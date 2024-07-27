import { AIResponseStateProvider } from "@/lib/context/AIResponseContext";
import { AppStateProvider } from "@/lib/context/AppStateContext";
import { ToggleStateProvider } from "@/lib/context/ToggleStateContext";

export default function layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <AppStateProvider>
      <AIResponseStateProvider>
        <ToggleStateProvider>{children}</ToggleStateProvider>
      </AIResponseStateProvider>
    </AppStateProvider>
  );
}
