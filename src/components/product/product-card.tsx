"use client"

import { useState } from 'react'
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  MessageCircle,
  Eye
} from "lucide-react"
import { CompactCommentCard } from '@/components/comments/compact-comment-card'
import { useViewport } from "@/contexts/viewport-context"

interface ProductImage {
  url: string
  alt: string
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
  images?: Array<{url: string, alt: string}>
  replies?: Array<{
    id: number
    author: string
    content: string
    timestamp: string
    likes: number
    parentId?: number
  }>
  likes?: number
  has_follow_up?: boolean
  follow_up?: {
    content: string
    timestamp: string
    days_later: number
  }
}

interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  soldCount: number
  image: ProductImage
  tags?: string[]
  topComment?: Comment
}

interface ProductCardProps {
  product: Product
  onAddToCart?: (productId: number) => void
  onViewDetails?: (productId: number) => void
}

export function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
  const { isMobile } = useViewport()
  const [isLiked, setIsLiked] = useState(false)

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'} ${
          i < Math.floor(rating) ? 'fill-orange-400 text-orange-400' : 'text-gray-300'
        }`}
      />
    ))
  }

  const formatPrice = (price: number) => {
    return `$${price.toFixed(2)}`
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
  }

  const discount = product.originalPrice 
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0

  return (
    <Card className="group cursor-pointer hover:shadow-lg transition-all duration-200 border hover:border-muted-foreground/20">
      <CardContent className="p-0">
        {/* 商品图片 */}
        <div className="relative aspect-square overflow-hidden rounded-t-lg bg-muted">
          <Image
            src={product.image.url}
            alt={product.image.alt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          
          {/* 折扣标签 */}
          {discount > 0 && (
            <Badge className={`absolute top-2 left-2 bg-red-500 text-white ${isMobile ? 'text-xs px-1 py-0.5' : ''}`}>
              -{discount}%
            </Badge>
          )}
          
          {/* 悬浮操作按钮 */}
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleLike()
              }}
              className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} p-0 rounded-full ${
                isLiked 
                  ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30' 
                  : 'bg-background/80 text-muted-foreground hover:bg-background'
              }`}
            >
              <Heart className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'} ${isLiked ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>

        <div className={`${isMobile ? 'p-3' : 'p-4'} space-y-3`}>
          {/* 商品标签 */}
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 2).map((tag, index) => (
                <Badge key={index} variant="secondary" className={`${isMobile ? 'text-xs px-1.5 py-0' : 'text-xs px-2 py-0'}`}>
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* 商品名称 */}
          <h3 className={`font-medium text-foreground line-clamp-2 leading-5 ${isMobile ? 'text-xs' : 'text-sm'}`}>
            {product.name}
          </h3>

          {/* 评分和销量 */}
          <div className={`flex items-center justify-between ${isMobile ? 'text-xs' : 'text-xs'} text-muted-foreground`}>
            <div className={`flex items-center ${isMobile ? 'space-x-0.5' : 'space-x-1'}`}>
              {renderStars(product.rating)}
              <span className={`${isMobile ? 'ml-0.5' : 'ml-1'}`}>{product.rating}</span>
              <span>({product.reviewCount})</span>
            </div>
            <span>{isMobile ? `Sold ${product.soldCount}` : `Sold ${product.soldCount} items`}</span>
          </div>

          {/* 价格 */}
          <div className={`flex items-center ${isMobile ? 'space-x-1' : 'space-x-2'}`}>
            <span className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-red-600 dark:text-red-400`}>
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-muted-foreground line-through`}>
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          {/* 精选评论 */}
          {product.topComment && (
            <div className={`border-t border-border ${isMobile ? 'pt-2' : 'pt-3'}`}>
              <div className={`flex items-center ${isMobile ? 'space-x-0.5 mb-1' : 'space-x-1 mb-2'}`}>
                <MessageCircle className={`${isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'} text-muted-foreground`} />
                <span className={`${isMobile ? 'text-xs' : 'text-xs'} text-muted-foreground`}>Customer Reviews</span>
              </div>
              <CompactCommentCard 
                comment={product.topComment} 
                showImages={false}
              />
            </div>
          )}

          {/* 操作按钮 */}
          <div className={`flex ${isMobile ? 'space-x-1 pt-1' : 'space-x-2 pt-2'}`}>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onViewDetails?.(product.id)
              }}
              className={`flex-1 ${isMobile ? 'h-7 text-xs' : 'h-8 text-xs'}`}
            >
              <Eye className={`${isMobile ? 'h-2.5 w-2.5 mr-0.5' : 'h-3 w-3 mr-1'}`} />
              {isMobile ? 'Details' : 'View Details'}
            </Button>
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onAddToCart?.(product.id)
              }}
              className={`flex-1 ${isMobile ? 'h-7 text-xs' : 'h-8 text-xs'} bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800`}
            >
              <ShoppingCart className={`${isMobile ? 'h-2.5 w-2.5 mr-0.5' : 'h-3 w-3 mr-1'}`} />
              {isMobile ? 'Buy' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 