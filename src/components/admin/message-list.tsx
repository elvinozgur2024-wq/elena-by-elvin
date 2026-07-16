"use client";

import { useTransition } from "react";
import {
  ArrowBendUpLeft,
  Envelope,
  EnvelopeOpen,
  Trash,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import {
  deleteContactMessage,
  setMessageRead,
} from "@/actions/admin-messages";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ContactMessage } from "@/types/database.types";

function MessageCard({ message }: { message: ContactMessage }) {
  const [isPending, startTransition] = useTransition();

  function run(action: () => Promise<void>, errorFallback: string) {
    startTransition(async () => {
      try {
        await action();
      } catch (err) {
        toast.error(err instanceof Error ? err.message : errorFallback);
      }
    });
  }

  return (
    <article
      className={cn(
        "rounded-2xl border bg-card p-5 transition-opacity",
        message.is_read ? "border-border" : "border-primary/40",
        isPending && "opacity-60",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-2 text-sm font-medium text-foreground">
            {!message.is_read ? (
              <span
                className="h-2 w-2 shrink-0 rounded-full bg-primary"
                aria-label="Okunmamış"
              />
            ) : null}
            {message.name}
          </p>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {message.email} · {formatDate(message.created_at)}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <a
            href={`mailto:${message.email}?subject=${encodeURIComponent("Re: Elena By Elvin iletişim mesajınız")}`}
            className="flex h-8 items-center gap-1.5 rounded-full border border-border px-3 text-xs text-foreground hover:bg-secondary"
          >
            <ArrowBendUpLeft className="h-3.5 w-3.5" /> Yanıtla
          </a>
          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              run(
                () => setMessageRead(message.id, !message.is_read),
                "Mesaj güncellenemedi",
              )
            }
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label={message.is_read ? "Okunmadı olarak işaretle" : "Okundu olarak işaretle"}
            title={message.is_read ? "Okunmadı olarak işaretle" : "Okundu olarak işaretle"}
          >
            {message.is_read ? (
              <Envelope className="h-4 w-4" />
            ) : (
              <EnvelopeOpen className="h-4 w-4" />
            )}
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() =>
              run(() => deleteContactMessage(message.id), "Mesaj silinemedi")
            }
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-destructive"
            aria-label="Sil"
            title="Sil"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      </div>

      <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
        {message.message}
      </p>
    </article>
  );
}

export function MessageList({ messages }: { messages: ContactMessage[] }) {
  if (messages.length === 0) {
    return (
      <p className="rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted-foreground">
        Henüz mesaj yok.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {messages.map((message) => (
        <MessageCard key={message.id} message={message} />
      ))}
    </div>
  );
}
