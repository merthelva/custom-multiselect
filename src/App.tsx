import { useMemo, useRef } from "react";
import { ErrorBoundary, Select } from "components";
import type { TOption } from "components/Select";
import { useRickAndMortyAPI } from "hooks";

function App() {
  const selectRef = useRef<HTMLDivElement>(null);
  const [apiResult, handleFetch] = useRickAndMortyAPI();

  const handleOpenSelectOptions = async (page: number, search?: string) => {
    if (!search || search === "") {
      await handleFetch({
        queryKeys: ["page"],
        queryValues: [`${page}`],
      });
      return;
    }

    await handleFetch({
      queryKeys: ["page", "name"],
      queryValues: [`${page}`, search],
    });
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
  }, [apiResult.data]);

  return (
    <ErrorBoundary fallback={<p>[ErrorBoundary wrapping Select component]</p>}>
      <Select
        ref={selectRef}
        data={{
          options: transformedOptions,
          meta: {
            hasPrev: !!apiResult.meta?.prev,
            hasNext: !!apiResult.meta?.next,
          },
          errorMessage: apiResult.errorMessage,
        }}
        onOpen={handleOpenSelectOptions}
        isLoading={apiResult.isLoading}
      />
    </ErrorBoundary>
  );
}

export default App;
