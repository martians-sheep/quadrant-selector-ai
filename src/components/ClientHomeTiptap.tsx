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
import { useRouter } from "next/navigation";
import Tiptap from "./tiptap/Tiptap";

// サンプルファイルデータ
const sampleFiles: File[] = [
  {
    id: "1",
    name: "00003_粉飾決算による違法配当",
  },
  {
    id: "2",
    name: "00004_請け負った会社の倒産による下請業者からの･･･",
  },
  {
    id: "3",
    name: "00005_重大な誤りのある決算書類についての監査役･･･",
  },
];

type HomeClientProps = {
  fileContent: string;
  selectedFile: File;
  sampleFiles: File[];
};

export default async function ClientHomeTiptap({
  fileContent,
  selectedFile,
  sampleFiles,
}: HomeClientProps) {
  const router = useRouter();

  const handleFileSelect = (fileId: string) => {
    router.push(`/tiptap/${fileId}`);
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

      <Tiptap content={fileContent} />
    </ResizablePanelGroup>
  );
}
