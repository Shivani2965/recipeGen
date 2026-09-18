import React from 'react';
import { AlertCircle, RefreshCw, Key } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  showKeySetupHint?: boolean;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  showKeySetupHint = false,
}) => {
  const isKeyError =
    message.includes('SPOONACULAR_API_KEY') ||
    message.includes('API key') ||
    showKeySetupHint;

  return (
    <div
      id="error-message-banner"
      className="max-w-2xl mx-auto my-6 p-5 rounded-2xl bg-amber-50/90 border border-amber-200 text-stone-800 shadow-xs"
    >
      <div className="flex items-start gap-3.5">
        <div className="p-2 rounded-xl bg-amber-100 text-amber-800 shrink-0 mt-0.5">
          {isKeyError ? <Key className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
        </div>
        <div className="flex-1 text-left">
          <h4 className="font-semibold text-amber-950 text-base mb-1">
            {isKeyError ? 'Spoonacular API Configuration Required' : 'Unable to load recipes'}
          </h4>
          <p className="text-sm text-stone-700 leading-relaxed">{message}</p>

          {isKeyError && (
            <div className="mt-3 p-3 bg-white/80 rounded-xl border border-amber-200/70 text-xs text-stone-600 space-y-1">
              <p className="font-semibold text-stone-800">How to activate recipe discovery:</p>
              <ol className="list-decimal list-inside space-y-0.5 pl-1">
                <li>
                  Get a free API key at{' '}
                  <a
                    href="https://spoonacular.com/food-api/console#Dashboard"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 underline font-medium hover:text-emerald-800"
                  >
                    spoonacular.com/food-api
                  </a>
                </li>
                <li>
                  Set <code className="bg-stone-100 px-1 py-0.5 rounded text-amber-900 font-mono">SPOONACULAR_API_KEY</code> in your environment variables or <code className="bg-stone-100 px-1 py-0.5 rounded text-amber-900 font-mono">.env</code>
                </li>
                <li>Restart the server or refresh the page to explore thousands of live recipes.</li>
              </ol>
            </div>
          )}

          {onRetry && (
            <button
              id="retry-search-btn"
              onClick={onRetry}
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-100/90 hover:bg-emerald-200 rounded-lg transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
