import { useMemo, useState } from "react";
import { ErrorBoundary, Select } from "./components";
import type { TApiResult, TResponse } from "./lib";
import type { TOption } from "./components/Select";

function App() {
  const [apiResult, setApiResult] = useState<TApiResult>({
    isLoading: false,
  });

  const handleOpenSelectOptions = async () => {
    try {
      setApiResult((prevState) => ({
        ...prevState,
        isLoading: true,
      }));
      const { fetchData, FETCH_ALL_API_URL } = await import("./lib");
      const response = await fetchData<TResponse>(FETCH_ALL_API_URL);

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
        errorMessage: "Failed to fetch characters",
      }));
    } finally {
      setApiResult((prevState) => ({
        ...prevState,
        isLoading: false,
      }));
    }
  };

  const transformedOptions: Array<TOption> = useMemo(() => {
    return !apiResult.data
      ? []
      : apiResult.data.map(({ id, name, image, episode }) => ({
          id: id.toString(),
          label: name,
          isSelected: false,
          data: {
            image,
            episode,
          },
        }));
  }, [!apiResult.data]);

  return (
    <ErrorBoundary fallback={<p>An error occurred when fetching characters</p>}>
      <Select
        options={transformedOptions}
        onOpen={handleOpenSelectOptions}
        isLoading={apiResult.isLoading}
      />
    </ErrorBoundary>
  );
}

export default App;
