// src/components/atoms/Typography/BaseTypography.tsx
"use client";

import React from "react";
import { BaseTypographyInternalProps } from "./types";

/**
 * BaseTypography - Componente base para aplicar estilos de tipografía usando clases nativas de Tailwind CSS.
 * Este componente es interno y no debe ser usado directamente, sino a través de los componentes exportados (Display, Body, etc.).
 */
export const BaseTypography: React.FC<BaseTypographyInternalProps> = ({
  children,
  className = "",
  variant,
  defaultElement,
  as: Component = defaultElement,
}) => {
  // Mapeo de variantes a clases nativas de Tailwind CSS
  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case "display":
        return "text-4xl font-bold"; // 36px, bold — WCAG 1.4.4: rem-based
      case "heading":
        return "text-2xl font-bold"; // 24px, bold
      case "subheading":
        return "text-xl font-bold"; // 20px, bold
      case "body":
        return "text-base"; // 16px, normal
      case "body-small":
        return "text-sm"; // 14px, normal
      case "caption":
        return "text-xs"; // 12px, normal
      default:
        return "text-base";
    }
  };

  const baseClasses = getVariantClasses(variant);

  return (
    <Component className={`${baseClasses} ${className}`.trim()}>
      {children}
    </Component>
  );
};
