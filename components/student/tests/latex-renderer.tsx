import { InlineMath, BlockMath } from "react-katex"

interface LatexRendererProps {
  content: string
}

export default function LatexRenderer({ content }: LatexRendererProps) {
  if (!content) return null

  // Split content by LaTeX blocks (either inline $...$ or block $$...$$)
  const parts = content.split(/(\$[^$]*\$)/g)

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("$") && part.endsWith("$")) {
          const latex = part.slice(1, -1)
          // Check if it's block math (double $$)
          if (part.startsWith("$$") && part.endsWith("$$")) {
            return <BlockMath key={index} math={latex} />
          }
          try {
            return <InlineMath key={index} math={latex} />
          } catch (e) {
            console.error("Error rendering LaTeX:", e)
            return <span key={index}>{part}</span>
          }
        }
        return <span key={index}>{part}</span>
      })}
    </>
  )
}
