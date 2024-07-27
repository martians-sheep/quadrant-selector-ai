"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { ResizablePanel } from "../ui/resizable";
import FormattingMenu from "./FormattingMenu";
import Underline from "@tiptap/extension-underline";
import BubbleMenu from "./BubbleMenu";
import { DOMSerializer } from "prosemirror-model";
import { extractAndJoinText } from "@/lib/tiptap-utils";

const Tiptap = ({ content }: { content: string }) => {
  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: content,
  });

  const state = editor?.state ?? null;
  const contents = state?.selection.content();
  console.log("content:", contents?.toJSON());
  if (contents !== undefined && contents !== null) {
    console.log(extractAndJoinText(contents?.toJSON()));
  }
  //const serializer = DOMSerializer.fromSchema(editor?.schema);
  //const fragment = serializer.serializeFragment(slice.content);
  //console.log(fragment);

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
