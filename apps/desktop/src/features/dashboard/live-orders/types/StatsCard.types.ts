import { IconType } from "react-icons";

export interface StatConfig {
  label: string;
  value: number;
  icon: IconType;
  borderColor: string;
  bgColor: string;
  iconColor: string;
}

export interface StatCardItemProps extends StatConfig {}
