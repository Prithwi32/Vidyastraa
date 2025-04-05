import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context;

  try {
    const deletedQuestion = await prisma.question.delete({
      where: {
        id: params.id,
      },
    });

    return NextResponse.json({
      message: "Deleted successfully",
      deletedQuestion,
    });
  } catch (error) {
    console.error("Error deleting question:", error);
    return NextResponse.json(
      { error: "Failed to delete question" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  const { params } = context;

  try {
    const data = await request.json();

    const updateData: any = {
      ...data,
      ...(data.image === "" ? { image: null } : data.image !== undefined ? { image: data.image } : {}),
    };

    const updatedQuestion = await prisma.question.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json({
      message: "Updated successfully",
      updatedQuestion,
    });
  } catch (error) {
    console.error("Error updating question:", error);
    return NextResponse.json(
      { error: "Failed to update question" },
      { status: 500 }
    );
  }
}
