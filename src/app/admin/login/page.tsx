import { LoginForm } from "@/components/login-form";

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen flex-1 flex-col items-center justify-center bg-ink px-6 py-16 text-paper">
      <p className="mb-3 font-mono text-xs tracking-[0.16em] text-brass uppercase">
        Admin panel
      </p>
      <h1 className="mb-10 font-display text-3xl italic">Tress Studio</h1>
      <LoginForm />
    </main>
  );
}
