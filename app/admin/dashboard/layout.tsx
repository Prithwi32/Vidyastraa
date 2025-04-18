"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  FileQuestion,
  LayoutDashboard,
  LogOut,
  Settings,
  CreditCard,
  Menu,
  X,
  FileText,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { signOut, useSession } from "next-auth/react";
import Loader from "@/components/Loader";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

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
    },
    {
      href: "/admin/dashboard/study-materials",
      label: "Study Materials",
      icon: <FileText className="h-5 w-5" />,
      active: pathname.includes("/admin/dashboard/study-materials"),
    },
  ];

  const session = useSession();
  const router = useRouter();
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    setLoader(true);
    handleAuth();
  }, [session]);

  const handleAuth = () => {
    if (session.status === "unauthenticated")
      return router.push("/auth/signin");
    else if (
      session.status === "authenticated" &&
      session.data.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL
    )
      return router.push("/student/dashboard");
    else setLoader(false);
  };

  if (loader)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );

  return (
    <div className="h-full relative dark:bg-gray-950">
      <div className="hidden md:flex h-full w-72 flex-col fixed inset-y-0 z-50 dark:bg-gray-900 bg-white border-r dark:border-gray-800">
        <Link href={"/"}>
          <div className="flex items-center p-6 pl-4">
            <Image
              src="/logo.jpeg"
              alt="Vidyastraa Logo"
              width={26}
              height={26}
              className="object-contain mr-2 rounded-full hover:scale-110 transition-all duration-300"
            />
            <h1 className="text-xl font-bold text-yellow-600 hover:text-yellow-500">
              Vidyastraa
            </h1>
          </div>
        </Link>
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
          <button
            onClick={() => signOut()}
            className="flex items-center gap-x-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-all"
          >
            <LogOut className="h-5 w-5" />
            Logout
          </button>
          <ThemeToggle />
        </div>
      </div>
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 bg-white dark:bg-gray-900 p-2 rounded-md shadow-md"
      >
        {isSidebarOpen ? (
          <X className="h-5 w-5" />
        ) : (
          <Menu className="h-5 w-5" />
        )}
      </button>
      {isSidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      <div
        className={`md:hidden fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-gray-900 transform transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <Link href={"/"}>
          <div className="flex items-center p-6">
            <Image
              src="/logo.jpeg"
              alt="Vidyastraa Logo"
              width={26}
              height={26}
              className="object-contain mr-2 rounded-full hover:scale-110 transition-all duration-300"
            />
            <h1 className="text-xl font-bold text-yellow-600 hover:text-yellow-500">
              Vidyastraa
            </h1>
          </div>
        </Link>
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
            href="#"
            onClick={(e) => {
              e.preventDefault();
              signOut();
            }}
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
  );
}
