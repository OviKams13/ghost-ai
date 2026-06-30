import { auth, currentUser } from "@clerk/nextjs/server"
import { prisma } from "@/lib/prisma"

export interface ProjectSummary {
  id: string
  name: string
  ownerId: string
}

export async function getCurrentIdentity(): Promise<{
  userId: string | null
  email: string | null
}> {
  const { userId } = await auth()
  if (!userId) return { userId: null, email: null }
  const user = await currentUser()
  const email = user?.primaryEmailAddress?.emailAddress ?? null
  return { userId, email }
}

export async function getProjectAccess(
  projectId: string,
  userId: string,
  email: string | null
): Promise<ProjectSummary | null> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      id: true,
      name: true,
      ownerId: true,
      collaborators: { select: { email: true } },
    },
  })

  if (!project) return null

  const isOwner = project.ownerId === userId
  const isCollaborator = email
    ? project.collaborators.some((c) => c.email === email)
    : false

  if (!isOwner && !isCollaborator) return null

  return { id: project.id, name: project.name, ownerId: project.ownerId }
}
