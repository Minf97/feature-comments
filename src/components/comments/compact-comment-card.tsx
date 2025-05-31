"use client"

import Image from "next/image"
import { Star, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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

interface CompactCommentCardProps {
  comment: Comment
  showImages?: boolean
}

export function CompactCommentCard({ comment, showImages = false }: CompactCommentCardProps) {
  const { isMobile } = useViewport()
  
  const getInitials = (name: string) => {
    return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase()
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'} ${
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

  return (
    <div className={`bg-background border border-border rounded-lg ${isMobile ? 'p-2' : 'p-3'} space-y-2 hover:shadow-md transition-shadow`}>
      {/* User info and rating */}
      <div className={`flex items-center ${isMobile ? 'space-x-1.5' : 'space-x-2'}`}>
        <Avatar className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'}`}>
          <AvatarFallback className={`bg-gradient-to-br from-blue-500 to-purple-600 text-white ${isMobile ? 'text-xs' : 'text-xs'} font-bold`}>
            {getInitials(comment.reviewer_name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className={`flex items-center ${isMobile ? 'space-x-1' : 'space-x-2'}`}>
            <span className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'} text-foreground truncate`}>{comment.reviewer_name}</span>
            {comment.verified_purchase && (
              <Badge variant="secondary" className={`${isMobile ? 'text-xs px-1 py-0' : 'text-xs px-1 py-0'} bg-green-100 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800`}>
                <CheckCircle className={`${isMobile ? 'h-1.5 w-1.5 mr-0.5' : 'h-2 w-2 mr-1'}`} />
                {isMobile ? 'Verified' : 'Verified Purchase'}
              </Badge>
            )}
          </div>
          <div className={`flex items-center ${isMobile ? 'space-x-1' : 'space-x-2'}`}>
            <div className={`flex items-center ${isMobile ? 'space-x-0.5' : 'space-x-1'}`}>
              {renderStars(comment.rating)}
              <span className={`${isMobile ? 'text-xs' : 'text-xs'} font-medium ${getRatingColor(comment.rating)}`}>
                {comment.rating}.0
              </span>
            </div>
            <span className={`${isMobile ? 'text-xs' : 'text-xs'} text-muted-foreground`}>
              {isMobile ? `${comment.helpful_count} helpful` : `${comment.helpful_count} found helpful`}
            </span>
          </div>
        </div>
      </div>

      {/* Comment content - limited to two lines */}
      <div className="space-y-1">
        {comment.title && (
          <h4 className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'} text-foreground line-clamp-1`}>
            {comment.title}
          </h4>
        )}
        <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground line-clamp-2 leading-relaxed`}>
          {comment.body}
        </p>
      </div>

      {/* Image display - compact mode */}
      {showImages && comment.images && comment.images.length > 0 && (
        <div className={`flex ${isMobile ? 'space-x-0.5' : 'space-x-1'}`}>
          {comment.images.slice(0, 3).map((image, index) => (
            <div key={index} className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded border border-border overflow-hidden bg-muted flex-shrink-0 relative`}>
              <Image
                src={image.url}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 40px, 48px"
              />
            </div>
          ))}
          {comment.images.length > 3 && (
            <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} rounded border border-border bg-muted flex items-center justify-center ${isMobile ? 'text-xs' : 'text-xs'} text-muted-foreground flex-shrink-0`}>
              +{comment.images.length - 3}
            </div>
          )}
        </div>
      )}
    </div>
  )
} 