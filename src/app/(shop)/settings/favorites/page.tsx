"use client"

import Image from "next/image"
import Link from "next/link"
import { PageLayout } from "@/components/templates/PageLayout"
import { SettingsBreadcrumb } from "@/components/organisms/SettingsBreadcrumb";
import { Body, Subheading } from "@/components/atoms/Typography";
import Button from "@/components/atoms/Button";
import { TrashIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useCart } from "@/contexts/CartContext";

export default function FavoritesPage() {
  const { items: favoriteItems, removeFromFavorites } = useFavorites();
  const { addToCart } = useCart();

  const handleRemoveFavorite = (productId: string) => {
    removeFromFavorites(productId);
  }

  const handleAddToCart = (item: { id: string; name: string; price: number; image: string; brand: string; category: string }) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      brand: item.brand,
      category: item.category,
    });
  }

  return (
    <PageLayout>
      <div className="pt-8 pb-4">
        <SettingsBreadcrumb
          items={[
            { label: "Configuración", href: "/settings" },
            { label: "Favoritos" },
          ]}
          title="Favoritos"
          color="text-white"
          className="mb-8"
        />
        <div className="space-y-6">
          {favoriteItems.length === 0 ? (
            <div className="p-6 bg-dark rounded-lg">
              <Body className="text-white text-center">
                No tienes productos favoritos. ¡Añade algunos!
              </Body>
            </div>
          ) : (
            <div className="space-y-4">
              {favoriteItems.map((item) => (
                <div
                  key={item.id}
                  className="p-6 bg-gray rounded-lg flex flex-col sm:flex-row justify-start items-center gap-6"
                >
                  <Image
                    className="w-24 h-24 object-contain"
                    src={item.image || "/placeholder.svg"}
                    alt={item.name}
                    width={96}
                    height={96}
                  />
                  <div className="flex-1 flex flex-col sm:flex-row justify-between items-start w-full">
                    <div className="flex-1 flex flex-col justify-center items-start gap-4 mb-4 sm:mb-0">
                      <Link href={`/product/${item.id}`}>
                        <Subheading className="text-white hover:underline cursor-pointer">
                          {item.name}
                        </Subheading>
                      </Link>
                      <Body className="text-white font-medium">
                        ${item.price.toLocaleString()}
                      </Body>
                    </div>
                    <div className="flex justify-start items-start gap-3">
                      <Button onClick={() => handleAddToCart(item)}>
                        <ShoppingCartIcon className="w-5 h-5 mr-2" />
                        Agregar al carrito
                      </Button>
                      <Button onClick={() => handleRemoveFavorite(item.id)}>
                        <TrashIcon className="w-5 h-5 mr-2" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  )
}