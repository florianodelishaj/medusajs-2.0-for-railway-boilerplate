import { revalidatePath, revalidateTag } from "next/cache"
import { NextRequest, NextResponse } from "next/server"

/**
 * API endpoint per invalidazione cache su richiesta
 *
 * Esempi di utilizzo:
 * - POST /api/revalidate?tag=products (invalida tutti i prodotti)
 * - POST /api/revalidate?path=/products/[handle] (invalida pagina specifica)
 *
 * Chiamabile da Medusa subscribers quando cambiano prodotti/prezzi/inventario
 */
export async function POST(request: NextRequest) {
  const secret = request.headers.get("x-revalidate-secret")
  if (process.env.REVALIDATE_SECRET && secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 })
  }

  const tag = request.nextUrl.searchParams.get("tag")
  const path = request.nextUrl.searchParams.get("path")

  if (!tag && !path) {
    return NextResponse.json(
      { error: "Either 'tag' or 'path' parameter is required" },
      { status: 400 }
    )
  }

  try {
    if (tag) {
      console.log(`[Revalidate] Invalidating tag: ${tag}`)
      revalidateTag(tag)
      // Invalida anche la homepage per far ricaricare i dati
      revalidatePath("/")
      console.log(`[Revalidate] Successfully invalidated tag: ${tag} and path: /`)
      return NextResponse.json({
        revalidated: true,
        type: "tag",
        value: tag,
        alsoInvalidated: "/",
        now: Date.now()
      })
    }

    if (path) {
      console.log(`[Revalidate] Invalidating path: ${path}`)
      revalidatePath(path)
      console.log(`[Revalidate] Successfully invalidated path: ${path}`)
      return NextResponse.json({
        revalidated: true,
        type: "path",
        value: path,
        now: Date.now()
      })
    }
  } catch (error) {
    console.error("[Revalidate] Error:", error)
    return NextResponse.json(
      { error: "Error revalidating", details: (error as Error).message },
      { status: 500 }
    )
  }
}
