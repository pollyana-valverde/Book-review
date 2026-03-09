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
  extends React.ComponentProps<"span">, VariantProps<typeof textVariants> {
  as?: React.ElementType;
}

function Text({ children, as = "span", className, variant }: TextProps) {
  return React.createElement(
    as,
    { className: cn(textVariants({ variant }), className) },
    children,
  );
}

export { Text, textVariants };
