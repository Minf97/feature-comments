"use client"

import * as React from "react"
import { Search, Filter, Star, TrendingUp, Clock, Award, MessageSquare, Users, BarChart3 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent } from "@/components/ui/card"
import { CommentCard } from "./comment-card"
import commentsData from "@/data/comments.json"

type SortType = "helpful" | "recent" | "rating" | "featured"
type FilterType = "all" | "featured" | "verified" | "high_rating"

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

interface CommentsDataStructure {
  comments: Comment[]
  statistics: Record<string, unknown>
  lastUpdated: string
}

export function InteractiveComments() {
  const commentsTyped = commentsData as CommentsDataStructure
  
  // 确保数据是数组
  const commentsArray = Array.isArray(commentsTyped?.comments) ? commentsTyped.comments : []
  
  const [comments, setComments] = React.useState<Comment[]>(commentsArray)
  const [filteredComments, setFilteredComments] = React.useState<Comment[]>(commentsArray)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [sortBy, setSortBy] = React.useState<SortType>("featured")
  const [filterBy, setFilterBy] = React.useState<FilterType>("all")
  const [visibleCount, setVisibleCount] = React.useState(6)

  // 搜索功能
  const handleSearch = React.useCallback((query: string) => {
    // 确保 comments 是数组
    if (!Array.isArray(comments)) {
      console.error('Comments is not an array:', comments)
      return
    }
    
    setSearchQuery(query)
    
    let filtered = comments
    
    if (query.trim()) {
      filtered = comments.filter(comment => 
        comment.title.toLowerCase().includes(query.toLowerCase()) ||
        comment.body.toLowerCase().includes(query.toLowerCase()) ||
        comment.reviewer_name.toLowerCase().includes(query.toLowerCase())
      )
    }
    
    // 应用筛选
    switch (filterBy) {
      case "featured":
        filtered = filtered.filter(c => c.featured)
        break
      case "verified":
        filtered = filtered.filter(c => c.verified_purchase)
        break
      case "high_rating":
        filtered = filtered.filter(c => c.rating >= 4)
        break
    }
    
    // 应用排序
    switch (sortBy) {
      case "helpful":
        filtered.sort((a, b) => b.helpful_count - a.helpful_count)
        break
      case "recent":
        filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "featured":
        filtered.sort((a, b) => {
          if (a.featured && !b.featured) return -1
          if (!a.featured && b.featured) return 1
          return b.helpful_count - a.helpful_count
        })
        break
    }
    
    setFilteredComments(filtered)
    setVisibleCount(6) // 重置显示数量
  }, [comments, filterBy, sortBy])

  // 处理排序变化
  const handleSortChange = (newSort: SortType) => {
    setSortBy(newSort)
    handleSearch(searchQuery)
  }

  // 处理筛选变化
  const handleFilterChange = (newFilter: FilterType) => {
    setFilterBy(newFilter)
    handleSearch(searchQuery)
  }

  // 处理有用按钮点击
  const handleHelpful = (commentId: number) => {
    setComments(prev => 
      prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, helpful_count: comment.helpful_count + 1 }
          : comment
      )
    )
    
    toast("Thank you for your feedback!", {
      description: "You found this comment helpful."
    })
  }

  // 加载更多评论
  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 6, filteredComments.length))
  }

  // 初始化时执行搜索
  React.useEffect(() => {
    handleSearch(searchQuery)
  }, [handleSearch, searchQuery])

  const getSortIcon = (sort: SortType) => {
    switch (sort) {
      case "helpful": return TrendingUp
      case "recent": return Clock
      case "rating": return Star
      case "featured": return Award
      default: return TrendingUp
    }
  }

  const getSortLabel = (sort: SortType) => {
    switch (sort) {
      case "helpful": return "Most Helpful"
      case "recent": return "Recent"
      case "rating": return "Rating"
      case "featured": return "Featured"
      default: return "Most Helpful"
    }
  }

  const getFilterLabel = (filter: FilterType) => {
    switch (filter) {
      case "all": return "All"
      case "featured": return "Featured"
      case "verified": return "Verified"
      case "high_rating": return "High Rating"
      default: return "All"
    }
  }

  const averageRating = React.useMemo(() => {
    if (!Array.isArray(comments) || comments.length === 0) return "0.0"
    const total = comments.reduce((sum, comment) => sum + comment.rating, 0)
    return (total / comments.length).toFixed(1)
  }, [comments])

  const ratingDistribution = React.useMemo(() => {
    const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    if (Array.isArray(comments)) {
      comments.forEach(comment => {
        distribution[comment.rating]++
      })
    }
    return distribution
  }, [comments])

  const renderStars = (rating: number, size: "sm" | "md" = "md") => {
    const starSize = size === "sm" ? "h-3 w-3" : "h-4 w-4"
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`${starSize} ${
          i < rating 
            ? 'fill-orange-400 text-orange-400' 
            : 'fill-gray-200 text-gray-200'
        }`}
      />
    ))
  }

  return (
    <div className="space-y-8">
      {/* 评分概览 */}
      <Card className="border-0 bg-gradient-to-r from-blue-50 to-purple-50 shadow-sm">
        <CardContent className="p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 总体评分 */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-2 mb-2">
                <span className="text-4xl font-bold text-gray-900">{averageRating}</span>
                <div className="flex">{renderStars(Math.round(parseFloat(averageRating)))}</div>
              </div>
              <p className="text-gray-600 mb-1">Based on {Array.isArray(comments) ? comments.length : 0} reviews</p>
              <div className="flex items-center justify-center lg:justify-start space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <MessageSquare className="h-4 w-4" />
                  <span>{Array.isArray(comments) ? comments.filter(c => c.verified_purchase).length : 0} Verified</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="h-4 w-4" />
                  <span>{Array.isArray(comments) ? comments.filter(c => c.featured).length : 0} Featured</span>
                </div>
              </div>
            </div>
            
            {/* 评分分布 */}
            <div className="lg:col-span-2">
              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map(rating => (
                  <div key={rating} className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 w-12">
                      <span className="text-sm text-gray-700">{rating}</span>
                      <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                    </div>
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-400 to-yellow-400 transition-all duration-500"
                        style={{ 
                          width: `${Array.isArray(comments) && comments.length > 0 ? (ratingDistribution[rating] / comments.length) * 100 : 0}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8 text-right">
                      {ratingDistribution[rating]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 搜索和筛选区域 */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 text-gray-900">
          <BarChart3 className="h-5 w-5" />
          <h2 className="text-xl font-semibold">User Reviews</h2>
          <span className="text-gray-500">({Array.isArray(filteredComments) ? filteredComments.length : 0})</span>
        </div>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search comments, content, username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Sort:</span>
            </div>
            {(["featured", "helpful", "recent", "rating"] as SortType[]).map(sort => {
              const Icon = getSortIcon(sort)
              return (
                <Button
                  key={sort}
                  variant={sortBy === sort ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleSortChange(sort)}
                  className={`h-9 ${
                    sortBy === sort 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'border-gray-300 hover:border-blue-500 hover:text-blue-600'
                  }`}
                >
                  <Icon className="h-3 w-3 mr-1" />
                  {getSortLabel(sort)}
                </Button>
              )
            })}
            
            <Separator orientation="vertical" className="h-6 mx-2" />
            
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-700">Filter:</span>
              {(["all", "featured", "verified", "high_rating"] as FilterType[]).map(filter => (
                <Badge
                  key={filter}
                  variant={filterBy === filter ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    filterBy === filter 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'border-gray-300 hover:border-blue-500 hover:text-blue-600'
                  }`}
                  onClick={() => handleFilterChange(filter)}
                >
                  {getFilterLabel(filter)}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 评论列表 */}
      <div className="space-y-6">
        {filteredComments.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <MessageSquare className="h-16 w-16 mx-auto" />
            </div>
            <p className="text-gray-500 text-lg">No matching comments found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search terms or filters</p>
          </div>
        ) : (
          <>
            <div className="grid gap-6">
              {Array.isArray(filteredComments) ? filteredComments.slice(0, visibleCount).map(comment => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  onHelpful={handleHelpful}
                />
              )) : null}
            </div>
            
            {visibleCount < filteredComments.length && (
              <div className="text-center pt-8">
                <Button 
                  variant="outline" 
                  onClick={loadMore}
                  className="min-w-40 h-11 border-gray-300 hover:border-blue-500 hover:text-blue-600"
                >
                  Load More ({filteredComments.length - visibleCount} remaining)
                </Button>
              </div>
            )}
            
            {visibleCount >= filteredComments.length && filteredComments.length > 6 && (
              <div className="text-center pt-8">
                <div className="inline-flex items-center space-x-2 text-gray-500">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">Showing all {filteredComments.length} comments</span>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}