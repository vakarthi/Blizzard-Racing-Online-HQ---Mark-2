
import React from 'react';
import { AlertTriangleIcon } from './icons';

interface Props {
  children?: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component to catch JavaScript errors anywhere in their child component tree,
 * log those errors, and display a fallback UI instead of the component tree that crashed.
 */
// Fix: Using React.Component explicitly to ensure TypeScript correctly identifies setState and props inherited from the base class.
class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  public handleRetry = () => {
    // Fix: Accessing setState inherited from React.Component.
    this.setState({ hasError: false, error: null });
    // A full reload might be necessary if assets failed to load due to network issues
    window.location.reload();
  };

  public render() {
    // Fix: Accessing the state property inherited from the React.Component base class.
    if (this.state.hasError) {
      // Fallback UI
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

    // Fix: Accessing the props property inherited from the React.Component base class.
    return this.props.children;
  }
}

export default ErrorBoundary;
