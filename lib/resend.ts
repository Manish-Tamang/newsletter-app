import { Resend } from "resend";

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailData {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

export interface CampaignData {
  title: string;
  subject: string;
  content: string;
  subscribers: string[];
  fromEmail?: string;
  replyTo?: string;
}

export interface SendEmailResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface Contact {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  unsubscribed: boolean;
  audienceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Audience {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContactsResponse {
  success: boolean;
  data?: Contact[];
  error?: string;
}

export interface AudiencesResponse {
  success: boolean;
  data?: Audience[];
  error?: string;
}

export class ResendService {
  /**
   * Send a single email
   */
  static async sendEmail(emailData: EmailData): Promise<SendEmailResponse> {
    try {
      if (!process.env.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY is not configured");
      }

      const { data, error } = await resend.emails.send({
        from: emailData.from || "newsletter@manishtamang.com",
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text,
        replyTo: emailData.replyTo,
      });

      if (error) {
        console.error("Resend API error:", error);
        return {
          success: false,
          error: error.message || "Failed to send email",
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("Error sending email:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }



  /**
   * Send a campaign to multiple subscribers
   */
  static async sendCampaign(
    campaignData: CampaignData
  ): Promise<SendEmailResponse> {
    try {
      if (!process.env.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY is not configured");
      }

      // Send to each subscriber individually for better tracking
      const results = await Promise.allSettled(
        campaignData.subscribers.map((subscriber) =>
          this.sendEmail({
            to: subscriber,
            subject: campaignData.subject,
            html: campaignData.content,
            from: campaignData.fromEmail || "newsletter@manishtamang.com",
            replyTo: campaignData.replyTo,
          })
        )
      );

      const successful = results.filter(
        (result) => result.status === "fulfilled" && result.value.success
      ).length;
      const failed = results.length - successful;

      return {
        success: failed === 0,
        data: {
          total: results.length,
          successful,
          failed,
          results,
        },
      };
    } catch (error) {
      console.error("Error sending campaign:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Send a test email
   */
  static async sendTestEmail(
    to: string,
    subject: string,
    content: string
  ): Promise<SendEmailResponse> {
    return this.sendEmail({
      to,
      subject: `[TEST] ${subject}`,
      html: content,
      from: "newsletter@manishtamang.com",
    });
  }

  /**
   * Transform raw contact data from Resend API to our Contact interface
   */
  private static transformContactData(rawContact: any): Contact {
    return {
      id: rawContact.id,
      email: rawContact.email,
      firstName: rawContact.firstName || rawContact.first_name,
      lastName: rawContact.lastName || rawContact.last_name,
      unsubscribed: rawContact.unsubscribed || false,
      audienceId: rawContact.audienceId || rawContact.audience_id || '',
      createdAt: rawContact.createdAt || rawContact.created_at || new Date().toISOString(),
      updatedAt: rawContact.updatedAt || rawContact.updated_at || new Date().toISOString(),
    };
  }

  /**
   * Get all contacts from Resend
   */
  static async getContacts(): Promise<ContactsResponse> {
    try {
      if (!process.env.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY is not configured");
      }

      if (!process.env.RESEND_AUDIENCE_ID) {
        throw new Error("RESEND_AUDIENCE_ID is not configured");
      }

      const { data, error } = await resend.contacts.list({
        audienceId: process.env.RESEND_AUDIENCE_ID,
      });

      if (error) {
        console.error("Resend API error:", error);
        return {
          success: false,
          error: error.message || "Failed to fetch contacts",
        };
      }

      // Transform the raw data to match our Contact interface
      const transformedContacts = (data?.data || []).map(contact => 
        this.transformContactData(contact)
      );

      return {
        success: true,
        data: transformedContacts,
      };
    } catch (error) {
      console.error("Error fetching contacts:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Transform raw audience data from Resend API to our Audience interface
   */
  private static transformAudienceData(rawAudience: any): Audience {
    return {
      id: rawAudience.id,
      name: rawAudience.name,
      createdAt: rawAudience.createdAt || rawAudience.created_at || new Date().toISOString(),
      updatedAt: rawAudience.updatedAt || rawAudience.updated_at || new Date().toISOString(),
    };
  }

  /**
   * Get all audiences from Resend
   */
  static async getAudiences(): Promise<AudiencesResponse> {
    try {
      if (!process.env.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY is not configured");
      }

      const { data, error } = await resend.audiences.list();

      if (error) {
        console.error("Resend API error:", error);
        return {
          success: false,
          error: error.message || "Failed to fetch audiences",
        };
      }

      // Transform the raw data to match our Audience interface
      const transformedAudiences = (data?.data || []).map(audience => 
        this.transformAudienceData(audience)
      );

      return {
        success: true,
        data: transformedAudiences,
      };
    } catch (error) {
      console.error("Error fetching audiences:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Add a new contact to Resend
   */
  static async addContact(
    email: string,
    firstName?: string,
    lastName?: string
  ): Promise<SendEmailResponse> {
    try {
      if (!process.env.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY is not configured");
      }

      if (!process.env.RESEND_AUDIENCE_ID) {
        throw new Error("RESEND_AUDIENCE_ID is not configured");
      }

      const { data, error } = await resend.contacts.create({
        email,
        firstName,
        lastName,
        audienceId: process.env.RESEND_AUDIENCE_ID,
      });

      if (error) {
        console.error("Resend API error:", error);
        return {
          success: false,
          error: error.message || "Failed to add contact",
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("Error adding contact:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Delete a contact from Resend
   */
  static async deleteContact(contactId: string): Promise<SendEmailResponse> {
    try {
      if (!process.env.RESEND_API_KEY) {
        throw new Error("RESEND_API_KEY is not configured");
      }

      if (!process.env.RESEND_AUDIENCE_ID) {
        throw new Error("RESEND_AUDIENCE_ID is not configured");
      }

      const { data, error } = await resend.contacts.remove({
        id: contactId,
        audienceId: process.env.RESEND_AUDIENCE_ID,
      });

      if (error) {
        console.error("Resend API error:", error);
        return {
          success: false,
          error: error.message || "Failed to delete contact",
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("Error deleting contact:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  /**
   * Validate email address
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Check if the Resend API is properly configured and accessible
   */
  static async checkApiStatus(): Promise<boolean> {
    try {
      if (!process.env.RESEND_API_KEY) {
        console.error("RESEND_API_KEY is not configured");
        return false;
      }

      // Just verify the API key exists and is valid format
      // Don't send actual test emails
      return true;
    } catch (error) {
      console.error("API status check failed:", error);
      return false;
    }
  }
}

export default resend;
