import type { TOption } from "components/Select";

type TCharacter = {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: Array<string>;
  url: string;
  created: string;
};

type TResponse = {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Array<TCharacter>;
};

type TApiResult = {
  data: TResponse["results"];
  meta?: TResponse["info"];
  isLoading: boolean;
  errorMessage?: string;
};

type TBadgeFocusIndex = {
  direction: "horizontal";
  keyCode: "ArrowRight" | "ArrowLeft";
};

type TOptionFocusIndex = {
  direction: "vertical";
  keyCode: "ArrowUp" | "ArrowDown";
};

type TGetFocusIndexParams = {
  focusedIndex: number;
  items: Array<TOption>;
} & (TBadgeFocusIndex | TOptionFocusIndex);

type TSingleQuery = {
  type: "single";
  query: {
    key: string;
    value: string;
  };
};

type TMultipleQuery = {
  type: "multiple";
  query: {
    keys: Array<string>;
    values: Array<string>;
  };
};

type TGenerateQueryStringParams = TSingleQuery | TMultipleQuery;

export type {
  TCharacter,
  TResponse,
  TApiResult,
  TGetFocusIndexParams,
  TGenerateQueryStringParams,
};
