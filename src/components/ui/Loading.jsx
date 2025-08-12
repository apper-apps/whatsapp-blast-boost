import ApperIcon from "@/components/ApperIcon";

const Loading = ({ message = "Loading...", className = "" }) => {
  return (
    <div className={`flex items-center justify-center p-8 ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-r from-whatsapp-primary to-whatsapp-dark rounded-full flex items-center justify-center">
            <ApperIcon name="Loader2" size={24} className="text-white animate-spin" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-whatsapp-primary to-whatsapp-dark rounded-full animate-ping opacity-20"></div>
        </div>
        <p className="text-gray-600 font-medium">{message}</p>
      </div>
    </div>
  );
};

export default Loading;