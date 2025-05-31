"use client"

import * as React from "react"
import { Send, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useViewport } from "@/contexts/viewport-context"

interface ReplyEditorProps {
  onSubmit: (content: string) => void
  onCancel: () => void
  placeholder?: string
  parentAuthor?: string
}

export function ReplyEditor({ 
  onSubmit, 
  onCancel, 
  placeholder = "Write your reply...",
  parentAuthor 
}: ReplyEditorProps) {
  const { isMobile } = useViewport()
  const [content, setContent] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const handleSubmit = async () => {
    if (!content.trim()) return
    
    console.log('Reply editor starting submission:', content.trim())
    setIsSubmitting(true)
    
    try {
      // Simulate submission delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      console.log('Preparing to call onSubmit:', content.trim())
      // Call callback function first
      onSubmit(content.trim())
      
      console.log('onSubmit called, preparing to clear content')
      // Then clear content and reset state
      setContent("")
    } catch (error) {
      console.error('Failed to submit reply:', error)
    } finally {
      setIsSubmitting(false)
      console.log('Submission state reset completed')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      handleSubmit()
    }
    if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <div className={`border border-blue-200 rounded-lg bg-blue-50/30 dark:border-blue-800 dark:bg-blue-900/10 ${isMobile ? 'p-3' : 'p-4'}`}>
      <div className={`flex ${isMobile ? 'space-x-2' : 'space-x-3'}`}>
        <Avatar className={`ring-1 ring-border ${isMobile ? 'h-6 w-6 flex-shrink-0' : 'h-8 w-8'}`}>
          <AvatarFallback className={`bg-muted text-muted-foreground ${isMobile ? 'text-xs' : 'text-xs'}`}>
            Me
          </AvatarFallback>
        </Avatar>
        
        <div className={`flex-1 min-w-0 ${isMobile ? 'space-y-2' : 'space-y-3'}`}>
          {parentAuthor && (
            <div className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
              Reply to <span className="font-medium text-foreground">@{parentAuthor}</span>
            </div>
          )}
          
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`border-input focus:border-blue-500 focus:ring-blue-500 resize-none bg-background text-foreground dark:focus:border-blue-400 dark:focus:ring-blue-400 ${
              isMobile ? 'min-h-[60px] text-sm' : 'min-h-[80px]'
            }`}
            autoFocus
          />
          
          {/* 移动端布局 */}
          {isMobile ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCancel}
                  className="h-8 text-xs flex-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3 w-3 mr-1" />
                </Button>
                
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={!content.trim() || isSubmitting}
                  className="h-8 text-xs flex-1 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  <Send className="h-3 w-3 mr-1" />
                </Button>
              </div>
              <div className="text-xs text-muted-foreground text-center">
                Ctrl+Enter to send
              </div>
            </div>
          ) : (
            /* 桌面端布局 */
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">
                Press Ctrl+Enter to send quickly, ESC to cancel
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCancel}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                
                <Button
                  size="sm"
                  onClick={handleSubmit}
                  disabled={!content.trim() || isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-700 dark:hover:bg-blue-800"
                >
                  <Send className="h-4 w-4 mr-1" />
                  {isSubmitting ? "Sending..." : "Send"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 