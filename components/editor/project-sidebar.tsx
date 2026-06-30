"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Pencil, Plus, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Project } from "@/lib/projects"

interface ProjectSidebarProps {
  isOpen: boolean
  onClose: () => void
  myProjects: Project[]
  sharedProjects: Project[]
  onNewProject: () => void
  onRenameProject: (project: Project) => void
  onDeleteProject: (project: Project) => void
}

export function ProjectSidebar({
  isOpen,
  onClose,
  myProjects,
  sharedProjects,
  onNewProject,
  onRenameProject,
  onDeleteProject,
}: ProjectSidebarProps) {
  const pathname = usePathname()
  const activeProjectId = pathname.startsWith("/editor/")
    ? pathname.split("/")[2]
    : null

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed left-0 top-12 z-40 flex h-[calc(100vh-3rem)] w-72 flex-col border-r border-surface-border bg-surface transition-transform duration-200 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-surface-border px-4 py-3">
          <span className="text-sm font-medium text-copy-primary">Projects</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-7 w-7 text-copy-muted hover:text-copy-primary"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col px-3 py-3">
          <Tabs defaultValue="my-projects" className="flex min-h-0 flex-1 flex-col">
            <TabsList className="w-full shrink-0">
              <TabsTrigger value="my-projects" className="flex-1 text-xs">
                My Projects
              </TabsTrigger>
              <TabsTrigger value="shared" className="flex-1 text-xs">
                Shared
              </TabsTrigger>
            </TabsList>

            <TabsContent value="my-projects" className="mt-2 min-h-0 flex-1">
              {myProjects.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-copy-muted">No projects yet</p>
                </div>
              ) : (
                <ScrollArea className="h-full">
                  <ul className="flex flex-col gap-0.5">
                    {myProjects.map((project) => (
                      <ProjectItem
                        key={project.id}
                        project={project}
                        isActive={project.id === activeProjectId}
                        onRename={onRenameProject}
                        onDelete={onDeleteProject}
                      />
                    ))}
                  </ul>
                </ScrollArea>
              )}
            </TabsContent>

            <TabsContent value="shared" className="mt-2 min-h-0 flex-1">
              {sharedProjects.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-copy-muted">No shared projects</p>
                </div>
              ) : (
                <ScrollArea className="h-full">
                  <ul className="flex flex-col gap-0.5">
                    {sharedProjects.map((project) => (
                      <ProjectItem
                        key={project.id}
                        project={project}
                        isActive={project.id === activeProjectId}
                        onRename={onRenameProject}
                        onDelete={onDeleteProject}
                      />
                    ))}
                  </ul>
                </ScrollArea>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="border-t border-surface-border p-3">
          <Button className="w-full" onClick={onNewProject}>
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  )
}

function ProjectItem({
  project,
  isActive,
  onRename,
  onDelete,
}: {
  project: Project
  isActive: boolean
  onRename: (project: Project) => void
  onDelete: (project: Project) => void
}) {
  return (
    <li
      className={`group flex items-center gap-1 rounded-xl px-2 py-1.5 hover:bg-elevated ${
        isActive ? "bg-elevated" : ""
      }`}
    >
      <Link
        href={`/editor/${project.id}`}
        className="flex-1 truncate text-sm text-copy-secondary group-hover:text-copy-primary"
      >
        {project.name}
      </Link>
      {project.isOwned && (
        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-copy-muted hover:text-copy-primary"
            onClick={(e) => { e.stopPropagation(); onRename(project) }}
          >
            <Pencil className="h-3 w-3" />
            <span className="sr-only">Rename</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 text-copy-muted hover:text-error"
            onClick={(e) => { e.stopPropagation(); onDelete(project) }}
          >
            <Trash2 className="h-3 w-3" />
            <span className="sr-only">Delete</span>
          </Button>
        </div>
      )}
    </li>
  )
}
