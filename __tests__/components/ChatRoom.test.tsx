import React from 'react';
import { render, screen, act } from '@testing-library/react';
import ChatRoom from '@/components/chat/ChatRoom';
import { useAuth } from '@/lib/auth/AuthContext';

// Mock the auth context
jest.mock('@/lib/auth/AuthContext', () => ({
  useAuth: jest.fn()
}));

describe('ChatRoom', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('shows loading state when user is not available', () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null });
    render(<ChatRoom />);
    expect(screen.getByText('Loading user...')).toBeInTheDocument();
  });

  it('shows retry button after 5 seconds of loading', async () => {
    (useAuth as jest.Mock).mockReturnValue({ user: null });
    render(<ChatRoom />);
    
    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(screen.getByText('Taking longer than expected...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
  });

  it('shows welcome message when user is available', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { email: 'test@example.com' }
    });
    render(<ChatRoom />);
    expect(screen.getByText(/Welcome to Chat, test@example.com/)).toBeInTheDocument();
  });

  it('shows auth error message when auth error occurs', () => {
    (useAuth as jest.Mock).mockImplementation(() => {
      throw new Error('auth error occurred');
    });
    render(<ChatRoom />);
    expect(screen.getByText('⚠️ Authentication error. Please sign in again.')).toBeInTheDocument();
  });
}); 