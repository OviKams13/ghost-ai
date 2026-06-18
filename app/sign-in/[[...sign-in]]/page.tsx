import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-base flex">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-16 border-r border-surface-border">
        <div className="max-w-sm">
          <p className="text-lg font-semibold tracking-tight text-copy-primary mb-1">Ghost AI</p>
          <p className="text-sm text-copy-muted mb-10">Real-time collaborative system design</p>
          <ul className="space-y-3 text-sm text-copy-secondary">
            <li>Describe your system in plain English</li>
            <li>AI maps it onto a shared canvas</li>
            <li>Collaborate in real time with your team</li>
            <li>Generate a technical spec from the final design</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-4">
        <SignIn />
      </div>
    </div>
  );
}
