import type { TGetFocusIndexParams } from "./types";
import { FETCH_ALL_API_URL } from "./constants";

const generateUrlForCharacterFilter = (name: string) =>
  `${FETCH_ALL_API_URL}/?name=${name}`;

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

export { generateUrlForCharacterFilter, fetchData, getFocusIndex };
