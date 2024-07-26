"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ResizablePanel } from "../ui/resizable";
import FormattingMenu from "./FormattingMenu";
import Underline from "@tiptap/extension-underline";
import BubbleMenu from "./BubbleMenu";

const Tiptap = ({ content }: { content: string }) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: content,
  });

  console.log("editor:", editor?.getJSON(), editor?.state);
  const state = editor?.state ?? {};
  //console.log("state:", state,state.selection);

  return (
    <ResizablePanel defaultSize={75} minSize={20}>
      <div className="flex flex-col h-screen">
        <FormattingMenu editor={editor} />
        <div className="overflow-auto">
          <BubbleMenu editor={editor} />
          <EditorContent editor={editor} />
        </div>
      </div>
    </ResizablePanel>
  );
};

export default Tiptap;
