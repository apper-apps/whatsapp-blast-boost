import { useState, useRef } from "react";
import ApperIcon from "@/components/ApperIcon";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import FileUploadZone from "@/components/molecules/FileUploadZone";
import { toast } from "react-toastify";

const ContactImporter = ({ onContactsImported, disabled, apiConfigured }) => {
  const [contacts, setContacts] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (file) => {
    if (!file) return;
    
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast.error('Please select a valid CSV file');
      return;
    }

    setIsProcessing(true);
    
    try {
      const text = await file.text();
      const lines = text.trim().split('\n');
      
      if (lines.length < 2) {
        toast.error('CSV file must contain at least a header row and one data row');
        setIsProcessing(false);
        return;
      }

      // Parse CSV header
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      const requiredFields = ['id', 'name', 'phonenumber'];
      const missingFields = requiredFields.filter(field => !headers.includes(field));
      
      if (missingFields.length > 0) {
        toast.error(`Missing required columns: ${missingFields.join(', ')}`);
        setIsProcessing(false);
        return;
      }

      // Parse data rows
      const parsedContacts = [];
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        
        if (values.length !== headers.length) {
          toast.warning(`Skipping row ${i + 1}: incorrect number of columns`);
          continue;
        }

        const contact = {};
        headers.forEach((header, index) => {
          contact[header === 'id' ? 'Id' : header === 'phonenumber' ? 'phoneNumber' : header] = values[index];
        });

        // Validate required fields
        if (!contact.Id || !contact.name || !contact.phoneNumber) {
          toast.warning(`Skipping row ${i + 1}: missing required data`);
          continue;
        }

        // Convert Id to integer
        contact.Id = parseInt(contact.Id);
        if (isNaN(contact.Id)) {
          toast.warning(`Skipping row ${i + 1}: invalid ID`);
          continue;
        }

        // Format phone number
        if (!contact.phoneNumber.startsWith('+')) {
          contact.phoneNumber = '+' + contact.phoneNumber.replace(/[^\d]/g, '');
        }

        parsedContacts.push({
          ...contact,
          status: 'pending',
          error: null,
          timestamp: null
        });
      }

      if (parsedContacts.length === 0) {
        toast.error('No valid contacts found in CSV file');
        setIsProcessing(false);
        return;
      }

      setContacts(parsedContacts);
      onContactsImported(parsedContacts);
      toast.success(`Successfully imported ${parsedContacts.length} contacts`);
      
    } catch (error) {
      toast.error('Failed to parse CSV file: ' + error.message);
    }
    
    setIsProcessing(false);
  };

  const handleDownloadSample = () => {
    const sampleData = `id,name,phonenumber
1,John Doe,+1234567890
2,Jane Smith,+0987654321
3,Mike Johnson,+1122334455`;

    const blob = new Blob([sampleData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'sample_contacts.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success('Sample CSV downloaded successfully');
  };

  const handleClearContacts = () => {
    setContacts([]);
    onContactsImported([]);
    toast.info('Contact list cleared');
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <ApperIcon name="Users" size={20} />
          Contact Importer
        </h2>
        {contacts.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500">
              {contacts.length} contacts loaded
            </span>
            <Button
              onClick={handleClearContacts}
              variant="ghost"
              size="sm"
              className="text-red-600 hover:text-red-700"
            >
              <ApperIcon name="Trash2" size={16} />
              Clear
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <Button
            onClick={handleDownloadSample}
            variant="secondary"
            size="sm"
            className="flex items-center gap-2"
          >
            <ApperIcon name="Download" size={16} />
            Download Sample CSV
          </Button>
          <p className="text-xs text-gray-500">
            Download a sample file to see the required format
          </p>
        </div>

        <FileUploadZone
          onFileSelect={handleFileSelect}
          isProcessing={isProcessing}
          disabled={disabled}
          acceptedFileTypes=".csv"
          maxFileSize={5 * 1024 * 1024} // 5MB
        />

        {!apiConfigured && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800">
              <ApperIcon name="AlertTriangle" size={16} />
              <span className="text-sm font-medium">
                API configuration required before importing contacts
              </span>
            </div>
          </div>
        )}

        {contacts.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="font-medium text-gray-900 mb-3">Imported Contacts Preview</h3>
            <div className="max-h-48 overflow-y-auto">
              <div className="space-y-2">
                {contacts.slice(0, 5).map((contact) => (
                  <div key={contact.Id} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-whatsapp-primary rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {contact.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{contact.name}</p>
                        <p className="text-sm text-gray-600">{contact.phoneNumber}</p>
                      </div>
                    </div>
                    <span className="text-xs font-mono text-gray-500">ID: {contact.Id}</span>
                  </div>
                ))}
                {contacts.length > 5 && (
                  <div className="text-center py-2 text-sm text-gray-500">
                    ... and {contacts.length - 5} more contacts
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ContactImporter;