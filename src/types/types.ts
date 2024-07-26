import { LexicalEditor } from "lexical";

export interface File {
  id: string;
  name: string;
}

export interface FileListProps {
  files: File[];
  onSelect: (fileId: string) => void;
}

export interface LexicalEditorProps {
  onBlockSelect: (json: string) => void;
  initialContent: string;
}

export interface JSONViewerProps {
  json: string;
}
