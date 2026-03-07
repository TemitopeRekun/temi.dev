"use client";

import { useState, useRef } from "react";
import { Button } from "@temi/ui";
import { uploadFile } from "@/lib/upload";

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string) => void;
  token: string;
  className?: string;
  label?: string;
}

export function ImageUpload({ value, onChange, token, className, label = "Cover Image" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    // Validate file size (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB");
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const url = await uploadFile(file, token);
      onChange(url);
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Failed to upload image");
    } finally {
      setIsUploading(false);
      // Reset input so same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className={`space-y-2 ${className || ""}`}>
      <label className="block text-sm font-medium mb-1">{label}</label>
      
      {value && (
        <div className="relative mb-2 w-full max-w-md aspect-video rounded-lg overflow-hidden border border-(--border)/20 bg-(--surface)">
          <img 
            src={value} 
            alt="Preview" 
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-2 right-2 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
            title="Remove image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          id="image-upload-input"
        />
        <div className="flex items-center gap-2">
          <Button
            type="button"
            magnetic={false}
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-(--surface) border border-(--border)/20 hover:bg-(--surface)/80"
          >
            {isUploading ? "Uploading..." : value ? "Change Image" : "Upload Image"}
          </Button>
          {isUploading && <span className="text-sm text-(--muted)">Uploading...</span>}
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </div>
    </div>
  );
}
