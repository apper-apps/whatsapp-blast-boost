import React, { useState } from "react";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import VariableTag from "@/components/molecules/VariableTag";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";

const MessageComposer = ({ message, onMessageUpdate, onSendAll, canSend, totalContacts }) => {
  const [templateId, setTemplateId] = useState(message?.templateId || "");
  
  // Mock template messages - in real app, these would come from API
  const availableTemplates = [
    { id: "welcome_001", name: "Welcome Message", preview: "Hello {{name}}, welcome to our service! Your number {{number}} has been registered." },
    { id: "reminder_001", name: "Payment Reminder", preview: "Hi {{name}}, this is a friendly reminder about your pending payment. Contact us at {{number}} for assistance." },
    { id: "promo_001", name: "Special Offer", preview: "Exclusive offer for {{name}}! Get 50% off on your next purchase. Reply to {{number}} to claim." },
    { id: "support_001", name: "Support Follow-up", preview: "Hi {{name}}, thank you for contacting support. We're here to help at {{number}}." },
    { id: "delivery_001", name: "Delivery Update", preview: "Hello {{name}}, your order is on its way! Track your delivery or call {{number}} for updates." }
  ];
  
  const selectedTemplate = availableTemplates.find(t => t.id === templateId);
  const availableVariables = ["name", "number"];
  
const handleTemplateChange = (newTemplateId) => {
    setTemplateId(newTemplateId);
    const template = availableTemplates.find(t => t.id === newTemplateId);
    onMessageUpdate({
      templateId: newTemplateId,
      content: template?.preview || "",
      variables: template ? extractVariables(template.preview) : [],
      characterCount: template?.preview?.length || 0
    });
  };
  
  const extractVariables = (text) => {
    const matches = text.match(/\{\{(\w+)\}\}/g);
    return matches ? matches.map(match => match.replace(/[{}]/g, "")) : [];
  };
  return (
<Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <ApperIcon name="MessageSquare" size={20} />
          Template Message Selector
        </h2>
        {selectedTemplate && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500">
              Template: {selectedTemplate.name}
            </span>
          </div>
        )}
      </div>

<div className="space-y-4">
        <FormField label="Select Template Message">
          <select
            value={templateId}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-whatsapp-primary focus:border-whatsapp-primary"
          >
            <option value="">Choose a template message...</option>
            {availableTemplates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name} (ID: {template.id})
              </option>
            ))}
          </select>
        </FormField>
{selectedTemplate && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Template Variables
            </label>
            <div className="flex flex-wrap gap-2">
              {availableVariables.map((variable) => (
                <VariableTag
                  key={variable}
                  variable={variable}
                  readOnly={true}
                />
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Variables will be automatically replaced with contact data
            </p>
          </div>
        )}

{selectedTemplate && (
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message Preview
            </label>
            <div className="bg-gray-50 border rounded-lg p-3">
              <div className="bg-whatsapp-primary text-white rounded-lg p-3 max-w-sm">
                <p className="text-sm whitespace-pre-wrap">
                  {selectedTemplate.preview.replace(/\{\{name\}\}/g, "John Doe").replace(/\{\{number\}\}/g, "+1234567890")}
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Template ID: <span className="font-mono bg-gray-200 px-1 rounded">{templateId}</span>
              </p>
            </div>
          </div>
        )}

        <div className="border-t pt-4">
<Button
            onClick={onSendAll}
            variant="primary"
            size="lg"
            disabled={!canSend || !templateId}
            className="w-full"
          >
            <ApperIcon name="Send" size={20} />
            Send Template to {totalContacts} Contact{totalContacts !== 1 ? "s" : ""}
          </Button>
          
          {!canSend && totalContacts > 0 && (
            <p className="text-sm text-red-600 mt-2 text-center">
              Please configure and validate API settings before sending
            </p>
          )}
          
          {totalContacts === 0 && (
            <p className="text-sm text-gray-500 mt-2 text-center">
              Import contacts to start sending messages
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MessageComposer;