"use client";
import type React from "react";
import { useState, useRef, useEffect, useCallback } from "react";

const QuadrantSelector: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [aiResponse, setAiResponse] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [documentA, setDocumentA] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);
  const [responseMetadata, setResponseMetadata] = useState<{
    x: number;
    y: number;
  } | null>(null);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const x =
          Math.round(((event.clientX - centerX) / (rect.width / 2)) * 100) /
          100;
        const y =
          Math.round(((centerY - event.clientY) / (rect.height / 2)) * 100) /
          100;

        setPosition({
          x: Math.max(-1, Math.min(1, x)),
          y: Math.max(-1, Math.min(1, y)),
        });
      }
    },
    [containerRef]
  );
  const handleMouseUp = useCallback(() => {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    document.removeEventListener("mousemove", handleMouseMove as any);
    document.removeEventListener("mouseup", handleMouseUp);
    // documentAに値がある場合のみfetchAiResponseを呼び出す
    if (documentA.trim()) {
      setPosition((currentPosition) => {
        fetchAiResponse(currentPosition);
        return currentPosition;
      });
    }
  }, [documentA, handleMouseMove]);

  const handleMouseDown = useCallback(() => {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    document.addEventListener("mousemove", handleMouseMove as any);
    document.addEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove, handleMouseUp]);

  const fetchAiResponse = async (currentPosition: { x: number; y: number }) => {
    setIsStreaming(true);
    setAiResponse("");
    setResponseMetadata(null);

    try {
      const response = await fetch("/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          x: currentPosition.x,
          y: currentPosition.y,
          documentA: documentA,
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
                setResponseMetadata(jsonChunk);
              } else if (jsonChunk.explanation) {
                setAiResponse((prev) => prev + jsonChunk.explanation);
              } else if (jsonChunk.error) {
                // biome-ignore lint/style/useTemplate: <explanation>
                setAiResponse((prev) => prev + `Error: ${jsonChunk.error}`);
              }
            } catch (e) {
              console.error("Error parsing chunk:", e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setAiResponse("Error occurred while fetching AI response.");
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 justify-center space-x-8 max-w-6xl mx-auto">
      <div className="flex flex-row">
        <div className="w-1/2 flex items-center px-12">
          <textarea
            value={documentA}
            onChange={(e) => setDocumentA(e.target.value)}
            className="w-full p-2 border rounded-2xl mt-12"
            rows={10}
            placeholder="Enter the text for Document A here..."
          />
        </div>
        <div className="w-1/2 flex flex-col items-center justify-center">
          <div className="relative mt-12 items-center">
            <div
              ref={containerRef}
              className="bg-white rounded-3xl w-64 h-64 border-2 border-gray-300 relative cursor-pointer"
              onMouseDown={handleMouseDown}
            >
              <div className="absolute top-1/2 left-0 w-full h-px bg-gray-300" />
              <div className="absolute top-0 left-1/2 w-px h-full bg-gray-300" />
              <div
                className="w-4 h-4 bg-blue-500 rounded-full absolute"
                style={{
                  left: `${((position.x + 1) / 2) * 100}%`,
                  top: `${((1 - position.y) / 2) * 100}%`,
                  transform: "translate(-50%, -50%)",
                }}
              />
            </div>
            <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-full pr-2">
              初心者
            </div>
            <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-full pl-2">
              専門家
            </div>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full pb-2">
              抽象的
            </div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full pt-2">
              具体的
            </div>
          </div>
        </div>
      </div>
      <div className="w-full justify-center items-center text-center">
        <div className="mt-4 hidden">
          <p>X: {position.x.toFixed(2)}</p>
          <p>Y: {position.y.toFixed(2)}</p>
        </div>
        <div className="mt-4 w-full max-w-lg mx-auto">
          <h3 className="text-lg font-semibold mb-2">AI Response:</h3>
          {responseMetadata && (
            <p className="mb-2 hidden">
              Response for X: {responseMetadata.x.toFixed(2)}, Y:{" "}
              {responseMetadata.y.toFixed(2)}
            </p>
          )}
          <div className="rounded-2xl border p-4 min-h-[100px] text-left whitespace-pre-wrap bg-white">
            {aiResponse ||
              (isStreaming
                ? "AIが考えています..."
                : "ポインタを動かして離すとAIの応答が表示されます")}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuadrantSelector;
