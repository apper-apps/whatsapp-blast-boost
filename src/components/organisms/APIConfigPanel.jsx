import { useState, useEffect } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Input from "@/components/atoms/Input";
import StatusIndicator from "@/components/molecules/StatusIndicator";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const APIConfigPanel = ({ config, onConfigUpdate, onValidate }) => {
  const [formData, setFormData] = useState({
    bearerToken: "",
    phoneId: "",
    businessAccountId: "",
    ...config
  });
  const [validationStatus, setValidationStatus] = useState("idle");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(prev => ({ ...prev, ...config }));
  }, [config]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.bearerToken.trim()) {
      newErrors.bearerToken = "Bearer token is required";
    }
    
    if (!formData.phoneId.trim()) {
      newErrors.phoneId = "Phone ID is required";
    }
    
    if (!formData.businessAccountId.trim()) {
      newErrors.businessAccountId = "Business Account ID is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveConfig = () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    onConfigUpdate(formData);
    toast.success("Configuration saved successfully");
  };

  const handleValidateAPI = async () => {
    if (!validateForm()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setValidationStatus("validating");
    
    try {
      const isValid = await onValidate(formData);
      setValidationStatus(isValid ? "valid" : "invalid");
      
      if (isValid) {
        toast.success("API configuration is valid and connected");
      } else {
        toast.error("Invalid API configuration. Please check your credentials.");
      }
    } catch (error) {
      setValidationStatus("invalid");
      toast.error("Failed to validate API configuration");
    }
  };

  return (
    <Card className="h-fit">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <ApperIcon name="Settings" size={20} />
          API Configuration
        </h2>
        <StatusIndicator 
          status={validationStatus} 
          isConnected={config.isValid}
        />
      </div>

      <div className="space-y-4">
        <FormField 
          label="Bearer Token" 
          required
          error={errors.bearerToken}
        >
          <Input
            type="password"
            value={formData.bearerToken}
            onChange={(e) => handleInputChange("bearerToken", e.target.value)}
            placeholder="EAAxxxxxxxxx..."
            error={!!errors.bearerToken}
          />
        </FormField>

        <FormField 
          label="Phone Number ID" 
          required
          error={errors.phoneId}
        >
          <Input
            value={formData.phoneId}
            onChange={(e) => handleInputChange("phoneId", e.target.value)}
            placeholder="1234567890123456"
            error={!!errors.phoneId}
          />
        </FormField>

        <FormField 
          label="WhatsApp Business Account ID" 
          required
          error={errors.businessAccountId}
        >
          <Input
            value={formData.businessAccountId}
            onChange={(e) => handleInputChange("businessAccountId", e.target.value)}
            placeholder="1234567890123456"
            error={!!errors.businessAccountId}
          />
        </FormField>

        <div className="flex gap-3 pt-4">
          <Button
            onClick={handleSaveConfig}
            variant="secondary"
            className="flex-1"
          >
            <ApperIcon name="Save" size={16} />
            Save Config
          </Button>
          <Button
            onClick={handleValidateAPI}
            variant="primary"
            className="flex-1"
            disabled={validationStatus === "validating"}
          >
            {validationStatus === "validating" ? (
              <ApperIcon name="Loader2" size={16} className="animate-spin" />
            ) : (
              <ApperIcon name="CheckCircle" size={16} />
            )}
            Validate API
          </Button>
        </div>

        {config.isValid && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <ApperIcon name="CheckCircle" size={16} />
              <span className="text-sm font-medium">
                API is configured and ready to send messages
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default APIConfigPanel;