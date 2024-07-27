"use client";

import type React from "react";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
} from "lucide-react";

type FormattingMenuProps = {
  editor: Editor | null;
};

const FormattingMenu: React.FC<FormattingMenuProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="formatting-menu py-2 divide-x divide-gray-200 flex items-center px-1 border-b">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`relative px-4 py-2  ${
          editor.isActive("bold") ? "is-active" : ""
        }`}
      >
        <Bold size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`relative px-4 py-2  ${
          editor.isActive("italic") ? "is-active" : ""
        }`}
      >
        <Italic size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`relative px-4 py-2  ${
          editor.isActive("underline") ? "is-active" : ""
        }`}
      >
        <Underline size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`relative px-4 py-2  ${
          editor.isActive("bulletList") ? "is-active" : ""
        }`}
      >
        <List size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`relative px-4 py-2  ${
          editor.isActive("orderedList") ? "is-active" : ""
        }`}
      >
        <ListOrdered size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={`relative px-4 py-2  ${
          editor.isActive("heading", { level: 1 }) ? "is-active" : ""
        }`}
      >
        <Heading1 size={18} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={`relative px-4 py-2  ${
          editor.isActive("heading", { level: 2 }) ? "is-active" : ""
        }`}
      >
        <Heading2 size={18} />
      </button>
    </div>
  );
};

export default FormattingMenu;
