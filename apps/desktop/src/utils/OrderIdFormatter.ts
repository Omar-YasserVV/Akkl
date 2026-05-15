interface orderIdFormat {
  (num: number, padding?: number): string;
}

export const orderIdFormat: orderIdFormat = (num, padding = 3) => {
  const paddedNumber = String(num).padStart(padding, "0");
  return `#ORD${paddedNumber}`;
};
