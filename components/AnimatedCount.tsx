import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"



export default function AnimateCountClient({
  count,
  className,
}: {
  count: number
  className?: string
}) {
  const [previousCount, setPreviousCount] = useState(count)

  useEffect(() => {
    if (count !== previousCount) {
      setTimeout(() => {
        setPreviousCount(count)
      }, 300)
    }
  }, [count])
  return (
    <AnimateCount
      key={count}
      preCount={previousCount}
      className={cn("inline-flex items-center leading-none", className)}
      data-issues-count-animation
    >
      {count}
    </AnimateCount>
  )
}

export function AnimateCount({
  children: count,
  className,
  preCount,
  ...props
}: {
  children: number
  className?: string
  preCount?: number
}) {
  const currentDigits = count.toString().split("")
  const previousDigits = (
    preCount !== undefined ? preCount.toString() : count - 1 >= 0 ? (count - 1).toString() : "0"
  ).split("")

  // Only pad with zeros if both numbers need to maintain the same length for animation
  const maxLength = Math.max(previousDigits.length, currentDigits.length)
  while (previousDigits.length < maxLength) {
    previousDigits.unshift("0")
  }
  while (currentDigits.length < maxLength && previousDigits[0] === "0") {
    currentDigits.unshift("0")
  }

  return (
    <div {...props} className={cn("flex h-[1em] items-center", className)}>
      {currentDigits.map((digit, index) => {
        const hasChanged = digit !== previousDigits[index]
        return (
          <div
            key={`${index}-${digit}`}
            className={cn("relative h-full flex items-center min-w-[0.6em] text-center", {
              "min-w-[0.2em]": digit === ".",
            })}
          >
            <div
              aria-hidden
              data-issues-count-exit
              className={cn(
                "absolute inset-0 flex items-center justify-center",
                hasChanged ? "animate" : "opacity-0",
              )}
            >
              {previousDigits[index]}
            </div>
            <div
              data-issues-count-enter
              className={cn(
                "absolute inset-0 flex items-center justify-center",
                hasChanged && "animate",
              )}
            >
              {digit}
            </div>
          </div>
        )
      })}
    </div>
  )
}
