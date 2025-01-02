import { NezhaAPISafe } from "@/app/types/nezha-api"
import ServerFlag from "@/components/ServerFlag"
import ServerUsageBar from "@/components/ServerUsageBar"
import { Card } from "@/components/ui/card"
import { GetFontLogoClass, GetOsName, MageMicrosoftWindows } from "@/lib/logo-class"
import { cn, formatBytes, formatNezhaInfo } from "@/lib/utils"
import Link from "next/link"

import { Separator } from "./ui/separator"

export default function ServerCardInline({ serverInfo }: { serverInfo: NezhaAPISafe }) {
  const { id, name, country_code, online, cpu, up, down, mem, stg, host } =
    formatNezhaInfo(serverInfo)

  const showFlag = true

  const saveSession = () => {
    sessionStorage.setItem("fromMainPage", "true")
  }

  return online ? (
    <Link onClick={saveSession} href={`/server/${id}`} prefetch={true}>
      <Card
        className={cn(
          "flex items-center lg:flex-row justify-start gap-3 p-3 md:px-5 cursor-pointer hover:bg-accent/50 transition-colors min-w-[900px] w-full",
        )}
      >
        <section
          className={cn("grid items-center gap-2 lg:w-36")}
          style={{ gridTemplateColumns: "auto auto 1fr" }}
        >
          <span className="h-2 w-2 shrink-0 rounded-full bg-green-500 self-center"></span>
          <div
            className={cn(
              "flex items-center justify-center",
              showFlag ? "min-w-[17px]" : "min-w-0",
            )}
          >
            {showFlag ? <ServerFlag country_code={country_code} /> : null}
          </div>
          <div className="relative w-28">
            <p
              className={cn(
                "break-all font-bold tracking-tight",
                showFlag ? "text-xs " : "text-sm",
              )}
            >
              {name}
            </p>
          </div>
        </section>
        <Separator orientation="vertical" className="h-8 mx-0 ml-2" />
        <div className="flex flex-col gap-2">
          <section className={cn("grid grid-cols-9 items-center gap-3 flex-1")}>
            <div className={"items-center flex flex-row gap-2 whitespace-nowrap"}>
              <div className="text-xs font-semibold">
                {host.Platform.includes("Windows") ? (
                  <MageMicrosoftWindows className="size-[10px]" />
                ) : (
                  <p className={`fl-${GetFontLogoClass(host.Platform)}`} />
                )}
              </div>
              <div className={"flex w-14 flex-col"}>
                <p className="text-xs text-muted-foreground">{"系统"}</p>
                <div className="flex items-center text-[10.5px] font-semibold">
                  {host.Platform.includes("Windows") ? "Windows" : GetOsName(host.Platform)}
                </div>
              </div>
            </div>
            <div className={"flex w-20 flex-col"}>
              <p className="text-xs text-muted-foreground">{"在线"}</p>
              <div className="flex items-center text-xs font-semibold">
                {(serverInfo?.status.Uptime / 86400).toFixed(0)} {"Days"}
              </div>
            </div>
            <div className={"flex w-14 flex-col"}>
              <p className="text-xs text-muted-foreground">{"CPU"}</p>
              <div className="flex items-center text-xs font-semibold">{cpu.toFixed(2)}%</div>
              <ServerUsageBar value={cpu} />
            </div>
            <div className={"flex w-14 flex-col"}>
              <p className="text-xs text-muted-foreground">{"内存"}</p>
              <div className="flex items-center text-xs font-semibold">{mem.toFixed(2)}%</div>
              <ServerUsageBar value={mem} />
            </div>
            <div className={"flex w-14 flex-col"}>
              <p className="text-xs text-muted-foreground">{"存储"}</p>
              <div className="flex items-center text-xs font-semibold">{stg.toFixed(2)}%</div>
              <ServerUsageBar value={stg} />
            </div>
            <div className={"flex w-16 flex-col"}>
              <p className="text-xs text-muted-foreground">{"上传"}</p>
              <div className="flex items-center text-xs font-semibold">
                {up >= 1024 ? `${(up / 1024).toFixed(2)}G/s` : `${up.toFixed(2)}M/s`}
              </div>
            </div>
            <div className={"flex w-16 flex-col"}>
              <p className="text-xs text-muted-foreground">{"下载"}</p>
              <div className="flex items-center text-xs font-semibold">
                {down >= 1024 ? `${(down / 1024).toFixed(2)}G/s` : `${down.toFixed(2)}M/s`}
              </div>
            </div>
            <div className={"flex w-20 flex-col"}>
              <p className="text-xs text-muted-foreground">{"总上传"}</p>
              <div className="flex items-center text-xs font-semibold">
                {formatBytes(serverInfo.status.NetOutTransfer)}
              </div>
            </div>
            <div className={"flex w-20 flex-col"}>
              <p className="text-xs text-muted-foreground">{"总下载"}</p>
              <div className="flex items-center text-xs font-semibold">
                {formatBytes(serverInfo.status.NetInTransfer)}
              </div>
            </div>
          </section>
        </div>
      </Card>
    </Link>
  ) : (
    <Card
      className={cn(
        "flex items-center justify-start gap-3 p-3 md:px-5 min-h-[61px] min-w-[900px] flex-row",
      )}
    >
      <section
        className={cn("grid items-center gap-2 lg:w-40")}
        style={{ gridTemplateColumns: "auto auto 1fr" }}
      >
        <span className="h-2 w-2 shrink-0 rounded-full bg-red-500 self-center"></span>
        <div
          className={cn("flex items-center justify-center", showFlag ? "min-w-[17px]" : "min-w-0")}
        >
          {showFlag ? <ServerFlag country_code={country_code} /> : null}
        </div>
        <div className="relative w-28">
          <p className={cn("break-all font-bold tracking-tight", showFlag ? "text-xs" : "text-sm")}>
            {name}
          </p>
        </div>
      </section>
    </Card>
  )
}
