import type { TGenerateQueryStringParams, TGetFocusIndexParams } from "./types";

const generateQueryString = (params: TGenerateQueryStringParams) => {
  switch (params.type) {
    case "single":
      return `?${new URLSearchParams({
        [params.query.key]: params.query.value,
      }).toString()}`;
    case "multiple":
      try {
        if (params.query.keys.length !== params.query.values.length) {
          throw new Error("The lengths for both parameters must be equal!");
        }
        const queries = [];
        for (let i = 0; i < params.query.keys.length; i++) {
          queries.push(
            new URLSearchParams({
              [params.query.keys[i]]: params.query.values[i],
            }).toString()
          );
        }

        return `?${queries.join("&")}`;
      } catch (err) {
        console.log((err as Error).message);
      }
  }
};

const generateLocalCacheKey = (keys: Array<string>, values: Array<string>) => {
  const mergedKeysAndValues: typeof keys = [];
  for (let i = 0; i < keys.length; i++) {
    mergedKeysAndValues.push(`${keys[i]}-${values[i]}`);
  }
  return mergedKeysAndValues.join("&");
};

const fetchData = async <T>(url: string) => {
  const response = await fetch(url);
  const result: T = await response.json();
  return result;
};

const getIndex = (index: number, length: number) => {
  // the following "if" conditions prevent focus
  // from escaping out of the options wrapper, when
  // navigating through the options
  if (index >= length) {
    return length - 1;
  }

  if (index < 0) {
    return 0;
  }

  return index;
};

const getFocusIndex = ({
  direction,
  keyCode,
  items,
  focusedIndex,
}: TGetFocusIndexParams) => {
  switch (direction) {
    case "horizontal": {
      const updatedBadgeIndex =
        focusedIndex + (keyCode === "ArrowRight" ? 1 : -1);
      return getIndex(updatedBadgeIndex, items.length);
    }

    case "vertical": {
      const updatedOptionIndex =
        focusedIndex + (keyCode === "ArrowDown" ? 1 : -1);
      return getIndex(updatedOptionIndex, items.length);
    }

    default:
      return 0;
  }
};

export { generateQueryString, generateLocalCacheKey, fetchData, getFocusIndex };
