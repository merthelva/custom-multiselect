import { useMemo, useState } from "react";
import { Select } from "./components";
import type { TResponse } from "./lib";
import type { TOption } from "./components/Select";

function App() {
  const [options, setOptions] = useState<TResponse["results"]>([]);

  const handleOpenSelectOptions = async () => {
    try {
      const { fetchData, FETCH_ALL_API_URL } = await import("./lib");
      const response = await fetchData<TResponse>(FETCH_ALL_API_URL);

      if (response != undefined) {
        setOptions(response.results);
      }
    } catch (error) {
      // handle error
    }
  };

  const transformedOptions: Array<TOption> = useMemo(() => {
    return options.map(({ id, name, image, episode }) => ({
      id: id.toString(),
      label: name,
      isSelected: false,
      data: {
        id,
        image,
        episode,
      },
    }));
  }, [options]);

  return (
    <Select options={transformedOptions} onOpen={handleOpenSelectOptions} />
  );
}

export default App;
