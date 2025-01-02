"use client"

import { Loader } from "@/components/loading/Loader"

export default function GlobalLoading() {
  return (
    <section className="flex flex-col gap-4 mt-[3.2px]">
      <div className="flex min-h-40 flex-col items-center justify-center font-medium text-sm">
        加载中...
        <Loader visible={true} />
      </div>
    </section>
  )
}
