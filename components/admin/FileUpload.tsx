'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, UploadCloud, X } from 'lucide-react'
import Image from 'next/image'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface FileUploadProps {
  onUpload: (url: string) => void
}

export default function FileUpload({ onUpload }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

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
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      onUpload(data.secure_url)

      toast.success('Image uploaded successfully!', {
        position: 'top-right',
        autoClose: 3000,
      })

      // Reset state
      setFile(null)
      setPreview(null)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Upload failed. Please try again.', {
        position: 'top-right',
        autoClose: 5000,
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <ToastContainer />

      <label className="text-sm font-medium">Upload Image (Optional)</label>

      <div className="flex items-center gap-4">
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud className="mr-2 h-5 w-5" />
          Choose File
        </Button>
      </div>

      {preview && (
        <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
          <Image
            src={preview}
            alt="Preview"
            fill
            className="object-cover"
          />
          <button
            type="button"
            onClick={() => {
              setFile(null)
              setPreview(null)
            }}
            className="absolute top-1 right-1 p-1 bg-white rounded-full shadow"
          >
            <X className="h-4 w-4 text-red-500" />
          </button>
        </div>
      )}

      <Button
        type="button"
        onClick={handleUpload}
        disabled={uploading || !file}
      >
        {uploading ? (
          <>
            <Loader2 className="animate-spin h-4 w-4 mr-2" />
            Uploading...
          </>
        ) : (
          'Upload'
        )}
      </Button>
    </div>
  )
}
