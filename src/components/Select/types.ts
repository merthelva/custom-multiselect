import type { ChangeEvent } from "react";
import type { TCharacter } from "../../lib";

type TOption = {
  id: string;
  label: string;
  isSelected: boolean;
  data: Pick<TCharacter, "id" | "episode" | "image">;
};

type TSelectProps = {
  options: Array<TOption>;
  onOpen: VoidFunction;
};

type TSelectOptionProps = {
  imgSrc: string;
  character: {
    name: string;
    numOfEpisodes: number;
  };
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isSelected: boolean;
};

export type { TSelectProps, TSelectOptionProps, TOption };
