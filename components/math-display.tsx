"use client"

import { useEffect, useRef } from "react"
import katex from "katex"
import "katex/dist/katex.min.css"

interface MathDisplayProps {
  math: string
  display?: boolean
  className?: string
}

export default function MathDisplay({ math, display = false, className = "" }: MathDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      katex.render(math, containerRef.current, {
        throwOnError: false,
        displayMode: display,
      })
    }
  }, [math, display])

  return <div ref={containerRef} className={className} />
}
