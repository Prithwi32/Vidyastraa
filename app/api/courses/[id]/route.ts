import { NextResponse } from "next/server";
import{ prisma} from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const paths = url.pathname.split("/");
    const id = paths[paths.length - 1]; // Get last part of the URL as the ID

    if (!id) {
      return NextResponse.json({ error: "Course ID is required" }, { status: 400 });
    }

    console.log("Received Course ID:", id);

    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        enrolledStudents: true,
        tests: true,
      },
    });

    // console.log("Fetched Course Data:", course);

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    return NextResponse.json(course, { status: 200 });
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
