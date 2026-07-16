import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AdminSidebar } from "@/components/admin/sidebar";
import { getUnreadMessageCountAdmin } from "@/lib/data/admin";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/admin/giris");

  const { data: customer } = await supabase
    .from("customers")
    .select("role")
    .eq("id", user.id)
    .single();

  if (customer?.role !== "admin") redirect("/admin/giris");

  const unreadMessages = await getUnreadMessageCountAdmin();

  return (
    <div className="flex min-h-screen bg-secondary/30">
      <AdminSidebar unreadMessages={unreadMessages} />
      <div className="flex-1 overflow-x-hidden">
        <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
