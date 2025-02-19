"use client"

import AnimateCountClient from "@/components/AnimatedCount"
import { ModeToggle } from "@/components/ThemeSwitcher"
import { Loader } from "@/components/loading/Loader"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { DateTime } from "luxon"
import { useRouter } from "next/navigation"
import React, { memo, useEffect, useRef, useState } from "react"
import { useWebSocketContext } from "../lib/websocketProvider"
function Header() {
  const customTitle = "咖啡探针"
  const customDescription = "Coffee ☕️"

  const router = useRouter()

  const { connected, onlineCount } = useWebSocketContext()

  return (
    <div className="mx-auto w-full max-w-5xl">
      <section className="flex items-center justify-between">
        <section
          onClick={() => {
            sessionStorage.removeItem("selectedTag")
            router.push(`/`)
          }}
          className="flex cursor-pointer items-center text-base font-medium hover:opacity-50 transition-opacity duration-300"
        >
          <div className="mr-1 flex flex-row items-center justify-start">
            <img
              width={40}
              height={40}
              alt="apple-touch-icon"
              src={"/apple-touch-icon.png"}
              className="relative m-0! border-2 border-transparent h-6 w-6 object-cover object-top p-0! dark:hidden"
            />
            <img
              width={40}
              height={40}
              alt="apple-touch-icon"
              src={"/apple-touch-icon-dark.png"}
              className="relative m-0! border-2 border-transparent h-6 w-6 object-cover object-top p-0! hidden dark:block"
            />
          </div>
          {customTitle ? customTitle : "NezhaDash"}
          <Separator orientation="vertical" className="mx-2 hidden h-4 w-[1px] md:block" />
          <p className="hidden text-sm font-medium opacity-40 md:block">{customDescription}</p>
        </section>
        <section className="flex items-center gap-2">
          <ModeToggle />
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "hover:bg-white dark:hover:bg-black overflow-hidden cursor-default rounded-full flex gap-2 items-center px-[9px] bg-white dark:bg-black",
            )}
          >
            {connected ? <AnimateCountClient count={onlineCount} /> : <Loader visible={true} />}
            <p className="text-muted-foreground">{connected ? "在线" : "离线"}</p>
            <span
              className={cn("h-2 w-2 rounded-full bg-green-500", {
                "bg-red-500": !connected,
              })}
            ></span>
          </Button>
        </section>
      </section>
      <Overview />
    </div>
  )
}

interface TimeState {
  hh: number
  mm: number
  ss: number
}


const useCurrentTime = () => {
  const [time, setTime] = useState<TimeState>({
    hh: DateTime.now().setLocale("en-US").hour,
    mm: DateTime.now().setLocale("en-US").minute,
    ss: DateTime.now().setLocale("en-US").second,
  })

  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = DateTime.now().setLocale("en-US")
      setTime({
        hh: now.hour,
        mm: now.minute,
        ss: now.second,
      })
    }, 1000)

    return () => clearInterval(intervalId)
  }, [])

  return time
}

const Overview = memo(function Overview() {
  const time = useCurrentTime()
  const [mounted, setMounted] = useState(false)

  const getGreeting = () => {
    const hour = time.hh
    if (hour >= 5 && hour < 12) {
      return "早安 🌅"
    } else if (hour >= 12 && hour < 18) {
      return "午安 🌞"
    } else {
      return "晚安 🌙"
    }
  }

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className={"mt-10 flex flex-col md:mt-16"}>
      <p className="text-base font-semibold">
        {mounted ? (
          getGreeting()
        ) : (
          <Skeleton className="h-[24px] w-18 rounded-[5px] bg-muted-foreground/10 animate-none"></Skeleton>
        )}
      </p>
      <div className="flex items-center gap-1 mt-0.5">
        <p className="text-sm font-medium opacity-50">{"目前时间为"}</p>
        {mounted ? (
          <div className="flex items-center text-sm font-medium">
            <AnimateCountClient count={time.hh} minDigits={2} />
            <span className="text-sm mb-[1px] font-medium opacity-50">:</span>
            <AnimateCountClient count={time.mm} minDigits={2} />
            <span className="text-sm mb-[1px] font-medium opacity-50">:</span>
            <span className="text-sm font-medium">
              <AnimateCountClient count={time.ss} minDigits={2} />
            </span>
          </div>
        ) : (
          <Skeleton className="h-[21px] w-16 rounded-[5px] bg-muted-foreground/10 animate-none"></Skeleton>
        )}
      </div>
    </section>
  )
})

export default Header
