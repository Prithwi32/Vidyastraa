"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  ChevronDown,
  ClipboardList,
  CreditCard,
  FileQuestion,
  Home,
  LogOut,
  Menu,
  PlusCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    href: string;
    title: string;
    icon?: React.ReactNode;
    submenu?: {
      href: string;
      title: string;
      icon?: React.ReactNode;
    }[];
  }[];
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState<string | null>(null);

  const toggleSubmenu = (title: string) => {
    if (open === title) {
      setOpen(null);
    } else {
      setOpen(title);
    }
  };

  const items = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: <Home className="mr-2 h-4 w-4" />,
    },
    {
      title: "Tests",
      href: "#",
      icon: <ClipboardList className="mr-2 h-4 w-4" />,
      submenu: [
        {
          title: "Create Test",
          href: "/admin/dashboard/tests/create",
          icon: <PlusCircle className="mr-2 h-4 w-4" />,
        },
        {
          title: "View Tests",
          href: "/admin/dashboard/tests",
          icon: <ClipboardList className="mr-2 h-4 w-4" />,
        },
      ],
    },
    {
      title: "Questions",
      href: "/admin/dashboard/questions",
      icon: <FileQuestion className="mr-2 h-4 w-4" />,
    },
    {
      title: "Payments",
      href: "/admin/dashboard/payments",
      icon: <CreditCard className="mr-2 h-4 w-4" />,
    },
    {
      title: "Courses",
      href: "/admin/dashboard/courses",
      icon: <BookOpen className="mr-2 h-4 w-4" />,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 border-b bg-blue-600 text-white">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2 font-bold text-xl">
            <BookOpen className="h-6 w-6" />
            <span>Admin Dashboard</span>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-white hover:bg-blue-700"
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-0">
              <MobileSidebar items={items} />
            </SheetContent>
          </Sheet>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 flex-col border-r bg-slate-50 md:flex">
          <ScrollArea className="flex-1">
            <div className="flex flex-col gap-1 p-4">
              <SidebarNav items={items} />
              <div className="mt-auto pt-4">
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </ScrollArea>
        </aside>
        <main className="flex-1 overflow-y-auto bg-white">
          <div className="container py-6">{children}</div>
        </main>
      </div>
    </div>
  );
}

function SidebarNav({ items, className, ...props }: SidebarNavProps) {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (title: string) => {
    if (openSubmenu === title) {
      setOpenSubmenu(null);
    } else {
      setOpenSubmenu(title);
    }
  };

  return (
    <nav className={cn("flex flex-col gap-1", className)} {...props}>
      {items.map((item) => {
        const isActive =
          item.href === pathname || pathname.startsWith(item.href);
        const hasSubmenu = item.submenu && item.submenu.length > 0;

        return (
          <div key={item.href} className="flex flex-col">
            {hasSubmenu ? (
              <button
                onClick={() => toggleSubmenu(item.title)}
                className={cn(
                  "flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium hover:bg-blue-100 hover:text-blue-700",
                  isActive ? "bg-blue-100 text-blue-700" : "text-slate-700"
                )}
              >
                <div className="flex items-center">
                  {item.icon}
                  {item.title}
                </div>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    openSubmenu === item.title ? "rotate-180" : ""
                  )}
                />
              </button>
            ) : (
              <Link
                href={item.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-blue-100 hover:text-blue-700",
                  isActive ? "bg-blue-100 text-blue-700" : "text-slate-700"
                )}
              >
                {item.icon}
                {item.title}
              </Link>
            )}
            {hasSubmenu && openSubmenu === item.title && (
              <div className="ml-4 mt-1 flex flex-col gap-1 border-l pl-2">
                {item.submenu?.map((subItem) => {
                  const isSubActive = subItem.href === pathname;
                  return (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={cn(
                        "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-blue-100 hover:text-blue-700",
                        isSubActive
                          ? "bg-blue-100 text-blue-700"
                          : "text-slate-700"
                      )}
                    >
                      {subItem.icon}
                      {subItem.title}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

function MobileSidebar({ items }: SidebarNavProps) {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const toggleSubmenu = (title: string) => {
    if (openSubmenu === title) {
      setOpenSubmenu(null);
    } else {
      setOpenSubmenu(title);
    }
  };

  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex h-16 items-center border-b px-6">
        <div className="flex items-center gap-2 font-bold text-xl text-blue-600">
          <BookOpen className="h-6 w-6" />
          <span>Admin Dashboard</span>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="flex flex-col gap-1 p-4">
          <SidebarNav items={items} />
          <div className="mt-auto pt-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
