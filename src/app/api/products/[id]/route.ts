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
  ["Ryzen", "AMD"],
  ["NVMe", "Samsung"],
];

function detectBrand(name: string): string {
  for (const [keyword, brand] of BRAND_KEYWORDS) {
    if (name.includes(keyword)) return brand;
  }
  return "Genérico";
}

function enrichProduct(p: RawProduct, categoryKey: CategoryKey) {
  return {
    _id: String(p.id).padStart(24, "0"),
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

function getAllProducts() {
  return [
    ...featuredProducts.map((p) => enrichProduct(p, "featured")),
    ...gamingProducts.map((p) => enrichProduct(p, "gaming")),
    ...componentProducts.map((p) => enrichProduct(p, "components")),
    ...computerProducts.map((p) => enrichProduct(p, "computers")),
    ...accessoryProducts.map((p) => enrichProduct(p, "accessories")),
  ];
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const allProducts = getAllProducts();

  // Try matching by numeric id or string _id
  const product = allProducts.find(
    (p) => String(p.id) === id || p._id === id
  );

  if (!product) {
    return NextResponse.json(
      { success: false, error: "Producto no encontrado" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, data: product });
}
