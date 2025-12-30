
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
class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to an error reporting service if needed
    console.error("Uncaught error:", error, errorInfo);
  }

  /**
   * Resets the error state to allow the user to try again.
   */
  public handleRetry = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload(); 
  }

  public render() {
    // If the state indicates an error, render the fallback UI
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-brand-dark text-brand-text p-8 relative overflow-hidden">
          {/* York Traitor Theme Background */}
          <div className="absolute inset-0 bg-red-950/10 pointer-events-none flex items-center justify-center overflow-hidden">
             <div className="text-[200px] font-black text-red-500/5 rotate-45 select-none animate-pulse">BETRAYAL</div>
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
          </div>

          <div className="relative z-10 bg-brand-dark-secondary/80 backdrop-blur-xl p-12 rounded-3xl border border-red-500/30 shadow-[0_0_50px_rgba(220,38,38,0.2)] text-center max-w-2xl">
              <SkullIcon className="w-24 h-24 text-red-500 mx-auto mb-6 animate-[pulse_3s_ease-in-out_infinite]" />
              
              <h1 className="text-5xl font-black mb-2 text-white font-display tracking-tight">SYSTEM COMPROMISED</h1>
              <div className="h-1 w-32 bg-red-500 mx-auto mb-6 rounded-full"></div>
              
              <p className="text-brand-text-secondary mb-8 text-lg font-mono leading-relaxed">
                "It seems a Satellite has gone rogue. Error logic detected in the Punk Records synchronization stream. York is likely behind this."
              </p>
              
              <button
                onClick={this.handleRetry}
                className="px-10 py-4 bg-red-600 text-white font-black rounded-xl hover:bg-red-500 transition-all shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] uppercase tracking-widest text-sm transform hover:scale-105"
              >
                Reboot Stella Body
              </button>

              <details className="mt-12 text-left w-full border border-red-500/20 rounded-lg bg-black/40 overflow-hidden">
                <summary className="cursor-pointer p-4 font-mono text-xs uppercase text-red-400 hover:bg-red-500/10 transition-colors flex justify-between items-center">
                    <span>View Traitor Log</span>
                    <span className="opacity-50">ERROR_DUMP_V.101</span>
                </summary>
                <div className="p-4 pt-0 bg-black/20">
                    <pre className="whitespace-pre-wrap break-all text-[10px] text-red-300 font-mono opacity-80 border-t border-red-500/20 pt-4">
                    {this.state.error?.toString()}
                    {this.state.error?.stack}
                    </pre>
                </div>
              </details>
          </div>
        </div>
      );
    }

    // Otherwise, render the children components
    return this.props.children;
  }
}

export default ErrorBoundary;