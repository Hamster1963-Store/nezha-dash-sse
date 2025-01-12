"use client"

import { useServerData } from "@/app/lib/server-data-context"
import { BackIcon } from "@/components/Icon"
import ServerFlag from "@/components/ServerFlag"
import { ServerDetailLoading } from "@/components/loading/ServerDetailLoading"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn, formatBytes, formatNezhaInfo } from "@/lib/utils"
import countries from "i18n-iso-countries"
import enLocale from "i18n-iso-countries/langs/en.json"
import { notFound, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ServerDetailClient({ server_id }: { server_id: number }) {
  const router = useRouter()
  countries.registerLocale(enLocale)

  const [hasHistory, setHasHistory] = useState(false)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" })
  }, [])

  useEffect(() => {
    const previousPath = sessionStorage.getItem("fromMainPage")
    if (previousPath) {
      setHasHistory(true)
    }
  }, [])

  const linkClick = () => {
    if (hasHistory) {
      router.back()
    } else {
      router.push(`/`)
    }
  }

  const { data: serverList, isSSEConnected } = useServerData()
  const serverData = serverList?.result?.find((item) => item.id === server_id)

  if (!serverData && !isSSEConnected) {
    notFound()
  }

  if (!serverData) return <ServerDetailLoading />

  const {
    name,
    online,
    uptime,
    version,
    arch,
    mem_total,
    disk_total,
    country_code,
    platform,
    platform_version,
    cpu_info,
    gpu_info,
    load_1,
    load_5,
    load_15,
    net_out_transfer,
    net_in_transfer,
    last_active_time_string,
  } = formatNezhaInfo(serverData)

  console.log("last_active_time_string", last_active_time_string)

  return (
    <div>
      <div
        onClick={linkClick}
        className="flex flex-none cursor-pointer font-semibold leading-none items-center break-all tracking-tight gap-0.5 text-xl hover:opacity-50 transition-opacity duration-300"
      >
        <BackIcon />
        {name}
      </div>
      <section className="flex flex-wrap gap-2 mt-3">
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">{"状态"}</p>
              <Badge
                className={cn(
                  "text-[9px] rounded-[6px] w-fit px-1 py-0 -mt-[0.3px] dark:text-white",
                  {
                    " bg-green-800": online,
                    " bg-red-600": !online,
                  },
                )}
              >
                {online ? "在线" : "离线"}
              </Badge>
            </section>
          </CardContent>
        </Card>
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">{"在线时长"}</p>
              <div className="text-xs">
                {" "}
                {uptime / 86400 >= 1
                  ? (uptime / 86400).toFixed(0) + " " + "天"
                  : (uptime / 3600).toFixed(0) + " " + "小时"}{" "}
              </div>
            </section>
          </CardContent>
        </Card>
        {version && (
          <Card className="rounded-[10px] bg-transparent border-none shadow-none">
            <CardContent className="px-1.5 py-1">
              <section className="flex flex-col items-start gap-0.5">
                <p className="text-xs text-muted-foreground">{"版本"}</p>
                <div className="text-xs">{version} </div>
              </section>
            </CardContent>
          </Card>
        )}
        {arch && (
          <Card className="rounded-[10px] bg-transparent border-none shadow-none">
            <CardContent className="px-1.5 py-1">
              <section className="flex flex-col items-start gap-0.5">
                <p className="text-xs text-muted-foreground">{"架构"}</p>
                <div className="text-xs">{arch} </div>
              </section>
            </CardContent>
          </Card>
        )}

        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">{"内存"}</p>
              <div className="text-xs">{formatBytes(mem_total)}</div>
            </section>
          </CardContent>
        </Card>
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">{"硬盘"}</p>
              <div className="text-xs">{formatBytes(disk_total)}</div>
            </section>
          </CardContent>
        </Card>
        {country_code && (
          <Card className="rounded-[10px] bg-transparent border-none shadow-none">
            <CardContent className="px-1.5 py-1">
              <section className="flex flex-col items-start gap-0.5">
                <p className="text-xs text-muted-foreground">{"地区"}</p>
                <section className="flex items-start gap-1">
                  <div className="text-xs text-start">{countries.getName(country_code, "en")}</div>
                  <ServerFlag className="text-[11px] -mt-[1px]" country_code={country_code} />
                </section>
              </section>
            </CardContent>
          </Card>
        )}
      </section>
      <section className="flex flex-wrap gap-2 mt-1">
        {platform && (
          <Card className="rounded-[10px] bg-transparent border-none shadow-none">
            <CardContent className="px-1.5 py-1">
              <section className="flex flex-col items-start gap-0.5">
                <p className="text-xs text-muted-foreground">{"系统"}</p>

                <div className="text-xs">
                  {" "}
                  {platform} - {platform_version}{" "}
                </div>
              </section>
            </CardContent>
          </Card>
        )}
        {cpu_info && cpu_info.length > 0 && (
          <Card className="rounded-[10px] bg-transparent border-none shadow-none">
            <CardContent className="px-1.5 py-1">
              <section className="flex flex-col items-start gap-0.5">
                <p className="text-xs text-muted-foreground">{"CPU"}</p>

                <div className="text-xs"> {cpu_info.join(", ")}</div>
              </section>
            </CardContent>
          </Card>
        )}
        {gpu_info && gpu_info.length > 0 && (
          <Card className="rounded-[10px] bg-transparent border-none shadow-none">
            <CardContent className="px-1.5 py-1">
              <section className="flex flex-col items-start gap-0.5">
                <p className="text-xs text-muted-foreground">{"GPU"}</p>
                <div className="text-xs"> {gpu_info.join(", ")}</div>
              </section>
            </CardContent>
          </Card>
        )}
      </section>
      <section className="flex flex-wrap gap-2 mt-1">
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">{"负载"}</p>
              <div className="text-xs">
                {load_1 || "0.00"} / {load_5 || "0.00"} / {load_15 || "0.00"}
              </div>
            </section>
          </CardContent>
        </Card>
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">{"上传"}</p>
              {net_out_transfer ? (
                <div className="text-xs"> {formatBytes(net_out_transfer)} </div>
              ) : (
                <div className="text-xs">Unknown</div>
              )}
            </section>
          </CardContent>
        </Card>
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">{"下载"}</p>
              {net_in_transfer ? (
                <div className="text-xs"> {formatBytes(net_in_transfer)} </div>
              ) : (
                <div className="text-xs">Unknown</div>
              )}
            </section>
          </CardContent>
        </Card>
      </section>
      <section className="flex flex-wrap gap-2 mt-1">
        <Card className="rounded-[10px] bg-transparent border-none shadow-none">
          <CardContent className="px-1.5 py-1">
            <section className="flex flex-col items-start gap-0.5">
              <p className="text-xs text-muted-foreground">{"最后上报时间"}</p>
              <div className="text-xs">
                {last_active_time_string ? last_active_time_string : "N/A"}
              </div>
            </section>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
