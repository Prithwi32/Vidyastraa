import { InlineMath, BlockMath } from "react-katex";

interface LatexRendererProps {
  content: string;
}

export default function LatexRenderer({ content }: LatexRendererProps) {
  if (!content) return null;

  // Split content by LaTeX blocks (either inline $...$ or block $$...$$)
  const parts = String(content).split(/(\${1,2}[^$]+\${1,2})/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("$$") && part.endsWith("$$")) {
          const latex = part.slice(2, -2);
          return <BlockMath key={index} math={latex} />;
        }
        if (part.startsWith("$") && part.endsWith("$")) {
          const latex = part.slice(1, -1);
          try {
            return <InlineMath key={index} math={latex} />;
          } catch (e) {
            console.error("Error rendering LaTeX:", e);
            return <span key={index}>{part}</span>;
          }
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}
