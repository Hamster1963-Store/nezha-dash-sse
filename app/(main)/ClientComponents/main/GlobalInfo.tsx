"use client"

type GlobalInfoProps = {
  countries: string[]
}

export default function GlobalInfo({ countries }: GlobalInfoProps) {
  return (
    <section className="flex items-center justify-between">
      <p className="text-sm font-medium opacity-40">
        {"服务器分布在"} {countries.length} {"个地区"}
      </p>
    </section>
  )
}
