import Link from "next/link"

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-20 pt-20 sm:pt-28">
      <p className="mb-5 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Newsletter workspace</p>
      <h1 className="max-w-3xl text-5xl font-semibold leading-[1.08] tracking-tight text-zinc-950 sm:text-6xl">
        Write emails that look finished.
      </h1>
      <p className="mt-6 max-w-xl text-lg leading-relaxed text-zinc-600">
        Gulle is a block canvas for campaigns, subscribers, and templates. Start blank, keep one margin, and send work that already looks like a real product email.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-3">
        <Link
          href="/dashboard"
          className="inline-flex h-11 items-center rounded-full bg-zinc-950 px-5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
        >
          Open the app
        </Link>
        <Link
          href="/product"
          className="inline-flex h-11 items-center rounded-full border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-900 transition-colors hover:border-zinc-300"
        >
          See how it works
        </Link>
      </div>
    </section>
  )
}
