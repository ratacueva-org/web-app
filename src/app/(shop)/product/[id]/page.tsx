import ProductDetailPage from "@/components/features/home/organisms/ProductDetailPage";
import { getProductById, getRelatedProducts } from "@/services/home/products";
import { getProductReviews } from "@/services/home/reviews";
import { notFound } from "next/navigation";
import type { Product as ApiProduct } from "@/services/home/products";
import type { Product, Review } from "@/app/lib/data";

type ProductResponse = ApiProduct | { success: boolean; data: ApiProduct };
type RelatedProductsResponse =
  | ApiProduct[]
  | { success: boolean; data: ApiProduct[] };

function isWrappedResponse(
  response: ProductResponse
): response is { success: boolean; data: ApiProduct } {
  return (
    typeof response === "object" && response !== null && "success" in response
  );
}

function isWrappedArrayResponse(
  response: RelatedProductsResponse
): response is { success: boolean; data: ApiProduct[] } {
  return (
    typeof response === "object" && response !== null && "success" in response
  );
}

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Transform API product to component format
function transformApiProductToComponent(apiProduct: ApiProduct): Product {
  // Extract the actual ID from the MongoDB ObjectId
  const objectId = typeof apiProduct._id === 'object' && '$oid' in apiProduct._id 
    ? apiProduct._id.$oid 
    : apiProduct._id as string;
  
  return {
    id: objectId,
    name: apiProduct.name,
    price: apiProduct.price,
    originalPrice: apiProduct.discountPercentage
      ? apiProduct.price / (1 - apiProduct.discountPercentage / 100)
      : undefined,
    image: apiProduct.images[0] || "/placeholder.svg",
    rating: apiProduct.rating || 0,
    reviews: apiProduct.reviewCount || 0,
    shipping: "Envío gratis", // Default value
    discount: apiProduct.discountPercentage,
    category: apiProduct.category,
    brand: apiProduct.brand,
    location: "San José", // Default value
    description: apiProduct.description,
    specs: apiProduct.specs
      ? Object.entries(apiProduct.specs).map(([key, value]) => ({
          label: key,
          value: value,
        }))
      : [],
    images: apiProduct.images,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;

  try {
    const response = await getProductById(id);

    // Check if response is the product directly or wrapped in success/data
    const apiProduct = isWrappedResponse(response) ? response.data : response;

    if (!apiProduct || !apiProduct._id) {
      notFound();
    }

    const product = transformApiProductToComponent(apiProduct);

    // Extract the actual ID from the MongoDB ObjectId
    const objectId = typeof apiProduct._id === 'object' && '$oid' in apiProduct._id 
      ? apiProduct._id.$oid 
      : apiProduct._id as string;

    // Get related products
    let relatedProducts: Product[] = [];
    try {
        
      const relatedResponse = await getRelatedProducts(
        apiProduct.category,
        objectId,
        4
      );
      const relatedApiProducts = isWrappedArrayResponse(relatedResponse)
        ? relatedResponse.data
        : relatedResponse;

      if (Array.isArray(relatedApiProducts)) {
        relatedProducts = relatedApiProducts.map(
          transformApiProductToComponent
        );
      }
    } catch (relatedError) {
      console.error("Error fetching related products:", relatedError);
      // Continue without related products if there's an error
    }

    // Get product reviews
    let productReviews: Review[] = []
    try {
      productReviews = await getProductReviews(objectId)
    } catch (reviewError) {
      console.error("Error fetching reviews:", reviewError)
    }

    return (
      <ProductDetailPage
        product={product}
        relatedProducts={relatedProducts}
        reviews={productReviews}
      />
    );
  } catch (error) {
    console.error("Error fetching product:", error);
    notFound();
  }
}
