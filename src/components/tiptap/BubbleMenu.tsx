import { type Editor, BubbleMenu as TiptapBubbleMenu } from "@tiptap/react";

export default function BubbleMenu({ editor }: { editor: Editor | null }) {
  return (
    <>
      {editor && (
        <TiptapBubbleMenu
          className="floating-menu"
          tippyOptions={{ duration: 100 }}
          editor={editor}
        >
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={editor.isActive("bold") ? "is-active" : ""}
          >
            Bold
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={editor.isActive("italic") ? "is-active" : ""}
          >
            Italic
          </button>
          <button
            type="button"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={editor.isActive("strike") ? "is-active" : ""}
          >
            Strike
          </button>
          <button type="button">

          </button>
        </TiptapBubbleMenu>
      )}
    </>
  );
}
