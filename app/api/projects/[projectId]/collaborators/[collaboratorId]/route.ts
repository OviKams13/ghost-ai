import { auth } from "@clerk/nextjs/server"
import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

type Context = { params: Promise<{ projectId: string; collaboratorId: string }> }

export async function DELETE(_req: NextRequest, { params }: Context) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId, collaboratorId } = await params

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  })

  if (!project) return Response.json({ error: "Not found" }, { status: 404 })
  if (project.ownerId !== userId)
    return Response.json({ error: "Forbidden" }, { status: 403 })

  const record = await prisma.projectCollaborator.findUnique({
    where: { id: collaboratorId },
    select: { projectId: true },
  })

  if (!record || record.projectId !== projectId)
    return Response.json({ error: "Not found" }, { status: 404 })

  await prisma.projectCollaborator.delete({ where: { id: collaboratorId } })

  return new Response(null, { status: 204 })
}
