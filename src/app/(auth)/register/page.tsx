import { AuthLayout } from "@/components/layouts/auth-layout";
import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <AuthLayout>
      <div className="animate-fade-in-up">
        <div className="auth-glass">
          <div className="auth-glass-overlay" />
          <div className="auth-glass-content">
            <RegisterForm className="bg-transparent border-0 shadow-none" />
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
