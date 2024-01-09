import { useMemo, useRef } from "react";
import { ErrorBoundary, Select } from "components";
import type { TOption } from "components/Select";
import { useRickAndMortyAPI } from "hooks";

function App() {
  const selectRef = useRef<HTMLDivElement>(null);
  const [apiResult, handleFetch] = useRickAndMortyAPI();

  const handleOpenSelectOptions = async () => {
    await handleFetch();
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
    <ErrorBoundary fallback={<p>[ErrorBoundary wrapping Select component]</p>}>
      <Select
        ref={selectRef}
        options={transformedOptions}
        onOpen={handleOpenSelectOptions}
        isLoading={apiResult.isLoading}
      />
    </ErrorBoundary>
  );
}

export default App;
