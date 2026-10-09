import Link from "next/link"

const steps = [
  {
    title: "Open a canvas",
    body: "Start empty or pick a layout. New blocks inherit the email alignment, accent color, and side margin.",
  },
  {
    title: "Stack the letter",
    body: "Headings sit tight on body copy. Buttons follow text. Footers get a little more air. You do not fight the gap.",
  },
  {
    title: "Send from campaigns",
    body: "The same document becomes HTML for the inbox. Colors, radius, and alignment travel with the theme.",
  },
]

const surfaces = [
  { name: "Dashboard", href: "/dashboard", note: "Activity and recent sends" },
  { name: "Campaigns", href: "/campaigns", note: "Write and ship letters" },
  { name: "Editor", href: "/editor", note: "The block canvas" },
  { name: "Subscribers", href: "/subscribers", note: "People and lists" },
  { name: "Templates", href: "/templates", note: "Reusable layouts" },
  { name: "Settings", href: "/settings", note: "Workspace defaults" },
]

export function ProductDetails() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-20">
      <p className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-500">Product</p>
      <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
        The workspace is the product.
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-zinc-600">
        Gulle is not a page builder that later becomes email. You compose in the same rhythm the inbox will show: one card, one margin, blocks that know what sits above them.
      </p>

      <ol className="mt-14 grid gap-6 md:grid-cols-3">
        {steps.map((step, index) => (
          <li key={step.title} className="rounded-2xl border border-zinc-200 bg-white p-6">
            <span className="text-xs font-semibold text-zinc-400">{String(index + 1).padStart(2, "0")}</span>
            <h2 className="mt-3 text-lg font-semibold text-zinc-950">{step.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">{step.body}</p>
          </li>
        ))}
      </ol>

      <div className="mt-16">
        <h2 className="text-2xl font-semibold tracking-tight text-zinc-950">Inside the app</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
          These routes are the product. Open any of them when you are ready to work.
        </p>
        <ul className="mt-8 divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white">
          {surfaces.map((item) => (
            <li key={item.name}>
              <Link href={item.href} className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-zinc-50">
                <span className="text-sm font-medium text-zinc-950">{item.name}</span>
                <span className="text-sm text-zinc-500">{item.note}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
