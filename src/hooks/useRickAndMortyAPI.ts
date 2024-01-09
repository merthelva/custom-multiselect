import { useCallback, useRef, useState } from "react";
import type { TApiResult, TResponse } from "lib";
import type {
  TCachedResult,
  THandleFetchParams,
  TUseRickAndMortyAPIReturn,
} from "./types";

const initialState = {
  data: [],
  meta: undefined,
  isLoading: false,
  errorMessage: undefined,
} satisfies TApiResult;

const useRickAndMortyAPI = (): TUseRickAndMortyAPIReturn => {
  const cache = useRef<Record<string, TCachedResult>>({});
  const [apiResult, setApiResult] = useState<TApiResult>(initialState);

  /**
   * @param {Array<string>} queryKeys - array of strings to create query string
   * @param {Array<string>} queryValues - array of strings to create query string
   */
  const handleFetch = useCallback(
    async ({ queryKeys, queryValues }: THandleFetchParams) => {
      const {
        BASE_API_URL,
        fetchData,
        generateQueryString,
        generateLocalCacheKey,
      } = await import("lib");

      const localCacheKey = generateLocalCacheKey(queryKeys, queryValues);
      // if the requested data is available in the local cache,
      // immediately serve that data to user instead of making
      // an unnecessary API request for the same query parameters
      if (cache.current[localCacheKey]) {
        const { data, meta } = cache.current[localCacheKey];
        return setApiResult(() => ({
          ...initialState,
          data,
          meta,
        }));
      }

      try {
        setApiResult(() => ({
          ...initialState,
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

        // store data in local cache to be later used
        cache.current[localCacheKey] = {
          data: response.results,
          meta: response.info,
        };
        setApiResult((prevState) => ({
          ...prevState,
          data: response.results,
          meta: response.info,
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
