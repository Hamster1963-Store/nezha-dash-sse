// @auto-i18n-check. Please do not delete the line.
import { ThemeColorManager } from "@/components/ThemeColorManager"
import { FilterProvider } from "@/lib/network-filter-context"
import { StatusProvider } from "@/lib/status-context"
import { cn } from "@/lib/utils"
import "@/styles/globals.css"
import type { Metadata } from "next"
import { Viewport } from "next"
import { ThemeProvider } from "next-themes"
import { Inter as FontSans } from "next/font/google"
import React from "react"
import { WebSocketProvider } from "./lib/websocketProvider"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const customTitle = "咖啡探针"
const customDescription = "☕️"

export const metadata: Metadata = {
  manifest: "/manifest.json",
  title: customTitle || "NezhaDash",
  description: customDescription || "A dashboard for nezha",
  appleWebApp: {
    capable: true,
    title: customTitle || "NezhaDash",
    statusBarStyle: "default",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default async function LocaleLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fastly.jsdelivr.net/gh/lipis/flag-icons@7.0.0/css/flag-icons.min.css"
        />
        <link
          rel="stylesheet"
          href="https://fastly.jsdelivr.net/npm/font-logos@1/assets/font-logos.css"
        />
      </head>
      <body className={cn("min-h-screen bg-background font-sans antialiased", fontSans.variable)}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <WebSocketProvider>
            <FilterProvider>
              <StatusProvider>
                <ThemeColorManager />
                {children}
              </StatusProvider>
            </FilterProvider>
          </WebSocketProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
