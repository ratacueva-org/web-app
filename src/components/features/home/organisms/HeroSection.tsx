"use client";

import Button from "@/components/atoms/Button"
import { Body, Display } from "@/components/atoms/Typography"
import { useQuery } from "@tanstack/react-query"
import { getProducts } from "@/services/home/products"
import { transformProduct } from "@/hook/useProducts"
import { useEffect, useState } from "react"
import { ShoppingCartIcon } from "@heroicons/react/24/outline"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function HeroSection() {
  const router = useRouter();
  const { data: allProducts, isLoading, error } = useQuery({
    queryKey: ["products", "all"],
    queryFn: () => getProducts({ limit: 100 }),
    staleTime: 10 * 60 * 1000,
  });

  const products = allProducts?.data?.map(transformProduct) || [];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Autoplay: cambia el producto cada 3 segundos
  useEffect(() => {
    if (products.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [products.length]);

  const currentProduct = products[currentIndex];

  const handleComprarAhora = () => {
    if (currentProduct) {
      console.log("Product ID:", currentProduct.id);
      console.log("Product:", currentProduct);
      router.push(`/product/${currentProduct.id}`);
    }
  };

  return (
    <section className="w-full h-[400px] lg:h-[600px] xl:h-[700px] relative bg-gradient-to-br from-gray via-dark to-black">
      <div className="absolute inset-0 bg-gradient-to-r from-pink-600/30 to-gray-400/30 pointer-events-none"></div>
      <div className="max-w-[1440px] mx-auto px-[80px] h-full flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center w-full">
          {/* Columna izquierda - Texto */}
          <div className="max-w-2xl">
            <Display className="text-4xl lg:text-5xl font-bold text-white mb-6">
              {isLoading && "Cargando..."}
              {error && "Error cargando productos"}
              {!isLoading && !error && currentProduct && (
                <>{currentProduct.name}</>
              )}
            </Display>
            <Body className="text-white mb-8">
              {isLoading && "Buscando productos innovadores..."}
              {error && "No se pudo cargar la descripción."}
              {!isLoading && !error && currentProduct && (
                <>
                  {(() => {
                    const desc = currentProduct.description || "Sin descripción"
                    return desc.length > 150 ? desc.substring(0, 150) + "..." : desc
                  })()}
                </>
              )}
            </Body>
            {!isLoading && !error && currentProduct && (
              <div className="text-pink-400 font-bold text-2xl mb-8">
                ${currentProduct.price}
              </div>
            )}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleComprarAhora}>
                <ShoppingCartIcon className="w-5 h-5 mr-2" />
                Comprar ahora
              </Button>
            </div>
          </div>

          {/* Columna derecha - Isotipo */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative w-96 h-96 lg:w-[500px] lg:h-[500px]">
              <Image
                src="/images/isotipo.svg"
                alt="RataCueva Isotipo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
