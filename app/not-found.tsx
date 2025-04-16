"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { AlertTriangle, Home, ArrowLeft } from "lucide-react"

export default function NotFound() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Animation variants for the pencils
  const pencilVariants = {
    initial: { rotate: 0 },
    hover: { rotate: [-2, 2, -2, 0], transition: { duration: 0.5 } },
  }

  if (!isClient) {
    return null // Prevent SSR flash
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-slate-950 transition-colors">
      <div className="max-w-md w-full text-center">
        {/* Pencil illustration */}
        <div className="relative h-40 mb-4">
          <motion.div
            className="absolute left-1/2 -translate-x-[120px] top-1/2 -translate-y-1/2"
            initial="initial"
            whileHover="hover"
            variants={pencilVariants}
          >
            <div className="relative w-32 h-8 rotate-[30deg]">
              <div className="absolute inset-0 bg-amber-400 dark:bg-amber-500 rounded-sm transform skew-y-2"></div>
              <div className="absolute left-0 top-0 bottom-0 w-6 bg-red-400 dark:bg-red-500 rounded-sm transform -skew-y-6"></div>
              <div className="absolute left-4 top-0 bottom-0 w-1 bg-slate-700 dark:bg-slate-800"></div>
              <div className="absolute left-0 top-0 h-full w-1 bg-white/20 dark:bg-white/10"></div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 dark:bg-black/20"></div>
            </div>
          </motion.div>

          <motion.div
            className="absolute left-1/2 translate-x-[20px] top-1/2 -translate-y-1/2"
            initial="initial"
            whileHover="hover"
            variants={pencilVariants}
          >
            <div className="relative w-32 h-8 -rotate-[30deg]">
              <div className="absolute inset-0 bg-amber-400 dark:bg-amber-500 rounded-sm transform -skew-y-2"></div>
              <div className="absolute right-0 top-0 bottom-0 w-6 bg-slate-800 dark:bg-slate-900 rounded-sm transform skew-y-6"></div>
              <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/20 dark:bg-white/10"></div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10 dark:bg-black/20"></div>
            </div>
          </motion.div>
        </div>

        {/* 404 Text */}
        <h1 className="text-[120px] font-bold leading-none text-slate-700 dark:text-slate-200 mb-4">404</h1>

        {/* Message */}
        <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">Uh oh! Looks like something broke.</p>

        {/* Buttons */}
        <div className="flex flex-col items-center gap-4">
          <Button
            size="lg"
            className="px-8 py-6 text-base bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
            asChild
          >
            <Link href="/">
              <Home className="mr-2 h-5 w-5" />
              Take Me Home
            </Link>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="text-slate-600 dark:text-slate-400 border-slate-300 dark:border-slate-700"
            asChild
          >
            <Link href="javascript:history.back()">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Link>
          </Button>
        </div>

        {/* Additional help text */}
        <div className="mt-12 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900/50 text-sm text-amber-800 dark:text-amber-300 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p className="text-left">
            The page you're looking for might have been removed, renamed, or is temporarily unavailable.
          </p>
        </div>
      </div>
    </div>
  )
}
