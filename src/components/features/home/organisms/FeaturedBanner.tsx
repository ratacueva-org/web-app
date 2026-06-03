"use client"

import { Subheading, Body } from "@/components/atoms/Typography"
import Button from "@/components/atoms/Button"
import Image from "next/image"
import { useRandomCategories } from "@/hook/useRandomCategories"

export default function FeaturedBanner() {
  const { data: categories, isLoading, error } = useRandomCategories();

  const handleCategoryClick = (categoryId: string) => {
    const element = document.getElementById(categoryId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (isLoading) {
    return (
      <section className="py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12">
          <div className="relative h-[300px] lg:h-[500px] bg-gray rounded-lg animate-pulse"></div>
          <div className="grid grid-cols-2 gap-4 lg:gap-6">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="relative h-[140px] lg:h-[240px] bg-gray rounded-lg animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !categories) {
    return (
      <section className="py-8 lg:py-12">
        <div className="text-center text-dark">
          Error cargando categorías
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 lg:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 xl:gap-12">
        <div 
          className="relative h-[300px] lg:h-[500px] bg-gradient-to-br from-gray to-dark rounded-lg overflow-hidden group cursor-pointer"
          onClick={() => handleCategoryClick(categories[0].id)}
        >
          <Image
            src={categories[0].image}
            alt={categories[0].name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <Subheading className="text-white mb-2">{categories[0].name}</Subheading>
            <Body className="text-placeholder mb-4">{categories[0].productCount} productos disponibles</Body>
            <Button>
              Ver productos
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 lg:gap-6">
          {categories.slice(1).map((category) => (
            <div
              key={category.id}
              className="relative h-[140px] lg:h-[240px] bg-gradient-to-br from-dark to-gray rounded-lg overflow-hidden group cursor-pointer"
              onClick={() => handleCategoryClick(category.id)}
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-3 left-3 right-3">
                <Subheading className="text-white text-sm mb-1">{category.name}</Subheading>
                <Body className="text-placeholder text-xs lg:text-sm">
                  {category.productCount} productos
                </Body>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
