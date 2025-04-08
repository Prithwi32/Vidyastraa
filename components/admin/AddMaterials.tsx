"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { toast } from "react-toastify";
import MaterialUpload from "./MaterialUpload";

type AddMaterialFormProps = {
  onMaterialAdded?: () => void
}

const formSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  subject: z.enum(["PHYSICS", "CHEMISTRY", "MATHS", "BIOLOGY"]),
  type: z.string().min(1),
  url: z.string().url(),
  size: z.string(),
});

export default function AddMaterialForm({ onMaterialAdded }: AddMaterialFormProps) {
  const [fileSize, setFileSize] = useState("");
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (values: any) => {
    try {
      const res = await fetch("/api/study-materials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Upload failed");

      toast.success("Material added!");
      reset();
      onMaterialAdded?.(); // Call the callback to refresh material list
    } catch (err) {
      toast.error("Failed to add material");
    }
  };

  const handleFileUpload = (url: string, file: File) => {
    const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2) + " MB";
    setValue("url", url);
    setValue("size", fileSizeMB);
    setValue(
      "type",
      file.type.includes("pdf") ? "PDF" : file.type.toUpperCase()
    );
    setFileSize(fileSizeMB);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 bg-muted/50 p-4 rounded-xl w-full md:w-[28rem]"
    >
      <h3 className="text-lg font-semibold">Add New Material</h3>

      <Input placeholder="Title" {...register("title")} />
      {errors.title && (
        <p className="text-xs text-red-500">{errors.title.message}</p>
      )}

      <Textarea
        placeholder="Description (optional)"
        {...register("description")}
      />

      <Select onValueChange={(val) => setValue("subject", val)}>
        <SelectTrigger>
          <SelectValue placeholder="Select Subject" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="PHYSICS">Physics</SelectItem>
          <SelectItem value="CHEMISTRY">Chemistry</SelectItem>
          <SelectItem value="MATHS">Mathematics</SelectItem>
          <SelectItem value="BIOLOGY">Biology</SelectItem>
        </SelectContent>
      </Select>
      {errors.subject && (
        <p className="text-xs text-red-500">{errors.subject.message}</p>
      )}

      <MaterialUpload
        onUpload={(url: string, file: File) => {
          const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2) + " MB";
          setValue("url", url);
          setValue("size", fileSizeMB);
          setValue(
            "type",
            file.type.includes("pdf") ? "PDF" : file.type.toUpperCase()
          );
          setFileSize(fileSizeMB);
        }}
      />

      <Input type="hidden" {...register("url")} />
      <Input type="hidden" {...register("size")} />
      <Input type="hidden" {...register("type")} />

      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  );
}
