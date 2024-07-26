import { Suspense, useState } from "react";
import type { File } from "@/types/types";
import HomeClient from "@/components/ClientHome";
import Tiptap from "@/components/Tiptap";
import ClientHomeTiptap from "@/components/ClientHomeTiptap";

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

const getHTMLContent = async (fileId: string) => {
  const title = sampleFiles.find((f) => f.id === fileId);

  const res = await fetch(
    `http://localhost:3000/tiptap/${fileId}/api?title=${title?.name}`,
    {
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch file content");
  }
  return res.text();
};

export default async function Home({
  params,
}: {
  params: { documentId: string };
}) {
  console.log("page:", params);
  const fileContent = await getHTMLContent(params.documentId);
  const selectedFile =
    sampleFiles.find((f) => f.id === params.documentId) ?? sampleFiles[0];

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientHomeTiptap
        fileContent={fileContent}
        selectedFile={selectedFile}
        sampleFiles={sampleFiles}
      />
    </Suspense>
  );
}
