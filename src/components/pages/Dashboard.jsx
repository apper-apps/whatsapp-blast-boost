import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ContactImporter from "@/components/organisms/ContactImporter";
import MessageComposer from "@/components/organisms/MessageComposer";
import SendProgressTracker from "@/components/organisms/SendProgressTracker";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";
import whatsappService from "@/services/api/whatsappService";

const Dashboard = () => {
  // Get API config from localStorage to check validation status
  const [apiConfig, setApiConfig] = useState(() => {
    const saved = localStorage.getItem('whatsapp-api-config');
    return saved ? JSON.parse(saved) : {
      bearerToken: "",
      phoneId: "",
      businessAccountId: "",
      isValid: false
    };
  });
  
  const [contacts, setContacts] = useState([]);
  const [message, setMessage] = useState({
    templateId: "",
    variables: [],
    characterCount: 0
  });
  
  const [sendJob, setSendJob] = useState({
    id: null,
    contacts: [],
    message: null,
    startTime: null,
    endTime: null,
    status: "idle"
  });

  // Listen for API config changes from localStorage
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'whatsapp-api-config') {
        const newConfig = e.newValue ? JSON.parse(e.newValue) : {
          bearerToken: "",
          phoneId: "",
          businessAccountId: "",
          isValid: false
        };
        setApiConfig(newConfig);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);


  const handleContactsImported = (importedContacts) => {
    setContacts(importedContacts);
  };

  const handleMessageUpdate = (updatedMessage) => {
    setMessage(updatedMessage);
  };

const handleSendAll = async () => {
    if (!apiConfig.isValid) {
      toast.error("Please configure and validate API settings first");
      return;
    }
    
    if (!message.content.trim()) {
      toast.error("Please compose a message before sending");
      return;
    }
    
    if (contacts.length === 0) {
      toast.error("Please import contacts before sending");
      return;
    }

    // Start sending job
    const jobId = Date.now().toString();
    setSendJob({
      id: jobId,
      contacts: [...contacts],
message: { ...message },
      startTime: new Date(),
      endTime: null,
      status: "running"
    });

    // Reset all contacts to pending
    const resetContacts = contacts.map(contact => ({
      ...contact,
      status: "pending",
      error: null,
      timestamp: null
    }));
    setContacts(resetContacts);

    toast.success("Starting bulk message sending...");

    // Simulate sending process
    try {
await whatsappService.sendBulkMessages(
        resetContacts,
        message,
        apiConfig,
        (updatedContact) => {
          setContacts(prev => 
            prev.map(c => c.Id === updatedContact.Id ? updatedContact : c)
          );
        }
      );
      
      setSendJob(prev => ({ 
        ...prev, 
        status: "completed", 
        endTime: new Date() 
      }));
      
      toast.success("Bulk messaging completed");
    } catch (error) {
      setSendJob(prev => ({ 
        ...prev, 
        status: "completed", 
        endTime: new Date() 
      }));
      toast.error("Bulk messaging completed with some errors");
    }
  };

  const handlePauseSending = () => {
    setSendJob(prev => ({ ...prev, status: "paused" }));
    toast.info("Sending paused");
  };

  const handleResumeSending = () => {
    setSendJob(prev => ({ ...prev, status: "running" }));
    toast.info("Sending resumed");
  };

  const handleRetryFailed = async () => {
    const failedContacts = contacts.filter(c => c.status === "failed");
    
    if (failedContacts.length === 0) {
      toast.info("No failed messages to retry");
      return;
    }

    toast.info(`Retrying ${failedContacts.length} failed messages...`);

    // Reset failed contacts to pending
    setContacts(prev => 
      prev.map(c => 
        c.status === "failed" 
          ? { ...c, status: "pending", error: null, timestamp: null }
          : c
      )
    );

    // Retry sending for failed contacts
    try {
      await whatsappService.sendBulkMessages(
        failedContacts.map(c => ({ ...c, status: "pending", error: null, timestamp: null })),
        message,
        apiConfig,
        (updatedContact) => {
          setContacts(prev => 
            prev.map(c => c.Id === updatedContact.Id ? updatedContact : c)
          );
        }
      );
      
      toast.success("Retry completed");
    } catch (error) {
      toast.error("Retry completed with some errors");
    }
  };

  return (
    <div className="min-h-screen bg-whatsapp-background">
      {/* Header */}
      <div className="bg-white border-b border-whatsapp-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-whatsapp-primary to-whatsapp-dark rounded-lg flex items-center justify-center">
                <ApperIcon name="MessageCircle" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">WhatsApp Blast</h1>
                <p className="text-sm text-gray-500">Bulk Messaging Portal</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ApperIcon name="Users" size={16} />
                <span>{contacts.length} contacts loaded</span>
              </div>
              
              {apiConfig.isValid && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-dot" />
                  API Connected
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Import & Compose */}
          <div className="space-y-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-gray-900">Message Setup</h2>
              </div>
              <Link 
                to="/api-config"
                className="inline-flex items-center gap-2 px-4 py-2 bg-whatsapp-primary text-white rounded-lg hover:bg-whatsapp-dark transition-colors text-sm font-medium"
              >
                <ApperIcon name="Settings" size={16} />
                API Config
              </Link>
            </div>

<ContactImporter
              onContactsImported={handleContactsImported}
              disabled={!apiConfig.isValid}
              apiConfigured={apiConfig.isValid}
            />
            
            <MessageComposer
              message={message}
              onMessageUpdate={handleMessageUpdate}
              onSendAll={handleSendAll}
              canSend={apiConfig.isValid}
              totalContacts={contacts.length}
            />
          </div>
{/* Right Column - Progress Tracking */}
          <div className="lg:col-span-1">
            <SendProgressTracker
              contacts={contacts}
              sendJob={sendJob}
              onPauseSending={handlePauseSending}
              onResumeSending={handleResumeSending}
              onRetryFailed={handleRetryFailed}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;