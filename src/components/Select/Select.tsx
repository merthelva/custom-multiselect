import { forwardRef, useCallback, useEffect, useMemo, useState } from "react";
import type { ChangeEvent, ComponentPropsWithoutRef, RefObject } from "react";
import debounce from "lodash.debounce";

import { LoadingSpinner } from "components";
import { useAPI } from "hooks";
import type { TOption, TSelectProps } from "./types";
import classes from "./styles.module.scss";
import SelectOption from "./SelectOption";
import { Badge } from "../Badge";
import { Caret } from "../Caret";

const Select = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div"> & TSelectProps
>(({ options, isLoading, onOpen, className = "", ...props }, ref) => {
  const [apiResult, handleFetch] = useAPI({
    cb: async () => {
      const { generateUrlForCharacterFilter } = await import("lib");
      return generateUrlForCharacterFilter;
    },
  });
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [focusedOptionIndex, setFocusedOptionIndex] = useState(0);
  const [focusedBadgeIndex, setFocusedBadgeIndex] = useState(0);
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
      await handleFetch(search);
    }, 500),
    []
  );

  const handleChangeSearchValue = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
      handleOpenOptions();
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
            {apiResult.errorMessage ? (
              <span>{apiResult.errorMessage}</span>
            ) : (
              <LoadingSpinner />
            )}
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

  useEffect(() => {
    const wrapperRef = (ref as RefObject<HTMLDivElement>).current;
    const handleKeyboardNavigation = async (e: KeyboardEvent) => {
      const { getFocusIndex } = await import("lib");
      // 1) When pressing "Escape", close options wrapper
      // 2) When pressing "Enter",
      // -- 2.a) if options wrapper is closed, open it
      // -- 2.b) if options wrapper is open, do nothing
      // 3) When pressing "ArrowDown",
      // -- 3.a) if options wrapper is closed, open it
      // -- 3.b) if options wrapper is open, navigate through options till the first option
      // 4) When pressing "ArrowUp",
      // -- 4.a) if options wrapper is closed, do nothing
      // -- 4.b) if options wrapper is open, navigate through options till the last option
      // 5) When pressing "Space",
      // -- 5.a) if focus is on <input> element, do nothing and keep typing
      // -- 5.b) if focus is on any Badge component, remove currently focused badge
      // -- 5.c) if focus is on any SelectOption component, toggle selection for currently focused SelectOption
      // 6) When pressing "Shift + Backspace",
      // -- 6.a) Perform default keyboard navigation in backward direction
      // ---- 6.a.*) e.g. for navigating among selected badge(s)' remove buttons, use this key combination and to remove one, press "Space" when focused
      // 7) When pressing "ArrowRight" or "ArrowLeft",
      // -- 7.a) Navigate among selected badge(s)' remove buttons

      switch (e.code) {
        case "Escape":
          isOpen && handleCloseOptions();
          break;

        case "Enter": {
          !isOpen && handleOpenOptions();
          break;
        }

        case "ArrowDown":
        case "ArrowUp": {
          if (!isOpen) {
            e.code === "ArrowDown" && handleOpenOptions();
            break;
          }

          const updatedOptionIndex = getFocusIndex({
            direction: "vertical",
            keyCode: e.code,
            focusedIndex: focusedOptionIndex,
            items: displayedOptions,
          });
          const focusedOption = displayedOptions[updatedOptionIndex];

          // I could not obtain <li></li> elements by their respective refs
          // so used "document" API instead
          const liElement = document.getElementById(focusedOption.id)!;
          liElement.focus();

          setFocusedOptionIndex(updatedOptionIndex);
          break;
        }

        case "ArrowRight":
        case "ArrowLeft": {
          const updatedBadgeIndex = getFocusIndex({
            direction: "horizontal",
            keyCode: e.code,
            focusedIndex: focusedBadgeIndex,
            items: selectedOptions,
          });
          const focusedBadge = selectedOptions[updatedBadgeIndex];

          // I could not obtain <button></button> elements by their respective refs
          // so used "document" API instead
          const badgeDismissButton = document.getElementById(
            `badge-dismiss-${focusedBadge.id}`
          )!;
          badgeDismissButton.focus();

          setFocusedBadgeIndex(updatedBadgeIndex);
          break;
        }

        case "Space": {
          if (
            !document.activeElement ||
            document.activeElement.tagName !== "LI"
          ) {
            break;
          }

          const focusedOption = displayedOptions[focusedOptionIndex];
          handleToggleOptionSelection(focusedOption.id);
          break;
        }

        default:
          break;
      }
    };

    wrapperRef?.addEventListener("keydown", handleKeyboardNavigation);

    return () => {
      wrapperRef?.removeEventListener("keydown", handleKeyboardNavigation);
    };
  }, [
    isOpen,
    displayedOptions,
    focusedOptionIndex,
    selectedOptions,
    focusedBadgeIndex,
  ]);

  return (
    <div
      ref={ref}
      tabIndex={0}
      className={`${classes.wrapper} ${className}`}
      onClick={handleToggleOptions}
      onBlur={(e) => e.relatedTarget === null && handleCloseOptions()}
      {...props}
    >
      <div className={classes["badges-wrapper"]}>
        {selectedOptions.map((option) => (
          <Badge
            key={option.id}
            id={option.id}
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
          disabled={apiResult.isLoading}
          value={apiResult.isLoading ? "Searching..." : searchValue}
          onClick={handlePreventEventBubbling}
          onChange={handleChangeSearchValue}
        />
      </div>
      <div tabIndex={0} className={classes["caret-wrapper"]}>
        <button>
          <Caret />
        </button>
      </div>
      {isOpen && (
        <div className={classes["options-wrapper"]}>
          <ul onClick={handlePreventEventBubbling}>
            {renderOptionsWrapperContent(displayedOptions, selectedOptions)}
          </ul>
        </div>
      )}
    </div>
  );
});

export default Select;
