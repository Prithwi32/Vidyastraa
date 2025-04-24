"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  FileText,
  Home,
  LogOut,
  PlayCircle,
  User,
  FileCheck,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogoutDialog } from "@/components/logout-dialog";
import { useMobile } from "./stud-use-mobile";
import {  useSession } from "next-auth/react";
import Image from "next/image";
const navItems = [
  {
    name: "Dashboard",
    href: "/student/dashboard",
    icon: Home,
  },
  {
    name: "Profile",
    href: "/student/dashboard/profile",
    icon: User,
  },
  {
    name: "My Courses",
    href: "/student/dashboard/courses",
    icon: BookOpen,
  },
  {
    name: "My Tests",
    href: "/student/dashboard/tests",
    icon: FileCheck,
  },
  {
    name: "Study Materials",
    href: "/student/dashboard/materials",
    icon: FileText,
  },
  {
    name: "Video Lectures",
    href: "/student/dashboard/videos",
    icon: PlayCircle,
  },
];

export default function StudentSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const sidebarContent = (
    <>
      <div className="px-3 py-4">
        <Link href={"/"}>
          <div className="flex items-center mb-8 pl-2">
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
        <div className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center py-2 px-3 rounded-md text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              )}
              onClick={() => isMobile && setIsOpen(false)}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-auto px-3 py-4">
        <div className="flex items-center justify-between mb-4">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setShowLogoutDialog(true);
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>
        </div>
        <div className="bg-muted p-3 rounded-md">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{session?.user?.name}</p>
              <p className="text-xs text-muted-foreground">Student</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="fixed top-4 left-4 z-50"
          onClick={toggleSidebar}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      )}

      {/* Mobile sidebar */}
      {isMobile && (
        <div
          className={cn(
            "fixed inset-0 z-40 transform transition-transform duration-300 ease-in-out",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64 bg-background border-r flex flex-col h-full">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      {!isMobile && (
        <div className="w-64 border-r bg-background flex flex-col h-screen sticky top-0">
          {sidebarContent}
        </div>
      )}

      <LogoutDialog
        open={showLogoutDialog}
        onOpenChange={setShowLogoutDialog}
      />
    </>
  );
}
