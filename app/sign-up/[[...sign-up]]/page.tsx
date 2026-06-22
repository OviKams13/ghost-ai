import { SignUp } from "@clerk/nextjs";
import { AuthLeftPanel } from "@/components/auth/auth-left-panel";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-base flex">
      <AuthLeftPanel />
      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <SignUp />
      </div>
    </div>
  );
}
