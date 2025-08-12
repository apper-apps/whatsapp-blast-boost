import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const FileUploadZone = ({ onFileSelect, accept = ".csv", className, ...props }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };
  
  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onFileSelect(files[0]);
    }
  };
  
  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "border-2 border-dashed border-whatsapp-border rounded-lg p-6 text-center transition-all duration-200 hover:border-whatsapp-primary/50 hover:bg-whatsapp-primary/5",
        isDragOver && "border-whatsapp-primary bg-whatsapp-primary/10",
        className
      )}
      {...props}
    >
      <input
        type="file"
        accept={accept}
        onChange={handleFileInput}
        className="hidden"
        id="file-upload"
      />
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-whatsapp-primary/10 rounded-full">
            <ApperIcon name="Upload" size={24} className="text-whatsapp-primary" />
          </div>
          <div>
            <p className="font-medium text-gray-700">Drop CSV file here or click to browse</p>
            <p className="text-sm text-gray-500 mt-1">
              CSV should have phone numbers in first column
            </p>
          </div>
        </div>
      </label>
    </div>
  );
};

export default FileUploadZone;