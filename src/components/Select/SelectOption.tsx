import { ComponentPropsWithoutRef } from "react";
import classes from "./styles.module.scss";
import { TSelectOptionProps } from "./types";

const SelectOption: React.FC<
  ComponentPropsWithoutRef<"li"> & TSelectOptionProps
> = ({
  id,
  character,
  imgSrc,
  onToggle,
  onPreventEventBubbling,
  isSelected,
  className = "",
  ...props
}) => {
  return (
    <li
      className={`${classes["option-wrapper"]} ${className}`}
      onClick={onToggle.bind(undefined, id)}
      tabIndex={0}
      {...props}
    >
      <input
        type="checkbox"
        name={id}
        id={id}
        onChange={onToggle.bind(undefined, id)}
        onClick={onPreventEventBubbling}
        checked={isSelected}
      />
      <img src={imgSrc} alt={character.name} loading="lazy" />
      <div>
        <span>{character.name}</span>
        <span>
          {character.numOfEpisodes}{" "}
          {`${character.numOfEpisodes <= 1 ? "Episode" : "Episodes"}`}
        </span>
      </div>
    </li>
  );
};

export default SelectOption;
