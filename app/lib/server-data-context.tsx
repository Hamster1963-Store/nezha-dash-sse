"use client"

import { ServerApi } from "@/app/types/nezha-api"
import { SSEDataFetch } from "@/lib/sseFetch"
import { ReactNode, createContext, useContext, useEffect, useState } from "react"

export interface ServerDataWithTimestamp {
  timestamp: number
  data: ServerApi
}

interface ServerDataContextType {
  data: ServerApi | undefined
  isSSEConnected: boolean
  history: ServerDataWithTimestamp[]
}

const ServerDataContext = createContext<ServerDataContextType | undefined>(undefined)

const MAX_HISTORY_LENGTH = 30

export function ServerDataProvider({
  children,
  fallbackData,
}: { children: ReactNode; fallbackData: ServerApi }) {
  const [history, setHistory] = useState<ServerDataWithTimestamp[]>([])
  const [isSSEConnected, setIsSSEConnected] = useState(false)

  const data: ServerApi = SSEDataFetch(
    "https://home-api.buycoffee.top/v2/GetNezhaDashData?sse=true",
    fallbackData,
  )

  useEffect(() => {
    if (data) {
      setIsSSEConnected(true)
      setHistory((prev) => {
        const newHistory = [
          {
            timestamp: Date.now(),
            data: data,
          },
          ...prev,
        ].slice(0, MAX_HISTORY_LENGTH)

        return newHistory
      })
    }
  }, [data])

  return (
    <ServerDataContext.Provider value={{ data, isSSEConnected, history }}>
      {children}
    </ServerDataContext.Provider>
  )
}

export function useServerData() {
  const context = useContext(ServerDataContext)
  if (context === undefined) {
    throw new Error("useServerData must be used within a ServerDataProvider")
  }
  return context
}
