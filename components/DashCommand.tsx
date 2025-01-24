"use client"

import { Home, Languages, Moon, Sun, SunMoon } from "lucide-react"

import { useServerData } from "@/app/lib/server-data-context"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export function DashCommand() {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const { data } = useServerData()
  const router = useRouter()
  const { setTheme } = useTheme()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  if (!data?.result) return null

  const sortedServers = data.result.sort((a, b) => {
    const displayIndexDiff = (b.display_index || 0) - (a.display_index || 0)
    if (displayIndexDiff !== 0) return displayIndexDiff
    return a.id - b.id
  })

  const shortcuts = [
    {
      keywords: ["home", "homepage"],
      icon: <Home />,
      label: "Home",
      action: () => router.push("/"),
    },
    {
      keywords: ["light", "theme", "lightmode"],
      icon: <Sun />,
      label: "ToggleLightMode",
      action: () => setTheme("light"),
    },
    {
      keywords: ["dark", "theme", "darkmode"],
      icon: <Moon />,
      label: "ToggleDarkMode",
      action: () => setTheme("dark"),
    },
    {
      keywords: ["system", "theme", "systemmode"],
      icon: <SunMoon />,
      label: "ToggleSystemMode",
      action: () => setTheme("system"),
    },
  ].map((item) => ({
    ...item,
    value: `${item.keywords.join(" ")} ${item.label}`,
  }))

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={"TypeCommand"} value={search} onValueChange={setSearch} />
        <CommandList>
          <CommandEmpty>{"No Results"}</CommandEmpty>
          <CommandGroup heading={"Servers"}>
            {sortedServers.map((server) => (
              <CommandItem
                key={server.id}
                value={server.name}
                onSelect={() => {
                  router.push(`/server/${server.id}`)
                  setOpen(false)
                }}
              >
                {server.online_status ? (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-green-500 self-center" />
                ) : (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-red-500 self-center" />
                )}
                <span>{server.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />

          <CommandGroup heading={"Shortcuts"}>
            {shortcuts.map((item) => (
              <CommandItem
                key={item.label}
                value={item.value}
                onSelect={() => {
                  item.action()
                  setOpen(false)
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
