import { FETCH_ALL_API_URL } from "./constants";

const generateUrlForCharacterFilter = (name: string) =>
  `${FETCH_ALL_API_URL}/?name=${name}`;

const fetchData = async <T>(url: string) => {
  const response = await fetch(url);
  const result: T = await response.json();
  return result;
};

export { generateUrlForCharacterFilter, fetchData };
