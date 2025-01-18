import { GetServerIP } from "@/lib/serverFetch"
import { NextRequest, NextResponse } from "next/server"

interface ResError extends Error {
  statusCode: number
  message: string
}

export type IPInfo = {
  ip_info: any
  ip_asn: any
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const server_id = searchParams.get("server_id")

  if (!server_id) {
    return NextResponse.json({ error: "server_id is required" }, { status: 400 })
  }

  try {
    const ip = await GetServerIP({ server_id: Number(server_id) })

    const ipInfo = await fetch(`https://blog-api.buycoffee.top/api/GetASN?ip=${ip}`, {
      next: {
        revalidate: 60 * 60 * 24 * 30,
      },
    })

    const data = await ipInfo.json()

    return NextResponse.json(data.data, { status: 200 })
  } catch (error) {
    const err = error as ResError
    console.error("Error in GET handler:", err)
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"
    return NextResponse.json({ error: message }, { status: statusCode })
  }
}
