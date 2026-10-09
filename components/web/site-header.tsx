import Link from "next/link"
import Image from "next/image"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200/80 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Gulle" width={32} height={32} className="h-8 w-8" />
          <span className="text-[17px] font-semibold tracking-tight text-zinc-950">Gulle</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/product" className="text-zinc-600 transition-colors hover:text-zinc-950">
            Product
          </Link>
          <Link href="/dashboard" className="rounded-full bg-zinc-950 px-4 py-2 text-white transition-colors hover:bg-zinc-800">
            Open app
          </Link>
        </nav>
      </div>
    </header>
  )
}
