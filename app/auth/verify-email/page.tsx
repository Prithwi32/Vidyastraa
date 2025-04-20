"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DarkModeButton } from "@/components/DarkModeButton"
import { Loader2 } from "lucide-react"
import { toast, ToastContainer } from "react-toastify"
import { sendVerificationEmail } from "@/app/actions/auth"
import { useSession } from "next-auth/react"
import Loader from "@/components/Loader"

export default function VerifyEmailPage() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState("")
  const router = useRouter()
  const session = useSession();

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/student/dashboard/profile");
    }
  }, [session.status, router]);

  if (session.status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-950">
        <Loader />
      </div>
    );
  }

  const handleVerifyEmail = async (e: any) => {
    e.preventDefault()
    setLoading(true)
    try {
      if(email.trim()==="")return;

      const result = await sendVerificationEmail(email)
      if (!result.success){
        return toast.error(result.message)
      }

      toast.success(result.message)

      setTimeout(() => {
        router.push("/auth/signin")
      }, 3000)
    } catch (error) {
      console.log(error)
      toast.error("Failed to send verification email. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center sm:p-4 bg-slate-100 dark:bg-slate-950">
      <ToastContainer />
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
          <div className="w-full md:w-1/2 bg-blue-50 dark:bg-slate-800 p-8 flex items-center justify-center">
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

          {/* Verify Email Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex items-center">
            <div className="w-full max-w-md mx-auto space-y-6">
              <div className="text-center space-y-2 mb-8">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Verify Your Email</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-lg mx-auto">
                  Enter your email address below and we'll send you a verification link.
                </p>
              </div>

              <form onSubmit={handleVerifyEmail} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6"
                  disabled={loading}
                >
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Send Verification Link
                </Button>
              </form>

              <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                Already verified?{" "}
                <Link href="/auth/signin" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Sign in
                </Link>
              </p>

              <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Sign up
                </Link>
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
}
