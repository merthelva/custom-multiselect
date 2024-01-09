import type { TCharacter } from "lib";

type TReactMouseEvent<T extends HTMLElement> = React.MouseEvent<T, MouseEvent>;

type TOption = {
  id: string;
  label: string;
  isSelected: boolean;
  data: Pick<TCharacter, "episode" | "image">;
};

type TSelectProps = {
  data: {
    options: Array<TOption>;
    meta: {
      hasPrev?: boolean;
      hasNext?: boolean;
    };
    errorMessage?: string;
  };
  isLoading: boolean;
  onOpen: (page: number, search?: string) => Promise<void>;
};

type TSelectOptionProps = {
  imgSrc: string;
  character: {
    name: string;
    numOfEpisodes: number;
  };
  searchValue: string;
  onToggle: (id?: string) => void;
  onPreventEventBubbling: (e: TReactMouseEvent<HTMLElement>) => void;
  isSelected: boolean;
};

export type { TSelectProps, TSelectOptionProps, TOption, TReactMouseEvent };
