// app/components/EditorMenu.tsx
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  type TextFormatType,
  type ElementFormatType,
} from "lexical";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
} from "lucide-react";

export default function EditorMenu() {
  const [editor] = useLexicalComposerContext();

  const formatText = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const formatElement = (format: ElementFormatType) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, format);
  };

  const undo = () => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  };

  //redo
  const redo = () => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  };

  return (
    <div className="bg-gray-100 p-2 flex space-x-2">
      <button
        type="button"
        onClick={undo}
        className="p-1 bg-white rounded hover:bg-gray-200"
      >
        <Undo size={20} />
      </button>
      <button
        type="button"
        onClick={redo}
        className="p-1 bg-white rounded hover:bg-gray-200"
      >
        <Redo size={20} />
      </button>
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
