import type { TOption } from "components/Select";
import { FETCH_ALL_API_URL } from "./constants";

const generateUrlForCharacterFilter = (name: string) =>
  `${FETCH_ALL_API_URL}/?name=${name}`;

const fetchData = async <T>(url: string) => {
  const response = await fetch(url);
  const result: T = await response.json();
  return result;
};

const getFocusIndex = (
  keyCode: "ArrowDown" | "ArrowUp",
  focusedIndex: number,
  displayedOptions: Array<TOption>
) => {
  const updatedOptionIndex = focusedIndex + (keyCode === "ArrowDown" ? 1 : -1);
  // the following "if" conditions prevent focus
  // from escaping out of the options wrapper, when
  // navigating through the options
  if (updatedOptionIndex >= displayedOptions.length) {
    return displayedOptions.length - 1;
  }

  if (updatedOptionIndex < 0) {
    return 0;
  }

  return updatedOptionIndex;
};

export { generateUrlForCharacterFilter, fetchData, getFocusIndex };
