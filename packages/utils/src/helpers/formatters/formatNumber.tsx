import { JSX } from "react";

interface FormatterOptions {
  isCurrency?: boolean;
  isCompact?: boolean;
  decimals?: number;
  weightUnit?: string;
  unitStyle?: string;
}

export class NumberFormatter {
  // Default values for options
  private static readonly DEFAULTS: Required<FormatterOptions> = {
    isCurrency: false,
    isCompact: false,
    decimals: 0,
    weightUnit: "kg",
    unitStyle: "",
  };

  /**
   * Returns only the formatted number (as a string)
   */
  static getNumberOnly(value: number, options: FormatterOptions = {}): string {
    const opts = { ...this.DEFAULTS, ...options };

    return new Intl.NumberFormat("en-US", {
      ...(opts.isCurrency && { style: "currency", currency: "USD" }),
      notation: opts.isCompact ? "compact" : "standard",
      compactDisplay: "short",
      minimumFractionDigits: 0,
      maximumFractionDigits: opts.isCompact ? 1 : opts.decimals,
    }).format(value);
  }

  /**
   * Returns the number with the unit as a JSX element
   */
  static getWithUnit(
    value: number,
    options: FormatterOptions = {},
  ): JSX.Element {
    const opts = { ...this.DEFAULTS, ...options };
    const formattedValue = this.getNumberOnly(value, opts);

    return (
      <span>
        {formattedValue}{" "}
        <span className={opts.unitStyle}>{opts.weightUnit}</span>
      </span>
    );
  }
}
