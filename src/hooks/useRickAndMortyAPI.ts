import { useCallback, useState } from "react";
import type { TApiResult, TResponse } from "lib";
import type { THandleFetchParams, TUseRickAndMortyAPIReturn } from "./types";

const useRickAndMortyAPI = (): TUseRickAndMortyAPIReturn => {
  // const cache = useRef<Record<string, TCharacter[]>>({});
  const [apiResult, setApiResult] = useState<TApiResult>({
    data: [],
    meta: undefined,
    isLoading: false,
    errorMessage: undefined,
  });

  const handleFetch = useCallback(
    async ({ queryKeys, queryValues }: THandleFetchParams) => {
      const { BASE_API_URL, fetchData, generateQueryString } = await import(
        "lib"
      );
      // if the requested data is available in the cache,
      // immediately serve that data to user instead of making an API request
      /* if (cache.current[queryStr || "all-characters"]) {
      const data = cache.current[queryStr || "all-characters"];
      return setApiResult((prevState) => ({
        ...prevState,
        data,
        errorMessage: undefined,
      }));
    } */

      try {
        setApiResult((prevState) => ({
          ...prevState,
          isLoading: true,
        }));

        const queryStr = generateQueryString(
          // no need to check "queryValues.length" here, since the utility
          // already checks it internally
          queryKeys.length === 1
            ? {
                type: "single",
                query: {
                  key: queryKeys[0],
                  value: queryValues[0],
                },
              }
            : {
                type: "multiple",
                query: {
                  keys: queryKeys,
                  values: queryValues,
                },
              }
        );

        if (
          typeof queryStr === "object" &&
          (queryStr satisfies { message: string })
        ) {
          throw new Error(queryStr.message);
        }

        const response = await fetchData<TResponse>(
          // typeof util === "string" ? util : util(queryStr || "")
          `${BASE_API_URL}/${queryStr as string}`
        );

        // this check is due to the error handling of "fetch" API itself.
        // when an error occurs, "error" key is attached to the response.
        // so, use this "error" string as an error message to display to user.
        // note that, we could also return a generic error message in case
        // "response" has "error" key.
        if ("error" in response && typeof response.error === "string") {
          throw new Error(response.error);
        }

        // store data in cache
        // cache.current[queryStr || "all-characters"] = response.results;
        setApiResult((prevState) => ({
          ...prevState,
          data: response.results,
          meta: response.info,
          errorMessage: undefined,
        }));
      } catch (error) {
        setApiResult((prevState) => ({
          ...prevState,
          data: [],
          errorMessage: (error as Error).message,
        }));
      } finally {
        setApiResult((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
      }
    },
    []
  );

  return [apiResult, handleFetch];
};

export default useRickAndMortyAPI;
