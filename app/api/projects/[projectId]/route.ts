import { auth } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

type Context = { params: Promise<{ projectId: string }> };

export async function PATCH(request: NextRequest, { params }: Context) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId } = await params;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  });

  if (!project) return Response.json({ error: "Not found" }, { status: 404 });
  if (project.ownerId !== userId)
    return Response.json({ error: "Forbidden" }, { status: 403 });

  let body: { name?: string } = {};
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!body.name?.trim()) {
    return Response.json({ error: "name is required" }, { status: 400 });
  }

  const updated = await prisma.project.update({
    where: { id: projectId },
    data: { name: body.name.trim() },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return Response.json({ project: updated });
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  const { userId } = await auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { projectId } = await params;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  });

  if (!project) return Response.json({ error: "Not found" }, { status: 404 });
  if (project.ownerId !== userId)
    return Response.json({ error: "Forbidden" }, { status: 403 });

  await prisma.project.delete({ where: { id: projectId } });

  return new Response(null, { status: 204 });
}
