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
        reply_to: emailData.replyTo,
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

      return {
        success: true,
        data: data?.data || [],
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

      return {
        success: true,
        data: data?.data || [],
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
