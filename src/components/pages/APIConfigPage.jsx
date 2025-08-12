import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import APIConfigPanel from "@/components/organisms/APIConfigPanel";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const APIConfigPage = () => {
  const [apiConfig, setApiConfig] = useState(() => {
    const saved = localStorage.getItem('whatsapp-api-config');
    return saved ? JSON.parse(saved) : {
      bearerToken: "",
      phoneId: "",
      businessAccountId: "",
      isValid: false
    };
  });

  const handleConfigUpdate = (config) => {
    const updatedConfig = { ...apiConfig, ...config };
    setApiConfig(updatedConfig);
    localStorage.setItem('whatsapp-api-config', JSON.stringify(updatedConfig));
  };

  const handleValidateAPI = async (config) => {
    try {
      // Simulate API validation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock validation logic
      const isValid = config.bearerToken.startsWith("EAA") && 
                     config.phoneId.length >= 15 && 
                     config.businessAccountId.length >= 15;
      
      const updatedConfig = { ...config, isValid };
      setApiConfig(updatedConfig);
      localStorage.setItem('whatsapp-api-config', JSON.stringify(updatedConfig));
      
      return isValid;
    } catch (error) {
      console.error("API validation error:", error);
      return false;
    }
  };

  return (
    <div className="min-h-screen bg-whatsapp-background">
      {/* Navigation Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link 
                to="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ApperIcon name="ArrowLeft" size={20} />
                <span>Back to Dashboard</span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <ApperIcon name="Settings" size={24} className="text-whatsapp-primary" />
              <h1 className="text-xl font-semibold text-gray-900">
                API Configuration
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            WhatsApp Business API Setup
          </h2>
          <p className="text-gray-600">
            Configure your WhatsApp Business API credentials to start sending bulk messages. 
            Make sure to validate your configuration before returning to the dashboard.
          </p>
        </div>

        <div className="grid gap-6">
          <APIConfigPanel
            config={apiConfig}
            onConfigUpdate={handleConfigUpdate}
            onValidate={handleValidateAPI}
          />

          {/* Instructions Card */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <ApperIcon name="Info" size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  How to get your API credentials:
                </h3>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Go to Facebook Developers Console</li>
                  <li>Create or select your WhatsApp Business App</li>
                  <li>Navigate to WhatsApp → Getting Started</li>
                  <li>Copy the Bearer Token, Phone Number ID, and Business Account ID</li>
                  <li>Paste them above and click "Validate API" to test the connection</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4">
            <Link 
              to="/"
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ApperIcon name="ArrowLeft" size={20} />
              Return to Dashboard
            </Link>
            
            {apiConfig.isValid && (
              <div className="flex items-center gap-2 text-green-600">
                <ApperIcon name="CheckCircle" size={20} />
                <span className="font-medium">Configuration Complete</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default APIConfigPage;