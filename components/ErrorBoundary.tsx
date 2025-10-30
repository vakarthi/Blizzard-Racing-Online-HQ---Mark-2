import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangleIcon } from './icons';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

// FIX: Extend React.Component to make this a valid React class component.
// This gives the class access to `this.props`, `this.setState`, and other React lifecycle methods.
class ErrorBoundary extends React.Component<Props, State> {
  // Use a class property for state initialization, which is a modern and clean approach.
  state: State = {
    hasError: false,
    error: null,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  // Use an arrow function for the event handler to ensure 'this' is correctly bound.
  handleRetry = () => {
    // FIX: `this.setState` is now available because the class extends React.Component, resolving the error.
    this.setState({ hasError: false, error: null });
    // A full reload might be necessary if assets failed to load
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-brand-dark text-brand-text p-8">
          <AlertTriangleIcon className="w-16 h-16 text-yellow-400 mb-4" />
          <h1 className="text-3xl font-bold mb-2">Something went wrong.</h1>
          <p className="text-brand-text-secondary mb-6 text-center">
            An unexpected error occurred. This could be a temporary network issue or a component failure.
          </p>
          <button
            onClick={this.handleRetry}
            className="px-6 py-2 bg-brand-accent text-brand-dark font-bold rounded-lg hover:bg-brand-accent-hover transition-colors"
          >
            Refresh Page
          </button>
          <details className="mt-8 text-sm text-brand-text-secondary w-full max-w-2xl">
            <summary className="cursor-pointer">Error Details</summary>
            <pre className="mt-2 p-4 bg-brand-dark-secondary rounded-md whitespace-pre-wrap break-all">
              {this.state.error?.toString()}
            </pre>
          </details>
        </div>
      );
    }

    // FIX: `this.props` is now available because the class extends React.Component, resolving the error.
    return this.props.children;
  }
}

export default ErrorBoundary;