"use client"

import * as React from "react"
import { ViewportProvider, useViewport } from "@/contexts/viewport-context"

interface ViewportContainerProps {
  children: React.ReactNode
}

export function ViewportContainer({ children }: ViewportContainerProps) {
  return (
    <ViewportProvider>
      <div className="min-h-screen bg-background">
        {children}
      </div>
    </ViewportProvider>
  )
}

interface ViewportBodyProps {
  children: React.ReactNode
  className?: string
}

function ViewportBodyInner({ children, className = "" }: ViewportBodyProps) {
  const { currentViewport, setCurrentViewport } = useViewport()

  React.useEffect(() => {
    // listen to viewport changes, update border styles
    const observer = new MutationObserver(() => {
      const frame = document.getElementById('viewport-frame')
      if (frame) {
        const maxWidth = frame.style.maxWidth
        if (maxWidth === "1200px") {
          setCurrentViewport("desktop")
        } else if (maxWidth === "768px") {
          setCurrentViewport("tablet")
        } else if (maxWidth === "375px") {
          setCurrentViewport("mobile")
        }
      }
    })

    const frame = document.getElementById('viewport-frame')
    if (frame) {
      observer.observe(frame, { attributes: true, attributeFilter: ['style'] })
    }

    return () => observer.disconnect()
  }, [setCurrentViewport])

  const getViewportStyles = () => {
    switch (currentViewport) {
      case "desktop":
        return {
          border: "none",
          borderRadius: "0",
          background: "hsl(var(--background))",
          padding: "0"
        }
      case "tablet":
        return {
          border: "12px solid #374151",
          borderRadius: "24px",
          background: "hsl(var(--background))",
          padding: "0",
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)"
        }
      case "mobile":
        return {
          border: "8px solid #1f2937",
          borderRadius: "20px",
          background: "hsl(var(--background))",
          padding: "0",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)"
        }
      default:
        return {}
    }
  }

  return (
    <div className="p-4 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div 
        id="viewport-frame"
        className={`
          mx-auto 
          transition-all 
          duration-300 
          ease-in-out
          relative
          overflow-hidden
          ${className}
        `}
        style={{ 
          maxWidth: "1200px",
          ...getViewportStyles()
        }}
      >
        {/* viewport size indicator - only show in non-PC mode */}
        {currentViewport !== "desktop" && (
          <div className="absolute -top-12 right-0 bg-primary/10 border border-primary/20 text-primary text-xs px-3 py-1.5 rounded-full font-mono">
            <span id="viewport-size">1200px</span>
          </div>
        )}
        
        {/* Body content */}
        <div className={currentViewport !== "desktop" ? "relative" : ""}>
          {children}
        </div>
      </div>
    </div>
  )
}

export function ViewportBody(props: ViewportBodyProps) {
  return <ViewportBodyInner {...props} />
} 