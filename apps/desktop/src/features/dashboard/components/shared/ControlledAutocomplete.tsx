import { Controller, useFormContext } from "react-hook-form";
import { Autocomplete, AutocompleteItem } from "@heroui/react";

interface ControlledAutocompleteProps {
  name: string;
  label: string;
  placeholder: string;
  items: { label: string; key: string }[];
  className?: string;
}

export const ControlledAutocomplete = ({
  name,
  label,
  placeholder,
  items,
  className,
}: ControlledAutocompleteProps) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete
          {...field}
          label={label}
          placeholder={placeholder}
          className={className}
          radius="sm"
          variant="bordered"
          labelPlacement="outside"
          selectedKey={field.value}
          onSelectionChange={(key) => field.onChange(key)}
          isInvalid={!!errors[name]}
          errorMessage={errors[name]?.message as string}
        >
          {items.map((item) => (
            <AutocompleteItem key={item.key}>{item.label}</AutocompleteItem>
          ))}
        </Autocomplete>
      )}
    />
  );
};
