import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
  /** Called when the user dismisses the error panel (e.g. close the modal). */
  onClose?: () => void;
  /** Short label for what failed, shown in the panel (e.g. "Print View"). */
  label?: string;
}
interface State { error: Error | null }

/**
 * Catches render/runtime errors in its subtree so a single component crash shows a readable panel
 * instead of blanking the whole app (React unmounts the tree on an uncaught error). Used around the
 * lazy modals — a bad roster used to make Print View blank the entire page with no message.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Surface it for anyone with the console open / for bug reports.
    console.error('[ErrorBoundary]', this.props.label ?? '', error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-6">
        <div className="max-w-lg w-full bg-zinc-900 border-2 border-red-800 rounded p-5 text-zinc-200">
          <div className="text-red-400 font-cinzel uppercase tracking-widest text-sm mb-2">
            {this.props.label ?? 'Something went wrong'}
          </div>
          <p className="text-[13px] text-zinc-300 mb-2">
            This view hit an error and couldn't render. The rest of the app is fine — close this and
            try again. If it keeps happening, please report it with the message below.
          </p>
          <pre className="text-[11px] text-red-300 bg-black/40 border border-zinc-700 rounded p-2 overflow-auto max-h-40 whitespace-pre-wrap">
            {error.message}
          </pre>
          <div className="mt-3 flex justify-end gap-2">
            <button
              onClick={() => { this.setState({ error: null }); this.props.onClose?.(); }}
              className="px-4 py-1.5 bg-red-900/60 border border-red-700 text-red-200 text-sm hover:bg-red-800/60 uppercase tracking-wide rounded"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
}
