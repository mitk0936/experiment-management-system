import { Loader2 } from "lucide-react";
import { PropsWithChildren } from "react";

export function FormWrapper({
  isLoading,
  children,
}: PropsWithChildren<{
  isLoading: boolean;
}>) {
  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-black/50 backdrop-blur-sm z-10">
          <Loader2 className="animate-spin" size={40} />
        </div>
      )}
      <div className={isLoading ? "opacity-50 pointer-events-none" : ""}>{children}</div>
    </div>
  );
}
