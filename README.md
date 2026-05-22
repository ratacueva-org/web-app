# RataCueva Web App — Gaming Ecommerce Frontend

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.3-black?logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/TailwindCSS-4.x-06B6D4?logo=tailwindcss&logoColor=white" alt="TailwindCSS">
  <img src="https://img.shields.io/badge/License-GPL_v3-0298c3?logo=gnu&logoColor=white" alt="GPL v3">
</p>

<p align="center">
  <em>Customer-facing ecommerce platform for video games, PC components, and gaming accessories</em>
</p>

<p align="center">
  <a href="https://github.com/ratacueva-org/ratacueva-web/issues">Report Bug</a>
  ·
  <a href="https://ratacueva.netlify.app/home">Visit Website</a>
</p>

<p align="center">
  <a href="README.md">🇬🇧 English</a> · <a href="README.es.md">🇪🇸 Español</a>
</p>

---

## About RataCueva Web App

A modern, responsive ecommerce frontend built with Next.js 15 and React 19. Features a complete product catalog, advanced search and filtering, shopping cart, user authentication, and a comprehensive admin dashboard for inventory and order management.

### Ecosystem

| Component | Repository | Stack |
|-----------|-----------|-------|
| Web App (this) | [ratacueva-org/ratacueva-web](https://github.com/ratacueva-org/ratacueva-web) | Next.js, TypeScript, TailwindCSS |
| Backend API | [ratacueva-org/ratacueva-api](https://github.com/ratacueva-org/ratacueva-api) | Express, TypeScript, MongoDB |

## Features

- Complete gaming product catalog with categories and search
- Advanced filtering by price, category, and specifications
- Shopping cart with optimized checkout flow
- User authentication and account management
- Admin dashboard for products, orders, and users
- Responsive design for all devices
- Framer Motion animations for smooth interactions

## Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
git clone https://github.com/ratacueva-org/ratacueva-web.git
cd ratacueva-web
npm install
```

### Environment Variables

Create a `.env.local` file:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXTAUTH_SECRET=your_secret_key
```

### Run

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Architecture

```
src/
├── app/
│   ├── (auth)/          # Authentication routes
│   ├── (dashboard)/     # Admin dashboard
│   └── (shop)/          # Online store
├── components/
│   ├── atoms/           # Basic components
│   ├── features/        # Feature-specific components
│   └── organisms/       # Complex components
├── hooks/               # Custom hooks
├── services/            # API services
└── contexts/            # React contexts
```

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for branch naming, commit conventions, and PR workflow.

## License

This project is licensed under the GPL v3 — see the [LICENSE](LICENSE) file for details.

## Acknowledgments

**Authors:**

- Serrano Puertos Jorge Christian
- Chavez Moreno Jose Eduardo
- Lopez Valdes Erick Ernesto
- Florentino Altamirano Misrael
