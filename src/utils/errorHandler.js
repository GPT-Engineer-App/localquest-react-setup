import { toast } from 'sonner';

export const handleError = (error) => {
  console.error('An error occurred:', error);
  toast.error(error.message || 'An unexpected error occurred');
};

export const withErrorHandling = (fn) => async (...args) => {
  try {
    return await fn(...args);
  } catch (error) {
    handleError(error);
    throw error;
  }
};