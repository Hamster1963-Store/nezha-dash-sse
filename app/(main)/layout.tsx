import Footer from "@/app/(main)/footer"
import Header from "@/app/(main)/header"
import { ServerDataProvider } from "@/app/lib/server-data-context"
import { DashCommand } from "@/components/DashCommand"
import { GetNezhaData } from "@/lib/serverFetch"
import React from "react"

type DashboardProps = {
  children: React.ReactNode
}
export default async function MainLayout({ children }: DashboardProps) {
  const nezhaDataFallbackFetch = await GetNezhaData()
  const [nezhaData] = await Promise.all([nezhaDataFallbackFetch])

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex min-h-[calc(100vh-calc(var(--spacing)*16))] flex-1 flex-col gap-4 bg-background p-4 md:p-10 md:pt-8">
        <Header />
        <ServerDataProvider fallbackData={nezhaData}>
          <DashCommand />
          {children}
        </ServerDataProvider>
        <Footer />
      </main>
    </div>
  )
}
