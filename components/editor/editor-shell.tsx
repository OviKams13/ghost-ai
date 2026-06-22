"use client"

import { useState } from "react"
import { EditorNavbar } from "./editor-navbar"
import { ProjectSidebar } from "./project-sidebar"
import { ProjectDialogs } from "./project-dialogs"
import { EditorContext } from "./editor-context"
import { useProjectDialogs } from "@/hooks/use-project-dialogs"

interface EditorShellProps {
  children: React.ReactNode
}

export function EditorShell({ children }: EditorShellProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const dialogs = useProjectDialogs()

  return (
    <EditorContext.Provider value={{ openCreateProject: dialogs.openCreate }}>
      <div className="h-screen overflow-hidden bg-base">
        <EditorNavbar
          isSidebarOpen={isSidebarOpen}
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          myProjects={dialogs.myProjects}
          sharedProjects={dialogs.sharedProjects}
          onNewProject={dialogs.openCreate}
          onRenameProject={dialogs.openRename}
          onDeleteProject={dialogs.openDelete}
        />
        <ProjectDialogs
          openDialog={dialogs.openDialog}
          selectedProject={dialogs.selectedProject}
          projectName={dialogs.projectName}
          slug={dialogs.slug}
          isLoading={dialogs.isLoading}
          onNameChange={dialogs.setProjectName}
          onClose={dialogs.close}
          onSubmitCreate={dialogs.submitCreate}
          onSubmitRename={dialogs.submitRename}
          onSubmitDelete={dialogs.submitDelete}
        />
        <main className="h-full overflow-hidden pt-12">{children}</main>
      </div>
    </EditorContext.Provider>
  )
}
