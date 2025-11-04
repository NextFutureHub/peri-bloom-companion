import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export const GradientButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => (
    <Button
      ref={ref}
      className={cn(
        "gradient-primary text-white shadow-soft hover:shadow-glow transition-smooth font-medium",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
);
GradientButton.displayName = "GradientButton";

export const SoftButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, ...props }, ref) => (
    <Button
      ref={ref}
      variant="outline"
      className={cn(
        "border-primary/20 hover:bg-primary/5 transition-smooth",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
);
SoftButton.displayName = "SoftButton";
