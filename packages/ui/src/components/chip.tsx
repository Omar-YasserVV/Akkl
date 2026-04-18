import { ChipProps, Chip as HeroChip } from "@heroui/react";
import { AllEnums } from "@repo/types";
import { ENUM_META } from "../constants/enums.js";

interface EnumChipProps extends ChipProps {
  value: AllEnums;
}

const Chip = ({ value, className, ...props }: EnumChipProps) => {
  const meta = ENUM_META[value];
  return (
    <HeroChip className={`${meta?.color} ${className}`} {...props}>
      {meta?.label ?? value}
    </HeroChip>
  );
};

export default Chip;
