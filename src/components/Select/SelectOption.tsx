import { ComponentPropsWithoutRef, Fragment, useCallback } from "react";
import classes from "./styles.module.scss";
import type { TSelectOptionProps } from "./types";

const SelectOption: React.FC<
  ComponentPropsWithoutRef<"li"> & TSelectOptionProps
> = ({
  id,
  character,
  imgSrc,
  searchValue,
  onToggle,
  onPreventEventBubbling,
  isSelected,
  className = "",
  ...props
}) => {
  const handleHighlightMatchedToken = useCallback(
    (search: string, name: string) => {
      const tokens = name.split(new RegExp(search, "i"));
      const matches = name.match(new RegExp(search, "ig"));

      if (!matches) {
        return tokens.map((token) => ({
          id: `${id}:${name}`,
          hasMatch: false,
          token,
        }));
      }

      const mergedTokens = [];
      for (let i = 0; i < matches.length; i++) {
        mergedTokens.push({
          id: Math.random(), // not a desired solution, but no better alternative could be found :(
          hasMatch: false,
          token: tokens[i],
        });
        mergedTokens.push({
          id: Math.random(), // not a desired solution, but no better alternative could be found :(
          hasMatch: true,
          token: matches[i],
        });
      }
      mergedTokens.push({
        id: `${id}:${name}-${tokens.length}`,
        hasMatch: false,
        token: tokens[tokens.length - 1],
      });

      // filtering is needed here, since this algorithm
      // puts empty string value for "token" property of an entry,
      // if a match for "search" parameter occurs either at the start
      // or the end of "name" parameter
      return mergedTokens.filter((piece) => piece.token !== "");
    },
    []
  );

  return (
    <li
      id={id}
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
        <span>
          {handleHighlightMatchedToken(searchValue, character.name).map(
            (item) =>
              item.hasMatch ? (
                <b key={item.id}>{item.token}</b>
              ) : (
                <Fragment key={item.id}>{item.token}</Fragment>
              )
          )}
        </span>
        <span>
          {character.numOfEpisodes}{" "}
          {`${character.numOfEpisodes <= 1 ? "Episode" : "Episodes"}`}
        </span>
      </div>
    </li>
  );
};

export default SelectOption;
