const features = [
  {
    title: "Canvas",
    body: "Add a logo, heading, text, and a button. Every block shares the same gutter so a from-scratch email stays aligned.",
  },
  {
    title: "Campaigns",
    body: "Draft, preview, and send from one place. The editor writes table-based HTML that inbox clients can actually render.",
  },
  {
    title: "Audience",
    body: "Keep contacts in lists, then pick who receives the next send without leaving the workspace.",
  },
  {
    title: "Templates",
    body: "Save layouts you like and reuse them. Start from a security notice, a code email, a product update, or a blank page.",
  },
]

export function ProductOverview() {
  return (
    <section className="border-t border-zinc-200 bg-zinc-50">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-semibold tracking-tight text-zinc-950">What you get</h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-zinc-600">
          The product lives in the app. The site is only here so people can see the shape of it before they open a workspace.
        </p>
        <div className="mt-12 grid gap-5 sm:grid-cols-2">
          {features.map((feature) => (
            <article key={feature.title} className="rounded-2xl border border-zinc-200 bg-white p-6">
              <h3 className="text-base font-semibold text-zinc-950">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">{feature.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
