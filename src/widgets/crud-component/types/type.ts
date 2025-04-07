import {ReactNode} from "react";

export interface IAdditionalToolbarButtons {
  label: string;
  tooltip: string;
  icon: ReactNode;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
  index?: number;
}

export interface IAdditionalMenuItem<T> {
  key: string
  label: string;
  icon: ReactNode;
  onClick: (rows?: T[]) => void;
  danger?: boolean;
}