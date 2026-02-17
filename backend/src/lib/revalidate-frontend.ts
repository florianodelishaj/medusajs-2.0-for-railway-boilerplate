/**
 * Utility per chiamare l'endpoint di revalidazione del frontend.
 * Usata sia dai subscriber che dal middleware price list.
 */
export async function revalidateFrontendCache(tag: string, context?: string) {
  const label = context || 'Cache Invalidation'
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:8000'
  const revalidateSecret = process.env.REVALIDATE_SECRET

  if (!frontendUrl) {
    console.warn(`[${label}] FRONTEND_URL not set, skipping cache invalidation`)
    return
  }

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (revalidateSecret) {
      headers['x-revalidate-secret'] = revalidateSecret
    }

    const url = `${frontendUrl}/api/revalidate?tag=${tag}`
    console.log(`[${label}] Calling revalidate endpoint:`, url)

    const response = await fetch(url, {
      method: 'POST',
      headers,
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[${label}] Failed to revalidate:`, response.status, errorText)
    } else {
      const result = await response.json()
      console.log(`[${label}] Successfully revalidated:`, result)
    }
  } catch (error) {
    console.error(`[${label}] Error:`, error instanceof Error ? error.message : error)
  }
}
