import type { Metadata } from "next"
import { ProductDetails } from "@/components/web/product-details"

export const metadata: Metadata = {
  title: "Product",
  description: "How Gulle works: canvas, campaigns, subscribers, and templates.",
}

export default function ProductPage() {
  return <ProductDetails />
}
