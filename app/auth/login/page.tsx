"use client";

import { useState } from "react";
import Image from "next/image";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-96 text-center">
        <Image
          src="/login.avif"
          alt="EduLearn Logo"
          width={200}
          height={200}
          className="mx-auto mb-4"
        />
        <h2 className="text-2xl font-semibold mb-2">Welcome Back! 👋</h2>
        <p className="text-gray-600 mb-4">Sign in to continue</p>
        <button
          className={`w-full flex items-center justify-center gap-2 bg-blue-300 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
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
  );
}
