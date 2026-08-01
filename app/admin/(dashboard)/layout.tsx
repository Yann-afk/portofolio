import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/db/client";
import { getSessionUser } from "@/lib/db/auth";
import { AdminNav } from "./admin-nav";

export const metadata = {
  title: "Admin — Portfolio",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  const admin = createAdminClient();
  const { count } = await admin
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("is_read", false);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-7xl">
        <aside className="sticky top-0 hidden h-screen w-60 shrink-0 border-r border-zinc-200 bg-white lg:block dark:border-zinc-800 dark:bg-zinc-900">
          <a
            href="/admin"
            className="block px-6 py-5 font-mono text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-50"
          >
            admin.
            <span className="text-violet-600 dark:text-violet-400">panel</span>
          </a>
          <AdminNav unread={count ?? 0} />
        </aside>

        <div className="min-w-0 flex-1">
          <div className="sticky top-0 z-20 border-b border-zinc-200 bg-white/80 backdrop-blur lg:hidden dark:border-zinc-800 dark:bg-zinc-950/80">
            <AdminNav unread={count ?? 0} variant="top" />
          </div>
          <main className="mx-auto max-w-4xl px-6 py-10">{children}</main>
        </div>
      </div>
    </div>
  );
}
