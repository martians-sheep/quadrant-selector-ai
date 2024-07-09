// app/components/EditorMenu.tsx
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND, FORMAT_ELEMENT_COMMAND } from "lexical";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

export default function EditorMenu() {
  const [editor] = useLexicalComposerContext();

  const formatText = (format: string) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatElement = (format: string) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, format);
  };

  return (
    <div className="bg-gray-100 p-2 flex space-x-2">
      <button
        type="button"
        onClick={() => formatText("bold")}
        className="p-1 bg-white rounded hover:bg-gray-200"
      >
        <Bold size={20} />
      </button>
      <button
        type="button"
        onClick={() => formatText("italic")}
        className="p-1 bg-white rounded hover:bg-gray-200"
      >
        <Italic size={20} />
      </button>
      <button
        type="button"
        onClick={() => formatText("underline")}
        className="p-1 bg-white rounded hover:bg-gray-200"
      >
        <Underline size={20} />
      </button>
      <button
        type="button"
        onClick={() => formatElement("left")}
        className="p-1 bg-white rounded hover:bg-gray-200"
      >
        <AlignLeft size={20} />
      </button>
      <button
        type="button"
        onClick={() => formatElement("center")}
        className="p-1 bg-white rounded hover:bg-gray-200"
      >
        <AlignCenter size={20} />
      </button>
      <button
        type="button"
        onClick={() => formatElement("right")}
        className="p-1 bg-white rounded hover:bg-gray-200"
      >
        <AlignRight size={20} />
      </button>
    </div>
  );
}
