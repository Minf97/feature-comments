"use client";

import { useMemo } from "react";
import { toast } from "sonner";
import {
  Settings,
  MessageSquareMore,
  ImageIcon,
  Star,
  Award,
  ShoppingBag,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnhancedCommentCard } from "./enhanced-comment-card";
import { ProductCard } from "../product/product-card";
import { useViewport } from "@/contexts/viewport-context";
import commentsData from "@/data/comments.json";

interface CommentImage {
  url: string;
  alt: string;
}

interface Reply {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  parentId?: number;
}

interface Comment {
  id: number;
  title: string;
  body: string;
  reviewer_name: string;
  product_handle: string;
  timestamp: string;
  rating: number;
  helpful_count: number;
  verified_purchase: boolean;
  featured: boolean;
  images?: CommentImage[];
  replies?: Reply[];
  likes?: number;
  has_follow_up?: boolean;
  follow_up?: {
    content: string;
    timestamp: string;
    days_later: number;
  };
}

// Mock data enhancement function
const enhanceCommentsWithExtras = (comments: Comment[]) => {
  // Ensure comments is an array and perform safety check
  if (!Array.isArray(comments) || comments.length === 0) {
    return [];
  }

  return comments.slice(0, 5).map((comment, index) => ({
    ...comment,
    likes: Math.floor(Math.random() * 50) + 5,
    has_follow_up: index === 1, // Second comment has follow-up
    follow_up:
      index === 1
        ? {
            // Follow-up content for second comment
            content:
              "After using it for a while, I found the effect was better than I expected! My cat's allergy symptoms have basically disappeared, and the fur has become more shiny. Especially the sneezing situation is almost gone, I'm really satisfied with this purchase. Recommend it to pet owners with similar troubles!",
            timestamp: new Date(
              Date.now() - 7 * 24 * 60 * 60 * 1000
            ).toISOString(),
            days_later: 3,
          }
        : undefined,
    images:
      index === 0
        ? [
            // First comment has images
            {
              url: "https://picsum.photos/200/300?random=1",
              alt: "User uploaded image 1",
            },
            {
              url: "https://picsum.photos/200/300?random=2",
              alt: "User uploaded image 2",
            },
            {
              url: "https://picsum.photos/200/300?random=3",
              alt: "User uploaded image 3",
            },
            {
              url: "https://picsum.photos/200/300?random=4",
              alt: "User uploaded image 4",
            },
          ]
        : undefined,
    replies:
      index === 2
        ? [
            // Third comment has hierarchical replies
            {
              id: 1001,
              author: "Customer Service",
              content:
                "Thank you for your feedback! We're glad to hear that our product has been helpful to you. If you have any other questions, feel free to contact our customer service team.",
              timestamp: new Date(
                Date.now() - 2 * 24 * 60 * 60 * 1000
              ).toISOString(),
              likes: 12,
              // No parentId, root level reply
            },
            {
              id: 1002,
              author: "John Smith",
              content:
                "I agree with the reviewer's opinion. My cat's allergy symptoms have indeed improved significantly after using this product!",
              timestamp: new Date(
                Date.now() - 1 * 24 * 60 * 60 * 1000
              ).toISOString(),
              likes: 8,
              // No parentId, root level reply
            },
            {
              id: 1003,
              author: "Pet Lover",
              content:
                "@Customer Service Can this product be used during pregnancy? My cat is pregnant but has severe allergies.",
              timestamp: new Date(
                Date.now() - 12 * 60 * 60 * 1000
              ).toISOString(),
              likes: 3,
              parentId: 1001, // Reply to customer service comment
            },
            {
              id: 1004,
              author: "Customer Service",
              content:
                "@Pet Lover We recommend consulting a veterinarian before use, as pregnant cats are more sensitive and need professional guidance.",
              timestamp: new Date(
                Date.now() - 6 * 60 * 60 * 1000
              ).toISOString(),
              likes: 5,
              parentId: 1003, // Reply to Pet Lover's question
            },
            {
              id: 1005,
              author: "Cat Owner Lee",
              content:
                "@John Smith How long did it take to see results? My cat just started using it.",
              timestamp: new Date(
                Date.now() - 4 * 60 * 60 * 1000
              ).toISOString(),
              likes: 2,
              parentId: 1002, // Reply to John Smith's comment
            },
          ]
        : undefined,
  }));
};

export function ScenarioShowcase() {
  const { isMobile, isTablet, isDesktop } = useViewport();

  // Safely handle comment data
  const commentsTyped = commentsData as { comments?: Comment[] };

  const enhancedComments = useMemo(() => {
    const commentsArray = Array.isArray(commentsTyped?.comments)
      ? commentsTyped.comments
      : [];
    return enhanceCommentsWithExtras(commentsArray);
  }, [commentsTyped?.comments]);

  // Dynamically set grid class names based on device type
  const getGridClassName = () => {
    if (isMobile) return "grid-cols-1";
    if (isTablet) return "grid-cols-2";
    if (isDesktop) return "grid-cols-3";
    return "grid-cols-1"; // Default value
  };

  const getGridGap = () => {
    return isMobile ? "gap-4" : "gap-6";
  };

  // Mock product data
  const mockProducts = [
    {
      id: 1,
      name: "Cat Allergy Relief Nutritional Paste 120g Pet Health Supplement for Cats - Relieves Allergy Symptoms and Improves Coat Health",
      price: 89.9,
      originalPrice: 128.0,
      rating: 4.8,
      reviewCount: 2843,
      soldCount: 15672,
      image: {
        url: "https://picsum.photos/400/400?random=101",
        alt: "Cat Allergy Relief Nutritional Paste",
      },
      tags: ["Official Store", "Free Shipping", "Highly Rated"],
      topComment: enhancedComments[1] || null, // Use second comment as featured
    },
    {
      id: 2,
      name: "Dog Joint Care Chondroitin Capsules 60-count Senior Dog Joint Maintenance Pet Supplement",
      price: 156.8,
      originalPrice: 198.0,
      rating: 4.9,
      reviewCount: 1567,
      soldCount: 8934,
      image: {
        url: "https://picsum.photos/400/400?random=102",
        alt: "Dog Joint Care Chondroitin",
      },
      tags: ["Best Seller", "Imported"],
      topComment: enhancedComments[3] || null, // Use fourth comment as featured
    },
    {
      id: 3,
      name: "Pet Probiotic Powder 50g Digestive Health Support for Cats and Dogs Universal Pet Supplement",
      price: 72.5,
      rating: 4.7,
      reviewCount: 892,
      soldCount: 3421,
      image: {
        url: "https://picsum.photos/400/400?random=103",
        alt: "Pet Probiotic Powder",
      },
      tags: ["New Product"],
      topComment: enhancedComments[0] || null, // Use first comment as featured
    },
  ];

  const handleHelpful = (commentId: number) => {
    console.log(`Comment ${commentId} helpful status toggled`);
    toast("Operation Successful", {
      description: "Your feedback has been recorded.",
    });
  };

  const handleLike = (commentId: number) => {
    console.log(`Comment ${commentId} like status toggled`);
    toast("Operation Successful", {
      description: "Your like status has been updated.",
    });
  };

  const handleReport = (commentId: number) => {
    console.log(`Comment ${commentId} reported`);
    toast("Report Submitted", {
      description: "We will process your report as soon as possible.",
    });
  };

  const handleReply = (commentId: number) => {
    console.log(`Reply to comment ${commentId}`);
  };

  const handleAddToCart = (productId: number) => {
    console.log(`Product ${productId} added to cart`);
    toast("Added Successfully", {
      description: "Product has been added to cart.",
    });
  };

  const handleViewDetails = (productId: number) => {
    console.log(`View product ${productId} details`);
    toast("Redirecting", {
      description: "Redirecting to product details page.",
    });
  };

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-foreground">
          Comment System Scenario Showcase
        </h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Demonstrates comment functionality in different scenarios:
          multi-feature support, reply system, image comments, and product card
          integration
        </p>
      </div>

      <Tabs defaultValue="multi-features" className="w-full">
        <TabsList className={`grid w-full ${isMobile ? 'grid-cols-2 grid-rows-2 h-auto gap-1' : 'grid-cols-4'} ${isMobile ? 'mb-4' : 'mb-8'}`}>
          <TabsTrigger
            value="multi-features"
            className={`flex items-center ${isMobile ? 'flex-col space-y-1 p-2 h-auto' : 'space-x-2'}`}
          >
            <Settings className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
            <span className={`${isMobile ? 'text-xs' : ''}`}>
              {isMobile ? 'Multi' : 'Multi-Features'}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="reply-system"
            className={`flex items-center ${isMobile ? 'flex-col space-y-1 p-2 h-auto' : 'space-x-2'}`}
          >
            <MessageSquareMore className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
            <span className={`${isMobile ? 'text-xs' : ''}`}>
              {isMobile ? 'Reply' : 'Reply System'}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="image-comments"
            className={`flex items-center ${isMobile ? 'flex-col space-y-1 p-2 h-auto' : 'space-x-2'}`}
          >
            <ImageIcon className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
            <span className={`${isMobile ? 'text-xs' : ''}`}>
              {isMobile ? 'Images' : 'Image Comments'}
            </span>
          </TabsTrigger>
          <TabsTrigger
            value="product-cards"
            className={`flex items-center ${isMobile ? 'flex-col space-y-1 p-2 h-auto' : 'space-x-2'}`}
          >
            <ShoppingBag className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
            <span className={`${isMobile ? 'text-xs' : ''}`}>
              {isMobile ? 'Products' : 'Product Cards'}
            </span>
          </TabsTrigger>
        </TabsList>

        {/* Scenario 1: Multi-feature Support */}
        <TabsContent value="multi-features" className="space-y-6">
          <Card className="border-0 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-700 dark:text-green-400">
                <Settings className="h-5 w-5" />
                <span>Scenario 1: Multi-feature Support</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <span>Rating System</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span>Featured Badge</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>🚩</span>
                  <span>Report Function</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span>💬</span>
                  <span>Interactive Reply</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            {enhancedComments.slice(0, 3).map((comment) => (
              <EnhancedCommentCard
                key={comment.id}
                comment={comment}
                variant="with-replies"
                onHelpful={handleHelpful}
                onLike={handleLike}
                onReport={handleReport}
                onReply={handleReply}
              />
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 dark:bg-blue-900/20 dark:border-blue-800">
            <h3 className="font-semibold text-blue-900 dark:text-blue-400 mb-3">
              Feature Description
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-300">
              <div>
                <strong>• Rating System:</strong> Users can rate products from
                1-5 stars
              </div>
              <div>
                <strong>• Featured Badge:</strong> High-quality comments display
                featured badge
              </div>
              <div>
                <strong>• Report System:</strong> Click more menu to report
                content
              </div>
              <div>
                <strong>• Follow-up Reviews:</strong> Users can publish
                additional comments
              </div>
              <div>
                <strong>• Interactive Actions:</strong> Helpful, like, reply,
                share functions
              </div>
              <div>
                <strong>• Multimedia Support:</strong> Supports image comments
                and reply features
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Scenario 2: Reply System */}
        <TabsContent value="reply-system" className="space-y-6">
          <Card className="border-0 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-purple-700 dark:text-purple-400">
                <MessageSquareMore className="h-5 w-5" />
                <span>Scenario 2: Hierarchical Reply System</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-purple-600 dark:text-purple-400 space-y-2">
                <p>
                  • Supports multi-level replies to form conversation chains
                </p>
                <p>
                  • Reply content automatically indented for clear hierarchy
                  display
                </p>
                <p>• Each reply can be individually liked and replied to</p>
                <p>
                  • Customer service replies and user interactions form complete
                  communication system
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <EnhancedCommentCard
              comment={enhancedComments[2]}
              variant="with-replies"
              onHelpful={handleHelpful}
              onLike={handleLike}
              onReport={handleReport}
              onReply={handleReply}
            />
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 dark:bg-purple-900/20 dark:border-purple-800">
            <h3 className="font-semibold text-purple-900 dark:text-purple-400 mb-3">
              Reply System Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-800 dark:text-purple-300">
              <div>
                <Badge
                  variant="outline"
                  className="mb-2 text-purple-600 border-purple-300 dark:text-purple-400 dark:border-purple-700"
                >
                  Customer Service
                </Badge>
                <p>
                  Official customer service responds to user questions promptly
                  with professional advice
                </p>
              </div>
              <div>
                <Badge
                  variant="outline"
                  className="mb-2 text-blue-600 border-blue-300 dark:text-blue-400 dark:border-blue-700"
                >
                  User Interaction
                </Badge>
                <p>
                  Users share usage experiences with each other, forming
                  community discussions
                </p>
              </div>
              <div>
                <Badge
                  variant="outline"
                  className="mb-2 text-green-600 border-green-300 dark:text-green-400 dark:border-green-700"
                >
                  Question Consultation
                </Badge>
                <p>New users consult about product usage and get help</p>
              </div>
              <div>
                <Badge
                  variant="outline"
                  className="mb-2 text-orange-600 border-orange-300 dark:text-orange-400 dark:border-orange-700"
                >
                  Hierarchical Display
                </Badge>
                <p>
                  Reply content indented progressively, clear hierarchy for easy
                  reading
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Scenario 3: Image Comments */}
        <TabsContent value="image-comments" className="space-y-6">
          <Card className="border-0 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-orange-700 dark:text-orange-400">
                <ImageIcon className="h-5 w-5" />
                <span>Scenario 3: Image Comment Display</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-orange-600 dark:text-orange-400 space-y-2">
                <p>• Supports users uploading multiple product images</p>
                <p>
                  • Images displayed in grid layout, expandable for more than 3
                  images
                </p>
                <p>
                  • Images support click to enlarge for enhanced visual
                  experience
                </p>
                <p>
                  • Comments with images are more persuasive and valuable for
                  reference
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <EnhancedCommentCard
              comment={enhancedComments[0]}
              variant="with-images"
              onHelpful={handleHelpful}
              onLike={handleLike}
              onReport={handleReport}
              onReply={handleReply}
            />

            <EnhancedCommentCard
              comment={enhancedComments[1]}
              variant="default"
              onHelpful={handleHelpful}
              onLike={handleLike}
              onReport={handleReport}
              onReply={handleReply}
            />
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 dark:bg-orange-900/20 dark:border-orange-800">
            <h3 className="font-semibold text-orange-900 dark:text-orange-400 mb-3">
              Image Feature Description
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-orange-800 dark:text-orange-300">
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-200 dark:bg-orange-800/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <ImageIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <p>
                  <strong>Multi-Image Upload</strong>
                </p>
                <p className="text-xs mt-1">
                  Support users uploading multiple product images
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-200 dark:bg-orange-800/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-orange-600 dark:text-orange-400 font-bold">
                    3×3
                  </span>
                </div>
                <p>
                  <strong>Grid Display</strong>
                </p>
                <p className="text-xs mt-1">
                  3-column grid layout, beautiful and organized
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-orange-200 dark:bg-orange-800/30 rounded-lg flex items-center justify-center mx-auto mb-2">
                  <span className="text-orange-600 dark:text-orange-400 font-bold">
                    +N
                  </span>
                </div>
                <p>
                  <strong>Expand View</strong>
                </p>
                <p className="text-xs mt-1">
                  Show expand button for more than 3 images
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Scenario 4: Product Cards */}
        <TabsContent value="product-cards" className="space-y-6">
          <Card className="border-0 bg-gradient-to-r from-pink-50 to-red-50 dark:from-pink-900/20 dark:to-red-900/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-pink-700 dark:text-pink-400">
                <ShoppingBag className="h-5 w-5" />
                <span>Scenario 4: Product Card Integration</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-pink-600 dark:text-pink-400 space-y-2">
                <p>• Product cards integrate compact version comment display</p>
                <p>
                  • Comment text limited to two lines with ellipsis for overflow
                </p>
                <p>
                  • Maintains product information integrity while showing user
                  reviews
                </p>
              </div>
            </CardContent>
          </Card>

          <div className={`grid ${getGridClassName()} ${getGridGap()}`}>
            {mockProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>

          <div className="bg-pink-50 border border-pink-200 rounded-lg p-6 dark:bg-pink-900/20 dark:border-pink-800">
            <h3 className="font-semibold text-pink-900 dark:text-pink-400 mb-3">
              Product Card Feature Description
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-pink-800 dark:text-pink-300">
              <div>
                <Badge
                  variant="outline"
                  className="mb-2 text-pink-600 border-pink-300 dark:text-pink-400 dark:border-pink-700"
                >
                  Compact Display
                </Badge>
                <p>
                  Comment content limited to two lines for clean card appearance
                </p>
              </div>
              <div>
                <Badge
                  variant="outline"
                  className="mb-2 text-blue-600 border-blue-300 dark:text-blue-400 dark:border-blue-700"
                >
                  Featured Comments
                </Badge>
                <p>Display highest-rated featured comment content from users</p>
              </div>
              <div>
                <Badge
                  variant="outline"
                  className="mb-2 text-green-600 border-green-300 dark:text-green-400 dark:border-green-700"
                >
                  Purchase Conversion
                </Badge>
                <p>
                  Enhance user buying confidence and decision-making through
                  comments
                </p>
              </div>
              <div>
                <Badge
                  variant="outline"
                  className="mb-2 text-orange-600 border-orange-300 dark:text-orange-400 dark:border-orange-700"
                >
                  Responsive Layout
                </Badge>
                <p>Supports perfect adaptation for both mobile and desktop</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
