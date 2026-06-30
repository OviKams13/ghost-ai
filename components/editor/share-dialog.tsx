"use client"

import { useCallback, useEffect, useState } from "react"
import { Check, Copy, Loader2, Trash2, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface CollaboratorInfo {
  id: string
  email: string
  displayName: string | null
  avatarUrl: string | null
}

interface ShareDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projectId: string
  projectName: string
  isOwner: boolean
}

export function ShareDialog({
  open,
  onOpenChange,
  projectId,
  projectName,
  isOwner,
}: ShareDialogProps) {
  const [collaborators, setCollaborators] = useState<CollaboratorInfo[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)

  const [inviteEmail, setInviteEmail] = useState("")
  const [isInviting, setIsInviting] = useState(false)
  const [inviteError, setInviteError] = useState<string | null>(null)

  const [removingId, setRemovingId] = useState<string | null>(null)

  const [copied, setCopied] = useState(false)

  const fetchCollaborators = useCallback(async () => {
    setIsFetching(true)
    setFetchError(null)
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`)
      if (!res.ok) throw new Error("Failed to load collaborators")
      const data = await res.json()
      setCollaborators(data.collaborators)
    } catch {
      setFetchError("Could not load collaborators.")
    } finally {
      setIsFetching(false)
    }
  }, [projectId])

  useEffect(() => {
    if (open) fetchCollaborators()
  }, [open, fetchCollaborators])

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault()
    if (!inviteEmail.trim()) return
    setIsInviting(true)
    setInviteError(null)
    try {
      const res = await fetch(`/api/projects/${projectId}/collaborators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setInviteError(data.error ?? "Invite failed")
        return
      }
      setCollaborators((prev) => [...prev, data.collaborator])
      setInviteEmail("")
    } finally {
      setIsInviting(false)
    }
  }

  async function handleRemove(collaboratorId: string) {
    setRemovingId(collaboratorId)
    try {
      await fetch(
        `/api/projects/${projectId}/collaborators/${collaboratorId}`,
        { method: "DELETE" }
      )
      setCollaborators((prev) => prev.filter((c) => c.id !== collaboratorId))
    } finally {
      setRemovingId(null)
    }
  }

  function handleCopyLink() {
    const url = `${window.location.origin}/editor/${projectId}`
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl border-surface-border bg-surface p-0">
        <DialogHeader className="border-b border-surface-border px-6 py-4">
          <DialogTitle className="text-base font-semibold text-copy-primary">
            Share &ldquo;{projectName}&rdquo;
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-6 px-6 py-5">
          {/* Copy project link */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-copy-muted">
              Project link
            </span>
            <div className="flex items-center gap-2">
              <Input
                readOnly
                value={
                  typeof window !== "undefined"
                    ? `${window.location.origin}/editor/${projectId}`
                    : `/editor/${projectId}`
                }
                className="flex-1 bg-elevated text-copy-secondary"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopyLink}
                className="h-9 w-9 shrink-0 text-copy-muted hover:text-copy-primary"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-success" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
                <span className="sr-only">{copied ? "Copied!" : "Copy link"}</span>
              </Button>
            </div>
            {copied && (
              <span className="text-xs text-success">Copied!</span>
            )}
          </div>

          {/* Invite section — owner only */}
          {isOwner && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-medium uppercase tracking-wide text-copy-muted">
                Invite collaborator
              </span>
              <form onSubmit={handleInvite} className="flex items-center gap-2">
                <Input
                  type="email"
                  placeholder="colleague@example.com"
                  value={inviteEmail}
                  onChange={(e) => {
                    setInviteEmail(e.target.value)
                    setInviteError(null)
                  }}
                  disabled={isInviting}
                  className="flex-1 bg-elevated"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={isInviting || !inviteEmail.trim()}
                  className="shrink-0 gap-1.5"
                >
                  {isInviting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <UserPlus className="h-4 w-4" />
                  )}
                  Invite
                </Button>
              </form>
              {inviteError && (
                <span className="text-xs text-error">{inviteError}</span>
              )}
            </div>
          )}

          {/* Collaborators list */}
          <div className="flex flex-col gap-2">
            <span className="text-xs font-medium uppercase tracking-wide text-copy-muted">
              Collaborators{collaborators.length > 0 ? ` (${collaborators.length})` : ""}
            </span>

            {isFetching ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-5 w-5 animate-spin text-copy-muted" />
              </div>
            ) : fetchError ? (
              <p className="text-sm text-error">{fetchError}</p>
            ) : collaborators.length === 0 ? (
              <p className="text-sm text-copy-faint">No collaborators yet.</p>
            ) : (
              <ul className="flex flex-col gap-1">
                {collaborators.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center gap-3 rounded-xl px-2 py-1.5"
                  >
                    <CollaboratorAvatar
                      displayName={c.displayName}
                      avatarUrl={c.avatarUrl}
                      email={c.email}
                    />
                    <div className="min-w-0 flex-1">
                      {c.displayName ? (
                        <>
                          <p className="truncate text-sm text-copy-primary">
                            {c.displayName}
                          </p>
                          <p className="truncate text-xs text-copy-muted">{c.email}</p>
                        </>
                      ) : (
                        <p className="truncate text-sm text-copy-primary">{c.email}</p>
                      )}
                    </div>
                    {isOwner && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0 text-copy-muted hover:text-error"
                        disabled={removingId === c.id}
                        onClick={() => handleRemove(c.id)}
                      >
                        {removingId === c.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                        <span className="sr-only">Remove</span>
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function CollaboratorAvatar({
  displayName,
  avatarUrl,
  email,
}: {
  displayName: string | null
  avatarUrl: string | null
  email: string
}) {
  const initials = displayName
    ? displayName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : email[0].toUpperCase()

  return (
    <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-elevated">
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatarUrl}
          alt={displayName ?? email}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-xs font-medium text-copy-secondary">
          {initials}
        </div>
      )}
    </div>
  )
}
