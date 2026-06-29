"use client"

import { useState } from "react"
import { EditorNavbar } from "./editor-navbar"
import { ProjectSidebar } from "./project-sidebar"
import { ProjectDialogs } from "./project-dialogs"
import { EditorContext } from "./editor-context"
import { useProjectActions } from "@/hooks/use-project-actions"
import type { Project } from "@/lib/projects"

interface EditorShellProps {
  children: React.ReactNode
  myProjects: Project[]
  sharedProjects: Project[]
}

export function EditorShell({ children, myProjects, sharedProjects }: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const actions = useProjectActions()

  return (
    <EditorContext.Provider value={{ openCreateProject: actions.openCreate }}>
      <div className="h-screen overflow-hidden bg-base">
        <EditorNavbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          myProjects={myProjects}
          sharedProjects={sharedProjects}
          onNewProject={actions.openCreate}
          onRenameProject={actions.openRename}
          onDeleteProject={actions.openDelete}
        />
        <ProjectDialogs
          openDialog={actions.openDialog}
          selectedProject={actions.selectedProject}
          projectName={actions.projectName}
          roomIdPreview={actions.roomIdPreview}
          isLoading={actions.isLoading}
          onNameChange={actions.setProjectName}
          onClose={actions.close}
          onSubmitCreate={actions.submitCreate}
          onSubmitRename={actions.submitRename}
          onSubmitDelete={actions.submitDelete}
        />
        <main className="h-full overflow-hidden pt-12">{children}</main>
      </div>
    </EditorContext.Provider>
  )
}
