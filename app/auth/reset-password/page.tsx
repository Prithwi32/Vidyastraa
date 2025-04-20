"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DarkModeButton } from "@/components/DarkModeButton";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Get token from URL query parameter
    const tokenParam = searchParams.get("token");
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      // If no token is provided, redirect to forgot password page
      toast.error("Invalid or missing reset token");
      setTimeout(() => {
        router.push("/auth/forgot-password");
      }, 2000);
    }
  }, [searchParams, router]);

  const validatePassword = () => {
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return false;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }

    setPasswordError("");
    return true;
  };

  const handleResetPassword = async (e: any) => {
    e.preventDefault();

    if (!validatePassword()) {
      return;
    }

    setLoading(true);
    try {
      // Here you would typically call your API to reset the password
      // For example:
      // const response = await fetch('/api/auth/reset-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token, newPassword }),
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success(
        "Password reset successful! You can now sign in with your new password."
      );

      // Redirect to sign in page after a delay
      setTimeout(() => {
        router.push("/auth/signin");
      }, 3000);
    } catch (error) {
      console.log(error);
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

          {/* Reset Password Form */}
          <div className="w-full md:w-1/2 p-8 md:p-12 flex items-center">
            <div className="w-full max-w-md mx-auto space-y-6">
              <div className="text-center space-y-2 mb-8">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">
                  Reset Your Password
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm max-w-lg mx-auto">
                  Create a new password for your account. Make sure it's strong
                  and secure.
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Must be at least 8 characters
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

                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-6"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  Reset Password
                </Button>
              </form>

              <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                Remember your password?{" "}
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
  );
}
