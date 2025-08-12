import contactData from "@/services/mockData/contacts.json";

const whatsappService = {
  // Simulate sending a single message
  async sendMessage(contact, message, apiConfig) {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 1000));
    
    // Simulate success/failure (90% success rate)
    const isSuccess = Math.random() > 0.1;
    
    if (isSuccess) {
      return {
        ...contact,
        status: "sent",
        timestamp: new Date().toISOString(),
        error: null
      };
    } else {
      const errors = [
        "Invalid phone number format",
        "Phone number not registered on WhatsApp",
        "Rate limit exceeded",
        "Network timeout",
        "Insufficient account balance"
      ];
      
      return {
        ...contact,
        status: "failed",
        timestamp: new Date().toISOString(),
        error: errors[Math.floor(Math.random() * errors.length)]
      };
    }
  },

  // Simulate bulk message sending
  async sendBulkMessages(contacts, message, apiConfig, onProgress) {
    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      
      // Update status to sending
      const sendingContact = {
        ...contact,
        status: "sending",
        timestamp: new Date().toISOString()
      };
      onProgress(sendingContact);
      
      try {
        // Send the message
        const result = await this.sendMessage(contact, message, apiConfig);
        onProgress(result);
        
        // Small delay between messages to avoid overwhelming the UI
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        const failedContact = {
          ...contact,
          status: "failed",
          timestamp: new Date().toISOString(),
          error: "Unexpected error occurred"
        };
        onProgress(failedContact);
      }
    }
  },

  // Validate API configuration
  async validateConfig(config) {
    // Simulate API validation call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple validation logic
    return (
      config.bearerToken.startsWith("EAA") &&
      config.phoneId.length >= 15 &&
      config.businessAccountId.length >= 15
    );
  },

  // Get account info (mock)
  async getAccountInfo(apiConfig) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      accountId: apiConfig.businessAccountId,
      phoneId: apiConfig.phoneId,
      status: "VERIFIED",
      displayPhoneNumber: "+1 (555) 123-4567",
      qualityRating: "GREEN",
      messagingLimit: "TIER_1000"
    };
  },

  // Get message template (mock)
  async getMessageTemplates(apiConfig) {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return [
      {
        Id: 1,
        name: "hello_world",
        status: "APPROVED",
        category: "UTILITY",
        language: "en_US"
      },
      {
        Id: 2,
        name: "sample_shipping_confirmation",
        status: "APPROVED", 
        category: "UTILITY",
        language: "en_US"
      }
    ];
  }
};

export default whatsappService;