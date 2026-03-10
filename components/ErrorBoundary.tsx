import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  // Explicitly defining props if TS context requires it for 'this.props'
  public readonly props: Readonly<Props>;

  public state: State = {
    hasError: false,
    error: null
  };

  constructor(props: Props) {
    super(props);
    this.props = props;
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-full bg-black text-red-500 font-mono flex flex-col items-center justify-center p-8 z-50 relative">
            <div className="absolute inset-0 bg-red-900/10 pointer-events-none"></div>
            <h1 className="text-4xl font-bold mb-4 glitch-text">SYSTEM FAILURE</h1>
            <p className="mb-4 text-gray-400">The marching simulation encountered a critical error.</p>
            <div className="bg-black/80 p-4 border border-red-500 rounded text-xs font-mono max-w-2xl w-full overflow-auto mb-8 whitespace-pre-wrap shadow-[0_0_20px_rgba(220,38,38,0.5)]">
                {this.state.error?.toString()}
            </div>
            <button 
                onClick={() => window.location.reload()}
                className="px-8 py-4 bg-red-600 text-white font-bold hover:bg-red-500 border-2 border-red-400 uppercase tracking-widest shadow-lg transition-transform hover:scale-105"
            >
                REBOOT SYSTEM
            </button>
        </div>
      );
    }

    return this.props.children;
  }
}