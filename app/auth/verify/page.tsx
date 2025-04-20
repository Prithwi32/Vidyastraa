"use client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Link from "next/link";
import { verifyEmail } from "@/app/actions/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Mail,
  Loader,
} from "lucide-react";
import { motion } from "framer-motion";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading"
  );

  useEffect(() => {
    if (!token) {
      setStatus("error");
      return;
    }

    const verify = async () => {
      try {
        const result = await verifyEmail(token);
        if (!result.success) throw new Error(result.message);
        setStatus("success");
        toast.success("Email verified successfully!");
      } catch (error) {
        setStatus("error");
        toast.error(
          error instanceof Error ? error.message : "Verification failed"
        );
      }
    };

    verify();
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-white dark:from-slate-950 dark:to-slate-900">
      <Card className="w-full max-w-md border-slate-200 dark:border-slate-800 shadow-lg">
        <CardHeader className="space-y-1 text-center pb-2">
          <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <Mail className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100">
            {status === "loading" && "Verifying Your Email"}
            {status === "success" && "Email Verified!"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription className="text-slate-500 dark:text-slate-400">
            {status === "loading" &&
              "Please wait while we confirm your email address"}
            {status === "success" &&
              "Your email has been successfully verified"}
            {status === "error" &&
              "The verification link is invalid or has expired"}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {status === "loading" && (
            <motion.div
              className="flex justify-center py-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Loader2 className="h-12 w-12 text-blue-500 dark:text-blue-400 animate-spin" />
            </motion.div>
          )}

          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Alert className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300">
                <CheckCircle2 className="h-5 w-5" />
                <AlertTitle>Success!</AlertTitle>
                <AlertDescription>
                  Your email address has been verified. You can now sign in to
                  your account.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}

          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300">
                <AlertTriangle className="h-5 w-5" />
                <AlertTitle>Verification Failed</AlertTitle>
                <AlertDescription>
                  We couldn't verify your email. The link may be invalid or
                  expired.
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </CardContent>

        <CardFooter className="flex justify-center pt-2 pb-6">
          {(status === "success" || status === "error") && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button
                asChild
                className="px-6 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
              >
                <Link href="/auth/signin">
                  {status === "success"
                    ? "Proceed to Sign In"
                    : "Return to Sign In"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
