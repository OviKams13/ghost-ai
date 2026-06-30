# Progress Tracker

Update this file whenever the current phase, active feature, or implementation state changes.

## Current Phase
- Phase 1: Foundation

## Current Goal
- Project creation and management (Phase 2)

## Completed

- **Share Dialog** (`context/feature-specs/09-share-dialog.md`)
  - Created `app/api/projects/[projectId]/collaborators/route.ts` — `GET` lists collaborators (owner or collaborator access), enriched with Clerk display name + avatar via `clerkClient().users.getUserList({ emailAddress })`; `POST` invites by email, owner-only, validates email format, rejects self-invite and duplicates (`409`)
  - Created `app/api/projects/[projectId]/collaborators/[collaboratorId]/route.ts` — `DELETE` removes a collaborator by record id, owner-only, verifies the record belongs to the project
  - Created `components/editor/share-dialog.tsx` — client dialog with three sections: copy project link (`Copied!` feedback for 2s), invite-by-email form (owner only), and collaborator list with avatar/initials fallback and remove button (owner only); collaborators get read-only list view
  - Updated `components/editor/workspace-shell.tsx` — `Share` button opens `ShareDialog`; added `isOwner` prop
  - Updated `app/editor/[roomId]/page.tsx` — computes `isOwner = project.ownerId === userId` and passes it down
  - Clerk Backend API enrichment is best-effort: falls back to showing only the email when no Clerk user is found for an address; no local user table added
  - Avatars rendered via plain `<img>` (not `next/image`) to avoid remote-pattern config for Clerk's image CDN
  - `npm run build` passes with zero TypeScript errors

- **Editor Workspace Shell** (`context/feature-specs/08-editor-workspace-shell.md`)
  - Created `lib/project-access.ts` — `getCurrentIdentity()` returns `userId` + primary email via Clerk; `getProjectAccess()` checks owner or collaborator membership and returns a `ProjectSummary` or `null`
  - Created `components/editor/access-denied.tsx` — centered layout with `Lock` icon, short message, and link back to `/editor`
  - Created `components/editor/workspace-shell.tsx` — client component; workspace navbar shows project name, placeholder Share button, and AI sidebar toggle (`Bot` icon); right AI sidebar placeholder slides in on toggle
  - Created `app/editor/[roomId]/page.tsx` — server component; unauthenticated users redirect to `/sign-in`; missing or unauthorized projects show `AccessDenied`; authorized users see `WorkspaceShell` with project context
  - Updated `components/editor/project-sidebar.tsx` — uses `usePathname` to compute `activeProjectId`; each `ProjectItem` is now a `Link` to `/editor/[id]` and receives `isActive` for highlighted styling
  - `npm run build` passes with zero TypeScript errors

- **Wire Editor Home to Real Project API** (`context/feature-specs/07-wire-editor-home.md`)
  - Created `lib/projects.ts` — `getOwnedProjects(userId)` and `getSharedProjects(email)` using Prisma; dates serialized to ISO strings for RSC boundary safety
  - Created `hooks/use-project-actions.ts` — manages dialog state + real API mutations; create POSTs then navigates to `/editor/[id]`; rename PATCHes + `router.refresh()`; delete DELETEs + redirects to `/editor` if active workspace else `router.refresh()`; stable suffix per dialog session for room ID preview
  - Updated `app/editor/layout.tsx` — async server component; fetches owned and shared projects via Clerk `auth()`/`currentUser()`, passes both lists to `EditorShell`
  - Updated `components/editor/editor-shell.tsx` — accepts `myProjects`/`sharedProjects` props from server; uses `useProjectActions` instead of old mock hook
  - Updated `components/editor/project-sidebar.tsx` — type switched from `MockProject` to `Project`
  - Updated `components/editor/project-dialogs.tsx` — type switched to `Project`; `slug` prop replaced by `roomIdPreview`; create dialog label changed to "Room ID:"
  - `npm run build` passes with zero TypeScript errors

- **Project CRUD API Routes** (`context/feature-specs/06-project-apis.md`)
  - Created `app/api/projects/route.ts` — `GET` lists the authenticated user's projects (ordered by `createdAt` desc); `POST` creates a project, defaulting `name` to `"Untitled Project"`
  - Created `app/api/projects/[projectId]/route.ts` — `PATCH` renames; `DELETE` deletes; both verify ownership and return `403` for non-owners; unauthenticated requests return `401`
  - `params` resolved via `Promise<{ projectId: string }>` per Next.js 16 route handler convention
  - `npm run build` passes with zero TypeScript errors

- **Prisma Data Models + Client** (`context/feature-specs/05-prisma.md`)
  - Created `prisma/models/project.prisma` — `Project` and `ProjectCollaborator` models with correct relations, cascade delete, indexes, and unique constraints
  - Created `lib/prisma.ts` — cached singleton; branches on `DATABASE_URL`: `prisma+postgres://` uses `accelerateUrl` + `$extends(withAccelerate())`, all other URLs use `@prisma/adapter-pg`
  - Updated `prisma.config.ts` to use `env()` helper from `prisma/config`
  - Migration `20260624000000_init` created and verified against local Prisma dev server
  - Installed `@prisma/extension-accelerate` for Accelerate support
  - `npm run build` passes with zero TypeScript errors

- **Project Dialogs + Editor Home** (`context/feature-specs/04-project-dialogs.md`)
  - Editor home screen: heading, description, and New Project button wired to Create dialog
  - `hooks/use-project-dialogs.ts` — dialog state, form state, slug preview, loading state, mock project data
  - `components/editor/editor-context.tsx` — React context providing `openCreateProject` to child pages
  - `components/editor/project-dialogs.tsx` — Create, Rename, Delete dialogs
  - `components/editor/project-sidebar.tsx` — project list with rename/delete actions (owned only), mobile backdrop scrim
  - `components/editor/editor-shell.tsx` — wires hook, context, sidebar, and dialogs together
  - TypeScript: zero errors; lint: zero errors

- **Authentication and Route Protection** (`context/feature-specs/03-auth.md`)
  - Installed `@clerk/ui` (v1.18.0) for theme support
  - Added `NEXT_PUBLIC_CLERK_SIGN_IN_URL` and `NEXT_PUBLIC_CLERK_SIGN_UP_URL` to `.env.local`
  - Wrapped root layout with `ClerkProvider` using `dark` theme from `@clerk/ui/themes` and CSS variable overrides (no hardcoded colors)
  - Created `app/sign-in/[[...sign-in]]/page.tsx` — two-panel layout (left: logo/tagline/feature list, right: Clerk `<SignIn />`); small screens show form only
  - Created `app/sign-up/[[...sign-up]]/page.tsx` — same two-panel pattern with `<SignUp />`
  - Updated `app/page.tsx` — authenticated users redirect to `/editor`, unauthenticated to `/sign-in`
  - Created `proxy.ts` at project root (Next.js 16 convention, named export `proxy`) using `clerkMiddleware` + `createRouteMatcher`; public routes are sign-in and sign-up paths; all other routes are protected
  - Added `UserButton` to the right section of `components/editor/editor-navbar.tsx`
  - `npm run build` passes with zero errors

- **Editor Chrome — Navbar + Sidebar Shell** (`context/feature-specs/02-editor.md`)
  - Created `components/editor/editor-navbar.tsx` — fixed-height top navbar, sidebar toggle with `PanelLeftOpen`/`PanelLeftClose` icons, dark background + subtle bottom border
  - Created `components/editor/project-sidebar.tsx` — floating overlay sidebar (doesn't push content), slides in from left, `isOpen`/`onClose` props, "Projects" header with close button, shadcn Tabs (My Projects / Shared) with empty placeholder states, full-width "New Project" button with Plus icon
  - Dialog pattern: existing `components/ui/dialog.tsx` already exports `DialogHeader`, `DialogFooter`, `DialogTitle`, `DialogDescription` — ready for future use
  - TypeScript: zero errors

- **Design System / UI Primitives** (`context/feature-specs/01-design-system.md`)
  - Installed: `clsx`, `tailwind-merge`, `lucide-react`, `class-variance-authority`
  - Installed Radix UI: `@radix-ui/react-dialog`, `@radix-ui/react-scroll-area`, `@radix-ui/react-slot`, `@radix-ui/react-tabs`
  - Created `lib/utils.ts` with `cn()` helper
  - Created `components.json` for shadcn/ui (Tailwind v4, RSC mode)
  - Configured `app/globals.css` with full dark theme: project tokens + shadcn semantic mappings
  - Added shadcn components: Button, Card, Dialog, Input, Tabs, Textarea, ScrollArea in `components/ui/`
  - TypeScript: zero errors

## In Progress

- None.

## Next Up

- Real canvas with Liveblocks + React Flow (`app/editor/[roomId]`)

## Open Questions

- None yet.

## Architecture Decisions

- Tailwind CSS v4 in use — theme tokens defined via `@theme inline` in `app/globals.css`. No `tailwind.config.js`.
- Dark-only theme. No light mode. All color tokens are hardcoded values (no CSS variable indirection needed).
- `components/ui/*` are generated by shadcn CLI and must not be modified. Project-specific styling goes in app-level components.

## Session Notes

- Prisma v7 requires a driver adapter for all SQL connections. Accelerate is configured via `accelerateUrl` in `PrismaClientOptions` (not via a separate adapter). The `accelerateUrl` option takes a `prisma+postgres://` URL directly.
- `pooled.db.prisma.io:5432` (PgBouncer endpoint) does not support raw Postgres wire protocol needed for `prisma migrate dev`. Migrations must be run against a direct connection. The migration SQL was generated with `prisma migrate diff` and applied against the local `prisma dev` server for verification. To deploy to production, run `prisma migrate deploy` with a direct Prisma Postgres URL.
- Prisma multi-file schemas: `prisma.config.ts` with `schema: "prisma/"` recursively discovers all `.prisma` files including `prisma/models/project.prisma`.

- shadcn components reference standard tokens (`bg-primary`, `text-foreground`, etc.) which resolve to the dark theme values defined in `app/globals.css`.
- Project utility tokens available: `bg-base`, `bg-surface`, `bg-elevated`, `bg-subtle`, `border-surface-border`, `border-subtle-border`, `text-copy-primary`, `text-copy-secondary`, `text-copy-muted`, `text-copy-faint`, `text-brand`, `bg-brand-dim`, `text-ai`, `text-ai-text`, `text-error`, `text-success`, `text-warning`.
- Clerk v7 appearance API uses `theme` (not `baseTheme`) for the `dark` theme from `@clerk/ui/themes`. The `Variables` type uses `colorInput` (input background), `colorInputForeground` (input text), `colorForeground` (primary text), `colorMutedForeground` (secondary text).
- Next.js 16 uses `proxy.ts` (not `middleware.ts`). The exported function must be named `proxy`. `clerkMiddleware` from `@clerk/nextjs/server` works directly as the proxy handler.
