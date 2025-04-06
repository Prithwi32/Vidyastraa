"use client"
import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import StudentSidebar from "@/components/student/Sidebar"

export default function StudentDashboardLayout({ children }: { children: React.ReactNode }){
  return (
    <div>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <div className="flex min-h-screen">
            <StudentSidebar />
            <div className="flex-1 flex flex-col p-6">{children}</div>
          </div>
        </ThemeProvider>
    </div>
  )
}

