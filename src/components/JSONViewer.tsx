// app/components/JSONViewer.tsx
import type { JSONViewerProps } from "@/types/types";

export default function JSONViewer({ json }: JSONViewerProps) {
  return (
    <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-[500px] text-sm">
      {json}
    </pre>
  );
}
