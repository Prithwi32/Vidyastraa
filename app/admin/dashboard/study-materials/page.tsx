"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast, ToastContainer } from "react-toastify";
import {
  FileText,
  Download,
  Edit,
  Trash,
  Eye,
  MoreVertical,
  AlertTriangle,
  Loader2,
  Upload,
} from "lucide-react";
import AddMaterialForm from "@/components/admin/AddMaterials";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  subjectId: string;
  subject: {
    id: string;
    name: string;
  };
  type: string;
  url: string;
  uploadedAt: string;
  size?: string;
}

export default function AdminMaterialsPage() {
  const [materials, setMaterials] = useState<{
    [key: string]: StudyMaterial[];
  }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMaterial, setSelectedMaterial] =
    useState<StudyMaterial | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    subjectId: "", // Changed from 'subject' to 'subjectId'
  });
  const [editFile, setEditFile] = useState<File | null>(null);

  const subjects = ["PHYSICS", "CHEMISTRY", "MATHS", "BIOLOGY"];

  const fetchMaterials = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/study-materials");
      if (!res.ok) {
        throw new Error("Failed to fetch materials");
      }
      const data: StudyMaterial[] = await res.json();

      const grouped = data.reduce(
        (acc: { [key: string]: StudyMaterial[] }, material) => {
          const subjectName = material.subject?.name || "Unknown";
          if (!acc[subjectName]) {
            acc[subjectName] = [];
          }
          acc[subjectName].push(material);
          return acc;
        },
        {}
      );

      setMaterials(grouped);
    } catch (error) {
      console.error("Failed to fetch materials:", error);
      toast.error("Failed to load study materials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const updateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterial) return;

    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append("title", editForm.title);
      formData.append("description", editForm.description);
      formData.append("subjectId", editForm.subjectId);
      if (editFile) {
        formData.append("file", editFile);
      }

      const res = await fetch(`/api/study-materials/${selectedMaterial.id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update material");
      }

      const result = await res.json();
      toast.success(result.message || "Study material updated successfully");
      fetchMaterials();
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Error updating material:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update study material"
      );
    } finally {
      setIsUpdating(false);
      setEditFile(null);
    }
  };

  // Update your handleEdit function
  const handleEdit = (material: StudyMaterial) => {
    setSelectedMaterial(material);
    setEditForm({
      title: material.title,
      description: material.description,
      subjectId: material.subjectId, // Changed from subject to subjectId
    });
    setEditFile(null);
    setIsEditDialogOpen(true);
  };

  const handleDelete = (material: StudyMaterial) => {
    setSelectedMaterial(material);
    setIsDeleteDialogOpen(true);
  };

  const handleViewPdf = (material: StudyMaterial) => {
    if (!material?.url) {
      toast.error("Material URL missing.");
      return;
    }
    setSelectedMaterial(material);
    setIsPdfViewerOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedMaterial) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/study-materials/${selectedMaterial.id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete material");
      }

      toast.success("Study material deleted successfully");
      fetchMaterials();
    } catch (error) {
      console.error("Error deleting material:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete study material"
      );
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        toast.error("Invalid file type, Please upload a PDF file");
        return;
      }

      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File too large, Please upload a file smaller than 10MB");
        return;
      }

      setEditFile(selectedFile);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Manage Study Materials</h2>
          <p className="text-muted-foreground">
            Add, edit, view, and delete uploaded materials by subject
          </p>
        </div>
        <AddMaterialForm onMaterialAdded={fetchMaterials} />
      </div>

      <Tabs defaultValue="PHYSICS">
        <TabsList className="flex flex-wrap">
          {subjects.map((subject) => (
            <TabsTrigger key={subject} value={subject}>
              {subject}
            </TabsTrigger>
          ))}
        </TabsList>

        {subjects.map((subject) => (
          <TabsContent key={subject} value={subject}>
            <Card>
              <CardHeader>
                <CardTitle>{subject}</CardTitle>
                <CardDescription>
                  Materials uploaded under {subject.toLowerCase()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <span className="ml-2">Loading materials...</span>
                  </div>
                ) : materials[subject]?.length ? (
                  <Accordion type="single" collapsible>
                    {materials[subject].map((mat) => (
                      <AccordionItem key={mat.id} value={`item-${mat.id}`}>
                        <AccordionTrigger>
                          <div className="flex items-center text-left">
                            <FileText className="mr-2 h-5 w-5 text-primary" />
                            <div>
                              <p className="font-medium">{mat.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {mat.type} • {mat.size || "N/A"}
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="space-y-4">
                          <p>{mat.description}</p>
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <Badge>
                              Uploaded:{" "}
                              {new Date(mat.uploadedAt).toLocaleDateString()}
                            </Badge>
                            <div className="flex flex-wrap gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewPdf(mat)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View PDF
                              </Button>
                              <a
                                href={mat.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                download
                                className="w-full sm:w-auto"
                              >
                                <Button variant="outline" className="w-full">
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </Button>
                              </a>

                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8"
                                  >
                                    <MoreVertical className="h-4 w-4" />
                                    <span className="sr-only">
                                      More options
                                    </span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => handleEdit(mat)}
                                  >
                                    <Edit className="mr-2 h-4 w-4" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleDelete(mat)}
                                    className="text-destructive focus:text-destructive"
                                  >
                                    <Trash className="mr-2 h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="mx-auto h-12 w-12 mb-2 opacity-20" />
                    <p>No study materials found for {subject}</p>
                    <p className="text-sm">
                      Upload materials using the "Add Material" button
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Edit Material Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Study Material</DialogTitle>
            <DialogDescription>
              Update the details of this study material
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={updateMaterial}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Select
                  value={editForm.subjectId}
                  onValueChange={(value) =>
                    setEditForm({ ...editForm, subjectId: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  rows={4}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-file">Replace PDF (Optional)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="edit-file"
                    type="file"
                    accept="application/pdf"
                    onChange={handleEditFileChange}
                    className="hidden"
                  />
                  <div
                    className="border rounded-md p-4 w-full flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() =>
                      document.getElementById("edit-file")?.click()
                    }
                  >
                    <Upload className="h-8 w-8 text-muted-foreground" />
                    <div className="text-center">
                      <p className="font-medium">Click to upload new PDF</p>
                      <p className="text-xs text-muted-foreground">
                        PDF (max 10MB)
                      </p>
                    </div>
                  </div>
                </div>
                {editFile && (
                  <div className="text-sm text-muted-foreground flex items-center">
                    <span className="font-medium text-primary">Selected:</span>
                    <span className="ml-1">{editFile.name}</span>
                    <span className="ml-1 text-xs">
                      ({(editFile.size / (1024 * 1024)).toFixed(2)} MB)
                    </span>
                  </div>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Delete Study Material
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this study material? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedMaterial && (
              <div className="border rounded-md p-3 bg-muted/50">
                <p className="font-medium">{selectedMaterial.title}</p>
                <p className="text-sm text-muted-foreground">
                  {selectedMaterial.subject?.name || "Unknown subject"}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* PDF Viewer Dialog */}
      <Dialog open={isPdfViewerOpen} onOpenChange={setIsPdfViewerOpen}>
        <DialogContent className="max-w-[95vw] w-full h-[90vh] max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-4">
            <DialogTitle>{selectedMaterial?.title || "Untitled"}</DialogTitle>
            <DialogDescription>
              {selectedMaterial?.description || "No description available."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-hidden p-6 pt-0">
            {selectedMaterial?.url ? (
              <div className="w-full h-full flex">
                <iframe
                  src={`${selectedMaterial.url}#toolbar=0&navpanes=0&scrollbar=0`}
                  className="absolute inset-0 w-full h-5/6 border rounded-md"
                  title={selectedMaterial.title}
                />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-red-500">PDF could not be loaded</p>
                <p className="text-sm text-muted-foreground">
                  The document may be unavailable or corrupted
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="px-6 py-4 border-t">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 w-full">
              <a
                href={selectedMaterial?.url}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="w-full sm:w-auto"
              >
                <Button variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </a>
              <Button
                className="ml-4"
                onClick={() => setIsPdfViewerOpen(false)}
              >
                Close
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
