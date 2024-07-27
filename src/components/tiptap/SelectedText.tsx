import { useAIResponseState } from "@/lib/context/AIResponseContext";
import { useAppState, useSetAppState } from "@/lib/context/AppStateContext";
import { Settings, X } from "lucide-react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "../ui/resizable";
import DOMPurify from "dompurify";
import { useSetToggleState } from "@/lib/context/ToggleStateContext";

const IsomorphicSafeHTMLRenderer = ({ html }: { html: string }) => {
  const sanitizedHTML = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: ["p", "strong", "em", "u", "ol", "ul", "li", "br", "h1"],
    ALLOWED_ATTR: ["href", "target"],
  });

  // biome-ignore lint/security/noDangerouslySetInnerHtml: <explanation>
  return <div dangerouslySetInnerHTML={{ __html: sanitizedHTML }} />;
};

export const SelectedText = () => {
  const setToggleState = useSetToggleState();
  const { value } = useAppState();
  const setAppState = useSetAppState();
  const aiResponseState = useAIResponseState();

  const clearState = () => {
    setAppState({ value: "" });
  };

  const showQuadrantSelect = () => {
    setToggleState((current) => {
      return { value: !current.value };
    });
  };

  if (value === "") return null;
  return (
    <ResizablePanel defaultSize={25} minSize={20}>
      <div className="h-screen border-l py-3">
        <ResizablePanelGroup direction={"vertical"}>
          <ResizablePanel
            className="overflow-auto"
            defaultSize={50}
            minSize={10}
          >
            <div className="font-bold border-b pt-2 pb-2.5 px-3 flex items-center justify-between">
              <span className="text-sm">選択されたテキスト</span>
              <Settings
                size={20}
                className="ml-2 cursor-pointer"
                onClick={() => showQuadrantSelect()}
              />
            </div>
            <div className="p-3 flex flex-col">
              <p>{value}</p>
              <button
                type="button"
                className="text-sm text-green-700 ml-auto"
                onClick={clearState}
              >
                選択テキストをクリア
              </button>
            </div>
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel
            className="overflow-hidden flex flex-col"
            defaultSize={50}
            minSize={10}
          >
            <div className="border-t p-3 border-b">解説</div>
            <div className="safe-html-content flex flex-grow flex-col  overflow-y-auto">
              <div className="pt-4 px-4 flex-grow overflow-y-auto">
                <IsomorphicSafeHTMLRenderer html={aiResponseState.response} />
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </ResizablePanel>
  );
};
