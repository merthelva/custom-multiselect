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
  info: unknown; // since it does not matter, its type is specified deliberately as "unknown"
  results: Array<TCharacter>;
};

type TApiResult = {
  data?: TResponse["results"];
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

export type { TCharacter, TResponse, TApiResult, TGetFocusIndexParams };
