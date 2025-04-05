"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  BookOpen,
  ClipboardList,
  CreditCard,
  Users,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/admin/stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        toast.error("Failed to load dashboard stats.");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading Dashboard...</p>;

  const subjectColors: Record<string, string> = {
    PHYSICS: "bg-blue-500",
    CHEMISTRY: "bg-green-500",
    MATHS: "bg-purple-500",
    BIOLOGY: "bg-amber-500",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your educational platform</p>
      </div>

      {/* STAT CARDS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Courses" value={stats.totalCourses} icon={<BookOpen className="h-4 w-4 text-blue-600" />} />
        <StatCard title="Total Students" value={stats.totalStudents} icon={<Users className="h-4 w-4 text-blue-600" />} />
        <StatCard title="Total Tests" value={stats.totalTests} icon={<ClipboardList className="h-4 w-4 text-blue-600" />} />
        <StatCard title="Total Revenue" value={`₹${stats.totalRevenue.toLocaleString()}`} icon={<CreditCard className="h-4 w-4 text-blue-600" />} />
      </div>

      {/* ENROLLMENTS + QUESTION STATS */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Enrollments</CardTitle>
            <CardDescription>Students who recently enrolled in courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentEnrollments.map((enroll: any, index: number) => (
                <div key={index} className="flex items-center gap-4 rounded-lg border p-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-medium">
                      {enroll.user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{enroll.user.name}</p>
                    <p className="text-xs text-muted-foreground">Enrolled in {enroll.course.title}</p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(enroll.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Question Bank Stats</CardTitle>
            <CardDescription>Distribution of questions by subject</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.questionStats.map((q: any) => {
                const percentage = Math.min((q._count._all / 2000) * 100, 100); // adjust total if needed
                return (
                  <div key={q.subject} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`h-3 w-3 rounded-full ${subjectColors[q.subject]}`}></div>
                        <span className="text-sm">{q.subject}</span>
                      </div>
                      <span className="text-sm font-medium">{q._count._all}</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div className={`h-2 rounded-full ${subjectColors[q.subject]}`} style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: any; icon: React.ReactNode }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {/* Optional: Add dynamic description */}
      </CardContent>
    </Card>
  );
}
