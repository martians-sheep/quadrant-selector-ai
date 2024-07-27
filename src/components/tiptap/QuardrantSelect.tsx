"use client";
import {
  useAIResponseState,
  useSetAIResponseState,
} from "@/lib/context/AIResponseContext";
import { useAppState } from "@/lib/context/AppStateContext";
import { useToggleState } from "@/lib/context/ToggleStateContext";
import type React from "react";
import { useState, useRef, useCallback } from "react";

export const QuadrantSelect: React.FC = () => {
  const isShow = useToggleState();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { x, y, response } = useAIResponseState();
  const setAIResponseState = useSetAIResponseState();
  const appState = useAppState();
  const [isStreaming, setIsStreaming] = useState(false);

  console.log(position);
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
        console.log(x, y);

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
    //if (response.trim()) {
    // fetchAiResponseを呼び出す
    setAIResponseState((prev) => ({
      ...prev,
      x: position.x,
      y: position.y,
    }));
    setPosition((currentPosition) => {
      fetchAiResponse(currentPosition, appState.value);
      return currentPosition;
    });
  }, [handleMouseMove, setAIResponseState, position, appState]);

  const handleMouseDown = useCallback(() => {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    document.addEventListener("mousemove", handleMouseMove as any);
    document.addEventListener("mouseup", handleMouseUp);
  }, [handleMouseMove, handleMouseUp]);

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

  if (!isShow.value) return null;

  return (
    <div className="flex flex-col items-center top-5 pb-10 shadow-xl justify-center border absolute z-10 bg-white rounded-xl h-96 w-96 p-5 right-12">
      <div className="font-bold">回答のトーン/ターゲット</div>
      <div className="flex flex-col items-center justify-center">
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
  );
};

export default QuadrantSelect;
