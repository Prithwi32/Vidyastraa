"use client";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { BookOpen, ClipboardList, LogOut, User, Menu } from "lucide-react";
import { useState } from "react";
import { usePathname } from "next/navigation";

export default function StudentDashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  if (!session) return <p className="text-center text-gray-500">Please log in.</p>;

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className={`w-64 bg-gray-900 text-white p-4 fixed inset-y-0 left-0 transition-all duration-300 ${isOpen ? "translate-x-0" : "-translate-x-64"} md:translate-x-0 md:relative`}>
        <button
          onClick={() => setIsOpen(false)}
          className="md:hidden text-gray-400 hover:text-white absolute top-4 right-4"
        >
          ✖
        </button>

        <h2 className="text-xl font-bold">🎓 Student Dashboard</h2>
        <ul className="mt-4 space-y-3">
          <li>
            <Link href="/student/dashboard/profile" className={`flex items-center gap-2 p-2 rounded ${pathname === "/dashboard/profile" ? "bg-gray-800" : "hover:bg-gray-800"}`}>
              <User size={18} /> Profile
            </Link>
          </li>
          <li>
            <Link href="/student/dashboard/courses" className={`flex items-center gap-2 p-2 rounded ${pathname === "/dashboard/courses" ? "bg-gray-800" : "hover:bg-gray-800"}`}>
              <BookOpen size={18} /> Enrolled Courses
            </Link>
          </li>
          <li>
            <Link href="/student/dashboard/tests" className={`flex items-center gap-2 p-2 rounded ${pathname === "/dashboard/tests" ? "bg-gray-800" : "hover:bg-gray-800"}`}>
              <ClipboardList size={18} /> Tests Appeared
            </Link>
          </li>
          <li>
            <button onClick={() => signOut()} className="flex w-full items-center gap-2 p-2 hover:bg-red-700 rounded">
              <LogOut size={18} /> Logout
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 min-h-screen p-6 ml-0 mt-20 md:mt-0">
        {/* Mobile Sidebar Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden bg-gray-900 text-white px-4 py-2 rounded fixed top-4"
        >
          <Menu size={18} />
        </button>

        {children}
      </div>
    </div>
  );
}
