// src/components/Modals/YAMLModal.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { YAMLModal } from './YAMLModal';
import * as toastModule from '@/lib/toast';

// Mock Shiki - syntax highlighting not needed for these tests
vi.mock('shiki', () => ({
  codeToHtml: vi.fn().mockResolvedValue('<span>mocked html</span>'),
}));

// Mock the shiki theme import
vi.mock('@/lib/shiki-theme', () => ({
  equithermTheme: 'mocked-theme',
}));

// Default store state - used to reset mockStore between tests
const defaultStoreState = {
  curve: {
    tTarget: 21,
    hc: 0.9,
    n: 1.25,
    shift: 0,
    minFlow: 20,
    maxFlow: 70,
    tOutMin: -20,
    tOutMax: 20,
  },
  pid: {
    enabled: false,
    mode: 'offset' as const,
    roomTemp: 0,
    kp: 1,
    ki: 0,
    kd: 0,
    deadbandEnabled: false,
    deadbandThresholdHigh: 0.3,
    deadbandThresholdLow: -0.3,
    deadbandKpMultiplier: 0.1,
    deadbandKiMultiplier: 0.0,
    deadbandKdMultiplier: 0.0,
  },
};

// Mock zustand store (mutable for tests that need to modify state)
const mockStore = { ...defaultStoreState, curve: { ...defaultStoreState.curve }, pid: { ...defaultStoreState.pid } };

vi.mock('@/store/useStore', () => ({
  useStore: vi.fn((selector) => selector(mockStore)),
}));

// Mock clipboard API
const mockClipboardWrite = vi.fn();
const originalClipboard = navigator.clipboard;

describe('YAMLModal - Copy Functionality', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Reset mock store to default state to prevent test pollution
    Object.assign(mockStore.curve, defaultStoreState.curve);
    Object.assign(mockStore.pid, defaultStoreState.pid);

    // Setup clipboard mock with targeted approach (preserves rest of navigator)
    Object.assign(navigator, {
      clipboard: {
        writeText: mockClipboardWrite.mockResolvedValue(undefined),
      },
    });
  });

  afterEach(() => {
    // Restore clipboard to original state
    Object.assign(navigator, { clipboard: originalClipboard });
    vi.useRealTimers();
  });

  it('should render Copy button when modal is open', () => {
    render(<YAMLModal isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
  });

  it('should call clipboard.writeText with YAML content when Copy is clicked', async () => {
    render(<YAMLModal isOpen={true} onClose={mockOnClose} />);

    const copyButton = screen.getByRole('button', { name: 'Copy' });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockClipboardWrite).toHaveBeenCalledTimes(1);
    });

    // Verify the YAML content contains expected fields
    const writtenText = mockClipboardWrite.mock.calls[0][0];
    expect(writtenText).toContain('climate:');
    expect(writtenText).toContain('platform: equitherm');
    expect(writtenText).toContain('default_target_temperature: 21');
  });

  it('should show "Copied!" feedback after successful copy', async () => {
    render(<YAMLModal isOpen={true} onClose={mockOnClose} />);

    const copyButton = screen.getByRole('button', { name: 'Copy' });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Copied!' })).toBeInTheDocument();
    });
  });

  it('should reset button text to "Copy" after 1500ms', async () => {
    vi.useFakeTimers();

    render(<YAMLModal isOpen={true} onClose={mockOnClose} />);

    const copyButton = screen.getByRole('button', { name: 'Copy' });

    await act(async () => {
      fireEvent.click(copyButton);
      // Flush microtasks (promises) without advancing timers
      await Promise.resolve();
    });

    // Wait for the state update by flushing React updates
    await act(async () => {
      // Advance a small amount to let the promise resolve
      vi.advanceTimersByTime(0);
    });

    // Now the button should show "Copied!"
    expect(screen.getByRole('button', { name: 'Copied!' })).toBeInTheDocument();

    // Advance by 1500ms (matches setTimeout in YAMLModal.tsx:101)
    await act(async () => {
      vi.advanceTimersByTime(1500);
    });

    // Button should be back to "Copy"
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
  });

  it('should show error toast when clipboard write fails', async () => {
    const showToastSpy = vi.spyOn(toastModule, 'showToast');
    mockClipboardWrite.mockRejectedValueOnce(new Error('Clipboard error'));

    render(<YAMLModal isOpen={true} onClose={mockOnClose} />);

    const copyButton = screen.getByRole('button', { name: 'Copy' });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(showToastSpy).toHaveBeenCalledWith('Failed to copy', 'error');
    });
  });

  it('should not change button to "Copied!" when clipboard write fails', async () => {
    mockClipboardWrite.mockRejectedValueOnce(new Error('Clipboard error'));

    render(<YAMLModal isOpen={true} onClose={mockOnClose} />);

    const copyButton = screen.getByRole('button', { name: 'Copy' });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockClipboardWrite).toHaveBeenCalled();
    });

    // Button should still say "Copy", not "Copied!"
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Copied!' })).not.toBeInTheDocument();
  });

  it('should reset copied state when modal is reopened', async () => {
    const { rerender } = render(<YAMLModal isOpen={true} onClose={mockOnClose} />);

    // Click copy to set copied state
    const copyButton = screen.getByRole('button', { name: 'Copy' });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Copied!' })).toBeInTheDocument();
    });

    // Close the modal
    rerender(<YAMLModal isOpen={false} onClose={mockOnClose} />);

    // Reopen the modal - this triggers the useEffect that resets copied state
    rerender(<YAMLModal isOpen={true} onClose={mockOnClose} />);

    // Button should be reset to "Copy"
    expect(screen.getByRole('button', { name: 'Copy' })).toBeInTheDocument();
  });

  it('should include correct YAML content based on store state', async () => {
    // Update mock store with different values
    mockStore.curve.tTarget = 22;
    mockStore.curve.hc = 1.5;

    render(<YAMLModal isOpen={true} onClose={mockOnClose} />);

    const copyButton = screen.getByRole('button', { name: 'Copy' });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockClipboardWrite).toHaveBeenCalled();
    });

    const writtenText = mockClipboardWrite.mock.calls[0][0];
    expect(writtenText).toContain('default_target_temperature: 22°C');
    expect(writtenText).toContain('heat_curve_coefficient: 1.5');
  });

  it('should include sensors in YAML when includeSensors is true', async () => {
    render(<YAMLModal isOpen={true} onClose={mockOnClose} includeSensors={true} />);

    const copyButton = screen.getByRole('button', { name: 'Copy' });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockClipboardWrite).toHaveBeenCalled();
    });

    const writtenText = mockClipboardWrite.mock.calls[0][0];
    expect(writtenText).toContain('# Diagnostic sensors');
  });

  it('should include numbers in YAML when includeNumbers is true', async () => {
    render(<YAMLModal isOpen={true} onClose={mockOnClose} includeNumbers={true} />);

    const copyButton = screen.getByRole('button', { name: 'Copy' });
    fireEvent.click(copyButton);

    await waitFor(() => {
      expect(mockClipboardWrite).toHaveBeenCalled();
    });

    const writtenText = mockClipboardWrite.mock.calls[0][0];
    expect(writtenText).toContain('# Runtime tuning');
  });
});
