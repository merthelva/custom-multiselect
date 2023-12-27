import { forwardRef, useCallback, useState } from "react";
import type { ChangeEvent, ComponentPropsWithoutRef } from "react";

import type { TSelectProps } from "./types";
import classes from "./styles.module.scss";
import SelectOption from "./SelectOption";
import { Badge } from "../Badge";
import { Caret } from "../Caret";

const Select = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div"> & TSelectProps
>(({ options, onOpen, className = "", ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

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

  const handleChangeSearchValue = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
    },
    []
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
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <Badge key={num} name="Morty Smith" onRemove={() => {}} />
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
            {options.map(({ id, label, isSelected, data }) => (
              <SelectOption
                key={id}
                id={id}
                character={{ name: label, numOfEpisodes: data.episode.length }}
                imgSrc={data.image}
                isSelected={isSelected}
                onChange={() => {}}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
});

export default Select;
