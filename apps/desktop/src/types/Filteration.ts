export type FilterOption<T> = {
  label: string;
  value: T;
};

export type FilterPillGroupProps<T> = {
  label: string;
  options: FilterOption<T>[];
  value: T;
  onChange: (value: T) => void;
  align?: "start" | "end";
};
