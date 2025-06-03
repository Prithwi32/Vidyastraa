"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Calculator, X } from "lucide-react"
import MathDisplay from "@/components/math-display"

interface MathInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  rows?: number
  multiline?: boolean
  label?: string
}

const mathSymbols = [
  // Basic operations (no $ for simple symbols)
  { symbol: "+", latex: "+", label: "Plus" },
  { symbol: "−", latex: "-", label: "Minus" },
  { symbol: "×", latex: "$\\times$", label: "Multiply" },
  { symbol: "÷", latex: "$\\div$", label: "Divide" },
  { symbol: "=", latex: "=", label: "Equals" },
  { symbol: "≠", latex: "$\\neq$", label: "Not equal" },
  { symbol: "≈", latex: "$\\approx$", label: "Approximately" },

  // Fractions and powers
  { symbol: "x²", latex: "^2", label: "Square" },
  { symbol: "x³", latex: "^3", label: "Cube" },
  { symbol: "xⁿ", latex: "^{n}", label: "Power" },
  { symbol: "x₀", latex: "_0", label: "Subscript" },
  { symbol: "½", latex: "$\\frac{1}{2}$", label: "Half" },
  { symbol: "a/b", latex: "$\\frac{a}{b}$", label: "Fraction" },
  { symbol: "√", latex: "$\\sqrt{}$", label: "Square root" },
  { symbol: "∛", latex: "$\\sqrt[3]{}$", label: "Cube root" },
  { symbol: "ⁿ√", latex: "$\\sqrt[n]{}$", label: "Nth root" },

  // Greek letters (all in $)
  { symbol: "α", latex: "$\\alpha$", label: "Alpha" },
  { symbol: "β", latex: "$\\beta$", label: "Beta" },
  { symbol: "γ", latex: "$\\gamma$", label: "Gamma" },
  { symbol: "δ", latex: "$\\delta$", label: "Delta" },
  { symbol: "ε", latex: "$\\epsilon$", label: "Epsilon" },
  { symbol: "θ", latex: "$\\theta$", label: "Theta" },
  { symbol: "λ", latex: "$\\lambda$", label: "Lambda" },
  { symbol: "μ", latex: "$\\mu$", label: "Mu" },
  { symbol: "π", latex: "$\\pi$", label: "Pi" },
  { symbol: "σ", latex: "$\\sigma$", label: "Sigma" },
  { symbol: "φ", latex: "$\\phi$", label: "Phi" },
  { symbol: "ω", latex: "$\\omega$", label: "Omega" },

  // Trigonometry
  { symbol: "sin", latex: "$\\sin$", label: "Sine" },
  { symbol: "cos", latex: "$\\cos$", label: "Cosine" },
  { symbol: "tan", latex: "$\\tan$", label: "Tangent" },
  { symbol: "csc", latex: "$\\csc$", label: "Cosecant" },
  { symbol: "sec", latex: "$\\sec$", label: "Secant" },
  { symbol: "cot", latex: "$\\cot$", label: "Cotangent" },
  // Inverse trig functions
  { symbol: "sin⁻¹", latex: "$\\sin^{-1}$", label: "Inverse sine" },
  { symbol: "cos⁻¹", latex: "$\\cos^{-1}$", label: "Inverse cosine" },
  { symbol: "tan⁻¹", latex: "$\\tan^{-1}$", label: "Inverse tangent" },
  { symbol: "csc⁻¹", latex: "$\\csc^{-1}$", label: "Inverse cosecant" },
  { symbol: "sec⁻¹", latex: "$\\sec^{-1}$", label: "Inverse secant" },
  { symbol: "cot⁻¹", latex: "$\\cot^{-1}$", label: "Inverse cotangent" },
  { symbol: "log", latex: "$\\log$", label: "Logarithm" },
  { symbol: "ln", latex: "$\\ln$", label: "Natural log" },

  // Calculus
  { symbol: "∫", latex: "$\\int$", label: "Integral" },
  { symbol: "∂", latex: "$\\partial$", label: "Partial derivative" },
  { symbol: "∞", latex: "$\\infty$", label: "Infinity" },
  { symbol: "∑", latex: "$\\sum$", label: "Sum" },
  { symbol: "∏", latex: "$\\prod$", label: "Product" },
  { symbol: "lim", latex: "$\\lim$", label: "Limit" },
  { symbol: "∇", latex: "$\\nabla$", label: "Gradient" },
  { symbol: "∮", latex: "$\\oint$", label: "Closed integral" },

  // Geometry
  { symbol: "°", latex: "$^\\circ$", label: "Degree" },
  { symbol: "∠", latex: "$\\angle$", label: "Angle" },
  { symbol: "⊥", latex: "$\\perp$", label: "Perpendicular" },
  { symbol: "∥", latex: "$\\parallel$", label: "Parallel" },
  { symbol: "△", latex: "$\\triangle$", label: "Triangle" },

  // Sets and logic
  { symbol: "∈", latex: "$\\in$", label: "Element of" },
  { symbol: "∉", latex: "$\\notin$", label: "Not element of" },
  { symbol: "⊂", latex: "$\\subset$", label: "Subset" },
  { symbol: "∪", latex: "$\\cup$", label: "Union" },
  { symbol: "∩", latex: "$\\cap$", label: "Intersection" },
  { symbol: "∅", latex: "$\\emptyset$", label: "Empty set" },

  // Comparison
  { symbol: "<", latex: "<", label: "Less than" },
  { symbol: ">", latex: ">", label: "Greater than" },
  { symbol: "≤", latex: "$\\leq$", label: "Less than or equal" },
  { symbol: "≥", latex: "$\\geq$", label: "Greater than or equal" },

  // Brackets
  { symbol: "()", latex: "()", label: "Parentheses" },
  { symbol: "[]", latex: "[]", label: "Square brackets" },
  { symbol: "{}", latex: "$\\{\\}$", label: "Curly brackets" },
  { symbol: "||", latex: "$|\\quad|$", label: "Absolute value" },

  // Chemistry & Physics
  { symbol: "→", latex: "$\\rightarrow$", label: "Right arrow" },
  { symbol: "⇌", latex: "$\\rightleftharpoons$", label: "Equilibrium" },
  { symbol: "↑", latex: "$\\uparrow$", label: "Gas" },
  { symbol: "↓", latex: "$\\downarrow$", label: "Precipitate" },
  { symbol: "Δ", latex: "$\\Delta$", label: "Delta (heat/change)" },
  { symbol: "⇋", latex: "$\\leftrightharpoons$", label: "Reversible reaction" },
  { symbol: "⚡", latex: "$\\lightning$", label: "Electricity" },
  { symbol: "Na⁺", latex: "$Na^+$", label: "Sodium ion" },
  { symbol: "Cl⁻", latex: "$Cl^-$", label: "Chloride ion" },
  { symbol: "α", latex: "$\\alpha$", label: "Alpha particle" },
  { symbol: "β", latex: "$\\beta$", label: "Beta particle" },
  { symbol: "⁰₋₁e", latex: "$^0_{-1}e$", label: "Beta decay" },
  { symbol: "σ", latex: "$\\sigma$", label: "Sigma bond" },
  { symbol: "π", latex: "$\\pi$", label: "Pi bond" },
  { symbol: "sp³", latex: "$sp^3$", label: "sp³ Hybridization" },
  { symbol: "·", latex: "$\\cdot$", label: "Dot product" },
  { symbol: "×", latex: "$\\times$", label: "Cross product" },
  { symbol: "→a", latex: "$\\vec{a}$", label: "Vector" },
  { symbol: "ℏ", latex: "$\\hbar$", label: "Reduced Planck constant" },
  { symbol: "Ω", latex: "$\\Omega$", label: "Ohm" },
  { symbol: "Å", latex: "$\\AA$", label: "Angstrom" },
  { symbol: "°C", latex: "$^\\circ\\text{C}$", label: "Degree Celsius" },
  { symbol: "H₂O", latex: "$H_2O$", label: "Water" },
  { symbol: "CO₂", latex: "$CO_2$", label: "Carbon dioxide" },
  { symbol: "‖a‖", latex: "$\\|a\\|$", label: "Vector norm" },
  { symbol: "Aᵀ", latex: "$A^\\top$", label: "Matrix transpose" },
  { symbol: "⊗", latex: "$\\otimes$", label: "Tensor product" },
  { symbol: "μ₀", latex: "$\\mu_0$", label: "Permeability" },
  { symbol: "ε₀", latex: "$\\epsilon_0$", label: "Permittivity" },
  { symbol: "ψ", latex: "$\\psi$", label: "Wave function" },
  { symbol: "ν", latex: "$\\nu$", label: "Frequency" },
]

const categoryGroups = {
  Basic: mathSymbols.slice(0, 7),
  "Powers & Roots": mathSymbols.slice(7, 16),
  "Greek Letters": mathSymbols.slice(16, 28),
  Functions: mathSymbols.slice(28, 40),
  Calculus: mathSymbols.slice(40, 48),
  Geometry: mathSymbols.slice(48, 53),
  Sets: mathSymbols.slice(53, 59),
  Comparison: mathSymbols.slice(59, 63),
  Brackets: mathSymbols.slice(63, 67),
  "Chemistry&Physics": mathSymbols.slice(67, 101),
}

export default function MathInput({
  value,
  onChange,
  placeholder = "Enter text with math expressions...",
  className = "",
  rows = 3,
  multiline = false,
  label,
}: MathInputProps) {
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [activeCategory, setActiveCategory] = useState("Basic")
  const [cursorPosition, setCursorPosition] = useState(0)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  const insertSymbol = (latex: string) => {
    const input = inputRef.current
    if (!input) return

    const start = input.selectionStart || 0
    const end = input.selectionEnd || 0
    const newValue = value.slice(0, start) + latex + value.slice(end)

    onChange(newValue)

    // Set cursor position after the inserted symbol
    setTimeout(() => {
      const newPosition = start + latex.length
      input.setSelectionRange(newPosition, newPosition)
      input.focus()
    }, 0)
  }

  const insertInlineMath = () => {
    const input = inputRef.current
    if (!input) return

    const start = input.selectionStart || 0
    const end = input.selectionEnd || 0
    const selectedText = value.slice(start, end)
    const mathExpression = selectedText ? `$${selectedText}$` : "$|$"
    const newValue = value.slice(0, start) + mathExpression + value.slice(end)

    onChange(newValue)

    setTimeout(() => {
      const newPosition = selectedText ? start + mathExpression.length : start + 1
      input.setSelectionRange(newPosition, newPosition)
      input.focus()
    }, 0)
  }

  const insertDisplayMath = () => {
    const input = inputRef.current
    if (!input) return

    const start = input.selectionStart || 0
    const end = input.selectionEnd || 0
    const selectedText = value.slice(start, end)
    const mathExpression = selectedText ? `$$${selectedText}$$` : "$$|$$"
    const newValue = value.slice(0, start) + mathExpression + value.slice(end)

    onChange(newValue)

    setTimeout(() => {
      const newPosition = selectedText ? start + mathExpression.length : start + 2
      input.setSelectionRange(newPosition, newPosition)
      input.focus()
    }, 0)
  }

  // Helper function to render math content
  const renderMathContent = (text: string) => {
    if (!text) return null

    const parts = text.split(/(\$\$.*?\$\$|\$.*?\$)/g)

    return (
      <>
        {parts.map((part, index) => {
          if (part.startsWith("$$") && part.endsWith("$$")) {
            const math = part.slice(2, -2)
            return <MathDisplay key={index} math={math} display={true} className="my-2" />
          } else if (part.startsWith("$") && part.endsWith("$")) {
            const math = part.slice(1, -1)
            return <MathDisplay key={index} math={math} display={false} className="inline" />
          } else {
            return <span key={index}>{part}</span>
          }
        })}
      </>
    )
  }

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}

      <div className="relative">
        {multiline ? (
          <Textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`${className} pr-10`}
            rows={rows}
            onSelect={(e) => {
              const target = e.target as HTMLTextAreaElement
              setCursorPosition(target.selectionStart || 0)
            }}
          />
        ) : (
          <Input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`${className} pr-10`}
            onSelect={(e) => {
              const target = e.target as HTMLInputElement
              setCursorPosition(target.selectionStart || 0)
            }}
          />
        )}

        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1 h-8 w-8 p-0"
          onClick={() => setShowKeyboard(!showKeyboard)}
        >
          <Calculator className="h-4 w-4" />
        </Button>
      </div>

      {/* Math Keyboard */}
      {showKeyboard && (
        <Card className="border shadow-lg">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium">Math Keyboard</h3>
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowKeyboard(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick Math Wrapper Buttons */}
            <div className="flex gap-2 mb-3">
              <Button type="button" variant="outline" size="sm" onClick={insertInlineMath} className="text-xs">
                Inline Math ($)
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={insertDisplayMath} className="text-xs">
                Display Math ($$)
              </Button>
            </div>

            {/* Category Tabs */}
            <div className="flex flex-wrap gap-1 mb-3">
              {Object.keys(categoryGroups).map((category) => (
                <Button
                  key={category}
                  type="button"
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                  className="text-xs"
                >
                  {category}
                </Button>
              ))}
            </div>

            {/* Symbol Grid */}
            <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto">
              {categoryGroups[activeCategory as keyof typeof categoryGroups]?.map((item, index) => (
                <Button
                  key={index}
                  type="button"
                  variant="outline"
                  className="h-10 text-sm font-mono"
                  onClick={() => insertSymbol(item.latex)}
                  title={item.label}
                >
                  {item.symbol}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview */}
      {value && (
        <div className="mt-2 p-3 border rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Preview:</p>
          <div className="math-preview">{renderMathContent(value)}</div>
        </div>
      )}
    </div>
  )
}
