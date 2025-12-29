
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { SkullIcon } from './icons';

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
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to an error reporting service if needed
    console.error("Uncaught error:", error, errorInfo);
  }

  /**
   * Resets the error state to allow the user to try again.
   */
  handleRetry = () => {
    this.setState({ hasError: false, error: null });
    // A full reload might be necessary if assets failed to load or if the app is in a broken state
    window.location.reload();
  }

  render() {
    // If the state indicates an error, render the fallback UI
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-brand-dark text-brand-text p-8 relative overflow-hidden">
          {/* York Traitor Theme */}
          <div className="absolute inset-0 bg-red-500/5 pointer-events-none flex items-center justify-center">
             <div className="text-[200px] font-black text-red-500/10 rotate-45 select-none">BETRAYAL</div>
          </div>

          <SkullIcon className="w-20 h-20 text-red-500 mb-6 animate-pulse" />
          <h1 className="text-4xl font-bold mb-2 text-red-500 font-display">SYSTEM COMPROMISED</h1>
          <p className="text-brand-text-secondary mb-6 text-center max-w-lg">
            "It seems a Satellite has gone rogue. Error logic detected in the Punk Records synchronization stream. York is likely behind this."
          </p>
          <button
            onClick={this.handleRetry}
            className="px-8 py-3 bg-brand-accent text-brand-dark font-bold rounded-xl hover:bg-brand-accent-hover transition-colors shadow-glow-accent uppercase tracking-widest"
          >
            Reboot Stella Body
          </button>
          <details className="mt-8 text-sm text-brand-text-secondary w-full max-w-2xl border border-red-500/30 rounded-lg bg-black/50">
            <summary className="cursor-pointer p-4 font-mono text-xs uppercase hover:text-red-400">View Traitor Log</summary>
            <pre className="p-4 pt-0 whitespace-pre-wrap break-all text-xs text-red-300 font-mono">
              {this.state.error?.toString()}
            </pre>
          </details>
        </div>
      );
    }

    // Otherwise, render the children components
    return this.props.children;
  }
}

export default ErrorBoundary;
