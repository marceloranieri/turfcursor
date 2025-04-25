import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import InteractionDebugger from '../../components/InteractionDebugger';

// Mock the document methods
global.document.querySelectorAll = jest.fn().mockImplementation(() => []);
global.document.elementFromPoint = jest.fn();

describe('InteractionDebugger', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders nothing by default (debug mode off)', () => {
    const { container } = render(<InteractionDebugger />);
    expect(container.firstChild).toBeNull();
  });

  it('enters debug mode when Ctrl+Shift+D is pressed', () => {
    render(<InteractionDebugger />);
    
    // Simulate Ctrl+Shift+D keydown
    fireEvent.keyDown(document, { 
      key: 'D',
      ctrlKey: true,
      shiftKey: true
    });
    
    // Check if the debug panel is now visible
    expect(screen.getByText('Interaction Debugger')).toBeInTheDocument();
  });

  it('shows empty state messages when no events are logged', () => {
    render(<InteractionDebugger />);
    
    // Enter debug mode
    fireEvent.keyDown(document, { 
      key: 'D',
      ctrlKey: true,
      shiftKey: true
    });
    
    // Check for empty state messages
    expect(screen.getByText('No click events recorded yet')).toBeInTheDocument();
    expect(screen.getByText('No form submissions recorded yet')).toBeInTheDocument();
  });

  it('applies fixes to clickable elements', () => {
    // Mock a button element
    const mockButton = {
      addEventListener: jest.fn(),
      style: {},
      dataset: {},
      tagName: 'BUTTON',
      className: 'test-button'
    };
    
    global.document.querySelectorAll.mockReturnValue([mockButton]);
    
    render(<InteractionDebugger />);
    
    // Let the effect run
    act(() => {
      jest.runAllTimers();
    });
    
    // Check if event listeners were added
    expect(mockButton.addEventListener).toHaveBeenCalledWith('mousedown', expect.any(Function));
    expect(mockButton.addEventListener).toHaveBeenCalledWith('mouseup', expect.any(Function));
    expect(mockButton.addEventListener).toHaveBeenCalledWith('click', expect.any(Function));
  });

  it('toggles debug mode on and off', () => {
    render(<InteractionDebugger />);
    
    // Enter debug mode
    fireEvent.keyDown(document, { 
      key: 'D',
      ctrlKey: true,
      shiftKey: true
    });
    
    // Check if the debug panel is visible
    expect(screen.getByText('Interaction Debugger')).toBeInTheDocument();
    
    // Exit debug mode
    fireEvent.keyDown(document, { 
      key: 'D',
      ctrlKey: true,
      shiftKey: true
    });
    
    // Check if the debug panel is no longer visible
    expect(screen.queryByText('Interaction Debugger')).not.toBeInTheDocument();
  });
}); 