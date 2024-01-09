import type { TApiResult, TCharacter } from "lib";

type THandleFetchParams = {
  queryKeys: Array<string>;
  queryValues: Array<string>;
};

type TUseRickAndMortyAPIReturn = [
  TApiResult,
  ({ queryKeys, queryValues }: THandleFetchParams) => Promise<void>
];

type TCachedResult = { data: TCharacter[]; meta: TApiResult["meta"] };

export type { THandleFetchParams, TUseRickAndMortyAPIReturn, TCachedResult };
