import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const typographyVariants = cva("m-0", {
  variants: {
    variant: {
      h1: "text-xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight",
      h2: "text-base font-medium text-gray-800 dark:text-gray-200 tracking-tight",
      body: "text-gray-600 dark:text-gray-300 leading-relaxed",
      tagline: "text-gray-500 dark:text-gray-400 text-[10px] font-normal tracking-normal",
    },
  },
  defaultVariants: {
    variant: "body",
  },
});

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {}

const Typography = React.forwardRef<HTMLElement, TypographyProps>(
  ({ className, variant, children, ...props }, ref) => {
    const Component = variant?.startsWith("h") ? (variant as any) : "p";

    return React.createElement(
      Component,
      {
        className: cn(typographyVariants({ variant, className })),
        ref,
        ...props,
      },
      children
    );
  }
);
Typography.displayName = "Typography";

export default Typography;
export { typographyVariants };
