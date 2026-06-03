"use client"

import { Heading, Body } from "@/components/atoms/Typography"
import { motion } from "framer-motion"
import { SocialMediaButtons, DualReviewsCarousel } from "../molecules"
import { userReviews } from "@/libs/userReviews"

// Atomic Design - Organism: Community Section
export default function CommunitySection() {

  return (
    <section className="py-12 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
        {/* Left Column - Content */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="space-y-6 lg:space-y-8"
        >
          <Heading className="text-white">
            ¿Qué opina la comunidad de RataCueva?
          </Heading>

          <Body className="text-white leading-relaxed">
            Descubre lo que nuestros clientes dicen sobre su experiencia en RataCueva. 
            Cada reseña refleja nuestro compromiso con la excelencia en servicio, 
            ambiente acogedor y sabores únicos que nos han convertido en el lugar 
            favorito de la comunidad.
          </Body>

          {/* Social Media Buttons */}
          <SocialMediaButtons />
        </motion.div>

        {/* Right Column - Dual Reviews Carousel */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex-1"
        >
          <DualReviewsCarousel reviews={userReviews} />
        </motion.div>
      </div>
    </section>
  )
}