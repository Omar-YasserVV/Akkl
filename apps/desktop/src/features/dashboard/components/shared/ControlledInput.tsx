import { Input } from "@heroui/react";
import { Controller, useFormContext } from "react-hook-form";

export const ControlledInput = ({
  name,
  label,
  type = "text",
  placeholder,
  className,
}: any) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Input
          {...field}
          type={type}
          label={label}
          placeholder={placeholder}
          min={0}
          className={className}
          radius="sm"
          variant="bordered"
          labelPlacement="outside"
          isInvalid={!!errors[name]}
          errorMessage={errors[name]?.message as string}
          onChange={(e) =>
            field.onChange(
              type === "number" ? e.target.valueAsNumber : e.target.value,
            )
          }
        />
      )}
    />
  );
};
