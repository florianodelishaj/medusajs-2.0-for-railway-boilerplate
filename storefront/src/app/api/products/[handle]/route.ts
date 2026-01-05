import { getProductByHandle } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { handle: string } }
) {
  try {
    const { handle } = params
    const searchParams = request.nextUrl.searchParams
    const countryCode = searchParams.get("countryCode")

    if (!countryCode) {
      return NextResponse.json(
        { error: "Country code is required" },
        { status: 400 }
      )
    }

    const region = await getRegion(countryCode)

    if (!region) {
      return NextResponse.json({ error: "Region not found" }, { status: 404 })
    }

    const product = await getProductByHandle(handle, region.id)

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("Error fetching product:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
