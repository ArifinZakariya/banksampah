import { AuthLayout } from "@/components/layouts/auth-layout";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <div className="animate-fade-in-up">
        <div className="auth-glass">
          <div className="auth-glass-overlay" />
          <div className="auth-glass-content">
            <ForgotPasswordForm className="bg-transparent border-0 shadow-none" />
          </div>
        </div>
      </div>
    </AuthLayout>
  );
}
