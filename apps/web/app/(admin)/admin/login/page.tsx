import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AnimatedText } from "../../../../components/common/AnimatedText";
import { Text } from "../../../../components/ui/Text";
import { LoginForm } from "./pageClient";

export default async function AdminLoginPage() {
  const c = await cookies();
  if (c.get("admin_jwt")) {
    redirect("/admin/dashboard");
  }
  return (
    <div className="dark min-h-screen bg-(--bg) text-(--text) grid place-items-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-(--border)/20 bg-(--surface) p-6">
        <h1 className="sr-only">Admin Login</h1>
        <AnimatedText
          phrase="Admin Login"
          className="mb-2 tracking-tight text-[var(--text)] text-3xl sm:text-4xl lg:text-5xl leading-snug"
        />
        <Text className="mb-4 text-(--muted)">
          Use your admin credentials to access the dashboard.
        </Text>
        <LoginForm />
      </div>
    </div>
  );
}
