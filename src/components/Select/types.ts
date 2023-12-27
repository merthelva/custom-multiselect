import type { ChangeEvent } from "react";

type TSelectProps = {};

type TSelectOptionProps = {
  imgSrc: string;
  character: {
    name: string;
    numOfEpisodes: number;
  };
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isSelected: boolean;
};

export type { TSelectProps, TSelectOptionProps };
