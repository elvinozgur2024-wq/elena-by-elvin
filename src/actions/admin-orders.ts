"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { OrderStatus } from "@/types/database.types";

const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ["paid", "cancelled", "failed"],
  paid: ["preparing", "cancelled"],
  preparing: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
  failed: [],
};

export async function updateOrderStatus(
  orderId: string,
  nextStatus: OrderStatus,
) {
  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .single();

  if (!order) throw new Error("Sipariş bulunamadı");

  const allowed = VALID_TRANSITIONS[order.status as OrderStatus];
  if (!allowed.includes(nextStatus)) {
    throw new Error(
      `"${order.status}" durumundan "${nextStatus}" durumuna geçilemez`,
    );
  }

  await supabase.from("orders").update({ status: nextStatus }).eq("id", orderId);
  revalidatePath("/admin/siparisler");
  revalidatePath(`/admin/siparisler/${orderId}`);
}
