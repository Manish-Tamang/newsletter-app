import { useState, useEffect } from 'react';
import { Contact, Audience } from '@/lib/resend';

interface SubscribersResponse {
  success: boolean;
  data?: Contact[];
  error?: string;
}

interface AudiencesResponse {
  success: boolean;
  data?: Audience[];
  error?: string;
}

export function useSubscribers() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [audiences, setAudiences] = useState<Audience[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchContacts = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/subscribers/contacts');
      const result: SubscribersResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch contacts');
      }

      setContacts(result.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAudiences = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/subscribers/audiences');
      const result: AudiencesResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch audiences');
      }

      setAudiences(result.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const addContact = async (email: string, firstName?: string, lastName?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/subscribers/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, firstName, lastName }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add contact');
      }

      // Refresh contacts list
      await fetchContacts();

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteContact = async (contactId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/subscribers/contacts/${contactId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete contact');
      }

      // Refresh contacts list
      await fetchContacts();

      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const clearError = () => {
    setError(null);
  };

  // Load data on mount
  useEffect(() => {
    fetchContacts();
    fetchAudiences();
  }, []);

  return {
    contacts,
    audiences,
    isLoading,
    error,
    fetchContacts,
    fetchAudiences,
    addContact,
    deleteContact,
    clearError,
  };
} 