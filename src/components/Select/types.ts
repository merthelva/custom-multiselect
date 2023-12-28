import type { TCharacter } from "../../lib";

type TOption = {
  id: string;
  label: string;
  isSelected: boolean;
  data: Pick<TCharacter, "episode" | "image">;
};

type TSelectProps = {
  options: Array<TOption>;
  isLoading: boolean;
  onOpen: VoidFunction;
};

type TSelectOptionProps = {
  imgSrc: string;
  character: {
    name: string;
    numOfEpisodes: number;
  };
  searchValue: string;
  onToggle: (id?: string) => void;
  onPreventEventBubbling: (e: React.MouseEvent<unknown, MouseEvent>) => void;
  isSelected: boolean;
};

export type { TSelectProps, TSelectOptionProps, TOption };
