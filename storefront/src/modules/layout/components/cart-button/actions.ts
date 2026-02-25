"use server"

import { enrichLineItems, retrieveCart } from "@lib/data/cart"

export async function fetchCartData() {
  const cart = await retrieveCart()

  if (!cart) {
    return null
  }

  if (cart?.items?.length) {
    const enrichedItems = await enrichLineItems(cart.items, cart.region_id!)
    cart.items = enrichedItems
  }

  return cart
}
