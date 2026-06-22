import { Bot, Share2, ScrollText, Ghost } from "lucide-react"

const features = [
  {
    icon: Bot,
    title: "AI Architecture Generation",
    desc: "Describe your system, AI maps it to nodes and edges on a live canvas.",
  },
  {
    icon: Share2,
    title: "Real-time Collaboration",
    desc: "Live cursors, presence indicators, and shared node editing across your team.",
  },
  {
    icon: ScrollText,
    title: "Instant Spec Generation",
    desc: "Export a complete Markdown technical spec directly from the canvas graph.",
  },
]

export function AuthLeftPanel() {
  return (
    <div className="hidden lg:flex lg:w-1/2 flex-col bg-surface border-r border-surface-border px-14 py-10">
      <div className="flex items-center gap-2">
        <div className="h-7 w-7 rounded-lg bg-brand flex items-center justify-center">
          <Ghost className="h-4 w-4" />
        </div>
        <span className="text-sm font-semibold text-copy-primary">Ghost AI</span>
      </div>

      <div className="flex flex-1 flex-col justify-center max-w-md">
        <h1 className="text-3xl font-bold text-copy-primary leading-tight mb-4">
          Design systems at the<br />speed of thought.
        </h1>
        <p className="text-sm text-copy-secondary leading-relaxed mb-12">
          Describe your architecture in plain English. Ghost AI maps it to a shared
          canvas your whole team can refine in real time.
        </p>
        <ul className="space-y-7">
          {features.map(({ icon: Icon, title, desc }) => (
            <li key={title} className="flex items-start gap-4">
              <div className="h-8 w-8 rounded-lg bg-elevated border border-surface-border flex items-center justify-center flex-shrink-0 mt-0.5">
                <Icon className="h-4 w-4 text-brand" />
              </div>
              <div>
                <p className="text-sm font-medium text-copy-primary mb-0.5">{title}</p>
                <p className="text-xs text-copy-muted leading-relaxed">{desc}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-xs text-copy-faint">© 2026 Ghost AI. All rights reserved.</p>
    </div>
  )
}
