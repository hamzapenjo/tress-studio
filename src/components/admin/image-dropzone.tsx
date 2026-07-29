"use client";

import { useRef, useState, type DragEvent } from "react";

export function ImageDropzone({
  name,
  multiple = true,
}: {
  name: string;
  multiple?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileNames, setFileNames] = useState<string[]>([]);
  const [dragOver, setDragOver] = useState(false);

  function updateFromFileList(files: FileList | null) {
    setFileNames(files ? Array.from(files).map((f) => f.name) : []);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);

    let files = e.dataTransfer.files;
    if (!multiple && files.length > 1) {
      const single = new DataTransfer();
      single.items.add(files[0]);
      files = single.files;
    }

    if (inputRef.current) {
      inputRef.current.files = files;
    }
    updateFromFileList(files);
  }

  const placeholder = multiple
    ? "Prevucite slike ovdje ili kliknite za odabir"
    : "Prevucite sliku ovdje ili kliknite za odabir";

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      className={`flex flex-col items-center justify-center gap-2 border border-dashed px-4 py-6 text-center transition-colors ${
        dragOver ? "border-brass bg-brass/5" : "border-paper/20 hover:border-paper/40"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={(e) => updateFromFileList(e.target.files)}
      />
      <span className="font-mono text-xs tracking-[0.08em] text-paper-dim uppercase">
        {fileNames.length > 0
          ? multiple
            ? `${fileNames.length} ${fileNames.length === 1 ? "slika odabrana" : "slika odabrano"}`
            : "Slika odabrana"
          : placeholder}
      </span>
      {fileNames.length > 0 && (
        <span className="max-w-full truncate px-2 text-[10px] text-paper-dim/70">
          {fileNames.join(", ")}
        </span>
      )}
    </div>
  );
}
