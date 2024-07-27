import { Fragment, type Slice } from "@tiptap/pm/model";
import DOMPurify from "dompurify";

export function extractAndJoinText(json: Slice | null | undefined): string {
  //console.log("json:", json);
  //console.log(JSON.stringify(json));
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  function traverse(content: any[]): string[] {
    return content.flatMap((item) => {
      if (item.type === "text" && item.text) {
        return [item.text];
      }

      if (item.type === "heading" && item.attrs && item.attrs.level) {
        const headingPrefix = "#".repeat(item.attrs.level);
        const headingText = item.content ? traverse(item.content).join("") : "";
        return [`${headingPrefix} ${headingText}`];
      }

      if (item.content) {
        return traverse(item.content);
      }

      return [];
    });
  }

  if (!json) {
    return "";
  }
  // @ts-ignore
  const textArray = traverse(json.content);
  return textArray.join("\n");
}

//
