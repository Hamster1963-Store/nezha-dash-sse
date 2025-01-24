export default function Footer() {
  return (
    <footer className="mx-auto w-full max-w-5xl flex items-center justify-between">
      <section className="flex flex-col">
        <div className="mt-3 flex gap-1 text-[13px] font-light tracking-tight text-neutral-600/50 dark:text-neutral-300/50">
          {"代码开源在"}{" "}
          <a
            href="https://github.com/hamster1963/nezha-dash"
            target="_blank"
            className="cursor-pointer font-normal underline decoration-yellow-500 hover:decoration-yellow-600 transition-colors decoration-2 underline-offset-2 dark:decoration-yellow-500/60 dark:hover:decoration-yellow-500/80"
          >
            {"GitHub"}
          </a>
          <p className="font-normal">SSE-Custom</p>
        </div>
        <section className="mt-1 flex items-center gap-2 text-[13px] font-light tracking-tight text-neutral-600/50 dark:text-neutral-300/50">
          {"© 2020-"}
          {new Date().getFullYear()} <a href={"https://buycoffee.top"}>{"Hamster1963"}</a>
        </section>
      </section>
      <p className="mt-1 text-[13px] font-light tracking-tight text-neutral-600/50 dark:text-neutral-300/50">
        <kbd className="pointer-events-none mx-1 inline-flex h-4 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </p>
    </footer>
  )
}
