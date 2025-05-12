import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Sidebar from '../Sidebar';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <SafeAreaProvider
    initialMetrics={{
      frame: { x: 0, y: 0, width: 0, height: 0 },
      insets: { top: 0, left: 0, right: 0, bottom: 0 },
    }}
  >
    {children}
  </SafeAreaProvider>
);

describe('Sidebar', () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    onNavigate: jest.fn(),
    currentRoute: '/(tabs)',
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders correctly', () => {
    const { getByTestId } = render(
      <TestWrapper>
        <Sidebar {...defaultProps} />
      </TestWrapper>
    );

    act(() => {
      jest.runAllTimers();
    });

    expect(getByTestId('sidebar-container')).toBeTruthy();
  });

  it('handles navigation correctly', () => {
    const onNavigate = jest.fn();
    const { getByText } = render(
      <TestWrapper>
        <Sidebar {...defaultProps} onNavigate={onNavigate} />
      </TestWrapper>
    );
    
    act(() => {
      jest.runAllTimers();
    });

    fireEvent.press(getByText('Home'));
    expect(onNavigate).toHaveBeenCalledWith('/(tabs)');
  });
}); 