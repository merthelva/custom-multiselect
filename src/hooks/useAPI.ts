import { useCallback, useState } from "react";
import type { TApiResult, TResponse } from "../lib";

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
  const [apiResult, setApiResult] = useState<TApiResult>({
    isLoading: false,
  });

  const handleFetch = useCallback(
    async (queryStr?: string) => {
      try {
        setApiResult((prevState) => ({
          ...prevState,
          isLoading: true,
        }));
        const { fetchData } = await import("../lib");
        const util = await cb();
        const response = await fetchData<TResponse>(
          typeof util === "string" ? util : util(queryStr || "")
        );

        if (response != undefined) {
          setApiResult((prevState) => ({
            ...prevState,
            data: response.results?.length ? response.results : [],
            errorMessage:
              response.results?.length > 0 ? undefined : "No character found",
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
