export type SavedDesign = {
  html: string
  design: any
  timestamp: string
}

export function saveDesignToLocalStorage(storageKey: string, html: string, design: any, setStatus?: (s: string) => void) {
  try {
    setStatus?.("Saving...")
    const dataToSave: SavedDesign = { html, design, timestamp: new Date().toISOString() }
    localStorage.setItem(storageKey, JSON.stringify(dataToSave))
    setStatus?.("Saved to browser")
    setTimeout(() => setStatus?.(""), 2000)
  } catch (error) {
    setStatus?.("Save failed")
    console.error("Error saving design to localStorage:", error)
  }
}

export function loadSavedDesign(storageKey: string) {
  try {
    const savedData = localStorage.getItem(storageKey)
    if (!savedData) return null
    return JSON.parse(savedData) as SavedDesign
  } catch (error) {
    console.error("Failed to load saved design from localStorage:", error)
    return null
  }
}


