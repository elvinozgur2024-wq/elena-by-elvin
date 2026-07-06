import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/types/database.types";

const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Beklemede",
  paid: "Ödendi",
  preparing: "Hazırlanıyor",
  shipped: "Kargoya Verildi",
  delivered: "Teslim Edildi",
  cancelled: "İptal Edildi",
  failed: "Başarısız",
};

const STATUS_CLASS: Record<OrderStatus, string> = {
  pending: "bg-tint-butter text-mocha",
  paid: "bg-tint-sky text-mocha",
  preparing: "bg-tint-sky text-mocha",
  shipped: "bg-tint-lavender text-mocha",
  delivered: "bg-tint-sage text-mocha",
  cancelled: "bg-secondary text-muted-foreground",
  failed: "bg-destructive/10 text-destructive",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge className={STATUS_CLASS[status]} variant="secondary">
      {STATUS_LABEL[status]}
    </Badge>
  );
}
