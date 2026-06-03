import Link from "next/link";
import Image from "next/image";
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { Subheading, Body, Caption } from "@/components/atoms/Typography";
import Button from "@/components/atoms/Button";

// Datos estructurados
const navigationLinks = [
  { label: "Inicio", href: "/" },
  { label: "Ofertas", href: "/ofertas" },
  { label: "Videojuegos", href: "/videojuegos" },
  { label: "Componentes", href: "/componentes" },
  { label: "Computadoras", href: "/computadoras" },
  { label: "Consolas", href: "/consolas" },
  { label: "Workstations", href: "/workstations" },
  { label: "Accesorios", href: "/accesorios" },
];

const supportLinks = [
  { label: "Centro de ayuda", href: "/ayuda" },
  { label: "Garantías", href: "/garantias" },
  { label: "Devoluciones", href: "/devoluciones" },
  { label: "Reparaciones", href: "/reparaciones" },
  { label: "Mantenimiento", href: "/mantenimiento" },
  { label: "Servicio técnico", href: "/servicio-tecnico" },
  { label: "Preguntas frecuentes", href: "/faq" },
];

const contactInfo = [
  {
    type: "email",
    icon: EnvelopeIcon,
    items: ["support@ratacueva.com", "pedidos@ratacueva.com"],
  },
  {
    type: "phone",
    icon: PhoneIcon,
    items: ["+506 2222-3333", "+506 8888-9999"],
  },
  {
    type: "address",
    icon: MapPinIcon,
    items: ["Córdoba, Veracruz, México"],
  },
];

const socialNetworks = [
  {
    name: "Facebook",
    href: "https://facebook.com/ratacueva",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com/ratacueva",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.291C3.89 14.81 3.29 13.506 3.29 12.017c0-1.489.6-2.793 1.836-3.68.875-.8 2.026-1.291 3.323-1.291 1.297 0 2.448.49 3.323 1.291 1.236.887 1.836 2.191 1.836 3.68 0 1.489-.6 2.793-1.836 3.68-.875.8-2.026 1.291-3.323 1.291zm7.138 0c-1.297 0-2.448-.49-3.323-1.291-1.236-.887-1.836-2.191-1.836-3.68 0-1.489.6-2.793 1.836-3.68.875-.8 2.026-1.291 3.323-1.291 1.297 0 2.448.49 3.323 1.291 1.236.887 1.836 2.191 1.836 3.68 0 1.489-.6 2.793-1.836 3.68-.875.8-2.026 1.291-3.323 1.291z" />
      </svg>
    ),
  },
  {
    name: "Twitter",
    href: "https://twitter.com/ratacueva",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com/ratacueva",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-gray">
      <div className="max-w-[1440px] mx-auto px-[80px] py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="flex justify-start items-center gap-2 mb-6"
            >
              <Image
                src="/images/logotipo-base.svg"
                alt="RataCueva Logo"
                width={126}
                height={22}
                style={{ height: 'auto' }}
              />
            </Link>
            <Body className="text-placeholder text-base mb-6 leading-relaxed">
              Tu tienda de confianza para productos gaming y tecnología.
              Llevamos tu experiencia al siguiente nivel.
            </Body>

            {/* Social Media */}
            <div className="mb-6">
              <Subheading className="mb-4">Síguenos</Subheading>
              <div className="flex gap-3">
                {socialNetworks.map((social, index) => (
                  <Button
                    key={index}
                    variant="primary"
                    size="md"
                    shape="circle"
                    href={social.href}
                    target="_blank"
                    className="w-10 h-10"
                    aria-label={social.name}
                  >
                    {social.icon}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <Subheading className="text-white mb-6">Navegación</Subheading>
            <div className="space-y-3">
              {navigationLinks.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="block text-placeholder hover:text-cyan-400 transition-colors text-base"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Support Column */}
          <div>
            <Subheading className="text-white mb-6">Soporte</Subheading>
            <div className="space-y-3">
              {supportLinks.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  className="block text-placeholder hover:text-cyan-400 transition-colors text-base"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact Column */}
          <div>
            <Subheading className="text-white mb-6">Contacto</Subheading>
            <div className="space-y-4">
              {contactInfo.map((contact, index) => {
                const IconComponent = contact.icon;
                return (
                  <div key={index} className="flex items-start gap-3">
                    <IconComponent className="w-5 h-5 text-cyan-400 mt-0.5 flex-shrink-0" />
                    <div>
                      {contact.items.map((item, itemIndex) => (
                        <Body
                          key={itemIndex}
                          className="text-placeholder text-base"
                        >
                          {contact.type === "address" && itemIndex > 0 ? (
                            <>
                              <br />
                              {item}
                            </>
                          ) : (
                            item
                          )}
                        </Body>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
            <Caption className="text-placeholder text-sm lg:text-base text-center lg:text-left">
              © 2025 RataCueva. Todos los derechos reservados.
            </Caption>
            <div className="flex flex-wrap justify-center lg:justify-end gap-6">
              <Link
                href="#"
                className="text-placeholder hover:text-cyan-400 transition-colors text-sm lg:text-base"
              >
                Términos de servicio
              </Link>
              <Link
                href="#"
                className="text-placeholder hover:text-cyan-400 transition-colors text-sm lg:text-base"
              >
                Política de privacidad
              </Link>
              <Link
                href="#"
                className="text-placeholder hover:text-cyan-400 transition-colors text-sm lg:text-base"
              >
                Cookies
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
