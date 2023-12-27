import { useMemo, useState } from "react";
import { Select } from "./components";
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
        errorMessage: "Failed to filter characters",
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
            id,
            image,
            episode,
          },
        }));
  }, [!apiResult.data]);

  return (
    <Select
      options={transformedOptions}
      onOpen={handleOpenSelectOptions}
      isLoading={apiResult.isLoading}
    />
  );
}

export default App;
