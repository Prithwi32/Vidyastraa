"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Eye, FileCheck } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function TestsPage() {
  const router = useRouter()
  const [showStartTestDialog, setShowStartTestDialog] = useState(false)
  const [selectedTest, setSelectedTest] = useState<any>(null)

  // Dummy completed tests data
  const completedTests = [
    {
      id: "test-1",
      title: "Physics - Mechanics",
      date: "2023-05-15",
      score: 85,
      totalQuestions: 20,
      correctAnswers: 17,
      timeSpent: "45 minutes",
      subject: "PHYSICS",
    },
    {
      id: "test-2",
      title: "Chemistry - Organic Compounds",
      date: "2023-05-20",
      score: 78,
      totalQuestions: 25,
      correctAnswers: 19,
      timeSpent: "55 minutes",
      subject: "CHEMISTRY",
    },
    {
      id: "test-3",
      title: "Mathematics - Calculus",
      date: "2023-05-25",
      score: 92,
      totalQuestions: 15,
      correctAnswers: 14,
      timeSpent: "40 minutes",
      subject: "MATHEMATICS",
    },
    {
      id: "test-4",
      title: "Biology - Cell Structure",
      date: "2023-06-01",
      score: 88,
      totalQuestions: 20,
      correctAnswers: 18,
      timeSpent: "50 minutes",
      subject: "BIOLOGY",
    },
  ]

  // Dummy upcoming tests data
  const upcomingTests = [
    {
      id: "test-5",
      title: "Physics - Electromagnetism",
      date: "2023-06-15",
      duration: "60 minutes",
      totalQuestions: 25,
      subject: "PHYSICS",
    },
    {
      id: "test-6",
      title: "Chemistry - Inorganic Chemistry",
      date: "2023-06-20",
      duration: "75 minutes",
      totalQuestions: 30,
      subject: "CHEMISTRY",
    },
    {
      id: "test-7",
      title: "Mathematics - Algebra",
      date: "2023-06-25",
      duration: "45 minutes",
      totalQuestions: 20,
      subject: "MATHEMATICS",
    },
  ]

  const handleViewAnswers = (testId: string) => {
    router.push(`/student/dashboard/tests/${testId}?mode=review`)
  }

  const handleStartTest = (test: any) => {
    setSelectedTest(test)
    setShowStartTestDialog(true)
  }

  const confirmStartTest = () => {
    setShowStartTestDialog(false)
    if (selectedTest) {
      router.push(`/student/dashboard/tests/${selectedTest.id}`)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Test Performance</h2>
          <p className="text-muted-foreground">Track your test results and upcoming assessments</p>
        </div>

        <Tabs defaultValue="completed" className="space-y-4">
          <TabsList>
            <TabsTrigger value="completed">Completed Tests</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Tests</TabsTrigger>
          </TabsList>
          <TabsContent value="completed" className="space-y-4">
            {completedTests.map((test) => (
              <Card key={test.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{test.title}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(test.date).toLocaleDateString()}
                        <Clock className="h-3 w-3 ml-3 mr-1" />
                        {test.timeSpent}
                      </CardDescription>
                    </div>
                    <Badge
                      className={test.score >= 90 ? "bg-green-500" : test.score >= 75 ? "bg-yellow-500" : "bg-red-500"}
                    >
                      {test.score}%
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <p>
                        <span className="font-medium">Questions:</span> {test.correctAnswers} correct out of{" "}
                        {test.totalQuestions}
                      </p>
                      <p className="mt-1">
                        <Badge variant="outline">{test.subject}</Badge>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => router.push(`/student/dashboard/tests/${test.id}/results`)}>
                        <FileCheck className="h-4 w-4 mr-2" />
                        Results
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleViewAnswers(test.id)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Answers
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          <TabsContent value="upcoming" className="space-y-4">
            {upcomingTests.map((test) => (
              <Card key={test.id}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{test.title}</CardTitle>
                      <CardDescription className="flex items-center mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(test.date).toLocaleDateString()}
                        <Clock className="h-3 w-3 ml-3 mr-1" />
                        {test.duration}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{test.totalQuestions} Questions</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <Badge variant="outline">{test.subject}</Badge>
                    </div>
                    <Button size="sm" onClick={() => handleStartTest(test)}>
                      Start Test
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        <Card>
          <CardHeader>
            <CardTitle>Test Statistics</CardTitle>
            <CardDescription>Your performance across different subjects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-blue-500 mr-2"></div>
                  <span className="text-sm font-medium">Physics</span>
                </div>
                <span className="text-sm font-medium">85%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-green-500 mr-2"></div>
                  <span className="text-sm font-medium">Chemistry</span>
                </div>
                <span className="text-sm font-medium">78%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-yellow-500 mr-2"></div>
                  <span className="text-sm font-medium">Mathematics</span>
                </div>
                <span className="text-sm font-medium">92%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-4 w-4 rounded-full bg-purple-500 mr-2"></div>
                  <span className="text-sm font-medium">Biology</span>
                </div>
                <span className="text-sm font-medium">88%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Start Test Dialog */}
      <Dialog open={showStartTestDialog} onOpenChange={setShowStartTestDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Start Test</DialogTitle>
            <DialogDescription>
              You are about to start {selectedTest?.title}. Make sure you have enough time to complete the test.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Duration:</span>
                <span className="text-sm font-medium">{selectedTest?.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Questions:</span>
                <span className="text-sm font-medium">{selectedTest?.totalQuestions}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Subject:</span>
                <span className="text-sm font-medium">{selectedTest?.subject}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStartTestDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmStartTest}>Start Test</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
