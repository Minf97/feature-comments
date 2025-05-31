"use client"

import * as React from "react"
import Link from "next/link"
import { Github, Component, Monitor, Tablet, Smartphone } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { useViewport, type ViewportSize } from "@/contexts/viewport-context"

interface ViewportConfig {
  maxWidth: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  description: string
}

const viewportConfigs: Record<ViewportSize, ViewportConfig> = {
  desktop: {
    maxWidth: "1200px",
    label: "PC",
    icon: Monitor,
    description: "Desktop view (1200px)"
  },
  tablet: {
    maxWidth: "768px",
    label: "Pad",
    icon: Tablet,
    description: "Tablet view (768px)"
  },
  mobile: {
    maxWidth: "375px",
    label: "Phone",
    icon: Smartphone,
    description: "Mobile view (375px)"
  }
}

export function Headers() {
  const { currentViewport, setCurrentViewport } = useViewport()

  const handleLoginClick = () => {
    toast("Coming soon!", {
      description: "Login functionality will be available soon.",
    })
  }

  const handleViewportChange = (viewport: ViewportSize) => {
    setCurrentViewport(viewport)
    
    const config = viewportConfigs[viewport]
    
    // only adjust the viewport container width of the Body area
    const viewportFrame = document.getElementById('viewport-frame')
    const viewportSizeIndicator = document.getElementById('viewport-size')
    
    if (viewportFrame) {
      viewportFrame.style.maxWidth = config.maxWidth
      viewportFrame.style.transition = "max-width 0.3s ease-in-out"
    }
    
    if (viewportSizeIndicator) {
      viewportSizeIndicator.textContent = config.maxWidth
    }

    toast(`Switched to ${config.label}`, {
      description: config.description,
    })
  }

  return (
    <header className="sticky select-none top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between px-6">
        {/* Left side - Logo and repo name */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <Component className="h-6 w-6" />
            <span className="font-bold hidden sm:inline-block">
              feature-comments
            </span>
          </Link>
        </div>

        {/* Center - Responsive View Controls */}
        <div className="flex items-center justify-center">
          <div className="flex items-center space-x-1 rounded-lg border bg-muted/50 p-1">
            {Object.entries(viewportConfigs).map(([key, config]) => {
              const Icon = config.icon
              const isActive = currentViewport === key
              
              return (
                <Button
                  key={key}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleViewportChange(key as ViewportSize)}
                  className="h-8 px-3 transition-all duration-200"
                  title={config.description}
                >
                  <Icon className="h-4 w-4 mr-1" />
                  <span className="hidden md:inline">{config.label}</span>
                </Button>
              )
            })}
          </div>
        </div>

        {/* Right side - Navigation */}
        <div className="flex items-center space-x-2">
          <nav className="flex items-center space-x-2">
            {/* GitHub Button */}
            <Button variant="outline" size="icon" asChild className="hover:bg-accent transition-colors">
              <Link
                href="https://github.com/Minf97/feature-comments"
                target="_blank"
                rel="noopener noreferrer"
                title="View on GitHub"
              >
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </Link>
            </Button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Login Button */}
            <Button onClick={handleLoginClick} size="sm" className="hidden sm:inline-flex transition-colors">
              Login
            </Button>
          </nav>
        </div>
      </div>
    </header>
  )
} 