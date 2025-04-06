import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Download, FileText, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function MaterialsPage() {
  // Dummy study materials data
  const studyMaterials = {
    PHYSICS: [
      {
        id: 1,
        title: "Mechanics - Newton's Laws",
        type: "PDF",
        size: "2.5 MB",
        uploadedDate: "2023-04-10",
        description: "Comprehensive notes on Newton's laws of motion and applications",
      },
      {
        id: 2,
        title: "Thermodynamics Formulas",
        type: "PDF",
        size: "1.8 MB",
        uploadedDate: "2023-04-15",
        description: "Quick reference guide for thermodynamics formulas and concepts",
      },
      {
        id: 3,
        title: "Electromagnetism Notes",
        type: "PDF",
        size: "3.2 MB",
        uploadedDate: "2023-04-20",
        description: "Detailed notes on electromagnetic theory and applications",
      },
    ],
    CHEMISTRY: [
      {
        id: 4,
        title: "Organic Chemistry - Functional Groups",
        type: "PDF",
        size: "4.1 MB",
        uploadedDate: "2023-04-12",
        description: "Comprehensive guide to organic chemistry functional groups",
      },
      {
        id: 5,
        title: "Periodic Table Guide",
        type: "PDF",
        size: "1.5 MB",
        uploadedDate: "2023-04-18",
        description: "Detailed periodic table with element properties and trends",
      },
      {
        id: 6,
        title: "Chemical Bonding",
        type: "PDF",
        size: "2.7 MB",
        uploadedDate: "2023-04-25",
        description: "Notes on different types of chemical bonds and their properties",
      },
    ],
    MATHEMATICS: [
      {
        id: 7,
        title: "Calculus - Differentiation",
        type: "PDF",
        size: "3.5 MB",
        uploadedDate: "2023-04-05",
        description: "Comprehensive notes on differentiation techniques and applications",
      },
      {
        id: 8,
        title: "Integration Formulas",
        type: "PDF",
        size: "2.2 MB",
        uploadedDate: "2023-04-15",
        description: "Quick reference guide for integration formulas and techniques",
      },
      {
        id: 9,
        title: "Linear Algebra Notes",
        type: "PDF",
        size: "3.8 MB",
        uploadedDate: "2023-04-22",
        description: "Detailed notes on vectors, matrices, and linear transformations",
      },
    ],
    BIOLOGY: [
      {
        id: 10,
        title: "Cell Biology",
        type: "PDF",
        size: "5.1 MB",
        uploadedDate: "2023-04-08",
        description: "Comprehensive notes on cell structure and function",
      },
      {
        id: 11,
        title: "Genetics - Mendel's Laws",
        type: "PDF",
        size: "2.8 MB",
        uploadedDate: "2023-04-16",
        description: "Detailed guide to Mendelian genetics and inheritance patterns",
      },
      {
        id: 12,
        title: "Human Anatomy",
        type: "PDF",
        size: "6.2 MB",
        uploadedDate: "2023-04-28",
        description: "Comprehensive guide to human anatomy and physiology",
      },
    ],
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Study Materials</h2>
          <p className="text-muted-foreground">Access notes, guides, and reference materials for your courses</p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search materials..." className="pl-8" />
          </div>
          <Button variant="outline">Filter</Button>
        </div>

        <Tabs defaultValue="PHYSICS" className="space-y-4">
          <TabsList className="flex flex-wrap">
            <TabsTrigger value="PHYSICS">Physics</TabsTrigger>
            <TabsTrigger value="CHEMISTRY">Chemistry</TabsTrigger>
            <TabsTrigger value="MATHEMATICS">Mathematics</TabsTrigger>
            <TabsTrigger value="BIOLOGY">Biology</TabsTrigger>
          </TabsList>

          {Object.entries(studyMaterials).map(([subject, materials]) => (
            <TabsContent key={subject} value={subject} className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>{subject} Materials</CardTitle>
                  <CardDescription>Notes, guides, and reference materials for {subject.toLowerCase()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {materials.map((material) => (
                      <AccordionItem key={material.id} value={`item-${material.id}`}>
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex items-center text-left">
                            <FileText className="h-5 w-5 mr-2 text-primary" />
                            <div>
                              <p className="font-medium">{material.title}</p>
                              <p className="text-xs text-muted-foreground">
                                {material.type} • {material.size}
                              </p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="pt-2 pb-4 px-4">
                            <p className="text-sm mb-4">{material.description}</p>
                            <div className="flex items-center justify-between">
                              <Badge variant="outline">
                                Uploaded: {new Date(material.uploadedDate).toLocaleDateString()}
                              </Badge>
                              <Button size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  )
}

