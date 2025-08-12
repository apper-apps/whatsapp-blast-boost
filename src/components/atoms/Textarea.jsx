import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Textarea = forwardRef(({ 
  className,
  error = false,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-3 py-2 border rounded-md transition-colors duration-200 resize-none focus:outline-none focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent";
  const errorStyles = error ? "border-red-500 focus:ring-red-500" : "border-whatsapp-border";
  
  return (
    <textarea
      ref={ref}
      className={cn(baseStyles, errorStyles, className)}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export default Textarea;