import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ToastProvider } from '@/components/ui/ToastContext';
import { useToast } from '@/components/ui/ToastContext';
import { Toast } from '@/components/ui/Toast';
import userEvent from '@testing-library/user-event';

// Mock component to trigger toasts
function TestComponent() {
  const { showToast } = useToast();
  return (
    <div>
      <button onClick={() => showToast('Success message', 'success')}>Show Success</button>
      <button onClick={() => showToast('Error message', 'error')}>Show Error</button>
      <button onClick={() => showToast('Info message', 'info')}>Show Info</button>
      <button onClick={() => showToast('Warning message', 'warning')}>Show Warning</button>
      <button onClick={() => showToast('Custom duration', 'info', 2000)}>Custom Duration</button>
      <button onClick={() => {
        showToast('First toast');
        showToast('Second toast');
        showToast('Third toast');
      }}>Show Multiple</button>
    </div>
  );
}

// Setup function to render the toast system
function setup() {
  return render(
    <ToastProvider>
      <TestComponent />
      <Toast />
    </ToastProvider>
  );
}

describe('Toast System', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('shows success toast and auto-dismisses', () => {
    setup();
    
    fireEvent.click(screen.getByText('Show Success'));
    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Success')).toBeInTheDocument();
    
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    expect(screen.queryByText('Success message')).not.toBeInTheDocument();
  });

  it('shows error toast with correct styling', () => {
    setup();
    
    fireEvent.click(screen.getByText('Show Error'));
    expect(screen.getByText('Error message')).toBeInTheDocument();
    expect(screen.getByText('Error')).toBeInTheDocument();
  });

  it('respects custom duration', () => {
    setup();
    
    fireEvent.click(screen.getByText('Custom Duration'));
    expect(screen.getByText('Custom duration')).toBeInTheDocument();
    
    act(() => {
      jest.advanceTimersByTime(1900);
    });
    expect(screen.getByText('Custom duration')).toBeInTheDocument();
    
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(screen.queryByText('Custom duration')).not.toBeInTheDocument();
  });

  it('allows manual dismissal', () => {
    setup();
    
    fireEvent.click(screen.getByText('Show Info'));
    expect(screen.getByText('Info message')).toBeInTheDocument();
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    expect(screen.queryByText('Info message')).not.toBeInTheDocument();
  });

  it('handles multiple toasts in sequence', () => {
    setup();
    
    fireEvent.click(screen.getByText('Show Multiple'));
    expect(screen.getByText('First toast')).toBeInTheDocument();
    
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    expect(screen.getByText('Second toast')).toBeInTheDocument();
    
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    
    expect(screen.getByText('Third toast')).toBeInTheDocument();
  });

  // New accessibility tests
  it('provides proper ARIA attributes for accessibility', () => {
    setup();
    
    fireEvent.click(screen.getByText('Show Success'));
    
    const toastElement = screen.getByRole('status');
    expect(toastElement).toHaveAttribute('aria-live', 'polite');
    
    const viewport = screen.getByRole('region');
    expect(viewport).toHaveAttribute('aria-label', 'Notification area');
  });

  it('handles keyboard dismissal correctly', async () => {
    const user = userEvent.setup();
    setup();
    
    fireEvent.click(screen.getByText('Show Info'));
    expect(screen.getByText('Info message')).toBeInTheDocument();
    
    const closeButton = screen.getByRole('button', { name: /close notification/i });
    await user.tab(); // Focus the close button
    await user.keyboard('{Enter}');
    
    expect(screen.queryByText('Info message')).not.toBeInTheDocument();
  });

  it('maintains focus management', async () => {
    const user = userEvent.setup();
    setup();
    
    const triggerButton = screen.getByText('Show Info');
    await user.click(triggerButton);
    
    const closeButton = screen.getByRole('button', { name: /close notification/i });
    expect(closeButton).toBeVisible();
    
    await user.tab();
    expect(closeButton).toHaveFocus();
    
    await user.keyboard('{Enter}');
    expect(triggerButton).toHaveFocus();
  });
}); 