'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render a fallback UI when an error is caught
      return (
        <div style={{ padding: '20px', color: 'white', textAlign: 'center' }}>
          <h1>Application Error</h1>
          <p>This application is intended to be run within the Telegram app.</p>
          <p style={{ color: '#ff4d4d', marginTop: '10px' }}>
            Error details: {this.state.error?.message}
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
