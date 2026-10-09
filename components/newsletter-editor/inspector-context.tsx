"use client"

import { createContext, useContext } from "react"

export type InspectorTab = "email" | "block"

const InspectorContext = createContext<InspectorTab>("email")

export function InspectorProvider({ tab, children }: { tab: InspectorTab; children: React.ReactNode }) {
  return <InspectorContext.Provider value={tab}>{children}</InspectorContext.Provider>
}

export function useInspectorTab() {
  return useContext(InspectorContext)
}
