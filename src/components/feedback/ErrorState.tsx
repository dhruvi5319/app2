interface Props {
  locationName: string;
  onRetry: () => void;
}

/**
 * Error state shown when weather fetch fails.
 * Per FRD §F1: "Unable to load weather for [location name]. Check your connection."
 * Never a blank screen — always shows retry button.
 */
export function ErrorState({ locationName, onRetry }: Props) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <div className="text-white/80 mb-2">
        <svg
          className="w-10 h-10 mx-auto mb-3 opacity-70"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <p className="font-medium text-white">
          Unable to load weather{locationName ? ` for ${locationName}` : ""}.
        </p>
        <p className="text-sm text-white/70 mt-1">Check your connection.</p>
      </div>
      <button
        onClick={onRetry}
        className="mt-4 px-6 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-lg font-medium text-sm transition-colors min-h-[44px] min-w-[44px] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-1"
      >
        Try again
      </button>
    </div>
  );
}
