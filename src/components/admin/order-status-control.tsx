"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateOrderStatus } from "@/actions/admin-orders";
import type { OrderStatus } from "@/types/database.types";

const TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["paid", "cancelled", "failed"],
  paid: ["preparing", "cancelled"],
  preparing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
  failed: [],
};

const LABEL: Record<OrderStatus, string> = {
  pending: "Beklemede",
  paid: "Ödendi",
  preparing: "Hazırlanıyor",
  shipped: "Kargoya Verildi",
  delivered: "Teslim Edildi",
  cancelled: "İptal Edildi",
  failed: "Başarısız",
};

export function OrderStatusControl({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const [isPending, startTransition] = useTransition();
  const nextOptions = TRANSITIONS[status];

  if (nextOptions.length === 0) {
    return <p className="text-sm text-muted-foreground">{LABEL[status]}</p>;
  }

  return (
    <Select
      disabled={isPending}
      onValueChange={(value) => {
        startTransition(async () => {
          try {
            await updateOrderStatus(orderId, value as OrderStatus);
            toast.success("Sipariş durumu güncellendi");
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Güncellenemedi");
          }
        });
      }}
    >
      <SelectTrigger className="w-52">
        <SelectValue placeholder={LABEL[status]} />
      </SelectTrigger>
      <SelectContent>
        {nextOptions.map((option) => (
          <SelectItem key={option} value={option}>
            {LABEL[option]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
