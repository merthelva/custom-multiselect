import { ComponentPropsWithoutRef } from "react";
import classes from "./styles.module.scss";
import { TSelectOptionProps } from "./types";

const SelectOption: React.FC<
  ComponentPropsWithoutRef<"li"> & TSelectOptionProps
> = ({
  id,
  character,
  imgSrc,
  onChange,
  isSelected,
  className = "",
  ...props
}) => {
  return (
    <li className={`${classes["option-wrapper"]} ${className}`} {...props}>
      <input
        type="checkbox"
        name={id}
        id={id}
        onChange={onChange}
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
