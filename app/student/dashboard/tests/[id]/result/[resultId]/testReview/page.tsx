import { redirect } from "next/navigation"
import ReviewInterface from "@/components/student/tests/review-interface"

export default async function ReviewPage({
  params,
}: {
  params: { id: string; resultId: string }
}) {
  // Add await to ensure params are resolved
  const { id, resultId } = params

  if (!id || !resultId) {
    redirect("/student/dashboard/tests")
  }

  return <ReviewInterface testId={id} resultId={resultId} />
}