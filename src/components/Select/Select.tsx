import { forwardRef, useCallback, useMemo, useState } from "react";
import type { ChangeEvent, ComponentPropsWithoutRef } from "react";
import debounce from "lodash.debounce";

import type { TOption, TSelectProps } from "./types";
import classes from "./styles.module.scss";
import SelectOption from "./SelectOption";
import { Badge } from "../Badge";
import { Caret } from "../Caret";
import type { TApiResult, TResponse } from "../../lib";

const Select = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div"> & TSelectProps
>(({ options, isLoading, onOpen, className = "", ...props }, ref) => {
  const [apiResult, setApiResult] = useState<TApiResult>({
    isLoading: false,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedOptions, setSelectedOptions] = useState<typeof options>([]);

  const handleCheckIfOptionSelected = useCallback(
    (selectedOpts: typeof options, id: string) => {
      return !!selectedOpts.find((option) => option.id === id);
    },
    []
  );

  const displayedOptions = useMemo(() => {
    if (searchValue === "" || !apiResult.data) {
      return options.map((option) => ({
        ...option,
        isSelected: handleCheckIfOptionSelected(selectedOptions, option.id),
      }));
    }
    return apiResult.data.map((item) => ({
      id: item.id.toString(),
      label: item.name,
      isSelected: handleCheckIfOptionSelected(
        selectedOptions,
        item.id.toString()
      ),
      data: {
        episode: item.episode,
        image: item.image,
      },
    })) satisfies Array<TOption>;
  }, [
    options,
    searchValue,
    selectedOptions,
    apiResult.data,
    handleCheckIfOptionSelected,
  ]);

  const handleOpenOptions = useCallback(() => {
    setIsOpen(true);
    onOpen();
  }, []);

  const handleCloseOptions = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleToggleOptions = useCallback(() => {
    isOpen ? handleCloseOptions() : handleOpenOptions();
  }, [isOpen]);

  // for example, when clicking to search input, prevent opening options container.
  const handlePreventEventBubbling = useCallback(
    (e: React.MouseEvent<unknown, MouseEvent>) => {
      e.stopPropagation();
    },
    []
  );

  const handleDebouncedSearch = useCallback(
    debounce(async (search: string) => {
      // TODO: Think about extracting this "try-catch" block and the one in App.tsx file in order to satisfy DRY principle
      try {
        setApiResult((prevState) => ({
          ...prevState,
          isLoading: true,
        }));
        const { fetchData, generateUrlForCharacterFilter } = await import(
          "../../lib"
        );
        const response = await fetchData<TResponse>(
          generateUrlForCharacterFilter(search)
        );

        if (response != undefined) {
          setApiResult((prevState) => ({
            ...prevState,
            data: response.results?.length ? response.results : [],
            errorMessage:
              response.results?.length > 0 ? undefined : "No character found",
          }));
        }
      } catch (error) {
        setApiResult((prevState) => ({
          ...prevState,
          data: [],
          errorMessage: "Failed to filter characters",
        }));
      } finally {
        setApiResult((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
      }
    }, 1000),
    []
  );

  const handleChangeSearchValue = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
      handleDebouncedSearch(e.target.value);
    },
    []
  );

  const handleToggleOptionSelection = useCallback(
    (id?: string) => {
      if (!id) {
        return;
      }

      const matchedOption = options.find((option) => option.id === id);
      if (!matchedOption) {
        return;
      }

      setSelectedOptions((prevState) => {
        const isOptionSelected = prevState.some((option) => option.id === id);
        if (!isOptionSelected) {
          return [...prevState, matchedOption];
        }

        return prevState.filter((option) => option.id !== id);
      });
    },
    [options]
  );

  const renderOptionsWrapperContent = useCallback(
    (
      options: typeof displayedOptions,
      selectedOptions: typeof displayedOptions
    ) => {
      const isDataFetching = isLoading || apiResult.isLoading;
      if (isDataFetching || apiResult.errorMessage) {
        return (
          <div className={classes["feedback-wrapper"]}>
            <span>{apiResult.errorMessage || "Loading..."}</span>
          </div>
        );
      }

      return options.map(({ id, label, data }) => (
        <SelectOption
          key={id}
          id={id}
          character={{
            name: label,
            numOfEpisodes: data.episode.length,
          }}
          imgSrc={data.image}
          searchValue={searchValue}
          isSelected={handleCheckIfOptionSelected(selectedOptions, id)}
          onToggle={handleToggleOptionSelection.bind(undefined, id)}
          onPreventEventBubbling={handlePreventEventBubbling}
        />
      ));
    },
    [isLoading, apiResult.isLoading, apiResult.errorMessage]
  );

  return (
    <div>
      <div
        ref={ref}
        tabIndex={0}
        className={`${classes["actions-wrapper"]} ${className}`}
        onClick={handleToggleOptions}
        // onBlur={handleCloseOptions}
        {...props}
      >
        <div className={classes["badges-wrapper"]}>
          {selectedOptions.map((option) => (
            <Badge
              key={option.id}
              name={option.label}
              onRemove={handleToggleOptionSelection.bind(undefined, option.id)}
            />
          ))}
        </div>
        <div className={classes["search-input-wrapper"]}>
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Type a name"
            onClick={handlePreventEventBubbling}
            onChange={handleChangeSearchValue}
            value={searchValue}
          />
        </div>
        <div className={classes["caret-wrapper"]}>
          <button>
            <Caret />
          </button>
        </div>
      </div>
      {isOpen && (
        <div className={classes["options-wrapper"]}>
          <ul>
            {renderOptionsWrapperContent(displayedOptions, selectedOptions)}
          </ul>
        </div>
      )}
    </div>
  );
});

export default Select;
