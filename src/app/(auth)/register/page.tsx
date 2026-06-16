import { AuthLayout } from "@/components/layouts/auth-layout";
import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <AuthLayout>
      <div className="animate-fade-in-up p-1">
        <RegisterForm className="bg-transparent border-0 shadow-none" />
      </div>
    </AuthLayout>
  );
}
