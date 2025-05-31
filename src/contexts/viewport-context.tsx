"use client"

import React, { createContext, useContext, useState, ReactNode } from 'react'

export type ViewportSize = "desktop" | "tablet" | "mobile"

interface ViewportContextType {
  currentViewport: ViewportSize
  setCurrentViewport: (viewport: ViewportSize) => void
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

const ViewportContext = createContext<ViewportContextType | undefined>(undefined)

export function ViewportProvider({ children }: { children: ReactNode }) {
  const [currentViewport, setCurrentViewport] = useState<ViewportSize>("desktop")

  const contextValue: ViewportContextType = {
    currentViewport,
    setCurrentViewport,
    isMobile: currentViewport === "mobile",
    isTablet: currentViewport === "tablet", 
    isDesktop: currentViewport === "desktop"
  }

  return (
    <ViewportContext.Provider value={contextValue}>
      {children}
    </ViewportContext.Provider>
  )
}

export function useViewport() {
  const context = useContext(ViewportContext)
  if (context === undefined) {
    throw new Error('useViewport must be used within a ViewportProvider')
  }
  return context
} 