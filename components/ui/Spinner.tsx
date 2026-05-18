import * as React from "react";
import { cn } from "@/lib/utils";

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-5 h-5 border-[1.5px] border-accent border-t-transparent rounded-full animate-spin",
          className
        )}
        {...props}
      />
    );
  }
);
Spinner.displayName = "Spinner";

export default Spinner;
