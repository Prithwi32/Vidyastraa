import { redirect } from "next/navigation"
import ReviewInterface from "@/components/student/tests/review-interface"

export default function ReviewPage({
  params,
}: {
  params: { id: string; resultId: string }
}) {
  if (!params.id || !params.resultId) {
    redirect("/student/dashboard/tests")
  }

  return <ReviewInterface testId={params.id} resultId={params.resultId} />
}
