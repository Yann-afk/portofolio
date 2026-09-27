import { Mail, MailOpen } from "lucide-react";
import { createAdminClient } from "@/lib/db/client";
import { DeleteButton, PageHeader } from "../admin-ui";
import { deleteMessage, toggleMessageRead } from "../actions";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pesan — Admin",
};

export default async function MessagesPage() {
  const admin = createAdminClient();
  const { data: messages } = await admin
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });

  const unreadCount = messages?.filter((m) => !m.is_read).length ?? 0;

  return (
    <div>
      <PageHeader
        title="Pesan"
        description={`${unreadCount} belum dibaca.`}
      />

      {messages && messages.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {messages.map((m) => (
            <li
              key={m.id}
              className={`rounded-2xl border bg-white p-5 dark:bg-zinc-900 ${
                m.is_read
                  ? "border-zinc-200 dark:border-zinc-800"
                  : "border-violet-300 dark:border-violet-800"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-50">
                    {m.sender_name}
                  </span>
                  <a
                    href={`mailto:${m.sender_email}`}
                    className="text-sm text-zinc-500 hover:text-violet-600 dark:text-zinc-400 dark:hover:text-violet-400"
                  >
                    {m.sender_email}
                  </a>
                </div>
                <span className="font-mono text-xs text-zinc-400">
                  {new Date(m.created_at).toLocaleString("id-ID")}
                </span>
              </div>
              <p className="mt-3 whitespace-pre-wrap text-sm text-zinc-600 dark:text-zinc-300">
                {m.message}
              </p>
              <div className="mt-4 flex items-center gap-2">
                <form action={toggleMessageRead.bind(null, m.id, !m.is_read)}>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:border-violet-300 hover:text-violet-600 dark:border-zinc-700 dark:text-zinc-400 dark:hover:border-violet-700 dark:hover:text-violet-400"
                  >
                    {m.is_read ? (
                      <Mail className="h-3.5 w-3.5" />
                    ) : (
                      <MailOpen className="h-3.5 w-3.5" />
                    )}
                    {m.is_read ? "Tandai belum dibaca" : "Tandai sudah dibaca"}
                  </button>
                </form>
                <DeleteButton
                  confirm="Hapus pesan ini?"
                  action={deleteMessage.bind(null, m.id)}
                />
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-400">
          Belum ada pesan masuk.
        </p>
      )}
    </div>
  );
}
