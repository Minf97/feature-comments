"use client"

import * as React from "react"
import { Star, ThumbsUp, CheckCircle, Award, Calendar } from "lucide-react"
import { toast } from "sonner"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ReplyEditor } from "./reply-editor"

interface Comment {
  id: number
  title: string
  body: string
  reviewer_name: string
  product_handle: string
  timestamp: string
  rating: number
  helpful_count: number
  verified_purchase: boolean
  featured: boolean
}

interface CommentCardProps {
  comment: Comment
  onHelpful?: (commentId: number) => void
}

export function CommentCard({ comment, onHelpful }: CommentCardProps) {
  const [isHelpful, setIsHelpful] = React.useState(false)
  const [helpfulCount, setHelpfulCount] = React.useState(comment.helpful_count)
  const [showReplyEditor, setShowReplyEditor] = React.useState(false)

  const handleHelpful = () => {
    if (!isHelpful) {
      setIsHelpful(true)
      setHelpfulCount(prev => prev + 1)
      onHelpful?.(comment.id)
    } else {
      setIsHelpful(false)
      setHelpfulCount(prev => prev - 1)
      onHelpful?.(comment.id)
    }
  }

  const handleReplyClick = () => {
    setShowReplyEditor(true)
  }

  const handleReplySubmit = (content: string) => {
    console.log('Regular comment card received reply submission:', content)
    setShowReplyEditor(false)
    toast("Reply Successful!", {
      description: "Your reply has been published."
    })
  }

  const handleReplyCancel = () => {
    setShowReplyEditor(false)
  }

  const formatDate = (timestamp: string) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating 
            ? 'fill-orange-400 text-orange-400' 
            : 'fill-gray-200 text-gray-200'
        }`}
      />
    ))
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600'
    if (rating >= 3) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <Card className={`relative border transition-all duration-200 hover:shadow-lg ${
      comment.featured ? 'ring-1 ring-blue-200 bg-blue-50/30 border-blue-200' : 'hover:border-gray-300'
    }`}>
      {comment.featured && (
        <div className="absolute -top-2 -left-2 z-10">
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md">
            <Award className="h-3 w-3 mr-1" />
            Featured Comment
          </Badge>
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* 用户信息和评分 */}
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <Avatar className="h-12 w-12 ring-2 ring-gray-100">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-bold">
                  {getInitials(comment.reviewer_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-semibold text-gray-900">{comment.reviewer_name}</h4>
                  {comment.verified_purchase && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Verified Purchase
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    {renderStars(comment.rating)}
                    <span className={`text-sm font-medium ml-1 ${getRatingColor(comment.rating)}`}>
                      {comment.rating}.0
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(comment.timestamp)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 评论内容 */}
          <div className="space-y-3">
            <h3 className="font-medium text-lg text-gray-900 leading-relaxed">
              {comment.title}
            </h3>
            
            <p className="text-gray-700 leading-relaxed text-base">
              {comment.body}
            </p>
          </div>
          
          <Separator className="my-4" />
          
          {/* 底部操作区域 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleHelpful}
                className={`h-8 text-sm transition-all ${
                  isHelpful 
                    ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-600' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <ThumbsUp className={`h-4 w-4 mr-1 ${isHelpful ? 'fill-current' : ''}`} />
                Helpful ({helpfulCount})
              </Button>
              
              <Button variant="ghost" size="sm" className="h-8 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50" onClick={handleReplyClick}>
                Reply
              </Button>
            </div>
            
            <div className="text-xs text-gray-400">
              {comment.product_handle.replace(/-/g, ' ').replace(/cat allergen neutralizing spray/, 'Cat Allergen Neutralizing Spray')}
            </div>
          </div>

          {/* Reply Editor */}
          {showReplyEditor && (
            <div className="mt-4">
              <ReplyEditor
                onSubmit={handleReplySubmit}
                onCancel={handleReplyCancel}
                parentAuthor={comment.reviewer_name}
                placeholder="Write your reply..."
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}