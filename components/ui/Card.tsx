import * as React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full bg-white dark:bg-gray-900 rounded-2xl border border-border dark:border-gray-800 shadow-[0_4px_20px_rgba(0,0,0,0.05)] dark:shadow-none p-6 sm:p-8",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

export default Card;
