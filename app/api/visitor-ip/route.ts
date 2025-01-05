import fs from "fs"
import path from "path"
import { AsnResponse, CityResponse, Reader } from "maxmind"
import { NextRequest, NextResponse } from "next/server"

export const dynamic = "force-dynamic"

interface ResError extends Error {
  statusCode: number
  message: string
}

export type IPInfo = {
  city: CityResponse
  asn: AsnResponse
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const ip = searchParams.get("ip")

  if (!ip) {
    return NextResponse.json({ error: "ip is required" }, { status: 400 })
  }
  try {
    const cityDbPath = path.join(process.cwd(), "lib", "GeoLite2-City.mmdb")

    const asnDbPath = path.join(process.cwd(), "lib", "GeoLite2-ASN.mmdb")

    const cityDbBuffer = fs.readFileSync(cityDbPath)
    const asnDbBuffer = fs.readFileSync(asnDbPath)

    const cityLookup = new Reader<CityResponse>(cityDbBuffer)
    const asnLookup = new Reader<AsnResponse>(asnDbBuffer)

    const data: IPInfo = {
      city: cityLookup.get(ip) as CityResponse,
      asn: asnLookup.get(ip) as AsnResponse,
    }
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    const err = error as ResError
    console.error("Error in GET handler:", err)
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}
