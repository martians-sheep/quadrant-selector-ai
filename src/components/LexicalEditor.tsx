"use client";

import { useEffect, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import * as ErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { $generateNodesFromDOM } from "@lexical/html";
import {
  $getRoot,
  $createParagraphNode,
  $createTextNode,
  LexicalEditor as LexicalEditorType,
  createEditor,
} from "lexical";
import EditorMenu from "./EditorMenu";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { LexicalEditorProps } from "@/types/types";

const theme = {
  // カスタムテーマ設定
};

function onError(error: Error) {
  console.error(error);
}

function Placeholder() {
  return (
    <div className="editor-placeholder absolute text-gray-400 pointer-events-none">
      Enter some text...
    </div>
  );
}

export default function LexicalEditor({
  onBlockSelect,
  initialContent,
}: LexicalEditorProps) {
  const initialConfig = {
    namespace: "MyEditor",
    theme,
    onError,
    nodes: [
      HeadingNode,
      QuoteNode,
      ListItemNode,
      ListNode,
      AutoLinkNode,
      LinkNode,
      CodeHighlightNode,
      CodeNode,
      TableCellNode,
      TableNode,
      TableRowNode,
    ],
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <LexicalEditorWithPlugins
        initialContent={initialContent}
        onBlockSelect={onBlockSelect}
      />
    </LexicalComposer>
  );
}

function LexicalEditorWithPlugins({
  initialContent,
  onBlockSelect,
}: LexicalEditorProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(initialContent, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();
      root.clear();
      // biome-ignore lint/complexity/noForEach: <explanation>
      nodes.forEach((node) => root.append(node));
      if (root.getTextContent().trim() === "") {
        const paragraph = $createParagraphNode();
        paragraph.append($createTextNode(""));
        root.append(paragraph);
      }
    });
  }, [editor, initialContent]);

  return (
    <div className="editor-container flex flex-col flex-grow w-full h-full">
      <EditorMenu />
      <div className="flex-grow overflow-auto w-full relative">
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="min-h-full w-full p-4 focus:outline-none" />
          }
          placeholder={<Placeholder />}
          ErrorBoundary={ErrorBoundary.LexicalErrorBoundary}
        />
      </div>
      <HistoryPlugin />
      <OnChangePlugin
        onChange={(editorState) => {
          editorState.read(() => {
            const json = JSON.stringify(editorState.toJSON(), null, 2);
            onBlockSelect(json);
          });
        }}
      />
    </div>
  );
}
