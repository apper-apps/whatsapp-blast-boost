import { useState } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Textarea from "@/components/atoms/Textarea";
import FormField from "@/components/molecules/FormField";
import VariableTag from "@/components/molecules/VariableTag";
import ApperIcon from "@/components/ApperIcon";

const MessageComposer = ({ message, onMessageUpdate, onSendAll, canSend, totalContacts }) => {
  const [messageContent, setMessageContent] = useState(message?.content || "");
  
  const availableVariables = ["name", "number"];
  const maxCharacters = 4096;
  const characterCount = messageContent.length;
  
  const handleMessageChange = (content) => {
    if (content.length <= maxCharacters) {
      setMessageContent(content);
      onMessageUpdate({
        content,
        variables: extractVariables(content),
        characterCount: content.length
      });
    }
  };
  
  const extractVariables = (text) => {
    const matches = text.match(/\{\{(\w+)\}\}/g);
    return matches ? matches.map(match => match.replace(/[{}]/g, "")) : [];
  };
  
  const insertVariable = (variable) => {
    const textarea = document.querySelector("#message-textarea");
    const cursorPosition = textarea.selectionStart;
    const textBefore = messageContent.substring(0, cursorPosition);
    const textAfter = messageContent.substring(cursorPosition);
    const newContent = textBefore + variable + textAfter;
    
    handleMessageChange(newContent);
    
    // Set cursor position after the inserted variable
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        cursorPosition + variable.length,
        cursorPosition + variable.length
      );
    }, 0);
  };
  
  const getCharacterCountColor = () => {
    if (characterCount > maxCharacters * 0.9) return "text-red-600";
    if (characterCount > maxCharacters * 0.7) return "text-yellow-600";
    return "text-gray-500";
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <ApperIcon name="MessageSquare" size={20} />
          Message Composer
        </h2>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-medium ${getCharacterCountColor()}`}>
            {characterCount}/{maxCharacters}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <FormField label="Message Content">
          <Textarea
            id="message-textarea"
            value={messageContent}
            onChange={(e) => handleMessageChange(e.target.value)}
            placeholder="Type your WhatsApp message here...

You can use variables like {{name}} and {{number}} to personalize messages."
            rows={8}
            className="resize-none"
          />
        </FormField>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available Variables
          </label>
          <div className="flex flex-wrap gap-2">
            {availableVariables.map((variable) => (
              <VariableTag
                key={variable}
                variable={variable}
                onInsert={insertVariable}
              />
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Click on variables to insert them at cursor position
          </p>
        </div>

        {messageContent && (
          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message Preview
            </label>
            <div className="bg-gray-50 border rounded-lg p-3">
              <div className="bg-whatsapp-primary text-white rounded-lg p-3 max-w-sm">
                <p className="text-sm whitespace-pre-wrap">
                  {messageContent.replace(/\{\{name\}\}/g, "John Doe").replace(/\{\{number\}\}/g, "+1234567890")}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="border-t pt-4">
          <Button
            onClick={onSendAll}
            variant="primary"
            size="lg"
            disabled={!canSend || !messageContent.trim()}
            className="w-full"
          >
            <ApperIcon name="Send" size={20} />
            Send to {totalContacts} Contact{totalContacts !== 1 ? "s" : ""}
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