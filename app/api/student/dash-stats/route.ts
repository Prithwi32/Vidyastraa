// import { NextResponse } from "next/server"
// import { getServerSession } from "next-auth"
// import { NEXT_AUTH } from "@/lib/auth";
// import {prisma} from "@/lib/prisma"

// export async function GET() {
//   const session = await getServerSession(NEXT_AUTH)
//   if (!session || !session.user?.email) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
//   }

//   const user = await prisma.user.findUnique({
//     where: { email: session.user.email },
//     include: {
//       enrolledCourses: {
//         include: {
//           course: true,
//         },
//       },
//     },
//   })

//   const enrolledCoursesCount = user?.enrolledCourses.length || 0

//   const courseProgress = user?.enrolledCourses.map((ec) => ({
//     id: ec.courseId,
//     name: ec.course.title,
//     progress: ec.progress,
//   })) || []

//   const completedTestsCount = 0
//   const averageScore = 0

//   return NextResponse.json({
//     enrolledCoursesCount,
//     completedTestsCount,
//     averageScore,
//     courseProgress,
//   })
// }


import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { NEXT_AUTH } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await getServerSession(NEXT_AUTH)
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      enrolledCourses: {
        include: {
          course: true,
        },
      },
      payments: true,
    },
  })

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const enrolledCourses = user.enrolledCourses
  const enrolledCoursesCount = enrolledCourses.length
  const overallProgress = enrolledCourses.length > 0
    ? enrolledCourses.reduce((acc, ec) => acc + ec.progress, 0) / enrolledCourses.length
    : 0

  const courseProgress = enrolledCourses.map((ec) => ({
    id: ec.courseId,
    name: ec.course.title,
    progress: ec.progress,
  }))

  const completedTestsCount = 0 // Update when you implement test submissions
  const averageScore = 0 // Update when scores are stored

  const joinedDate = user.createdAt

  return NextResponse.json({
    name: user.name,
    email: user.email,
    image: session.user.image || null,
    joinedDate,
    enrolledCoursesCount,
    completedTestsCount,
    averageScore,
    courseProgress,
    overallProgress: Math.round(overallProgress),
  })
}
