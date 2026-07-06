"use client";

import { Trash } from "@phosphor-icons/react";
import { deleteAddress } from "@/actions/addresses";

export function DeleteAddressButton({ addressId }: { addressId: string }) {
  return (
    <button
      onClick={() => deleteAddress(addressId)}
      className="text-muted-foreground hover:text-destructive"
      aria-label="Adresi sil"
    >
      <Trash className="h-4 w-4" />
    </button>
  );
}
