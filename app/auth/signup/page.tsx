"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DarkModeButton } from "@/components/DarkModeButton";
import { Loader2, Eye, EyeOff } from "lucide-react";
import Loader from "@/components/Loader";
import { toast, ToastContainer } from "react-toastify";
import { signUp } from "@/app/actions/auth";

export default function SignUpPage() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();
  const session = useSession();

  useEffect(() => {
    if (session.status === "authenticated") {
      router.push("/");
    }
  }, [session.status, router]);

  if (session.status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-100 dark:bg-slate-950">
        <Loader/>
      </div>
    );
  }

  const validatePassword = () => {
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handleSignUp = async (e:any) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    if (!agreeTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    setLoading(true);
    try {
     const result = await signUp(name, email, password);
      if (!result?.success) {
        toast.error(result.message);
      }else{
        toast.success(result.message);
        router.push("/auth/signin");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while signing up");
    } finally {
      setLoading(false);
    }
  };

  return (
    session.status === "unauthenticated" && (
      <div className="min-h-screen flex items-center justify-center sm:p-4 bg-slate-100 dark:bg-slate-950">
        <ToastContainer/>
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

            {/* Sign Up Form */}
            <div className="w-full md:w-1/2 p-8 md:p-12 flex items-center">
              <div className="w-full max-w-md mx-auto space-y-6">
                <div className="text-center space-y-2 mb-8">
                  <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                    Create your account
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm max-w-lg mx-auto">
                    Join thousands of aspirants learning smarter and achieving
                    success every day!
                  </p>
                </div>

                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

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

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Must be at least 6 characters
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    {passwordError && (
                      <p className="text-xs text-red-500">{passwordError}</p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="terms"
                      checked={agreeTerms}
                      onCheckedChange={(checked) =>
                        setAgreeTerms(checked === true)
                      }
                      required
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer"
                    >
                      I agree to the{" "}
                      <Link
                        href="/terms"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacy"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Create Account
                  </Button>
                </form>
                <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                  Already have an account?{" "}
                  <Link
                    href="/auth/signin"
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Sign in
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
  );
}
