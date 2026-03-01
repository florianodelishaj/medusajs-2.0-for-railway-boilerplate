const fulfillmentMap: Record<string, string> = {
  not_fulfilled: "Non evaso",
  fulfilled: "Evaso",
  partially_fulfilled: "Parzialmente evaso",
  shipped: "Spedito",
  partially_shipped: "Parzialmente spedito",
  delivered: "Consegnato",
  partially_delivered: "Parzialmente consegnato",
  returned: "Restituito",
  canceled: "Annullato",
  requires_action: "Richiede azione",
}

const paymentMap: Record<string, string> = {
  not_paid: "Non pagato",
  awaiting: "In attesa",
  authorized: "Autorizzato",
  captured: "Pagato",
  partially_refunded: "Parzialmente rimborsato",
  refunded: "Rimborsato",
  canceled: "Annullato",
  requires_action: "Richiede azione",
}

export function translateStatus(
  status: string,
  type: "fulfillment" | "payment"
): string {
  const map = type === "fulfillment" ? fulfillmentMap : paymentMap
  return (
    map[status] ??
    status
      .split("_")
      .join(" ")
      .replace(/^\w/, (c) => c.toUpperCase())
  )
}

export function getStatusBg(status: string): string {
  if (["fulfilled", "shipped", "delivered", "captured"].includes(status))
    return "bg-green-400 text-black"
  if (["canceled", "not_paid"].includes(status))
    return "bg-red-500 text-white"
  return "bg-[#F4F4F0] text-black"
}
