import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

/**
 * Max-width container with responsive grid shell.
 * max-w-4xl mx-auto px-4 — desktop constrained, mobile full-width.
 * No business logic — layout concerns only.
 */
export function AppLayout({ children }: Props) {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-4">
        {children}
      </div>
    </div>
  );
}
