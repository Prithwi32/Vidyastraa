import { PDFDocument, StandardFonts } from "pdf-lib"
import { getTestById } from "@/lib/server/testService"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const testId = params.id

  try {
    const test = await getTestById(testId)

    if (!test) {
      return NextResponse.json({ error: "Test not found" }, { status: 404 })
    }

    const totalQuestions = test.questions.length
    const totalMarks = test.questions.reduce((sum, q) => sum + (q.marks || 0), 0)
    const subjects = test.subjects.join(", ")
    const createdDate = new Date(test.createdAt).toLocaleDateString()

    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage()
    const { width, height } = page.getSize()
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    let y = height - 50
    const lineHeight = 20
    const fontSize = 12

    // Header
    page.drawText(`Test Title: ${test.title}`, { x: 50, y, font, size: 16 })
    y -= lineHeight

    if (test.description) {
      page.drawText(`Description: ${test.description}`, {
        x: 50,
        y,
        font,
        size: fontSize,
      })
      y -= lineHeight
    }

    page.drawText(`Category: ${test.category}`, { x: 50, y, font, size: fontSize })
    y -= lineHeight

    page.drawText(`Subjects: ${subjects}`, { x: 50, y, font, size: fontSize })
    y -= lineHeight

    page.drawText(`Total Questions: ${totalQuestions}`, { x: 50, y, font, size: fontSize })
    y -= lineHeight

    page.drawText(`Total Marks: ${totalMarks}`, { x: 50, y, font, size: fontSize })
    y -= lineHeight

    page.drawText(`Created On: ${createdDate}`, { x: 50, y, font, size: fontSize })
    y -= 2 * lineHeight

    // Questions
    page.drawText(`Questions involved in test are:`, { x: 50, y, font, size: fontSize })
    y -= 1 * lineHeight

    for (const [index, q] of test.questions.entries()) {
      const question = q.question

      if (y < 100) {
        const newPage = pdfDoc.addPage()
        y = newPage.getSize().height - 50
        newPage.drawText(`Continued from previous page...`, { x: 50, y, font, size: fontSize })
        y -= lineHeight
        page = newPage
      }

      page.drawText(`${index + 1}. ${question.question}`, { x: 50, y, font, size: fontSize })
      y -= lineHeight

      question.options.forEach((opt, optIdx) => {
        page.drawText(`   ${String.fromCharCode(65 + optIdx)}. ${opt}`, {
          x: 60,
          y,
          font,
          size: fontSize - 1,
        })
        y -= 15
      })

      y -= 10
    }

    const pdfBytes = await pdfDoc.save()

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Test_${test.title}.pdf"`,
      },
    })
  } catch (error) {
    console.error("[EXPORT_TEST_PDF] Error:", error)
    return new NextResponse("Failed to export PDF", { status: 500 })
  }
}
