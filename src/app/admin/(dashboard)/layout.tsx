import { AdminNav } from "@/components/admin-nav";

export default function AdminDashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen flex-col sm:flex-row">
      <AdminNav />
      <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col bg-paper px-6 py-10 text-ink">
        {children}
      </div>
    </div>
  );
}
