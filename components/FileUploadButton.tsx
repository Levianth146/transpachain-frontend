"use client";

import { useRef } from "react";
import { ImageSquare } from "@phosphor-icons/react";

type FileUploadButtonProps = {
  accept?: string;
  disabled?: boolean;
  uploading?: boolean;
  file: File | null;
  onFileChange: (file: File | null) => void;
  buttonLabel?: string;
  emptyLabel?: string;
  variant?: "light" | "holo";
};

const VARIANTS = {
  light: {
    button:
      "inline-flex items-center gap-1.5 rounded-lg border border-emerald-300/60 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-800 transition hover:bg-emerald-100 disabled:opacity-50 dark:border-emerald-700/50 dark:bg-emerald-950/40 dark:text-emerald-200 dark:hover:bg-emerald-900/50",
    label: "text-xs text-gray-500 dark:text-gray-400",
  },
  holo: {
    button:
      "inline-flex items-center gap-1.5 rounded-lg border border-holo-mint/30 bg-holo-mint/10 px-4 py-2 text-sm font-medium text-holo-mint transition hover:bg-holo-mint/20 disabled:opacity-50",
    label: "text-xs text-white/40",
  },
};

export function FileUploadButton({
  accept = "image/*",
  disabled = false,
  uploading = false,
  file,
  onFileChange,
  buttonLabel = "Choose file",
  emptyLabel = "No file chosen",
  variant = "light",
}: FileUploadButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const styles = VARIANTS[variant];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        disabled={disabled || uploading}
        onClick={() => inputRef.current?.click()}
        className={styles.button}
      >
        <ImageSquare size={16} weight="duotone" />
        {uploading ? "Uploading…" : buttonLabel}
      </button>
      <span className={styles.label}>{file ? file.name : emptyLabel}</span>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        disabled={disabled || uploading}
        onChange={(e) => {
          onFileChange(e.target.files?.[0] ?? null);
          e.target.value = "";
        }}
      />
    </div>
  );
}
