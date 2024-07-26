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

export default function Home() {
  return <div>HOME</div>;
}
