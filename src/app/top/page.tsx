"use client";

import { useState } from "react";
import LexicalEditor from "@/components/LexicalEditor";
import FileList from "@/components/FileList";
import JSONViewer from "@/components/JSONViewer";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import type { File } from "@/types/types";

// サンプルファイルデータ
const sampleFiles: File[] = [
  {
    id: "1",
    name: "Document 1",
    content: "<h1>Hello World</h1><p>This is document 1.</p>",
  },
  {
    id: "2",
    name: "Document 2",
    content: "<h2>Welcome</h2><p>This is <strong>document 2</strong>.</p>",
  },
  {
    id: "3",
    name: "Document 3",
    content:
      "<p>Document 3 content.</p><ul><li>Item 1</li><li>Item 2</li></ul>",
  },
];

export default function Home() {
  const [selectedBlockJSON, setSelectedBlockJSON] = useState<string>("{}");
  const [selectedFile, setSelectedFile] = useState<File>(sampleFiles[0]);

  const handleFileSelect = (fileId: string) => {
    const file = sampleFiles.find((f) => f.id === fileId);
    if (file) {
      setSelectedFile(file);
    }
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="h-screen">
      {/* Left Pane */}
      <ResizablePanel defaultSize={25} minSize={20}>
        <div className="h-full p-4 min-h-screen">
          <h2 className="text-xl font-bold mb-4 text-teal-600">File List</h2>
          <FileList files={sampleFiles} onSelect={handleFileSelect} />
        </div>
      </ResizablePanel>

      <ResizableHandle />

      {/* Center Pane */}
      <ResizablePanel defaultSize={50} minSize={30}>
        <div className="h-full flex flex-col">
          <h2 className="text-xl font-bold p-4 text-teal-600">
            Editor: {selectedFile.name}
          </h2>
          <LexicalEditor
            onBlockSelect={setSelectedBlockJSON}
            initialContent={selectedFile.content}
          />
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
    </ResizablePanelGroup>
  );
}
