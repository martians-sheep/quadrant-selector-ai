import { useState } from "react";
import { ResizableHandle, ResizablePanel } from "./ui/resizable";
import LexicalEditor from "./LexicalEditor";
import JSONViewer from "./JSONViewer";
import type { File } from "@/types/types";

export default function EditorWithRightPane({
  fileContent,
  selectedFile,
}: {
  fileContent: string;
  selectedFile: File;
}) {
  const [selectedBlockJSON, setSelectedBlockJSON] = useState<string>("{}");

  return (
    <>
      {/* Center Pane */}
      <ResizablePanel defaultSize={50} minSize={30}>
        <div className="h-full flex flex-col max-h-screen">
          <h2 className="text-xl font-bold p-4 text-teal-600">
            Editor: {selectedFile.name}
          </h2>
          <div className="py-4 overflow-auto">
            <LexicalEditor
              onBlockSelect={setSelectedBlockJSON}
              initialContent={fileContent}
            />
          </div>
        </div>
      </ResizablePanel>

      <ResizableHandle />

      {/* Right Pane */}
      <ResizablePanel defaultSize={25} minSize={20}>
        <div className="h-full p-4">
          <h2 className="text-xl font-bold mb-4 text-teal-600">Block JSON</h2>
          <JSONViewer json={selectedBlockJSON} />
        </div>
      </ResizablePanel>
    </>
  );
}
