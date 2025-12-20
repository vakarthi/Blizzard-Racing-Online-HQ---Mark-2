
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangleIcon } from './icons';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary component to catch JavaScript errors anywhere in their child component tree,
 * log those errors, and display a fallback UI instead of the component tree that crashed.
 */
/* Fix: Explicitly extend React.Component (via direct import) and declare state for proper TypeScript property access */
class ErrorBoundary extends Component<Props, State> {
  // Fix: Explicitly declare state on the class to resolve property access errors
  public state: State = {
    hasError: false,
    error: null,
  };

  constructor(props: Props) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  /* Fix: handleRetry method uses setState which is now correctly inherited from React.Component */
  public handleRetry = () => {
    this.setState({ hasError: false, error: null });
    // A full reload might be necessary if assets failed to load
    window.location.reload();
  };

  public render() {
    /* Fix: access state properties through this.state, inherited from React.Component */
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
              {/* Fix: access error property from state. */}
              {this.state.error?.toString()}
            </pre>
          </details>
        </div>
      );
    }

    /* Fix: access children through this.props, inherited from React.Component */
    return this.props.children;
  }
}

export default ErrorBoundary;
