"use client"

import { ModeToggle } from "@/components/ThemeSwitcher"
import { Loader } from "@/components/loading/Loader"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { DateTime } from "luxon"
import { useRouter } from "next/navigation"
import React, { useEffect, useRef, useState } from "react"
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
          className="flex cursor-pointer items-center text-base font-medium"
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
          <div className="hidden sm:block">
            <Links />
          </div>
          <ModeToggle />
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "hover:bg-white dark:hover:bg-black cursor-default rounded-full flex gap-2 items-center px-[9px] bg-white dark:bg-black",
            )}
          >
            {connected ? onlineCount : <Loader visible={true} />}
            <p className="text-muted-foreground">{connected ? "在线" : "离线"}</p>
            <span
              className={cn("h-2 w-2 rounded-full bg-green-500", {
                "bg-red-500": !connected,
              })}
            ></span>
          </Button>
        </section>
      </section>
      <div className="w-full flex justify-end sm:hidden mt-1">
        <Links />
      </div>
      <Overview />
    </div>
  )
}

type links = {
  link: string
  name: string
}

function Links() {
  const links: links[] = [
    { link: "https://github.com/hamster1963/nezha-dash", name: "GitHub" },
    { link: "https://buycoffee.top/coffee", name: "Buycoffee☕️" },
  ]

  return (
    <div className="flex items-center gap-2">
      {links.map((link, index) => {
        return (
          <a
            key={index}
            href={link.link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sm font-medium opacity-50 transition-opacity hover:opacity-100"
          >
            {link.name}
          </a>
        )
      })}
    </div>
  )
}

function Overview() {
  const [mouted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  const timeOption = DateTime.TIME_WITH_SECONDS
  timeOption.hour12 = true
  const [timeString, setTimeString] = useState(
    DateTime.now().setLocale("en-US").toLocaleString(timeOption),
  )
  useEffect(() => {
    const updateTime = () => {
      const now = DateTime.now().setLocale("en-US").toLocaleString(timeOption)
      setTimeString(now)
      requestAnimationFrame(updateTime)
    }
    requestAnimationFrame(updateTime)
  }, [])
  return (
    <section className={"mt-10 flex flex-col md:mt-16"}>
      <p className="text-base font-semibold">{"概览 👋"}</p>
      <div className="flex items-center gap-1.5">
        <p className="text-sm font-medium opacity-50">{"目前时间为"}</p>
        {mouted ? (
          <p className="text-sm font-medium">{timeString}</p>
        ) : (
          <Skeleton className="h-[20px] w-[50px] rounded-[5px] bg-muted-foreground/10 animate-none"></Skeleton>
        )}
      </div>
    </section>
  )
}
export default Header
