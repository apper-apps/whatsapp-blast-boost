import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Input = forwardRef(({ 
  className, 
  type = "text",
  error = false,
  ...props 
}, ref) => {
  const baseStyles = "w-full px-3 py-2 border rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent";
  const errorStyles = error ? "border-red-500 focus:ring-red-500" : "border-whatsapp-border";
  
  return (
    <input
      ref={ref}
      type={type}
      className={cn(baseStyles, errorStyles, className)}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;