import { NextRequest, NextResponse } from "next/server";
import {
  featuredProducts,
  gamingProducts,
  componentProducts,
  computerProducts,
  accessoryProducts,
} from "@/app/lib/homeProducts";
import { getExtendedDescription } from "@/app/lib/productDescriptions";

type RawProduct = (typeof featuredProducts)[number];

interface EnrichedProduct {
  _id: string;
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  stock: number;
  brand: string;
  images: string[];
  image: string;
  videos: string[];
  section: string;
  category: string;
  subcategory: string;
  specs: Record<string, string>;
  discountPercentage?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  reviews: number;
  isFeatured: boolean;
  isNewProduct: boolean;
  location: string;
  shipping: string;
  createdAt: string;
  updatedAt: string;
  badge?: string;
}

const CATEGORY_MAP = {
  featured: "Destacados",
  gaming: "Consolas y Gaming",
  components: "Componentes",
  computers: "PCs Armadas",
  accessories: "Accesorios",
} as const;

type CategoryKey = keyof typeof CATEGORY_MAP;

const BRAND_KEYWORDS: [string, string][] = [
  ["Samsung", "Samsung"],
  ["Logitech", "Logitech"],
  ["Corsair", "Corsair"],
  ["PlayStation", "Sony"],
  ["Xbox", "Microsoft"],
  ["Nintendo", "Nintendo"],
  ["Steam Deck", "Valve"],
  ["DualSense", "Sony"],
  ["ASUS", "ASUS"],
  ["ROG", "ASUS"],
  ["Intel", "Intel"],
  ["RTX", "NVIDIA"],
  ["Geforce", "NVIDIA"],
  ["Ryzen", "AMD"],
  ["NVMe", "Samsung"],
  ["Gaming", "Genérico"],
];

function detectBrand(name: string): string {
  for (const [keyword, brand] of BRAND_KEYWORDS) {
    if (name.includes(keyword)) return brand;
  }
  return "Genérico";
}

function enrichProduct(p: RawProduct, categoryKey: CategoryKey): EnrichedProduct {
  const idStr = String(p.id).padStart(24, "0");
  return {
    _id: idStr,
    id: p.id,
    name: p.name,
    description: getExtendedDescription(p.id, `${p.name} de alta calidad, ideal para los mejores equipos gaming y profesionales. Producto original con garantía de fábrica.`),
    price: p.price,
    originalPrice: p.originalPrice,
    stock: ((p.id * 7) % 50) + 10,
    brand: detectBrand(p.name),
    images: [p.image],
    image: p.image,
    videos: [],
    section: CATEGORY_MAP[categoryKey],
    category: CATEGORY_MAP[categoryKey],
    subcategory: "",
    specs: {},
    discountPercentage: p.discount,
    discount: p.discount,
    rating: p.rating,
    reviewCount: p.reviews,
    reviews: p.reviews,
    isFeatured: categoryKey === "featured",
    isNewProduct: categoryKey === "featured",
    location: "San José",
    shipping: "Envío gratis",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    badge: "badge" in p ? (p as { badge?: string }).badge : undefined,
  };
}

function getAllProducts(): EnrichedProduct[] {
  return [
    ...featuredProducts.map((p) => enrichProduct(p, "featured")),
    ...gamingProducts.map((p) => enrichProduct(p, "gaming")),
    ...componentProducts.map((p) => enrichProduct(p, "components")),
    ...computerProducts.map((p) => enrichProduct(p, "computers")),
    ...accessoryProducts.map((p) => enrichProduct(p, "accessories")),
  ];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const limit = parseInt(searchParams.get("limit") || "100", 10);
  const category = searchParams.get("category");
  const section = searchParams.get("section");
  const brand = searchParams.get("brand");
  const search = searchParams.get("search");
  const featured = searchParams.get("featured");
  const isNew = searchParams.get("isNew");
  const inStock = searchParams.get("inStock");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const sortBy = searchParams.get("sortBy");
  const sortOrder = searchParams.get("sortOrder");

  let products = getAllProducts();

  // Filters
  if (category) {
    products = products.filter((p) => p.category === category);
  }
  if (section) {
    products = products.filter((p) => p.section === section);
  }
  if (brand) {
    products = products.filter((p) => p.brand === brand);
  }
  if (search) {
    const q = search.toLowerCase();
    products = products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }
  if (featured === "true") {
    products = products.filter((p) => p.isFeatured);
  }
  if (isNew === "true") {
    products = products.filter((p) => p.isNewProduct);
  }
  if (inStock === "true") {
    products = products.filter((p) => p.stock > 0);
  }
  if (minPrice) {
    const min = parseFloat(minPrice);
    products = products.filter((p) => p.price >= min);
  }
  if (maxPrice) {
    const max = parseFloat(maxPrice);
    products = products.filter((p) => p.price <= max);
  }

  // Sorting
  if (sortBy) {
    const order = sortOrder === "desc" ? -1 : 1;
    products.sort((a, b) => {
      const aVal = a[sortBy as keyof EnrichedProduct];
      const bVal = b[sortBy as keyof EnrichedProduct];
      if (typeof aVal === "number" && typeof bVal === "number") {
        return (aVal - bVal) * order;
      }
      return 0;
    });
  }

  // Limit
  const sliced = products.slice(0, limit);

  return NextResponse.json({
    success: true,
    data: sliced,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalProducts: products.length,
      hasNextPage: false,
      hasPrevPage: false,
    },
  });
}
