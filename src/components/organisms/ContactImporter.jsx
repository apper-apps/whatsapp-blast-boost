import { useState } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Textarea from "@/components/atoms/Textarea";
import FormField from "@/components/molecules/FormField";
import FileUploadZone from "@/components/molecules/FileUploadZone";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const ContactImporter = ({ onContactsImported }) => {
  const [textInput, setTextInput] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processTextInput = (text) => {
    const lines = text.split(/\r?\n/);
    const contacts = [];
    
    lines.forEach((line, index) => {
      const numbers = line.split(/[,;|\t]/).map(num => num.trim()).filter(Boolean);
      
      numbers.forEach(number => {
        // Basic phone number validation
        const cleanNumber = number.replace(/\D/g, "");
        if (cleanNumber.length >= 10 && cleanNumber.length <= 15) {
          contacts.push({
            Id: contacts.length + 1,
            phoneNumber: cleanNumber,
            variables: { name: `Contact ${contacts.length + 1}`, number: cleanNumber },
            status: "pending",
            error: null,
            timestamp: null
          });
        }
      });
    });
    
    return contacts;
  };

  const processCSVFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const csv = e.target.result;
          const lines = csv.split(/\r?\n/).filter(line => line.trim());
          const contacts = [];
          
          lines.forEach((line, index) => {
            const columns = line.split(",").map(col => col.trim().replace(/['"]/g, ""));
            
            if (columns[0]) {
              const cleanNumber = columns[0].replace(/\D/g, "");
              if (cleanNumber.length >= 10 && cleanNumber.length <= 15) {
                contacts.push({
                  Id: contacts.length + 1,
                  phoneNumber: cleanNumber,
                  variables: {
                    name: columns[1] || `Contact ${contacts.length + 1}`,
                    number: cleanNumber
                  },
                  status: "pending",
                  error: null,
                  timestamp: null
                });
              }
            }
          });
          
          resolve(contacts);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  };

  const handleImportFromText = async () => {
    if (!textInput.trim()) {
      toast.error("Please enter phone numbers to import");
      return;
    }

    setIsProcessing(true);
    
    try {
      const contacts = processTextInput(textInput);
      
      if (contacts.length === 0) {
        toast.error("No valid phone numbers found");
        return;
      }
      
      onContactsImported(contacts);
      toast.success(`Imported ${contacts.length} contacts successfully`);
      setTextInput("");
    } catch (error) {
      toast.error("Failed to process phone numbers");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = async (file) => {
    if (!file) return;
    
    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast.error("Please select a CSV file");
      return;
    }

    setSelectedFile(file);
    setIsProcessing(true);
    
    try {
      const contacts = await processCSVFile(file);
      
      if (contacts.length === 0) {
        toast.error("No valid phone numbers found in CSV file");
        return;
      }
      
      onContactsImported(contacts);
      toast.success(`Imported ${contacts.length} contacts from CSV successfully`);
      setSelectedFile(null);
    } catch (error) {
      toast.error("Failed to process CSV file");
      setSelectedFile(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClearContacts = () => {
    onContactsImported([]);
    toast.success("Contact list cleared");
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <ApperIcon name="Users" size={20} />
          Import Contacts
        </h2>
        <Button
          onClick={handleClearContacts}
          variant="outline"
          size="sm"
        >
          <ApperIcon name="Trash2" size={16} />
          Clear All
        </Button>
      </div>

      <div className="space-y-6">
        <div>
          <FormField label="Paste Phone Numbers">
            <Textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Enter phone numbers separated by commas or new lines
Example:
+1234567890, +0987654321
+1122334455
+9988776655"
              rows={6}
              className="font-mono text-sm"
            />
          </FormField>
          
          <div className="mt-3">
            <Button
              onClick={handleImportFromText}
              disabled={!textInput.trim() || isProcessing}
              variant="primary"
            >
              {isProcessing ? (
                <ApperIcon name="Loader2" size={16} className="animate-spin" />
              ) : (
                <ApperIcon name="UserPlus" size={16} />
              )}
              Import from Text
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">or</span>
          </div>
        </div>

        <div>
          <FileUploadZone
            onFileSelect={handleFileSelect}
            accept=".csv"
          />
          
          {selectedFile && (
            <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ApperIcon name="FileText" size={16} className="text-gray-500" />
                  <span className="text-sm font-medium">{selectedFile.name}</span>
                  <span className="text-xs text-gray-500">
                    ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                {isProcessing && (
                  <ApperIcon name="Loader2" size={16} className="animate-spin text-whatsapp-primary" />
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <ApperIcon name="Info" size={16} className="text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">CSV Format Guidelines:</p>
              <ul className="space-y-1 text-xs">
                <li>• First column should contain phone numbers</li>
                <li>• Second column can contain names (optional)</li>
                <li>• Use international format: +1234567890</li>
                <li>• Numbers without names will be auto-labeled</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ContactImporter;