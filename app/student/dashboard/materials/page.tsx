"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { FileText, Download, Search } from "lucide-react"

type StudyMaterial = {
  id: string
  title: string
  description?: string
  type: string
  size?: string
  url: string
  uploadedAt: string
  subject: "PHYSICS" | "CHEMISTRY" | "MATHS" | "BIOLOGY"
}

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<StudyMaterial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMaterials = async () => {
      const res = await fetch("/api/study-materials")
      const data = await res.json()
      setMaterials(data)
      setLoading(false)
    }
    fetchMaterials()
  }, [])

  const groupedBySubject = materials.reduce<Record<string, StudyMaterial[]>>((acc, mat) => {
    if (!acc[mat.subject]) acc[mat.subject] = []
    acc[mat.subject].push(mat)
    return acc
  }, {})

  const subjects = ["PHYSICS", "CHEMISTRY", "MATHS", "BIOLOGY"]

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
        </div>

        {loading ? (
          <p>Loading materials...</p>
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
                    <CardTitle>{subject} Materials</CardTitle>
                    <CardDescription>Notes, guides, and references for {subject.toLowerCase()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                      {(groupedBySubject[subject] || []).map((material) => (
                        <AccordionItem key={material.id} value={`item-${material.id}`}>
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex items-center text-left">
                              <FileText className="h-5 w-5 mr-2 text-primary" />
                              <div>
                                <p className="font-medium">{material.title}</p>
                                <p className="text-xs text-muted-foreground">
                                  {material.type} {material.size ? `• ${material.size}` : ""}
                                </p>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="pt-2 pb-4 px-4">
                              <p className="text-sm mb-4">{material.description}</p>
                              <div className="flex items-center justify-between">
                                <Badge variant="outline">
                                  Uploaded: {new Date(material.uploadedAt).toLocaleDateString()}
                                </Badge>
                                <Button size="sm" asChild>
                                  <a href={material.url} target="_blank" rel="noopener noreferrer">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download
                                  </a>
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
        )}
      </main>
    </div>
  )
}
