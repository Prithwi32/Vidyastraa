"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, UploadCloud } from "lucide-react";
import Image from "next/image";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface FileUploadProps {
  onUpload: (url: string) => void;
}

export default function FileUpload({ onUpload }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      onUpload(data.secure_url);
      toast.success("Image uploaded successfully :)", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <ToastContainer />
      <label className="text-sm font-medium">Upload File</label>

      <div className="flex items-center gap-4">
        <Input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        <Button variant="outline" onClick={() => document.querySelector("input[type='file']")?.click()}>
          <UploadCloud className="mr-2 h-5 w-5" />
          Choose File
        </Button>
      </div>

      {preview && (
        <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
          <Image src={preview} alt="Preview" layout="fill" objectFit="cover" className="rounded-lg" />
        </div>
      )}

      <Button onClick={handleUpload} disabled={uploading || !file}>
        {uploading ? (
          <>
            <Loader2 className="animate-spin h-4 w-4 mr-2" /> Uploading...
          </>
        ) : (
          "Upload"
        )}
      </Button>
    </div>
  );
}