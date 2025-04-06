"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, FileCheck, Trophy } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useSession } from "next-auth/react"

type CourseProgress = {
  id: string
  name: string
  progress: number
}

export default function Dashboard() {
  const { data: session } = useSession()

  const [enrolledCoursesCount, setEnrolledCoursesCount] = useState(0)
  const [completedTestsCount, setCompletedTestsCount] = useState(0)
  const [averageScore, setAverageScore] = useState(0)
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      const res = await fetch("/api/student/dash-stats")
      const data = await res.json()

      setEnrolledCoursesCount(data.enrolledCoursesCount)
      setCompletedTestsCount(data.completedTestsCount)
      setAverageScore(data.averageScore)
      setCourseProgress(data.courseProgress)
    }

    fetchDashboardData()
  }, [])

  const motivationalQuotes = [
    "The expert in anything was once a beginner.",
    "Education is the passport to the future.",
    "The beautiful thing about learning is that no one can take it away from you.",
  ]
  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Welcome back, {session?.user?.name}!</h2>
          <p className="text-muted-foreground">Here's an overview of your academic progress.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrolledCoursesCount}</div>
              <p className="text-xs text-muted-foreground">Active courses in your curriculum</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Tests</CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedTestsCount}</div>
              <p className="text-xs text-muted-foreground">Tests taken across all subjects</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageScore}%</div>
              <p className="text-xs text-muted-foreground">Overall performance in tests</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Course Progress</CardTitle>
              <CardDescription>Track your progress across enrolled courses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {courseProgress.map((course) => (
                <div key={course.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{course.name}</div>
                    <div className="text-sm text-muted-foreground">{course.progress}%</div>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Learning Tip</CardTitle>
              <CardDescription>A little motivation to keep you going</CardDescription>
            </CardHeader>
            <CardContent>
              <blockquote className="border-l-4 border-primary pl-4 italic">"{randomQuote}"</blockquote>
              <div className="mt-6 space-y-2">
                <h4 className="font-semibold">Upcoming Tasks</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-center"><div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>Physics test on Friday</li>
                  <li className="flex items-center"><div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>Chemistry assignment due next week</li>
                  <li className="flex items-center"><div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>Mathematics tutorial tomorrow</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
