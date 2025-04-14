"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "@/components/Loader";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { DarkModeButton } from "@/components/DarkModeButton";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/");
    }
  }, [session.status, router]);

  if (session.status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <Loader size={12} />
      </div>
    );
  }

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await signIn("google", {
        redirect: false,
        callbackUrl: "/student/dashboard",
      });

      if (result?.error) {
        console.log(result.error);
      } else {
        router.push(result?.url || "/");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    session.status === "unauthenticated" && (
      <div className="min-h-screen flex items-center justify-center sm:p-4 bg-slate-100 dark:bg-slate-950">
        {/* Single Card Container */}
        <div className="w-full max-md:h-screen max-w-6xl overflow-y-auto overflow-x-hidden sm:rounded-2xl shadow-xl bg-white dark:bg-slate-900 transition-colors duration-300 flex flex-col justify-between">
          {/* Navigation */}
          <header className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
            <nav className="flex items-center justify-between">
              <div className="flex items-center">
                <Link href="/" className="flex items-center space-x-2 group">
                  <div className="relative w-10 h-10 transition-transform duration-200 group-hover:scale-110">
                    <Image
                      src="/logo.jpeg"
                      alt="Vidyastraa Logo"
                      width={40}
                      height={40}
                      className="object-contain rounded-full"
                    />
                  </div>
                  <span className="font-bold text-2xl text-yellow-600 group-hover:text-yellow-500 transition-colors">
                    Vidyastraa
                  </span>
                </Link>
              </div>
              <div className="hidden md:flex items-center font-medium text-sm space-x-6">
                <Link
                  href="/"
                  className="text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/about"
                  className="text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  className="text-slate-700 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400 transition-colors"
                >
                  Contact
                </Link>
                <DarkModeButton />
              </div>
            </nav>
          </header>

          {/* Main Content */}
          <main className="flex flex-col md:flex-row">
            {/* Illustration */}
            <div className="w-full md:w-1/2 bg-blue-50 dark:bg-slate-900 p-8 flex items-center justify-center">
              <div className="relative w-full max-w-md aspect-square">
                <Image
                  src="/signin.png"
                  alt="Educational illustration"
                  fill
                  className="object-contain scale-125"
                  priority
                />
              </div>
            </div>

            {/* Sign In Form */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex items-center">
              <div className="w-full max-w-md mx-auto space-y-3">
                <div className="text-center space-y-2 mb-8">
                  <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    Sign in to Vidyastraa
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm max-w-lg text-center">
                   Master your dream exams with top-rated courses, smart test series, and expert guidance. Join thousands of aspirants learning smarter and achieving success every day!
                  </p>
                </div>

                <Button className="w-full bg-white hover:bg-slate-50 text-slate-800 dark:border border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 py-6 " onClick={handleLogin}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="w-5 h-5"
                  >
                    <path
                      fill="#EA4335"
                      d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
                    />
                    <path
                      fill="#34A853"
                      d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2970142 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"
                    />
                    <path
                      fill="#4A90E2"
                      d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
                    />
                  </svg>
                  Continue with Google
                </Button>

                <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                  By signing in, you agree to our{" "}
                  <span className="text-blue-600 dark:text-blue-400 hover:underline">
                    Terms & Privacy Policy
                  </span>
                </p>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="px-6 py-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              © 2025 Vidyastraa. All rights reserved.
            </p>
          </footer>
        </div>
      </div>
    )
  );
}
