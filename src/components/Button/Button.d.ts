import { SxProps } from "@mui/material";

export interface ButtonCustomProp {
  isDisabled?: boolean;
  isHidden?: boolean;
  isRadius?: boolean;
  isFullwidth?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  startIcon?: any;
  txt?: string;
  id: string;
  fontColor?: string;
  bgcolor?: string;
  className?: string;
  sx?: any;
  bgcolorHover?: string;
  isCircleWithOutText?: boolean;
  sx?: SxProps;
  size?: "small" | "medium" | "large";
  tooltipPlacement?:
  | "bottom-end"
  | "bottom-start"
  | "bottom"
  | "left-end"
  | "left-start"
  | "left"
  | "right-end"
  | "right-start"
  | "right"
  | "top-end"
  | "top-start"
  | "top";
}

export interface BtnProp {
  isDisabled?: boolean;
  isHidden?: boolean;
  isRadius?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  txt?: string;
  isCircleWithOutText?: boolean;
  icon?: any;
  id: string;
  className?: string;
}
