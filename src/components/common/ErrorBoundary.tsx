import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
    errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null,
        errorInfo: null,
    };

    public static getDerivedStateFromError(error: Error): State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error, errorInfo: null };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
                    <div className="max-w-md w-full bg-gray-800 rounded-lg shadow-xl p-6 border border-red-500/20">
                        <h1 className="text-2xl font-bold text-red-500 mb-4">Something went wrong</h1>
                        <p className="text-gray-300 mb-4">
                            We're sorry, but the application encountered an unexpected error.
                        </p>
                        {this.state.error && (
                            <div className="bg-black/50 p-4 rounded text-sm font-mono overflow-auto max-h-48 mb-4 border border-white/10">
                                <p className="text-red-400 font-bold mb-1">{this.state.error.toString()}</p>
                                {this.state.errorInfo && (
                                    <pre className="text-gray-500 text-xs">{this.state.errorInfo.componentStack}</pre>
                                )}
                            </div>
                        )}
                        <button
                            onClick={() => window.location.reload()}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
