"use client";

import { useRef } from "react";
import { Image } from "@phosphor-icons/react";

type FileUploadButtonProps = {
  accept?: string;
  disabled?: boolean;
  uploading?: boolean;
  label?: string;
  uploadingLabel?: string;
  selectedFileName?: string | null;
  onChange: (file: File | null) => void;
  variant?: "default" | "compact";
};

export function FileUploadButton({
  accept = "image/*",
  disabled = false,
  uploading = false,
  label = "Choose image",
  uploadingLabel = "Uploading…",
  selectedFileName,
  onChange,
  variant = "default",
}: FileUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const baseClass =
    variant === "compact"
      ? "inline-flex items-center gap-2 cursor-pointer px-3 py-1.5 border border-gray-300 dark:border-zinc-600 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-white/60 dark:hover:bg-zinc-800/50 disabled:opacity-50 disabled:cursor-not-allowed"
      : "inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-holo-mint/30 bg-holo-mint/10 px-4 py-2 text-sm font-medium text-holo-mint transition hover:bg-holo-mint/20 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <label className={baseClass}>
        <Image size={16} weight="duotone" />
        {uploading ? uploadingLabel : label}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          disabled={disabled || uploading}
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
        />
      </label>
      {selectedFileName && (
        <span className="max-w-[200px] truncate text-xs text-gray-500">{selectedFileName}</span>
      )}
      {selectedFileName && !uploading && (
        <button
          type="button"
          className="text-xs text-gray-400 underline hover:text-gray-600"
          onClick={() => {
            onChange(null);
            if (inputRef.current) inputRef.current.value = "";
          }}
        >
          Clear
        </button>
      )}
    </div>
  );
}
