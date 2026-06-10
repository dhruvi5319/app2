import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

/**
 * Max-width container with responsive grid shell.
 * max-w-screen-xl mx-auto — desktop constrained, mobile full-width.
 * Breakpoint-aware padding: px-4 / sm:px-6 / lg:px-8.
 * No business logic — layout concerns only.
 */
export function AppLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {children}
      </div>
    </div>
  );
}
