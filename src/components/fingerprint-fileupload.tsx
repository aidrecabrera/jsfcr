"use client";

import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";
import { Paperclip } from "lucide-react";
import { useState } from "react";

const FileSvgDraw = () => {
  return (
    <>
      <svg
        className="w-8 h-8 mb-3 text-gray-500 dark:text-gray-400"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 20 16"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
        />
      </svg>
      <p className="mb-1 text-sm text-gray-500 dark:text-gray-400">
        <span className="font-semibold">Click to upload</span>
        &nbsp; or drag and drop
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">
        SVG, PNG, JPG or GIF
      </p>
    </>
  );
};

const FileUploaderTest = () => {
  const [files, setFiles] = useState<File[] | null>(null);

  const dropZoneConfig = {
    maxFiles: 5,
    maxSize: 1024 * 1024 * 4,
    multiple: true,
  };

  return (
    <FileUploader
      value={files}
      onValueChange={setFiles}
      dropzoneOptions={dropZoneConfig}
      className="relative p-2 rounded-lg bg-background"
    >
      <FileInput className="outline-dashed outline-1 outline-white">
        <div className="flex flex-col items-center justify-center w-full pt-3 pb-4 ">
          <FileSvgDraw />
        </div>
      </FileInput>
      <FileUploaderContent>
        {files &&
          files.length > 0 &&
          files.map((file, i) => (
            <FileUploaderItem key={i} index={i}>
              <Paperclip className="w-4 h-4 stroke-current" />
              <span>{file.name}</span>
            </FileUploaderItem>
          ))}
      </FileUploaderContent>
    </FileUploader>
  );
};

export default FileUploaderTest;
