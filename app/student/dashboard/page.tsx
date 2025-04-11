"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, FileCheck, Lightbulb, Trophy } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useSession } from "next-auth/react";
import Image from "next/image";

type CourseProgress = {
  id: string;
  name: string;
  progress: number;
  totalTests: number;
  completedTests: number;
};

export default function Dashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState({
    enrolledCoursesCount: 0,
    completedTestsCount: 0,
    averageScore: 0,
    courseProgress: [] as CourseProgress[],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      const res = await fetch("/api/student/dash-stats");
      const data = await res.json();
      setStats(data);
    };
    fetchDashboardData();
  }, []);

  const motivationalQuotes = [
    "The expert in anything was once a beginner.",
    "Education is the passport to the future.",
    "The beautiful thing about learning is that no one can take it away from you.",
  ];
  const randomQuote =
    motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 p-4 md:p-6 space-y-6">
        <div className="flex flex-col space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Welcome back, {session?.user?.name}!
          </h2>
          <p className="text-muted-foreground">
            Here's an overview of your academic progress.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Enrolled Courses
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.enrolledCoursesCount}</div>
              <p className="text-xs text-muted-foreground">
                Active courses in your curriculum
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Tests
              </CardTitle>
              <FileCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.completedTestsCount}</div>
              <p className="text-xs text-muted-foreground">
                Tests taken across all subjects
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Course Progress</CardTitle>
              <CardDescription>
                Based on test completion percentage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.courseProgress.map((course) => (
                <div key={course.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{course.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {course.completedTests}/{course.totalTests} tests ({course.progress}%)
                    </div>
                  </div>
                  <Progress value={course.progress} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Lightbulb className="h-10 w-10 text-yellow-500" />
                <div>
                  <CardTitle>Learning Tip</CardTitle>
                  <CardDescription>
                    Daily motivation for your studies
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex gap-4 items-center">
              <Image
                src="/logo.jpeg"
                alt="Study icon"
                width={80}
                height={80}
                className="rounded-lg"
              />
              <blockquote className="border-l-4 border-primary pl-4 italic">
                "{randomQuote}"
              </blockquote>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}