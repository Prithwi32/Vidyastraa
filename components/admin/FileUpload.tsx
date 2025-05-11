"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, UploadCloud, X } from "lucide-react"
import Image from "next/image"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface FileUploadProps {
  onUpload: (url: string) => void
  label?: string
}

export default function FileUpload({ onUpload, label = "Upload Image (Optional)" }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Add a key to reset the file input when needed
  const [inputKey, setInputKey] = useState(Date.now())

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      onUpload(data.secure_url)

      toast.success("Image uploaded successfully!", { containerId: "main-toast" })

      // Reset state
      setFile(null)
      setPreview(null)
      // Reset the file input by changing its key
      setInputKey(Date.now())
    } catch (error) {
      console.error("Upload error:", error)
      toast.error("Upload failed. Please try again.", { containerId: "main-toast" })
    } finally {
      setUploading(false)
    }
  }

  const handleCancelFile = () => {
    setFile(null)
    setPreview(null)
    // Reset the file input by changing its key
    setInputKey(Date.now())
  }

  // Clean up object URL when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview)
      }
    }
  }, [preview])

  return (
    <div className="flex flex-col gap-4">
      <label className="text-sm font-medium">{label}</label>

      <div className="flex items-center gap-4">
        <Input
          key={inputKey}
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
          <UploadCloud className="mr-2 h-5 w-5" />
          Choose File
        </Button>
      </div>

      {preview && (
        <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
          <Image src={preview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
          <button
            type="button"
            onClick={handleCancelFile}
            className="absolute top-1 right-1 p-1 bg-white rounded-full shadow"
          >
            <X className="h-4 w-4 text-red-500" />
          </button>
        </div>
      )}

      <Button type="button" onClick={handleUpload} disabled={uploading || !file} className="dark:text-white">
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
  )
}
