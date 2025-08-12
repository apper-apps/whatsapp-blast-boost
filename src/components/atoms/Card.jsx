import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Card = forwardRef(({ className, children, ...props }, ref) => {
  // Filter out any non-DOM props that might be passed through
  const { 
    // Add any known non-DOM props here as needed
    ...domProps 
  } = props;
  return (
    <div
      ref={ref}
      className={cn(
        "bg-white rounded-lg border border-whatsapp-border p-6 transition-all duration-200",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = "Card";

export default Card;