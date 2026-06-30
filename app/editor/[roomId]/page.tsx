import { redirect } from "next/navigation"
import { getCurrentIdentity, getProjectAccess } from "@/lib/project-access"
import { AccessDenied } from "@/components/editor/access-denied"
import { WorkspaceShell } from "@/components/editor/workspace-shell"

export default async function EditorWorkspacePage({
  params,
}: {
  params: Promise<{ roomId: string }>
}) {
  const { roomId } = await params
  const { userId, email } = await getCurrentIdentity()

  if (!userId) {
    redirect("/sign-in")
  }

  const project = await getProjectAccess(roomId, userId, email)

  if (!project) {
    return <AccessDenied />
  }

  return <WorkspaceShell project={project} />
}
