export interface MockReview {
  id: number
  author: string
  date: string
  content: string
  rating: number
  upvotes: number
  downvotes: number
}

const AUTHORS = [
  "Carlos Mendoza", "María García", "José Hernández", "Ana Martínez",
  "Luis Rodríguez", "Sofía Ramírez", "Diego Castillo", "Valentina López",
  "Andrés Torres", "Camila Flores", "Ricardo Sánchez", "Gabriela Cruz",
  "Fernando Vargas", "Daniela Rivas", "Miguel Ángel Pérez", "Ximena Castro",
  "Pablo Morales", "Regina Ortiz", "Santiago Jiménez", "Lucía Herrera",
  "Emilio Navarro", "Julieta Ríos", "Francisco Delgado", "Mariana Aguilar",
  "Humberto Paredes", "Renata Quintana", "Alejandro Vega", "Carolina Peña",
]

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function randomDate(start: Date, end: Date): string {
  const date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
  return date.toLocaleDateString("es-AR", { year: "numeric", month: "long", day: "numeric" })
}

function generateReviewsForProduct(productId: number, count: number, productName: string): MockReview[] {
  const authors = shuffleArray(AUTHORS)
  const reviewTemplates = [
    `Excelente ${productName}, superó todas mis expectativas. La calidad de construcción es impresionante y el rendimiento es exactamente lo que necesitaba para mi setup. Lo recomiendo totalmente para quien busque calidad profesional.`,
    `Muy buen producto, llegó en perfectas condiciones y bien empaquetado. La relación precio-calidad es excelente. Lo uso diariamente y funciona de maravilla. Definitivamente una compra inteligente.`,
    `Lo compré para regalar y la persona quedó encantada. El producto se ve y se siente de primera calidad. La entrega fue rápida y sin problemas. Muy satisfecho con la compra.`,
    `Buen producto en general, cumple con lo prometido. Tal vez esperaba un poco más en ciertos aspectos, pero por el precio me parece una opción más que aceptable. Volvería a comprar sin dudas.`,
    `Increíble calidad. Llevo usándolo varias semanas y no tengo ninguna queja. La atención al cliente también fue excelente cuando tuve una consulta sobre las especificaciones. 5 estrellas.`,
    `Después de investigar mucho, elegí este ${productName} y no me arrepiento. Funciona perfectamente, la instalación fue sencilla y los resultados son profesionales. Ideal para entusiastas y expertos.`,
    `Justo lo que necesitaba. Lo pedí para un proyecto específico y cumplió al 100%. La calidad supera a otros productos que he probado en el mismo rango de precio. Muy recomendado.`,
    `Producto de excelente calidad y acabados. Se nota que está fabricado con materiales premium. La entrega fue rápida y el embalaje protegió el producto adecuadamente. Compra 10/10.`,
    `Lo uso a diario y rinde perfectamente. La batería/duración es buena y el rendimiento es consistente. Por el precio, es difícil encontrar algo mejor en el mercado actual.`,
    `Muy contento con la compra. El envío fue rápido y el producto llegó en perfecto estado. Se ve robusto y bien construido. Lo recomendaría sin dudar a amigos y familiares.`,
    `Buena relación calidad-precio. No es el más caro del mercado pero cumple sobradamente con lo que promete. Para uso doméstico y semiprofesional va perfecto. Satisfecho con la compra.`,
    `Decidí comprarlo después de ver varias reseñas y la verdad es que no me decepcionó. Funciona tal como describen en la publicación. Muy buen servicio y producto de calidad.`,
    `El producto es excelente, pero la entrega tuvo un pequeño retraso. Fuera de eso, todo perfecto. El ${productName} es de gran calidad y el vendedor respondió rápido mis dudas.`,
    `Llegó antes de lo esperado y en perfectas condiciones. La calidad supera lo que muestran las fotos. Muy recomendable para quienes buscan algo duradero y de buena marca.`,
    `Lo tengo hace un mes y funciona de lujo. La configuración fue sencilla y los resultados son profesionales. Sin duda una de las mejores compras que he hecho este año.`,
  ]

  const reviews: MockReview[] = []
  const selectedTemplates = shuffleArray(reviewTemplates).slice(0, count)

  for (let i = 0; i < selectedTemplates.length; i++) {
    const authorIndex = i % authors.length
    const rating = Math.min(5, Math.max(3, Math.round(4 + Math.random() * 1.5)))
    reviews.push({
      id: productId * 1000 + i + 1,
      author: authors[authorIndex],
      date: randomDate(new Date("2024-01-01"), new Date("2026-06-01")),
      content: selectedTemplates[i],
      rating,
      upvotes: Math.floor(Math.random() * 25) + 1,
      downvotes: Math.floor(Math.random() * 5),
    })
  }

  return reviews
}

export const PRODUCT_REVIEWS: Record<number, MockReview[]> = {
  1: generateReviewsForProduct(1, 6, "Monitor Samsung 47\""),
  2: generateReviewsForProduct(2, 5, "Teclado Mecánico RGB"),
  3: generateReviewsForProduct(3, 4, "Mouse Gaming Pro"),
  4: generateReviewsForProduct(4, 3, "Auriculares Gaming"),
  5: generateReviewsForProduct(5, 5, "Tarjeta Gráfica RTX"),
  6: generateReviewsForProduct(6, 4, "Procesador Intel i9"),
  7: generateReviewsForProduct(7, 8, "PlayStation 5"),
  8: generateReviewsForProduct(8, 6, "Xbox Series X"),
  9: generateReviewsForProduct(9, 5, "Nintendo Switch OLED"),
  10: generateReviewsForProduct(10, 4, "Steam Deck"),
  11: generateReviewsForProduct(11, 3, "Control DualSense"),
  12: generateReviewsForProduct(12, 4, "Volante Racing"),
  13: generateReviewsForProduct(13, 3, "Motherboard ASUS ROG"),
  14: generateReviewsForProduct(14, 4, "Fuente 850W Modular"),
  15: generateReviewsForProduct(15, 5, "Cooler CPU Líquido"),
  16: generateReviewsForProduct(16, 3, "Case Gaming RGB"),
  17: generateReviewsForProduct(17, 4, "SSD NVMe 1TB"),
  18: generateReviewsForProduct(18, 3, "Memoria RAM 32GB"),
  19: generateReviewsForProduct(19, 4, "PC Gaming RTX 4070"),
  20: generateReviewsForProduct(20, 3, "PC Workstation Pro"),
  21: generateReviewsForProduct(21, 4, "PC Gaming Básica"),
  22: generateReviewsForProduct(22, 3, "PC Streaming Setup"),
  23: generateReviewsForProduct(23, 4, "Webcam 4K"),
  24: generateReviewsForProduct(24, 3, "Micrófono USB"),
  25: generateReviewsForProduct(25, 5, "Pad Mouse XXL"),
  26: generateReviewsForProduct(26, 3, "Hub USB-C"),
  27: generateReviewsForProduct(27, 4, "Soporte Monitor Dual"),
  28: generateReviewsForProduct(28, 3, "Lámpara LED Gaming"),
}
