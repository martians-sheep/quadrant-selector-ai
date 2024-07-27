import {
  useAIResponseState,
  useSetAIResponseState,
} from "@/lib/context/AIResponseContext";
import { useSetAppState } from "@/lib/context/AppStateContext";
import { extractAndJoinText } from "@/lib/tiptap-utils";
import { type Editor, BubbleMenu as TiptapBubbleMenu } from "@tiptap/react";
import { ScanText } from "lucide-react";
import { useEffect, useState } from "react";

export default function BubbleMenu({ editor }: { editor: Editor | null }) {
  const setAppState = useSetAppState();
  const aiResponseState = useAIResponseState();
  const setAIResponseState = useSetAIResponseState();
  const [isStreaming, setIsStreaming] = useState(false);

  const getText = async (editor: Editor | null) => {
    const state = editor?.state ?? null;
    const contents = state?.selection.content();
    if (contents !== undefined && contents !== null) {
      const text = extractAndJoinText(contents?.toJSON());
      setAppState({ value: text });
      await fetchAiResponse(
        { x: aiResponseState.x, y: aiResponseState.y },
        text
      );
    }
  };

  const fetchAiResponse = async (
    currentPosition: { x: number; y: number },
    value: string
  ) => {
    setIsStreaming(true);
    setAIResponseState((prev) => ({
      ...prev,
      response: "",
    }));
    try {
      const response = await fetch("/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          x: currentPosition.x,
          y: currentPosition.y,
          documentA: value,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (true) {
        // biome-ignore lint/style/noNonNullAssertion: <explanation>
        const { done, value } = await reader!.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const jsonChunk = JSON.parse(line.replace("data: ", ""));
              if (jsonChunk.x !== undefined && jsonChunk.y !== undefined) {
                //setResponseMetadata(jsonChunk);
              } else if (jsonChunk.explanation) {
                setAIResponseState((prev) => ({
                  ...prev,
                  response: prev.response + jsonChunk.explanation,
                }));
              } else if (jsonChunk.error) {
                setAIResponseState((prev) => ({
                  ...prev,
                  response: `${prev.response} Error: ${jsonChunk.error}`,
                }));
              }
            } catch (e) {
              console.error("Error parsing chunk:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setAIResponseState((prev) => ({
        ...prev,
        response: "Error occurred while fetching AI response.",
      }));
    } finally {
      setIsStreaming(false);
    }
  };

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
          <button
            type="button"
            onClick={() => {
              getText(editor);
            }}
          >
            <ScanText />
          </button>
        </TiptapBubbleMenu>
      )}
    </>
  );
}
