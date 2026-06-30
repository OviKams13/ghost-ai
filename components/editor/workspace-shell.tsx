"use client"

import { useState } from "react"
import { Bot, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ShareDialog } from "@/components/editor/share-dialog"
import type { ProjectSummary } from "@/lib/project-access"

interface WorkspaceShellProps {
  project: ProjectSummary
  isOwner: boolean
}

export function WorkspaceShell({ project, isOwner }: WorkspaceShellProps) {
  const [isAIOpen, setIsAIOpen] = useState(false)
  const [isShareOpen, setIsShareOpen] = useState(false)

  return (
    <div className="flex h-full flex-col">
      {/* Workspace navbar */}
      <div className="flex h-12 shrink-0 items-center border-b border-surface-border bg-surface px-4">
        <span className="truncate text-sm font-medium text-copy-primary">
          {project.name}
        </span>
        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-copy-muted hover:text-copy-primary"
            onClick={() => setIsShareOpen(true)}
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className={`h-8 w-8 ${isAIOpen ? "text-ai-text" : "text-copy-muted hover:text-copy-primary"}`}
            onClick={() => setIsAIOpen((prev) => !prev)}
            aria-label="Toggle AI sidebar"
          >
            <Bot className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Canvas placeholder */}
        <div className="flex flex-1 items-center justify-center bg-base">
          <p className="text-sm text-copy-faint">Canvas coming soon</p>
        </div>

        {/* AI sidebar placeholder */}
        {isAIOpen && (
          <aside className="flex w-80 shrink-0 flex-col border-l border-surface-border bg-surface">
            <div className="flex h-12 items-center border-b border-surface-border px-4">
              <span className="text-sm font-medium text-copy-primary">AI Chat</span>
            </div>
            <div className="flex flex-1 items-center justify-center">
              <p className="text-sm text-copy-faint">AI chat coming soon</p>
            </div>
          </aside>
        )}
      </div>

      <ShareDialog
        open={isShareOpen}
        onOpenChange={setIsShareOpen}
        projectId={project.id}
        projectName={project.name}
        isOwner={isOwner}
      />
    </div>
  )
}
