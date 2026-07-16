import { MessageList } from "@/components/admin/message-list";
import { getContactMessagesAdmin } from "@/lib/data/admin";

export default async function AdminMessagesPage() {
  const messages = await getContactMessagesAdmin();
  const unread = messages.filter((m) => !m.is_read).length;

  return (
    <div>
      <div className="flex items-baseline justify-between">
        <h1 className="font-serif text-2xl text-foreground">Mesajlar</h1>
        {unread > 0 ? (
          <span className="text-sm text-muted-foreground">
            {unread} okunmamış
          </span>
        ) : null}
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        İletişim formundan gelen mesajlar. Her mesaj ayrıca e-posta olarak da
        iletilir.
      </p>

      <div className="mt-6">
        <MessageList messages={messages} />
      </div>
    </div>
  );
}
