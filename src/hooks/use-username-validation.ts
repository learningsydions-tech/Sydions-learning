import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useDebounce } from 'use-debounce';

// Regex: Alphanumeric, dashes, and underscores only. Length 3-20.
const USERNAME_REGEX = /^[a-z0-9_-]{3,20}$/;

interface ValidationResult {
  isValid: boolean;
  isAvailable: boolean;
  message: string;
  isLoading: boolean;
}

/**
 * Hook to validate username format and check availability against the database.
 * @param initialUsername The current username value (used to skip checking if the username hasn't changed).
 * @param currentUserId The ID of the current user (used to exclude their own profile during availability check).
 */
export const useUsernameValidation = (initialUsername: string, currentUserId?: string) => {
  const [username, setUsername] = useState(initialUsername);
  const [debouncedUsername] = useDebounce(username, 500);
  const [validation, setValidation] = useState<ValidationResult>({
    isValid: false,
    isAvailable: false,
    message: "Username must be 3-20 characters long.",
    isLoading: false,
  });

  const formatUsername = (input: string) => {
    // Convert to lowercase and replace invalid characters (except - and _)
    return input.toLowerCase().replace(/[^a-z0-9_-]/g, '');
  };

  const checkAvailability = useCallback(async (name: string) => {
    if (!name || name.length < 3) {
      setValidation({
        isValid: false,
        isAvailable: false,
        message: "Username must be 3-20 characters long.",
        isLoading: false,
      });
      return;
    }
    
    if (!USERNAME_REGEX.test(name)) {
      setValidation({
        isValid: false,
        isAvailable: false,
        message: "Only lowercase letters, numbers, dashes (-), and underscores (_) are allowed.",
        isLoading: false,
      });
      return;
    }

    // If the username hasn't changed from the initial value, it's valid and available.
    if (name === initialUsername) {
        setValidation({
            isValid: true,
            isAvailable: true,
            message: "Username is valid.",
            isLoading: false,
        });
        return;
    }

    setValidation(prev => ({ ...prev, isLoading: true }));

    const query = supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('username', name);
      
    // If updating, exclude the current user's ID from the check
    if (currentUserId) {
        query.neq('id', currentUserId);
    }

    const { count, error } = await query;

    if (error) {
      console.error("Supabase username check error:", error);
      setValidation({
        isValid: false,
        isAvailable: false,
        message: "An error occurred while checking availability.",
        isLoading: false,
      });
      return;
    }

    const isAvailable = (count || 0) === 0;

    setValidation({
      isValid: true,
      isAvailable: isAvailable,
      message: isAvailable ? "Username is available." : "Username is already taken.",
      isLoading: false,
    });
  }, [initialUsername, currentUserId]);

  useEffect(() => {
    if (debouncedUsername) {
      checkAvailability(debouncedUsername);
    } else {
        setValidation({
            isValid: false,
            isAvailable: false,
            message: "Username is required.",
            isLoading: false,
        });
    }
  }, [debouncedUsername, checkAvailability]);

  return {
    username,
    setUsername: (input: string) => setUsername(formatUsername(input)),
    validation,
    debouncedUsername,
  };
};