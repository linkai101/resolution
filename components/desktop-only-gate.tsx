import { Monitor } from "lucide-react";

export function DesktopOnlyGate({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="hidden lg:block">{children}</div>
      <div className="lg:hidden min-h-dvh flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-lg border px-6 py-12 text-center">
          <Monitor size={48} strokeWidth={1.5} className="text-muted mx-auto" />

          <p className="text-3xl font-medium mt-4">
            {"Desktop preferred"}
          </p>

          <p className="text-lg mt-4">
            {"This experience is designed for larger screens."}
          </p>
          </div>
      </div>
    </>
  );
}
