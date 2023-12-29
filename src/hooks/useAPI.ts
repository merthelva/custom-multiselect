import { useCallback, useRef, useState } from "react";
import type { TApiResult, TCharacter, TResponse } from "lib";

type TParams = {
  cb: () => Promise<string | ((queryStr: string) => string)>;
  // if needed, more param(s) type(s) might be added here
};

type TReturn = [TApiResult, (queryStr?: string) => Promise<void>];

// Note: This hook is deliberately specialized for only Rick & Morty API
// and its purpose is to simplify the previous version of written code
// comply with DRY principle. In order to follow what has changed with
// this commit, please look at "extract fetch logic into dedicated hook"
// commit message in Git history
const useAPI = ({ cb }: TParams): TReturn => {
  const cache = useRef<Record<string, TCharacter[]>>({});
  const [apiResult, setApiResult] = useState<TApiResult>({
    isLoading: false,
  });

  const handleFetch = useCallback(
    async (queryStr?: string) => {
      // if the requested data is available in the cache,
      // immediately serve that data to user instead of making an API request
      if (cache.current[queryStr || "all-characters"]) {
        const data = cache.current[queryStr || "all-characters"];
        return setApiResult((prevState) => ({
          ...prevState,
          data,
          errorMessage: undefined,
        }));
      }

      try {
        setApiResult((prevState) => ({
          ...prevState,
          isLoading: true,
        }));
        const { fetchData } = await import("lib");
        const util = await cb();
        const response = await fetchData<TResponse>(
          typeof util === "string" ? util : util(queryStr || "")
        );

        if (response != undefined) {
          // FIXME: Is this "if" block really necessary?
          if (!response.results) {
            return setApiResult((prevState) => ({
              ...prevState,
              data: [],
              error: "No character found",
            }));
          }

          // store data in cache
          cache.current[queryStr || "all-characters"] = response.results;
          setApiResult((prevState) => ({
            ...prevState,
            data: response.results,
            errorMessage: undefined,
          }));
        }
      } catch (error) {
        setApiResult((prevState) => ({
          ...prevState,
          data: [],
          errorMessage: "Failed to fetch data",
        }));
      } finally {
        setApiResult((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
      }
    },
    [cb]
  );
  return [apiResult, handleFetch];
};

export default useAPI;
