// app/components/FileList.tsx
import type { FileListProps } from "@/types/types";

export default function FileList({ files, onSelect }: FileListProps) {
  return (
    <ul className="space-y-2">
      {files.map((file) => (
        <li
          key={file.id}
          className="cursor-pointer hover:text-teal-600"
          onClick={() => onSelect(file.id)}
          onKeyDown={() => {}}
          onKeyUp={() => {}}
        >
          {file.name}
        </li>
      ))}
    </ul>
  );
}
