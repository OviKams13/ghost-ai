"use client"

import { createContext, useContext } from "react"

interface EditorContextValue {
  openCreateProject: () => void
}

export const EditorContext = createContext<EditorContextValue>({
  openCreateProject: () => {},
})

export function useEditorContext() {
  return useContext(EditorContext)
}
