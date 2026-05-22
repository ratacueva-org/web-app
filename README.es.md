# RataCueva Web App — Frontend de Ecommerce Gamer

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.3-black?logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?logo=tailwindcss&logoColor=white" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/License-GPL_v3-0298c3?logo=gnu&logoColor=white" alt="GPL v3">
</p>

<p align="center">
  <em>Plataforma de ecommerce para videojuegos, componentes de PC y accesorios gaming</em>
</p>

<p align="center">
  <a href="https://github.com/ratacueva-org/ratacueva-web/issues">Reportar error</a>
  ·
  <a href="https://ratacueva.netlify.app/home">Visitar sitio web</a>
</p>

<p align="center">
  <a href="README.md">🇬🇧 English</a> · <a href="README.es.md">🇪🇸 Español</a>
</p>

---

## Acerca de RataCueva Web App

Un frontend de ecommerce moderno y responsivo construido con Next.js 15 y React 19. Incluye un catalogo completo de productos, busqueda avanzada con filtros, carrito de compras, autenticacion de usuarios y un panel administrativo integral para gestion de inventario y pedidos.

### Ecosistema

| Componente | Repositorio | Stack |
|-----------|-----------|-------|
| Web App (este) | [ratacueva-org/ratacueva-web](https://github.com/ratacueva-org/ratacueva-web) | Next.js, TypeScript, TailwindCSS |
| Backend API | [ratacueva-org/ratacueva-api](https://github.com/ratacueva-org/ratacueva-api) | Express, TypeScript, MongoDB |

## Funcionalidades

- Catalogo completo de productos gaming con categorias y busqueda
- Filtros avanzados por precio, categoria y especificaciones
- Carrito de compras con proceso de checkout optimizado
- Autenticacion de usuarios y gestion de cuentas
- Panel administrativo para productos, pedidos y usuarios
- Diseno responsivo para todos los dispositivos
- Animaciones con Framer Motion para interacciones fluidas

## Inicio rapido

### Requisitos previos

- Node.js 18+
- npm o yarn

### Instalacion

```bash
git clone https://github.com/ratacueva-org/ratacueva-web.git
cd ratacueva-web
npm install
```

### Variables de entorno

Crea un archivo `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_SECRET=tu_clave_secreta
```

### Ejecutar

```bash
npm run dev
```

La aplicacion estara disponible en `http://localhost:3000`

## Arquitectura

```
src/
├── app/
│   ├── (auth)/          # Rutas de autenticacion
│   ├── (dashboard)/     # Panel administrativo
│   └── (shop)/          # Tienda online
├── components/
│   ├── atoms/           # Componentes basicos
│   ├── features/        # Componentes por funcionalidad
│   └── organisms/       # Componentes complejos
├── hooks/               # Hooks personalizados
├── services/            # Servicios de API
└── contexts/            # Contextos de React
```

## Contribuciones

Lee [CONTRIBUTING.md](CONTRIBUTING.md) para conocer las convenciones de ramas, commits y PRs.

## Licencia

Este proyecto esta bajo la licencia GPL v3 — ver [LICENSE](LICENSE) para mas detalles.

## Agradecimientos

**Authors:**

- Serrano Puertos Jorge Christian
- Chavez Moreno Jose Eduardo
- Lopez Valdes Erick Ernesto
- Florentino Altamirano Misrael
