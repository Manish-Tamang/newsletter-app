import Link from "next/link"

export function SiteFooter() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-zinc-500">Gulle · emails that stay aligned</p>
        <div className="flex gap-5 text-sm text-zinc-600">
          <Link href="/product" className="transition-colors hover:text-zinc-950">
            Product
          </Link>
          <Link href="/dashboard" className="transition-colors hover:text-zinc-950">
            App
          </Link>
        </div>
      </div>
    </footer>
  )
}
