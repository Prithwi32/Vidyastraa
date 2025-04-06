"use server";

import { prisma } from "@/lib/prisma";

export async function getAllCourses() {
    try {
        const courses = await prisma.course.findMany({
            select: {
                id: true,
                title: true,
                category: true,
            },
        });
        return { success: true, courses };
    } catch (error) {
        console.error("Error fetching courses:", error);
        return { success: false, error: "Internal Server Error" };
    }
}