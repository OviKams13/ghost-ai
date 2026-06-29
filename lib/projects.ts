import { prisma } from "@/lib/prisma";

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  isOwned: boolean;
}

export async function getOwnedProjects(userId: string): Promise<Project[]> {
  const rows = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      description: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return rows.map((p) => ({
    ...p,
    status: p.status as string,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
    isOwned: true,
  }));
}

export async function getSharedProjects(email: string): Promise<Project[]> {
  const rows = await prisma.projectCollaborator.findMany({
    where: { email },
    orderBy: { createdAt: "desc" },
    include: {
      project: {
        select: {
          id: true,
          name: true,
          description: true,
          status: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });
  return rows.map((c) => ({
    ...c.project,
    status: c.project.status as string,
    createdAt: c.project.createdAt.toISOString(),
    updatedAt: c.project.updatedAt.toISOString(),
    isOwned: false,
  }));
}
