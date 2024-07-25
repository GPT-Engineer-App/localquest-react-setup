import { render, screen, fireEvent, waitFor } from '@/utils/testUtils';
import { vi } from 'vitest';
import Login from './Login';
import { supabase } from '@/integrations/supabase';
import { toast } from 'sonner';

describe('Login Component', () => {
  it('renders login form', () => {
    render(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  it('displays error messages for invalid inputs', async () => {
    render(<Login />);
    
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
    });
  });

  it('calls supabase signInWithPassword on form submission', async () => {
    const mockSignIn = vi.fn().mockResolvedValue({ error: null });
    supabase.auth.signInWithPassword = mockSignIn;

    render(<Login />);
    
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('shows success toast on successful login', async () => {
    supabase.auth.signInWithPassword = vi.fn().mockResolvedValue({ error: null });

    render(<Login />);
    
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Logged in successfully!');
    });
  });

  it('handles login error', async () => {
    const mockError = new Error('Login failed');
    supabase.auth.signInWithPassword = vi.fn().mockRejectedValue(mockError);

    render(<Login />);
    
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Login failed');
    });
  });
});