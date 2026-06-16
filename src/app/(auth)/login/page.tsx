import { AuthLayout } from "@/components/layouts/auth-layout";
import { LoginForm } from "@/features/auth/components/login-form";

const LOGO_URL =
  "https://ik.imagekit.io/fuagv7oun/background-removed-background-removed.png?updatedAt=1779287187896";

export default function LoginPage() {
  return (
    <AuthLayout>
      <div className="animate-fade-in-up p-1">
        <LoginForm
          logoSrc={LOGO_URL}
          className="bg-transparent border-0 shadow-none"
        />
      </div>
    </AuthLayout>
  );
}
