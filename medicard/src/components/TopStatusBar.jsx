import { Activity, CreditCard, ScanLine } from "lucide-react";

export function TopStatusBar() {
  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-end px-6 shrink-0 shadow-sm z-10 sticky top-0">
      <div className="flex items-center gap-6 text-sm font-medium text-secondary/80">
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-emerald-500" />
          <span>Card Connected</span>
        </div>
        <div className="w-px h-4 bg-gray-200" />
        <div className="flex items-center gap-2">
          <ScanLine className="h-4 w-4 text-primary" />
          <span>Scanner Ready</span>
        </div>
        <div className="w-px h-4 bg-gray-200" />
        <div className="flex items-center gap-2">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </div>
          <span>Real-Time: Live</span>
        </div>
      </div>
    </header>
  );
}
