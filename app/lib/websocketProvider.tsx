"use client"
import React, { createContext, useContext, ReactNode } from "react"
import useWebSocket, { WebSocketHook } from "./useWebsocket"

interface WebSocketProviderProps {
  children: ReactNode
}

const WebSocketContext = createContext<WebSocketHook | undefined>(undefined)

export const WebSocketProvider = ({ children }: WebSocketProviderProps) => {
  const ws = useWebSocket("wss://blog-api.buycoffee.top/api/Live?room=nezhadash")
  return <WebSocketContext.Provider value={ws}>{children}</WebSocketContext.Provider>
}

export const useWebSocketContext = (): WebSocketHook => {
  const context = useContext(WebSocketContext)
  if (!context) {
    throw new Error("useWebSocketContext must be used within a WebSocketProvider")
  }
  return context
}
