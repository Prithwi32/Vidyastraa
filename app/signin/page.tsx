"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loader from "../../components/Loader";

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
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-8 w-96 text-center">
          <Image
            src="/login.avif"
            alt="Vidyastraa Logo"
            width={200}
            height={200}
            className="mx-auto mb-4"
          />
          <h2 className="text-2xl font-semibold mb-2 text-gray-800">
            Welcome Back! 👋
          </h2>
          <p className="text-gray-600 mb-4">Sign in to continue</p>
          <button
            className={`w-full flex items-center justify-center gap-2 bg-blue-300 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={loading}
            onClick={handleLogin}
          >
            <Image src="/google.png" alt="Google Logo" width={30} height={30} />
            Continue with Google
          </button>
          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>
          {/* Footer */}
          <p className="text-gray-500 mt-4 text-sm">
            By signing in, you agree to our{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Terms & Privacy Policy
            </a>
          </p>
        </div>
      </div>
    )
  );
}
