import { useState } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ProgressBar from "@/components/atoms/ProgressBar";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import { format } from "date-fns";
import { toast } from "react-toastify";

const SendProgressTracker = ({ 
  contacts, 
  sendJob, 
  onPauseSending, 
  onResumeSending, 
  onExportResults,
  onRetryFailed 
}) => {
  const [filter, setFilter] = useState("all");

  if (!contacts || contacts.length === 0) {
    return (
      <Card>
        <Empty
          icon="MessageSquare"
          message="No contacts to track"
          description="Import contacts and compose a message to see sending progress here"
        />
      </Card>
    );
  }

  const getFilteredContacts = () => {
    if (filter === "all") return contacts;
    return contacts.filter(contact => contact.status === filter);
  };

  const getStatusCounts = () => {
    return contacts.reduce((acc, contact) => {
      acc[contact.status] = (acc[contact.status] || 0) + 1;
      return acc;
    }, {});
  };

  const statusCounts = getStatusCounts();
  const totalContacts = contacts.length;
  const sentCount = statusCounts.sent || 0;
  const failedCount = statusCounts.failed || 0;
  const pendingCount = statusCounts.pending || 0;
  const sendingCount = statusCounts.sending || 0;
  
  const progressPercentage = totalContacts > 0 ? ((sentCount + failedCount) / totalContacts) * 100 : 0;
  const filteredContacts = getFilteredContacts();

  const handleExport = () => {
    const csvContent = [
      ["Phone Number", "Status", "Timestamp", "Error"],
      ...contacts.map(contact => [
        contact.phoneNumber,
        contact.status,
        contact.timestamp ? format(new Date(contact.timestamp), "yyyy-MM-dd HH:mm:ss") : "",
        contact.error || ""
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `whatsapp-blast-results-${format(new Date(), "yyyy-MM-dd-HHmm")}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success("Results exported successfully");
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending": return "Clock";
      case "sending": return "Loader2";
      case "sent": return "CheckCircle";
      case "failed": return "XCircle";
      default: return "Circle";
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case "pending": return "pending";
      case "sending": return "sending";
      case "sent": return "sent";
      case "failed": return "failed";
      default: return "default";
    }
  };

  return (
    <Card>
      <div className="space-y-6">
        {/* Header with Controls */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <ApperIcon name="Activity" size={20} />
            Sending Progress
          </h2>
          
          <div className="flex items-center gap-2">
            {sendJob?.status === "running" && (
              <Button
                onClick={onPauseSending}
                variant="outline"
                size="sm"
              >
                <ApperIcon name="Pause" size={16} />
                Pause
              </Button>
            )}
            
            {sendJob?.status === "paused" && (
              <Button
                onClick={onResumeSending}
                variant="primary"
                size="sm"
              >
                <ApperIcon name="Play" size={16} />
                Resume
              </Button>
            )}
            
            <Button
              onClick={handleExport}
              variant="outline"
              size="sm"
            >
              <ApperIcon name="Download" size={16} />
              Export
            </Button>
            
            {failedCount > 0 && (
              <Button
                onClick={onRetryFailed}
                variant="outline"
                size="sm"
              >
                <ApperIcon name="RotateCcw" size={16} />
                Retry Failed
              </Button>
            )}
          </div>
        </div>

        {/* Progress Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{totalContacts}</div>
              <div className="text-sm text-gray-500">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{sentCount}</div>
              <div className="text-sm text-gray-500">Sent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">{failedCount}</div>
              <div className="text-sm text-gray-500">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{pendingCount + sendingCount}</div>
              <div className="text-sm text-gray-500">Remaining</div>
            </div>
          </div>
          
          <ProgressBar
            value={progressPercentage}
            variant="primary"
            showLabel
            className="mb-2"
          />
          
          {sendJob?.status === "running" && sendingCount > 0 && (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <ApperIcon name="Loader2" size={14} className="animate-spin" />
              Sending messages...
            </div>
          )}
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: "All", count: totalContacts },
            { key: "pending", label: "Pending", count: pendingCount },
            { key: "sending", label: "Sending", count: sendingCount },
            { key: "sent", label: "Sent", count: sentCount },
            { key: "failed", label: "Failed", count: failedCount }
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                filter === key
                  ? "bg-whatsapp-primary text-white"
                  : "bg-white border border-whatsapp-border text-gray-700 hover:bg-gray-50"
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        {/* Contacts List */}
        <div className="border border-whatsapp-border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-3 border-b border-whatsapp-border">
            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700">
              <div className="col-span-4">Phone Number</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-3">Timestamp</div>
              <div className="col-span-3">Error</div>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {filteredContacts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No contacts match the current filter
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <div
                  key={contact.Id}
                  className={`px-4 py-3 border-b border-whatsapp-border hover:bg-gray-50 ${
                    contact.status === "failed" ? "animate-shake" : ""
                  }`}
                >
                  <div className="grid grid-cols-12 gap-4 text-sm">
                    <div className="col-span-4 font-mono text-gray-900">
                      {contact.phoneNumber}
                    </div>
                    <div className="col-span-2">
                      <Badge variant={getStatusVariant(contact.status)}>
                        <ApperIcon 
                          name={getStatusIcon(contact.status)} 
                          size={12} 
                          className={contact.status === "sending" ? "animate-spin" : ""}
                        />
                        {contact.status}
                      </Badge>
                    </div>
                    <div className="col-span-3 text-gray-600">
                      {contact.timestamp ? 
                        format(new Date(contact.timestamp), "HH:mm:ss") : 
                        "-"
                      }
                    </div>
                    <div className="col-span-3 text-red-600 text-xs">
                      {contact.error || "-"}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default SendProgressTracker;