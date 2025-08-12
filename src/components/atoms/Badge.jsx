import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Badge = forwardRef(({ 
  className, 
  variant = "default", 
  children, 
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-200";
  
  const variants = {
    default: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800 border border-yellow-200",
    sending: "bg-blue-100 text-blue-800 border border-blue-200 animate-pulse",
    sent: "bg-green-100 text-green-800 border border-green-200",
    failed: "bg-red-100 text-red-800 border border-red-200",
    success: "bg-whatsapp-primary text-white"
  };
  
  return (
    <span
      ref={ref}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = "Badge";

export default Badge;