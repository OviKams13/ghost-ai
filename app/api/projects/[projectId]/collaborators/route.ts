import { auth, clerkClient, currentUser } from "@clerk/nextjs/server"
import { NextRequest } from "next/server"
import { prisma } from "@/lib/prisma"

type Context = { params: Promise<{ projectId: string }> }

interface CollaboratorInfo {
  id: string
  email: string
  displayName: string | null
  avatarUrl: string | null
}

async function enrichEmails(
  emails: string[]
): Promise<Record<string, { displayName: string | null; avatarUrl: string | null }>> {
  if (emails.length === 0) return {}
  const clerk = await clerkClient()
  const { data: users } = await clerk.users.getUserList({
    emailAddress: emails,
    limit: 100,
  })
  const map: Record<string, { displayName: string | null; avatarUrl: string | null }> = {}
  for (const user of users) {
    const primary = user.emailAddresses.find(
      (e) => e.id === user.primaryEmailAddressId
    )?.emailAddress
    if (primary) {
      map[primary] = {
        displayName: user.fullName ?? user.firstName ?? null,
        avatarUrl: user.imageUrl ?? null,
      }
    }
  }
  return map
}

export async function GET(_req: NextRequest, { params }: Context) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await params

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: {
      ownerId: true,
      collaborators: { select: { id: true, email: true }, orderBy: { createdAt: "asc" } },
    },
  })

  if (!project) return Response.json({ error: "Not found" }, { status: 404 })

  if (project.ownerId !== userId) {
    const user = await currentUser()
    const email = user?.primaryEmailAddress?.emailAddress ?? null
    const isCollaborator = email
      ? project.collaborators.some((c) => c.email === email)
      : false
    if (!isCollaborator) return Response.json({ error: "Forbidden" }, { status: 403 })
  }

  const emails = project.collaborators.map((c) => c.email)
  const clerkData = await enrichEmails(emails)

  const collaborators: CollaboratorInfo[] = project.collaborators.map((c) => ({
    id: c.id,
    email: c.email,
    displayName: clerkData[c.email]?.displayName ?? null,
    avatarUrl: clerkData[c.email]?.avatarUrl ?? null,
  }))

  return Response.json({ collaborators })
}

export async function POST(req: NextRequest, { params }: Context) {
  const { userId } = await auth()
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 })

  const { projectId } = await params

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  })

  if (!project) return Response.json({ error: "Not found" }, { status: 404 })
  if (project.ownerId !== userId)
    return Response.json({ error: "Forbidden" }, { status: 403 })

  let body: { email?: string } = {}
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "Invalid body" }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: "Valid email is required" }, { status: 400 })
  }

  // Prevent inviting self (check owner email)
  const owner = await currentUser()
  const ownerEmail = owner?.primaryEmailAddress?.emailAddress?.toLowerCase()
  if (ownerEmail === email) {
    return Response.json({ error: "You cannot invite yourself" }, { status: 400 })
  }

  try {
    const record = await prisma.projectCollaborator.create({
      data: { projectId, email },
      select: { id: true, email: true },
    })

    const clerkData = await enrichEmails([record.email])

    const collaborator: CollaboratorInfo = {
      id: record.id,
      email: record.email,
      displayName: clerkData[record.email]?.displayName ?? null,
      avatarUrl: clerkData[record.email]?.avatarUrl ?? null,
    }

    return Response.json({ collaborator }, { status: 201 })
  } catch (err: unknown) {
    if (
      err instanceof Error &&
      err.message.includes("Unique constraint")
    ) {
      return Response.json({ error: "Already a collaborator" }, { status: 409 })
    }
    throw err
  }
}
