import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const VariableTag = ({ variable, onInsert, className, ...props }) => {
  return (
    <button
      onClick={() => onInsert(`{{${variable}}}`)}
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 bg-whatsapp-blue/10 text-whatsapp-blue border border-whatsapp-blue/20 rounded-md text-xs font-medium hover:bg-whatsapp-blue/20 transition-colors duration-200",
        className
      )}
      {...props}
    >
      <ApperIcon name="Plus" size={12} />
      {variable}
    </button>
  );
};

export default VariableTag;