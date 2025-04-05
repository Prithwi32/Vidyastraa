"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, BookOpen, FileQuestion, LayoutDashboard, LogOut, Settings, CreditCard, Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const pathname = usePathname()

  const routes = [
    {
      href: "/admin/dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      active: pathname === "/admin/dashboard",
    },
    {
      href: "/admin/dashboard/courses",
      label: "Courses",
      icon: <BookOpen className="h-5 w-5" />,
      active: pathname.includes("/admin/dashboard/courses"),
    },
    {
      href: "/admin/dashboard/tests",
      label: "Tests",
      icon: <BarChart3 className="h-5 w-5" />,
      active: pathname.includes("/admin/dashboard/tests"),
    },
    {
      href: "/admin/dashboard/questions",
      label: "Questions",
      icon: <FileQuestion className="h-5 w-5" />,
      active: pathname.includes("/admin/dashboard/questions"),
    },
    {
      href: "/admin/dashboard/payments",
      label: "Payments",
      icon: <CreditCard className="h-5 w-5" />,
      active: pathname.includes("/admin/dashboard/payments"),
    }
  ]

  return (
    <div className="h-full relative dark:bg-gray-950">
      <div className="hidden md:flex h-full w-72 flex-col fixed inset-y-0 z-50 dark:bg-gray-900 bg-white border-r dark:border-gray-800">
        <div className="p-6">
          <Link href="/admin/dashboard">
            <h1 className="text-2xl font-bold dark:text-white">Admin Panel</h1>
          </Link>
        </div>
        <div className="flex flex-col w-full">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`flex items-center gap-x-2 text-sm font-medium px-3 py-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ${
                route.active
                  ? "text-black dark:text-white bg-gray-100 dark:bg-gray-800 border-r-4 border-blue-600"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {route.icon}
              {route.label}
            </Link>
          ))}
        </div>
        <div className="mt-auto p-6 flex items-center justify-between">
          <Link
            href="/admin/logout"
            className="flex items-center gap-x-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Link>
          <ThemeToggle />
        </div>
      </div>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white dark:bg-gray-900 p-2 rounded-md shadow-md"
      >
        {isSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setIsSidebarOpen(false)} />
      )}
      <div
        className={`md:hidden fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-gray-900 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-6">
          <Link href="/admin/dashboard">
            <h1 className="text-2xl font-bold dark:text-white">Admin Panel</h1>
          </Link>
        </div>
        <div className="flex flex-col w-full">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`flex items-center gap-x-2 text-sm font-medium px-3 py-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all ${
                route.active
                  ? "text-black dark:text-white bg-gray-100 dark:bg-gray-800 border-r-4 border-blue-600"
                  : "text-gray-500 dark:text-gray-400"
              }`}
              onClick={() => setIsSidebarOpen(false)}
            >
              {route.icon}
              {route.label}
            </Link>
          ))}
        </div>
        <div className="mt-auto p-6 flex items-center justify-between">
          <Link
            href="/admin/logout"
            className="flex items-center gap-x-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </Link>
          <ThemeToggle />
        </div>
      </div>
      <main className="md:pl-72 pt-16 md:pt-0 min-h-screen dark:bg-gray-950">
        <div className="p-6">{children}</div>
      </main>
    </div>
  )
}