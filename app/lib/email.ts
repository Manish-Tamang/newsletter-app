export function extractPlainTextFromHtml(html: string) {
  if (typeof window === "undefined") return ""
  const div = document.createElement("div")
  div.innerHTML = html
  return div.textContent || div.innerText || ""
}


