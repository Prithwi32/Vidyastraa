"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, UploadCloud, FileText, X } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import { supabase } from "@/lib/supabase/client";

interface MaterialUploadProps {
  onUpload: (url: string, file: File) => void;
}

export default function MaterialUpload({ onUpload }: MaterialUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
  
    setUploading(true);
  
    const { data, error } = await supabase.storage
      .from("study-materials")
      .upload(`materials/${file.name}`, file, {
        cacheControl: "3600",
        upsert: true,
      });
  
    if (error) {
      toast.error("Upload failed: " + error.message);
    } else {
      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("study-materials")
        .getPublicUrl(`materials/${file.name}`);
  
      const publicUrl = publicUrlData.publicUrl;
  
      toast.success("Uploaded successfully!");
      onUpload(publicUrl, file);
      setFile(null);
    }
  
    setUploading(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <ToastContainer />
      <label className="text-sm font-medium">Upload Material (PDF)</label>

      <div className="flex items-center gap-4">
        <Input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud className="mr-2 h-5 w-5" />
          Choose PDF
        </Button>
        {file && (
          <div className="flex items-center gap-2 text-sm bg-muted px-2 py-1 rounded-md">
            <FileText className="h-4 w-4 text-primary" />
            {file.name}
            <X
              className="h-4 w-4 cursor-pointer text-red-500 ml-2"
              onClick={() => setFile(null)}
            />
          </div>
        )}
      </div>

      <Button
        type="button"
        onClick={handleUpload}
        disabled={uploading || !file}
        className="dark:text-white"
      >
        {uploading ? (
          <>
            <Loader2 className="animate-spin h-4 w-4 mr-2" />
            Uploading...
          </>
        ) : (
          "Upload"
        )}
      </Button>
    </div>
  );
}
