"use server"

import { NezhaAPI } from "@/app/types/nezha-api"

export async function GetServerMonitor({ server_id }: { server_id: number }) {
  let nezhaBaseUrl = process.env["NezhaBaseUrl"]
  if (!nezhaBaseUrl) {
    console.error("NezhaBaseUrl is not set")
    throw new Error("NezhaBaseUrl is not set")
  }

  // Remove trailing slash
  nezhaBaseUrl = nezhaBaseUrl.replace(/\/$/, "")

  try {
    const response = await fetch(`${nezhaBaseUrl}/api/v1/monitor/${server_id}`, {
      headers: {
        Authorization: process.env["NezhaAuth"] as string,
      },
      next: {
        revalidate: 0,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to fetch data: ${response.status} ${errorText}`)
    }

    const resData = await response.json()
    const monitorData = resData.result

    if (!monitorData) {
      console.error("MonitorData fetch failed:", resData)
      throw new Error("MonitorData fetch failed: 'result' field is missing")
    }

    return monitorData
  } catch (error) {
    console.error("GetServerMonitor error:", error)
    throw error
  }
}

export async function GetServerIP({ server_id }: { server_id: number }): Promise<string> {
  let nezhaBaseUrl = process.env["NezhaBaseUrl"]
  if (!nezhaBaseUrl) {
    console.error("NezhaBaseUrl is not set")
    throw new Error("NezhaBaseUrl is not set")
  }

  // Remove trailing slash
  nezhaBaseUrl = nezhaBaseUrl.replace(/\/$/, "")

  try {
    const response = await fetch(`${nezhaBaseUrl}/api/v1/server/details`, {
      headers: {
        Authorization: process.env["NezhaAuth"] as string,
      },
      next: {
        revalidate: 0,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to fetch data: ${response.status} ${errorText}`)
    }

    const resData = await response.json()

    if (!resData.result) {
      throw new Error("NezhaData fetch failed: 'result' field is missing")
    }

    const nezhaData = resData.result as NezhaAPI[]

    // Find the server with the given ID
    const server = nezhaData.find((element) => element.id === server_id)

    if (!server) {
      throw new Error(`Server with ID ${server_id} not found`)
    }

    return server?.valid_ip || server?.ipv4 || server?.ipv6 || ""
  } catch (error) {
    console.error("GetNezhaData error:", error)
    throw error // Rethrow the error to be caught by the caller
  }
}
