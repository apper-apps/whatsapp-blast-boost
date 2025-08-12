import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Button = forwardRef(({ 
  className, 
  variant = "primary", 
  size = "md", 
  disabled = false,
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-gradient-to-r from-whatsapp-primary to-whatsapp-dark text-white hover:scale-105 focus:ring-whatsapp-primary shadow-lg hover:shadow-xl",
    secondary: "bg-white text-gray-700 border border-whatsapp-border hover:bg-gray-50 focus:ring-whatsapp-primary",
    outline: "border-2 border-whatsapp-primary text-whatsapp-primary bg-transparent hover:bg-whatsapp-primary hover:text-white focus:ring-whatsapp-primary",
    danger: "bg-gradient-to-r from-red-500 to-red-600 text-white hover:scale-105 focus:ring-red-500 shadow-lg hover:shadow-xl",
    success: "bg-gradient-to-r from-green-500 to-green-600 text-white hover:scale-105 focus:ring-green-500 shadow-lg hover:shadow-xl"
  };
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  return (
    <button
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export default Button;