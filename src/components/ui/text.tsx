import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const textVariants = cva("", {
  variants: {
    variant: {
      default: "text-base leading-[140%] font-normal",
      "heading-1": "text-2xl leading-[140%] font-bold",
      "heading-2": "text-xl leading-[140%] font-bold",
      "content-1": "text-sm leading-[140%] font-normal",
      "content-2": "text-xs leading-[140%] font-normal",
      caption: "text-[.625rem] leading-[140%] font-bold uppercase",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface TextProps
  extends React.HTMLAttributes<HTMLElement>, VariantProps<typeof textVariants> {
  as?: keyof React.JSX.IntrinsicElements;
}

function Text({ children, as = "span", className, variant, ...rest }: TextProps) {
  return React.createElement(
    as,
    { className: cn(textVariants({ variant }), className), ...rest },
    children,
  );
}

export { Text, textVariants };
