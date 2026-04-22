export function DesktopOnlyGate({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="hidden lg:block">{children}</div>
      <div className="lg:hidden min-h-screen flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-lg border px-6 py-12 text-center">
          <p className="text-3xl font-medium">
            {"Desktop preferred"}
          </p>

          <p className="mt-4 text-lg">
            {"This experience is designed for larger screens."}
          </p>
          </div>
      </div>
    </>
  );
}
