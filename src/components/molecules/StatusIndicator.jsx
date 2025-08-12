import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatusIndicator = ({ status, isConnected = false, className, ...props }) => {
  const getStatusConfig = (status, isConnected) => {
    if (status === "connected" && isConnected) {
      return {
        icon: "Wifi",
        color: "text-whatsapp-primary",
        bgColor: "bg-whatsapp-primary/10",
        label: "Connected",
        animate: "animate-pulse-dot"
      };
    }
    
    switch (status) {
      case "validating":
        return {
          icon: "Loader2",
          color: "text-blue-500",
          bgColor: "bg-blue-50",
          label: "Validating",
          animate: "animate-spin"
        };
      case "valid":
        return {
          icon: "CheckCircle",
          color: "text-green-500",
          bgColor: "bg-green-50",
          label: "Valid"
        };
      case "invalid":
        return {
          icon: "XCircle",
          color: "text-red-500",
          bgColor: "bg-red-50",
          label: "Invalid"
        };
      default:
        return {
          icon: "Circle",
          color: "text-gray-400",
          bgColor: "bg-gray-50",
          label: "Not configured"
        };
    }
  };
  
  const config = getStatusConfig(status, isConnected);
  
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <div className={cn("p-1.5 rounded-full", config.bgColor)}>
        <ApperIcon 
          name={config.icon} 
          size={16} 
          className={cn(config.color, config.animate)} 
        />
      </div>
      <span className="text-sm font-medium text-gray-700">
        {config.label}
      </span>
    </div>
  );
};

export default StatusIndicator;