import { FETCH_ALL_API_URL } from "./constants";

const generateUrlForCharacterFilter = (name: string) =>
  `${FETCH_ALL_API_URL}/?name=${name}`;

const fetchData = async <T>(url: string) => {
  try {
    const response = await fetch(url);
    const result: T = await response.json();
    return result;
  } catch (error) {
    // TODO: handle error gracefully
  }
};

export { generateUrlForCharacterFilter, fetchData };
