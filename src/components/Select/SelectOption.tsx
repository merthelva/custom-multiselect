import { Fragment, useCallback } from "react";
import type { ComponentPropsWithoutRef } from "react";
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

      // Let's handle this utility function with concrete example arguments:

      // =========== CASE I ===========
      // search = "" & name = "Rick Sanchez" --> name.length = 12
      // Then, matches = Array.from({length: name.length + 1}, () => ""), i.e., "matches" will be an array of 12 + 1 (13) empty strings
      // and   tokens = ["R", "i", "c", "k", " ", "S", "a", "n", "c", "h", "e", "z"] --> tokens.length = 12
      // ----> tokens.length = matches.length - 1
      // In for loop below, it will be guaranteed that the index for accessing an element of either "tokens"
      // or "matches" arrays will NOT be out of bounds by taking the minimum of both length values.
      // Since "tokens.length === matches.length + 1" condition, which is written just below the end of for
      // loop, will not be satisfied, the following "push" operation will NOT be performed.
      // Also, for any item of "matches", whose value is an empty string, pushing of "matches" item will
      // also be skipped right away. As a result,
      // mergedTokens =
      // [
      //    {id: <random_value>, hasMatch: false, token: "R"},
      //    {id: <random_value>, hasMatch: false, token: "i"},
      //    {id: <random_value>, hasMatch: false, token: "c"},
      //    {id: <random_value>, hasMatch: false, token: "k"},
      //    {id: <random_value>, hasMatch: false, token: " "}, --> !! this is NOT empty string. It is a space character
      //    {id: <random_value>, hasMatch: false, token: "S"},
      //    {id: <random_value>, hasMatch: false, token: "a"},
      //    ...
      // ]

      // ----------------------------------------------------------------

      // =========== CASE II ===========
      // search = "ck s" & name = "Rick Sanchez"
      // Then, matches = ["ck S"] --> matches.length = 1 (Note that "match" operation is performed upon "name" string with case-insensitive regexp)
      //       tokens = ["Ri", "anchez"] --> tokens.length = 2
      // ----> tokens.length = matches.length + 1
      // In for loop below, it will be guaranteed that the index for accessing an element of either "tokens"
      // or "matches" arrays will NOT be out of bounds by taking the minimum of both length values.
      // Since "tokens.length === matches.length + 1" condition, which is written just below the end of for
      // loop, will be satisfied in this case, the following "push" operation will BE performed. As a result,
      // mergedTokens =
      // [
      //    {id: <random_value>, hasMatch: false, token: "Ri"},
      //    {id: <random_value>, hasMatch: true,  token: "ck S"},
      //    {id: <random_value>, hasMatch: false, token: "anchez"},
      // ]

      // ----------------------------------------------------------------

      // =========== CASE III ===========
      // search = "çş" & name = "Rick Sanchez"
      // Then, matches = null and tokens = ["Rick Sanchez"]. As a result,
      // mergedTokens =
      // [
      //    {id: <random_value>, hasMatch: false, token: "Rick Sanchez"},
      // ]

      // ----------------------------------------------------------------

      // =========== CASE IV ===========
      // search = "rt h" & name = "Mert Helrt hadfsrt me had rt me"
      // Then, matches = ["rt H", "rt h"] --> matches.length = 2 (Note that "match" operation is performed upon "name" string with case-insensitive regexp)
      //       tokens = ["Me", "el", "adfsrt me had rt me"] --> tokens.length = 3
      // ----> tokens.length = matches.length + 1
      // In for loop below, it will be guaranteed that the index for accessing an element of either "tokens"
      // or "matches" arrays will NOT be out of bounds by taking the minimum of both length values.
      // Since "tokens.length === matches.length + 1" condition, which is written just below the end of for
      // loop, will be satisfied in this case, the following "push" operation will BE performed. As a result,
      // mergedTokens =
      // [
      //    {id: <random_value>, hasMatch: false, token: "Me"},
      //    {id: <random_value>, hasMatch: true,  token: "rt H"},
      //    {id: <random_value>, hasMatch: false, token: "el"},
      //    {id: <random_value>, hasMatch: true,  token: "rt h"},
      //    {id: <random_value>, hasMatch: false, token: "adfsrt me had rt me"},
      // ]

      // As can be seen by CASE IV, multiple matches will also be kept and highlighted in UI.

      // For all "mergedTokens" results, if entry has "hasMatch: true", the corresponding token will be bold.

      if (!matches) {
        return tokens.map((token) => ({
          id: `${id}:${name}`,
          hasMatch: false,
          token,
        }));
      }

      const mergedTokens = [];
      for (let i = 0; i < Math.min(tokens.length, matches.length); i++) {
        mergedTokens.push({
          id: Math.random(), // not a desired solution, but no better alternative could be found :(
          hasMatch: false,
          token: tokens[i],
        });
        matches[i] !== "" &&
          mergedTokens.push({
            id: Math.random(), // not a desired solution, but no better alternative could be found :(
            hasMatch: true,
            token: matches[i],
          });
      }
      tokens.length === matches.length + 1 &&
        mergedTokens.push({
          id: `${id}:${name}-${tokens.length}`,
          hasMatch: false,
          token: tokens[tokens.length - 1],
        });

      return mergedTokens;
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
