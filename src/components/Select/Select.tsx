import { forwardRef } from "react";
import type { ComponentPropsWithoutRef } from "react";

import type { TSelectProps } from "./types";
import classes from "./styles.module.scss";
import SelectOption from "./SelectOption";
import { Badge } from "../Badge";
import { Caret } from "../Caret";

const Select = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<"div"> & TSelectProps
>(({ className = "", ...props }, ref) => {
  return (
    <div>
      <div
        ref={ref}
        tabIndex={0}
        className={`${classes["actions-wrapper"]} ${className}`}
        {...props}
      >
        <div className={classes["badges-wrapper"]}>
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <Badge key={num} name="Morty Smith" onRemove={() => {}} />
          ))}
        </div>
        <div className={classes["search-input-wrapper"]}>
          <input type="text" name="search" id="search" />
        </div>
        <div className={classes["caret-wrapper"]}>
          <button>
            <Caret />
          </button>
        </div>
      </div>
      <div className={classes["options-wrapper"]}>
        <ul>
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <SelectOption
              key={num.toString()}
              id={num.toString()}
              character={{ name: "Rick Sanchez", numOfEpisodes: 5 }}
              imgSrc="https://unsplash.it/56/56"
              isSelected={num % 2 === 0}
              onChange={() => {}}
            />
          ))}
        </ul>
      </div>
    </div>
  );
});

export default Select;
