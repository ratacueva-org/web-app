import type { Review } from "@/app/lib/data"
import { PRODUCT_REVIEWS } from "./reviews-data"

/**
 * Get reviews for a specific product.
 * Currently uses mock data; swap this implementation with a real API call later.
 */
export async function getProductReviews(productId: string | number): Promise<Review[]> {
  const numericId = typeof productId === "string" ? parseInt(productId, 10) : productId

  // If the ID doesn't parse cleanly, try to look it up by string (MongoDB ObjectId pattern)
  if (isNaN(numericId)) {
    return getReviewsForObjectId(productId as string)
  }

  const reviews = PRODUCT_REVIEWS[numericId]
  return reviews || []
}

/**
 * Fallback for ObjectId-based product IDs.
 * Maps ObjectId to numeric ID by stripping leading zeros.
 */
function getReviewsForObjectId(objectId: string): Review[] {
  const numericId = parseInt(objectId.replace(/^0+/, ""), 10)
  if (!isNaN(numericId) && PRODUCT_REVIEWS[numericId]) {
    return PRODUCT_REVIEWS[numericId]
  }
  return []
}
