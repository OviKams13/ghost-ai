"use client"

import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEditorContext } from "@/components/editor/editor-context"

export default function EditorPage() {
  const { openCreateProject } = useEditorContext()

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-xl font-semibold text-copy-primary">
          Create a project or open an existing one
        </h1>
        <p className="text-sm text-copy-muted">
          Start a new architecture workspace, or choose a project from the sidebar.
        </p>
      </div>
      <Button onClick={openCreateProject}>
        <Plus className="h-4 w-4" />
        New Project
      </Button>
    </div>
  )
}
