import Link from "next/link"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AccessDenied() {
  return (
    <div className="flex h-full items-center justify-center bg-base">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-elevated">
          <Lock className="h-8 w-8 text-copy-muted" />
        </div>
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold text-copy-primary">Access Denied</h2>
          <p className="text-sm text-copy-muted">
            You don&apos;t have permission to view this project.
          </p>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/editor">Back to projects</Link>
        </Button>
      </div>
    </div>
  )
}
