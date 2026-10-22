import { Component, type ErrorInfo, type ReactNode } from 'react';

interface AppErrorBoundaryState {
  hasError: boolean;
}

export class AppErrorBoundary extends Component<{ children: ReactNode }, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): AppErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled application error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen grid place-items-center bg-surface px-6 text-on-surface">
          <div className="max-w-lg rounded-2xl border border-outline-variant bg-surface-container p-8 text-center">
            <h1 className="text-2xl font-bold">Something went wrong</h1>
            <p className="mt-3 text-on-surface-variant">
              Refresh the page. If the problem continues, please contact Fuega Academy support.
            </p>
            <button
              className="mt-6 rounded-full bg-primary px-5 py-2 font-bold text-on-primary"
              onClick={() => window.location.reload()}
              type="button"
            >
              Refresh
            </button>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}
