"use client";
import type React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import StudentSidebar from "@/components/student/Sidebar";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    setLoader(true);
    handleAuth();
  }, [session]);

  const handleAuth = () => {
    if (session.status === "unauthenticated") return router.push("/auth/signin");
    else if (
      session.status === "authenticated" &&
      session.data.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL
    )
      return router.push("/admin/dashboard");
    else setLoader(false);
  };

  const isTestTakingPage = pathname?.match(/^\/student\/dashboard\/tests\/[^\/]+$/);

  if (loader)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader />
      </div>
    );

  return (
    <div>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <div className="flex min-h-screen">
          {!isTestTakingPage && <StudentSidebar />}
          <div className={`flex-1 flex flex-col ${isTestTakingPage ? "" : "p-6"}`}>
            {children}
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}