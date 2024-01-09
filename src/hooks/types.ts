import type { TApiResult } from "lib";

type THandleFetchParams = {
  queryKeys: Array<string>;
  queryValues: Array<string>;
};

type TUseRickAndMortyAPIReturn = [
  TApiResult,
  ({ queryKeys, queryValues }: THandleFetchParams) => Promise<void>
];

export type { THandleFetchParams, TUseRickAndMortyAPIReturn };
