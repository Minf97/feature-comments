"use client"

import * as React from "react"
import { Send, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

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
    <div className="border border-blue-200 rounded-lg p-4 bg-blue-50/30 dark:border-blue-800 dark:bg-blue-900/10">
      <div className="flex space-x-3">
        <Avatar className="h-8 w-8 ring-1 ring-border">
          <AvatarFallback className="bg-muted text-muted-foreground text-xs">
            Me
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 space-y-3">
          {parentAuthor && (
            <div className="text-sm text-muted-foreground">
              Reply to <span className="font-medium text-foreground">@{parentAuthor}</span>
            </div>
          )}
          
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="min-h-[80px] border-input focus:border-blue-500 focus:ring-blue-500 resize-none bg-background text-foreground dark:focus:border-blue-400 dark:focus:ring-blue-400"
            autoFocus
          />
          
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
        </div>
      </div>
    </div>
  )
} 