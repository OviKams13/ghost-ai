"use client"

import { useState, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import type { Project } from "@/lib/projects"

export type { Project }
export type DialogType = "create" | "rename" | "delete" | null

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

function shortId(): string {
  return Math.random().toString(36).slice(2, 7)
}

export function useProjectActions() {
  const router = useRouter()
  const params = useParams<{ projectId?: string }>()

  const [openDialog, setOpenDialog] = useState<DialogType>(null)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [projectName, setProjectName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [suffix, setSuffix] = useState(shortId)

  const slug = toSlug(projectName)
  const roomIdPreview = slug ? `${slug}-${suffix}` : ""

  const openCreate = useCallback(() => {
    setProjectName("")
    setSelectedProject(null)
    setSuffix(shortId())
    setOpenDialog("create")
  }, [])

  const openRename = useCallback((project: Project) => {
    setProjectName(project.name)
    setSelectedProject(project)
    setOpenDialog("rename")
  }, [])

  const openDelete = useCallback((project: Project) => {
    setSelectedProject(project)
    setOpenDialog("delete")
  }, [])

  const close = useCallback(() => {
    setOpenDialog(null)
    setSelectedProject(null)
    setProjectName("")
  }, [])

  const submitCreate = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: projectName.trim() || "Untitled Project" }),
      })
      if (!res.ok) throw new Error("Failed to create project")
      const { project } = (await res.json()) as { project: { id: string } }
      close()
      router.push(`/editor/${project.id}`)
    } catch (err) {
      console.error(err)
      setIsLoading(false)
    }
  }, [projectName, close, router])

  const submitRename = useCallback(async () => {
    if (!selectedProject) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: projectName.trim() }),
      })
      if (!res.ok) throw new Error("Failed to rename project")
      close()
      router.refresh()
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [selectedProject, projectName, close, router])

  const submitDelete = useCallback(async () => {
    if (!selectedProject) return
    setIsLoading(true)
    try {
      const res = await fetch(`/api/projects/${selectedProject.id}`, {
        method: "DELETE",
      })
      if (!res.ok) throw new Error("Failed to delete project")
      const activeId = params?.projectId
      close()
      if (activeId === selectedProject.id) {
        router.push("/editor")
      } else {
        router.refresh()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [selectedProject, close, router, params])

  return {
    openDialog,
    selectedProject,
    projectName,
    setProjectName,
    roomIdPreview,
    isLoading,
    openCreate,
    openRename,
    openDelete,
    close,
    submitCreate,
    submitRename,
    submitDelete,
  }
}
