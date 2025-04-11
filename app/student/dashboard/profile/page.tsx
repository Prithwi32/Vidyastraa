"use client"

import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { BookOpen, Calendar, FileCheck, GraduationCap, Trophy } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import axios from "axios"
import { format } from "date-fns"

export default function ProfilePage() {
  const { data: session } = useSession()
  const [userData, setUserData] = useState<any>(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get("/api/student/dash-stats")
        setUserData(res.data)
      } catch (error) {
        console.error("Error fetching user data:", error)
      }
    }

    if (session) fetchUserData()
  }, [session])

  if (!session) return <p className="text-center text-gray-500">Please log in.</p>
  if (!userData) return <p className="text-center text-gray-500">Loading...</p>

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>View and manage your personal details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={userData.image || "/placeholder.svg"} alt={userData.name} />
                  <AvatarFallback>{userData.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="space-y-4 flex-1">
                  <div className="grid gap-2">
                    <h3 className="font-semibold text-2xl">{userData.name}</h3>
                    <p className="text-muted-foreground">{userData.email}</p>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      Joined on {format(new Date(userData.joinedDate), "MMMM d, yyyy")}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Academic Statistics</CardTitle>
              <CardDescription>Your academic journey at a glance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Total Courses Enrolled</p>
                    <p className="text-2xl font-bold">{userData.enrolledCoursesCount}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FileCheck className="mr-2 h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Tests Attempted</p>
                    <p className="text-2xl font-bold">{userData.completedTestsCount}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">Overall Progress</p>
                  <p className="text-sm font-medium">{userData.overallProgress}%</p>
                </div>
                <Progress value={userData.overallProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
