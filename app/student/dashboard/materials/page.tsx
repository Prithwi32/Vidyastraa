"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Download, Search, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface Subject {
  id: string;
  name: string;
}

interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  type: string;
  size?: string;
  url: string;
  uploadedAt: string;
  subject: Subject;
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMaterial, setSelectedMaterial] =
    useState<StudyMaterial | null>(null);
  const [isPdfViewerOpen, setIsPdfViewerOpen] = useState(false);
  const [isPdfLoading, setIsPdfLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await fetch("/api/study-materials");
        if (!res.ok) throw new Error("Failed to fetch materials");
        const data = await res.json();
        setMaterials(data);
      } catch (error) {
        console.error("Error fetching materials:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterials();
  }, []);

  // Group by subject name and filter by search query
  const groupedBySubject = materials.reduce<Record<string, StudyMaterial[]>>(
    (acc, mat) => {
      const subjectName = mat.subject.name.toUpperCase();
      if (!acc[subjectName]) acc[subjectName] = [];

      // Filter materials based on search query
      if (
        searchQuery === "" ||
        mat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mat.description.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        acc[subjectName].push(mat);
      }

      return acc;
    },
    {}
  );

  const handleViewPdf = (material: StudyMaterial) => {
    setSelectedMaterial(material);
    setIsPdfViewerOpen(true);
    setIsPdfLoading(true);
  };

  const subjects = ["PHYSICS", "CHEMISTRY", "MATHS", "BIOLOGY"];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Study Materials</h2>
          <p className="text-muted-foreground">
            Access notes, guides, and reference materials for your courses
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search materials..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Tabs defaultValue="PHYSICS" className="space-y-4">
            <TabsList className="flex flex-wrap">
              {subjects.map((subject) => (
                <TabsTrigger key={subject} value={subject}>
                  {subject.charAt(0) + subject.slice(1).toLowerCase()}
                </TabsTrigger>
              ))}
            </TabsList>

            {subjects.map((subject) => (
              <TabsContent key={subject} value={subject} className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {subject.charAt(0) + subject.slice(1).toLowerCase()}{" "}
                      Materials
                    </CardTitle>
                    <CardDescription>
                      {groupedBySubject[subject]?.length || 0} materials
                      available
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {groupedBySubject[subject]?.length ? (
                      <Accordion type="single" collapsible className="w-full">
                        {groupedBySubject[subject].map((material) => (
                          <AccordionItem key={material.id} value={material.id}>
                            <AccordionTrigger className="hover:no-underline">
                              <div className="flex items-center text-left">
                                <FileText className="h-5 w-5 mr-2 text-primary" />
                                <div>
                                  <p className="font-medium">
                                    {material.title}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {material.type}{" "}
                                    {material.size ? `• ${material.size}` : ""}
                                  </p>
                                </div>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent>
                              <div className="pt-2 pb-4 px-4 space-y-4">
                                {material.description && (
                                  <p className="text-sm">
                                    {material.description}
                                  </p>
                                )}
                                <div className="flex items-center justify-between gap-2">
                                  <Badge variant="outline">
                                    Uploaded:{" "}
                                    {new Date(
                                      material.uploadedAt
                                    ).toLocaleDateString()}
                                  </Badge>
                                  <div className="flex gap-2">
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleViewPdf(material)}
                                    >
                                      <Eye className="h-4 w-4 mr-2" />
                                      View
                                    </Button>
                                    <Button size="sm" asChild>
                                      <a
                                        href={material.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        download
                                      >
                                        <Download className="h-4 w-4 mr-2" />
                                        Download
                                      </a>
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <FileText className="mx-auto h-12 w-12 mb-2 opacity-20" />
                        <p>No materials found for {subject.toLowerCase()}</p>
                        {searchQuery && (
                          <p className="text-sm">Try a different search term</p>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </main>

      {/* PDF Viewer Dialog */}
      <Dialog open={isPdfViewerOpen} onOpenChange={setIsPdfViewerOpen}>
        <DialogContent className="max-w-[95vw] w-full h-[90vh] max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle>{selectedMaterial?.title || "Untitled"}</DialogTitle>
            <DialogDescription>
              {selectedMaterial?.description || "No description available."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 min-h-0 overflow-hidden p-6 pt-0 relative">
            {selectedMaterial?.url ? (
              <>
                {isPdfLoading && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                  </div>
                )}
                <iframe
                  src={`${selectedMaterial.url}#toolbar=0&navpanes=0&scrollbar=0`}
                  className={`absolute inset-0 w-full h-full border rounded-md ${
                    isPdfLoading ? "opacity-0" : "opacity-100"
                  }`}
                  title={selectedMaterial.title}
                  allow="fullscreen"
                  onLoad={() => setIsPdfLoading(false)}
                />
              </>
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
    </div>
  );
}
