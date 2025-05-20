// import ReviewInterface from "@/components/student/tests/review-interface"

// export default function ReviewPage() {
//   return <ReviewInterface />
// }


import { redirect } from "next/navigation"
import ReviewInterface from "@/components/student/tests/review-interface"

export default function ReviewPage({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: { resultId?: string }
}) {
  if (!params.id) {
    redirect("/student/dashboard/tests")
  }

  // For testing purposes, we'll use a dummy resultId if none is provided
  if (!searchParams.resultId) {
    // In a real app, you might want to redirect to the tests page
    // redirect("/student/dashboard/tests")
    // For testing, we'll just render the ReviewInterface with mock data
  }

  return <ReviewInterface />
}

