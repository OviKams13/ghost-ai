"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import type { DialogType, Project } from "@/hooks/use-project-actions"

interface ProjectDialogsProps {
  openDialog: DialogType
  selectedProject: Project | null
  projectName: string
  roomIdPreview: string
  isLoading: boolean
  onNameChange: (name: string) => void
  onClose: () => void
  onSubmitCreate: () => void
  onSubmitRename: () => void
  onSubmitDelete: () => void
}

export function ProjectDialogs({
  openDialog,
  selectedProject,
  projectName,
  roomIdPreview,
  isLoading,
  onNameChange,
  onClose,
  onSubmitCreate,
  onSubmitRename,
  onSubmitDelete,
}: ProjectDialogsProps) {
  return (
    <>
      <CreateProjectDialog
        open={openDialog === "create"}
        projectName={projectName}
        roomIdPreview={roomIdPreview}
        isLoading={isLoading}
        onNameChange={onNameChange}
        onClose={onClose}
        onSubmit={onSubmitCreate}
      />
      <RenameProjectDialog
        open={openDialog === "rename"}
        project={selectedProject}
        projectName={projectName}
        isLoading={isLoading}
        onNameChange={onNameChange}
        onClose={onClose}
        onSubmit={onSubmitRename}
      />
      <DeleteProjectDialog
        open={openDialog === "delete"}
        project={selectedProject}
        isLoading={isLoading}
        onClose={onClose}
        onSubmit={onSubmitDelete}
      />
    </>
  )
}

function CreateProjectDialog({
  open,
  projectName,
  roomIdPreview,
  isLoading,
  onNameChange,
  onClose,
  onSubmit,
}: {
  open: boolean
  projectName: string
  roomIdPreview: string
  isLoading: boolean
  onNameChange: (name: string) => void
  onClose: () => void
  onSubmit: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
          <DialogDescription>
            Give your project a name to get started.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Input
            placeholder="Project name"
            value={projectName}
            onChange={(e) => onNameChange(e.target.value)}
            autoFocus
            onKeyDown={(e) => { if (e.key === "Enter" && projectName.trim()) onSubmit() }}
          />
          {roomIdPreview && (
            <p className="text-xs text-copy-muted">
              Room ID: <span className="font-mono text-copy-secondary">{roomIdPreview}</span>
            </p>
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!projectName.trim() || isLoading}
          >
            Create Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function RenameProjectDialog({
  open,
  project,
  projectName,
  isLoading,
  onNameChange,
  onClose,
  onSubmit,
}: {
  open: boolean
  project: Project | null
  projectName: string
  isLoading: boolean
  onNameChange: (name: string) => void
  onClose: () => void
  onSubmit: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle>Rename Project</DialogTitle>
          {project && (
            <DialogDescription>
              Renaming &ldquo;{project.name}&rdquo;
            </DialogDescription>
          )}
        </DialogHeader>
        <Input
          ref={inputRef}
          placeholder="Project name"
          value={projectName}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && projectName.trim()) onSubmit() }}
        />
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            onClick={onSubmit}
            disabled={!projectName.trim() || isLoading}
          >
            Rename
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DeleteProjectDialog({
  open,
  project,
  isLoading,
  onClose,
  onSubmit,
}: {
  open: boolean
  project: Project | null
  isLoading: boolean
  onClose: () => void
  onSubmit: () => void
}) {
  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose() }}>
      <DialogContent className="sm:max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            {project
              ? `Are you sure you want to delete "${project.name}"? This action cannot be undone.`
              : "This action cannot be undone."}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onSubmit}
            disabled={isLoading}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
