"use client"

import { useState } from 'react'
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Star, 
  ThumbsUp, 
  MessageCircle, 
  Calendar, 
  Award, 
  CheckCircle,
  Heart,
  Flag,
  Share,
  MoreHorizontal,
  ZoomIn
} from "lucide-react"
import { ReplyEditor } from './reply-editor'
import Lightbox from "yet-another-react-lightbox"
import "yet-another-react-lightbox/styles.css"
import { useViewport } from "@/contexts/viewport-context"

interface CommentImage {
  url: string
  alt: string
}

interface Reply {
  id: number
  author: string
  content: string
  timestamp: string
  likes: number
  parentId?: number
}

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
  images?: CommentImage[]
  replies?: Reply[]
  likes?: number
  has_follow_up?: boolean
  follow_up?: {
    content: string
    timestamp: string
    days_later: number
  }
}

interface EnhancedCommentCardProps {
  comment: Comment
  variant?: "default" | "with-images" | "with-replies"
  onHelpful?: (commentId: number) => void
  onLike?: (commentId: number) => void
  onReport?: (commentId: number) => void
  onReply?: (commentId: number) => void
}

export function EnhancedCommentCard({ 
  comment, 
  variant = "default",
  onHelpful, 
  onLike,
  onReport,
  onReply
}: EnhancedCommentCardProps) {
  const { isMobile } = useViewport()
  const [isHelpful, setIsHelpful] = useState(false)
  const [helpfulCount, setHelpfulCount] = useState(comment.helpful_count)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(comment.likes || 0)
  const [showAllImages, setShowAllImages] = useState(false)
  const [showReplyEditor, setShowReplyEditor] = useState(false)
  const [replies, setReplies] = useState<Reply[]>(comment.replies || [])
  
  // 正确初始化回复的点赞状态，包含现有回复的点赞数
  const [replyLikes, setReplyLikes] = useState<{[key: number]: {liked: boolean, count: number}}>(() => {
    const initialReplyLikes: {[key: number]: {liked: boolean, count: number}} = {}
    if (comment.replies) {
      comment.replies.forEach(reply => {
        initialReplyLikes[reply.id] = { liked: false, count: reply.likes }
      })
    }
    return initialReplyLikes
  })
  
  const [nestedReplyEditor, setNestedReplyEditor] = useState<{replyId: number, parentAuthor: string} | null>(null)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const handleHelpful = () => {
    setIsHelpful(!isHelpful)
    setHelpfulCount(prev => isHelpful ? prev - 1 : prev + 1)
    onHelpful?.(comment.id)
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
    onLike?.(comment.id)
  }

  const handleReplyClick = () => {
    setShowReplyEditor(!showReplyEditor)
  }

  const handleReplySubmit = (content: string) => {
    const newReply: Reply = {
      id: replies.length + 1,
      author: "Current User",
      content,
      timestamp: new Date().toISOString(),
      likes: 0
    }
    
    setReplies(prev => [...prev, newReply])
    setReplyLikes(prev => ({
      ...prev,
      [newReply.id]: { liked: false, count: 0 }
    }))
    setShowReplyEditor(false)
    
    // Display success message
    const successToast = document.createElement('div')
    successToast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
    successToast.textContent = 'Reply posted successfully!'
    document.body.appendChild(successToast)
    setTimeout(() => {
      document.body.removeChild(successToast)
    }, 3000)
    
    onReply?.(comment.id)
  }

  const handleReplyCancel = () => {
    setShowReplyEditor(false)
  }

  const handleReplyLike = (replyId: number) => {
    setReplyLikes(prev => {
      // 找到对应的回复对象获取原始点赞数
      const reply = replies.find(r => r.id === replyId)
      const originalLikes = reply ? reply.likes : 0
      
      const current = prev[replyId] || { liked: false, count: originalLikes }
      return {
        ...prev,
        [replyId]: {
          liked: !current.liked,
          count: current.liked ? current.count - 1 : current.count + 1
        }
      }
    })
  }

  const handleNestedReply = (replyId: number, parentAuthor: string) => {
    setNestedReplyEditor({ replyId, parentAuthor })
  }

  const handleNestedReplySubmit = (content: string, parentId: number) => {
    const newReply: Reply = {
      id: replies.length + 1000, // Use large number to avoid conflicts
      author: "Current User",
      content,
      timestamp: new Date().toISOString(),
      likes: 0,
      parentId: parentId
    }
    
    setReplies(prev => [...prev, newReply])
    setReplyLikes(prev => ({
      ...prev,
      [newReply.id]: { liked: false, count: 0 }
    }))
    setNestedReplyEditor(null)
    
    // Display success message
    const successToast = document.createElement('div')
    successToast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50'
    successToast.textContent = 'Reply posted successfully!'
    document.body.appendChild(successToast)
    setTimeout(() => {
      document.body.removeChild(successToast)
    }, 3000)
  }

  const handleNestedReplyCancel = () => {
    setNestedReplyEditor(null)
  }

  const buildReplyTree = (replies: Reply[]) => {
    const replyMap: {[key: number]: Reply[]} = {}
    const topLevelReplies: Reply[] = []
    
    replies.forEach(reply => {
      if (reply.parentId) {
        if (!replyMap[reply.parentId]) {
          replyMap[reply.parentId] = []
        }
        replyMap[reply.parentId].push(reply)
      } else {
        topLevelReplies.push(reply)
      }
    })
    
    return { topLevelReplies, replyMap }
  }

  const renderReply = (reply: Reply, depth: number = 0): React.ReactNode => {
    const { replyMap } = buildReplyTree(replies)
    const childReplies = replyMap[reply.id] || []
    
    // 移动端优化的缩进距离
    const getMarginClass = (depth: number) => {
      if (isMobile) {
        // 移动端使用更小的缩进距离
        switch(depth) {
          case 0: return 'ml-0'
          case 1: return 'ml-3'
          case 2: return 'ml-6'
          case 3: return 'ml-9'
          default: return 'ml-12'
        }
      } else {
        // 桌面端保持原有缩进
        switch(depth) {
          case 0: return 'ml-0'
          case 1: return 'ml-6'
          case 2: return 'ml-12'
          case 3: return 'ml-18'
          default: return 'ml-24'
        }
      }
    }

    const replyLike = replyLikes[reply.id] || { liked: false, count: reply.likes }

    return (
      <div key={reply.id} className={`${getMarginClass(depth)} space-y-3`}>
        <div className="bg-muted rounded-lg p-3 border">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-2 flex-1">
              <Avatar className={`ring-2 ring-gray-100 ${isMobile ? 'h-6 w-6' : 'h-8 w-8'}`}>
                <AvatarFallback className={`bg-blue-500 text-white ${isMobile ? 'text-xs' : 'text-xs'}`}>
                  {reply.author.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className={`flex items-center space-x-2 mb-1 ${isMobile ? 'flex-col items-start space-x-0 space-y-1' : ''}`}>
                  <span className={`font-medium text-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>{reply.author}</span>
                  <span className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-xs'}`}>{formatDate(reply.timestamp)}</span>
                </div>
                <p className={`text-muted-foreground leading-relaxed ${isMobile ? 'text-xs' : 'text-sm'}`}>{reply.content}</p>
              </div>
            </div>
          </div>
          
          <div className={`flex items-center justify-between pt-2 border-t border-border ${isMobile ? 'mt-2' : 'mt-3'}`}>
            <div className={`flex items-center ${isMobile ? 'space-x-2' : 'space-x-3'}`}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleReplyLike(reply.id)}
                className={`transition-all ${isMobile ? 'h-5 text-xs px-2' : 'h-6 text-xs'} ${
                  replyLike.liked 
                    ? 'text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 hover:text-red-700' 
                    : 'text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                }`}
              >
                <Heart className={`${isMobile ? 'h-2.5 w-2.5 mr-0.5' : 'h-3 w-3 mr-1'} ${replyLike.liked ? 'fill-current' : ''}`} />
                <span className={isMobile ? 'text-xs' : ''}>{replyLike.count}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleNestedReply(reply.id, reply.author)}
                className={`text-muted-foreground hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 ${isMobile ? 'h-5 text-xs px-2' : 'h-6 text-xs'}`}
              >
                <MessageCircle className={`${isMobile ? 'h-2.5 w-2.5 mr-0.5' : 'h-3 w-3 mr-1'}`} />
                <span className={isMobile ? 'text-xs' : ''}>Reply</span>
              </Button>
            </div>
          </div>
        </div>

        {/* 嵌套回复编辑器 */}
        {nestedReplyEditor?.replyId === reply.id && (
          <div className={getMarginClass(depth + 1)}>
            <ReplyEditor
              placeholder={`Reply to @${nestedReplyEditor.parentAuthor}...`}
              onSubmit={(content) => handleNestedReplySubmit(content, reply.id)}
              onCancel={handleNestedReplyCancel}
            />
          </div>
        )}

        {/* 递归渲染子回复 */}
        {childReplies.map(childReply => renderReply(childReply, depth + 1))}
      </div>
    )
  }

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    
    if (diffInDays === 0) return 'Today'
    if (diffInDays === 1) return 'Yesterday'
    if (diffInDays < 30) return `${diffInDays} days ago`
    return date.toLocaleDateString('en-US')
  }

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase()
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-orange-400 text-orange-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return 'text-green-600'
    if (rating >= 3) return 'text-yellow-600'
    return 'text-red-600'
  }

  const handleImageClick = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  // 转换图片格式为lightbox需要的格式
  const lightboxSlides = comment.images?.map(image => ({
    src: image.url,
    alt: image.alt,
  })) || []

  return (
    <Card className={`relative border transition-all duration-200 hover:shadow-lg ${
      comment.featured ? 'ring-1 ring-blue-200 bg-blue-50/30 border-blue-200 dark:ring-blue-800 dark:bg-blue-900/10 dark:border-blue-800' : 'hover:border-muted-foreground/20'
    }`}>
      {comment.featured && (
        <div className="absolute -top-2 -left-2 z-10">
          <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md">
            <Award className="h-3 w-3 mr-1" />
            Featured
          </Badge>
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* 用户信息和评分 */}
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <Avatar className="h-12 w-12 ring-2 ring-gray-100">
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-sm font-bold">
                  {getInitials(comment.reviewer_name)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h4 className="font-semibold text-foreground">{comment.reviewer_name}</h4>
                  {comment.verified_purchase && (
                    <Badge variant="secondary" className="text-xs bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">
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
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(comment.timestamp)}
                  </div>
                </div>
              </div>
            </div>

            {/* 更多操作菜单 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onReport?.(comment.id)}>
                  <Flag className="h-4 w-4 mr-2" />
                  Report
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* 评论内容 */}
          <div className="space-y-3">
            <h3 className="font-medium text-lg text-foreground leading-relaxed">
              {comment.title}
            </h3>
            
            <p className="text-muted-foreground leading-relaxed text-base">
              {comment.body}
            </p>

            {/* 图片展示 - 仅在 with-images 变体中显示 */}
            {variant === "with-images" && comment.images && comment.images.length > 0 && (
              <div className="space-y-3">
                {(() => {
                  const imageCount = comment.images.length
                  const displayImages = showAllImages ? comment.images : comment.images.slice(0, 9)
                  
                  // 根据图片数量确定网格布局
                  const getGridConfig = (count: number) => {
                    if (count === 1) return { 
                      cols: 'grid-cols-1', 
                      containerClass: 'max-w-xs mx-auto' 
                    }
                    if (count === 2) return { 
                      cols: 'grid-cols-2', 
                      containerClass: isMobile ? 'w-full' : 'max-w-md' 
                    }
                    if (count === 3) return { 
                      cols: 'grid-cols-3', 
                      containerClass: isMobile ? 'w-full' : 'max-w-lg' 
                    }
                    if (count === 4) return { 
                      cols: 'grid-cols-2', 
                      containerClass: isMobile ? 'w-full' : 'max-w-md' 
                    }
                    if (count <= 6) return { 
                      cols: 'grid-cols-3', 
                      containerClass: isMobile ? 'w-full' : 'max-w-lg' 
                    }
                    return { 
                      cols: 'grid-cols-3', 
                      containerClass: isMobile ? 'w-full' : 'max-w-lg' 
                    }
                  }
                  
                  const { cols, containerClass } = getGridConfig(displayImages.length)
                  
                  return (
                    <div className={`grid ${cols} gap-2 ${containerClass}`}>
                      {displayImages.map((image, index) => (
                        <div 
                          key={index} 
                          className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer group"
                          onClick={() => handleImageClick(index)}
                        >
                          <Image
                            src={image.url}
                            alt={image.alt}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-200"
                            sizes="(max-width: 768px) 33vw, (max-width: 1200px) 25vw, 20vw"
                          />
                          {/* 悬浮放大图标 */}
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                            <ZoomIn className="h-6 w-6 text-white drop-shadow-lg" />
                          </div>
                        </div>
                      ))}
                      
                      {/* 更多图片指示器 */}
                      {!showAllImages && imageCount > 9 && (
                        <div className="relative aspect-square rounded-lg bg-black/20 flex items-center justify-center text-white font-semibold cursor-pointer hover:bg-black/30 transition-colors"
                             onClick={() => setShowAllImages(true)}>
                          <div className="text-center">
                            <div className="text-lg">+{imageCount - 9}</div>
                            <div className="text-xs">More</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })()}
                
                {/* 图片操作按钮 */}
                <div className="flex items-center space-x-3 text-sm text-gray-500">
                  <span>{comment.images.length} images</span>
                  {showAllImages && comment.images.length > 9 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAllImages(false)}
                      className="text-blue-600 hover:text-blue-700 h-auto p-0"
                    >
                      Collapse
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => comment.images && handleImageClick(0)}
                    className="text-blue-600 hover:text-blue-700 h-auto p-0"
                  >
                    View Larger
                  </Button>
                </div>
              </div>
            )}

            {/* 追评显示 */}
            {comment.follow_up && (
              <div className="bg-muted border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-muted-foreground">
                    Follow-up after {comment.follow_up.days_later} days
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pl-4 border-l-2 border-blue-200 bg-blue-50/30 dark:border-blue-800 dark:bg-blue-900/10">
                  {comment.follow_up.content}
                </p>
              </div>
            )}
          </div>
          
          <Separator className="my-4" />
          
          {/* 底部操作区域 */}
          <div className="flex items-center justify-between">
            <div className={`flex items-center ${isMobile ? 'space-x-2' : 'space-x-4'}`}>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleHelpful}
                className={`h-8 transition-all ${isMobile ? 'text-xs' : 'text-sm'} ${
                  isHelpful 
                    ? 'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-800' 
                    : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                }`}
              >
                <ThumbsUp className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-1 ${isHelpful ? 'fill-current' : ''}`} />
                Helpful ({helpfulCount})
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleLike}
                className={`h-8 transition-all ${isMobile ? 'text-xs' : 'text-sm'} ${
                  isLiked 
                    ? 'text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700' 
                    : 'text-gray-600 hover:text-red-600 hover:bg-red-50'
                }`}
              >
                <Heart className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-1 ${isLiked ? 'fill-current' : ''}`} />
                Like ({likeCount})
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleReplyClick}
                className={`h-8 text-gray-600 hover:text-blue-600 hover:bg-blue-50 ${isMobile ? 'text-xs' : 'text-sm'}`}
              >
                <MessageCircle className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} mr-1`} />
                Reply
              </Button>
            </div>
          </div>

          {/* 回复编辑器 */}
          {showReplyEditor && (
            <div className="mt-4">
              <ReplyEditor
                onSubmit={handleReplySubmit}
                onCancel={handleReplyCancel}
              />
            </div>
          )}

          {/* 回复列表 - 仅在 with-replies 变体中显示 */}
          {variant === "with-replies" && replies.length > 0 && (
            <div className="space-y-3 pt-4 border-t border-border">
              <div className="text-sm font-medium text-muted-foreground mb-3">
                Replies ({replies.length})
              </div>
              <div className="space-y-4">
                {(() => {
                  const { topLevelReplies } = buildReplyTree(replies)
                  return topLevelReplies.map(reply => renderReply(reply, 0))
                })()}
              </div>
            </div>
          )}
        </div>
      </CardContent>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        index={lightboxIndex}
        close={() => setLightboxOpen(false)}
        slides={lightboxSlides}
      />
    </Card>
  )
}