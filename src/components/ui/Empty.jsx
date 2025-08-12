import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Empty = ({ 
  message = "No data available", 
  description = "Get started by adding some data",
  action,
  actionLabel = "Get Started",
  icon = "Inbox",
  className = "" 
}) => {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <ApperIcon name={icon} size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{message}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        {action && (
          <Button onClick={action} variant="primary">
            <ApperIcon name="Plus" size={16} />
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Empty;