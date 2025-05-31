"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type ViewportSize = "desktop" | "tablet" | "mobile"

interface ViewportContextType {
  currentViewport: ViewportSize
  setCurrentViewport: (viewport: ViewportSize) => void
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
}

const ViewportContext = createContext<ViewportContextType | undefined>(undefined)

// 响应式断点定义
const MOBILE_BREAKPOINT = 768
const TABLET_BREAKPOINT = 1024

// 根据窗口宽度确定viewport类型
function getViewportFromWidth(width: number): ViewportSize {
  if (width < MOBILE_BREAKPOINT) return "mobile"
  if (width < TABLET_BREAKPOINT) return "tablet"
  return "desktop"
}

export function ViewportProvider({ children }: { children: ReactNode }) {
  // 使用懒初始化，在客户端直接根据窗口宽度设定初始值
  const [currentViewport, setCurrentViewport] = useState<ViewportSize>(() => {
    // 检查是否在客户端环境
    if (typeof window !== 'undefined') {
      return getViewportFromWidth(window.innerWidth)
    }
    // 服务端渲染时使用desktop作为默认值
    return "desktop"
  })
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    let lastUpdateTime = 0
    const MIN_UPDATE_INTERVAL = 200 // 减少到200ms，提高响应性
    
    // 更新视口尺寸的函数
    const updateViewport = () => {
      const now = Date.now()
      const width = window.innerWidth
      const newViewport = getViewportFromWidth(width)
      
      // 防止过于频繁的更新
      if (now - lastUpdateTime < MIN_UPDATE_INTERVAL && isInitialized) {
        return
      }
      
      // 只有当viewport真正改变时才更新状态
      setCurrentViewport(prev => {
        if (prev !== newViewport) {
          lastUpdateTime = now
          return newViewport
        }
        return prev
      })
      
      if (!isInitialized) {
        setIsInitialized(true)
        lastUpdateTime = now
      }
    }

    // 只在未初始化或者需要时才更新
    if (!isInitialized) {
      updateViewport()
    }

    // 减少防抖时间到200ms，提高响应性
    let timeoutId: NodeJS.Timeout
    const debouncedUpdate = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(updateViewport, 200)
    }

    // 监听窗口大小变化
    window.addEventListener('resize', debouncedUpdate)
    
    // 监听设备方向变化（移动设备）
    window.addEventListener('orientationchange', () => {
      setTimeout(updateViewport, 100)
    })

    // 清理事件监听器
    return () => {
      window.removeEventListener('resize', debouncedUpdate)
      window.removeEventListener('orientationchange', updateViewport)
      clearTimeout(timeoutId)
    }
  }, [isInitialized])

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