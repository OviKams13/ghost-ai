"use client"

import { useState, useCallback } from "react"

export type DialogType = "create" | "rename" | "delete" | null

export interface MockProject {
  id: string
  name: string
  slug: string
  isOwned: boolean
}

const MY_PROJECTS: MockProject[] = [
  { id: "1", name: "E-commerce Platform", slug: "e-commerce-platform", isOwned: true },
  { id: "2", name: "Portfolio Site", slug: "portfolio-site", isOwned: true },
]

const SHARED_PROJECTS: MockProject[] = [
  { id: "3", name: "Design System", slug: "design-system", isOwned: false },
]

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

export function useProjectDialogs() {
  const [openDialog, setOpenDialog] = useState<DialogType>(null)
  const [selectedProject, setSelectedProject] = useState<MockProject | null>(null)
  const [projectName, setProjectName] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const slug = toSlug(projectName)

  const openCreate = useCallback(() => {
    setProjectName("")
    setSelectedProject(null)
    setOpenDialog("create")
  }, [])

  const openRename = useCallback((project: MockProject) => {
    setProjectName(project.name)
    setSelectedProject(project)
    setOpenDialog("rename")
  }, [])

  const openDelete = useCallback((project: MockProject) => {
    setSelectedProject(project)
    setOpenDialog("delete")
  }, [])

  const close = useCallback(() => {
    setOpenDialog(null)
    setSelectedProject(null)
    setProjectName("")
  }, [])

  const submitCreate = useCallback(() => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      close()
    }, 300)
  }, [close])

  const submitRename = useCallback(() => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      close()
    }, 300)
  }, [close])

  const submitDelete = useCallback(() => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      close()
    }, 300)
  }, [close])

  return {
    openDialog,
    selectedProject,
    projectName,
    setProjectName,
    slug,
    isLoading,
    myProjects: MY_PROJECTS,
    sharedProjects: SHARED_PROJECTS,
    openCreate,
    openRename,
    openDelete,
    close,
    submitCreate,
    submitRename,
    submitDelete,
  }
}
