import { ChipProps, Chip as HeroChip } from "@heroui/react";
import { AllEnums } from "@repo/types";
import { ENUM_META } from "../constants/enums.js";

interface EnumChipProps extends ChipProps {
  value: AllEnums;
}

const Chip = ({ value, ...props }: EnumChipProps) => {
  const meta = ENUM_META[value];
  return (
    <HeroChip className={meta?.color} {...props}>
      {meta?.label ?? value}
    </HeroChip>
  );
};

export default Chip;
