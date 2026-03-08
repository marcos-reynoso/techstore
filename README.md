# 🛒 TechStore

> E-commerce de productos tecnológicos construido con Next.js 14, TypeScript y Prisma.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat-square&logo=tailwind-css)

---

## 📌 Descripción

TechStore es una aplicación e-commerce completa para la venta de productos tecnológicos. Desarrollada con Next.js App Router y TypeScript estricto, implementa un flujo de compra real con autenticación de usuarios, catálogo por categorías, carrito de compras, checkout y seguimiento de órdenes.

El proyecto fue construido con foco en arquitectura escalable, validación robusta de datos y una experiencia de usuario fluida.

---

## ✨ Funcionalidades

- 🔐 **Autenticación** — registro, login y sesiones con NextAuth.js
- 👤 **Perfil de usuario** — edición de datos, avatar personalizado y configuración
- 📦 **Catálogo de productos** — listado con productos destacados y páginas de detalle
- 🗂️ **Categorías** — navegación y filtrado de productos por categoría
- 🔍 **Búsqueda** — búsqueda de productos en tiempo real
- 🛒 **Carrito de compras** — gestión de items con estado global (Zustand)
- ❤️ **Wishlist** — lista de productos guardados por el usuario
- 💳 **Checkout** — proceso de compra con validación de formularios (Zod)
- 📋 **Gestión de órdenes** — historial de compras y seguimiento de pedidos
- 🛠️ **API REST completa** — endpoints para productos, categorías, órdenes y usuarios
- ⏳ **Loading states** — skeletons y estados de carga para mejor UX
- 🔒 **Middleware de autenticación** — protección de rutas privadas

---

## 🚀 Stack tecnológico

| Categoría | Tecnología |
|-----------|-----------|
| Framework | Next.js 14 (App Router) |
| Lenguaje | TypeScript |
| Autenticación | NextAuth.js |
| ORM | Prisma |
| Estado global | Zustand |
| Validación | Zod |
| UI Components | shadcn/ui |
| Estilos | Tailwind CSS |
| Package manager | pnpm |

---

## 🏃 Cómo correr el proyecto localmente

### Prerrequisitos

- Node.js 18+
- pnpm
- Base de datos compatible con Prisma (PostgreSQL / MySQL / SQLite)

### Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/marcos-reynoso/techstore.git
cd techstore

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env
# Completar las variables en el archivo .env

# 4. Generar el cliente de Prisma y migrar la base de datos
npx prisma migrate dev

# 5. Correr el servidor de desarrollo
pnpm dev
```

Abrí [http://localhost:3000](http://localhost:3000) en tu navegador para ver la app.

---

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── api/                  # API Routes (REST)
│   │   ├── auth/             # Autenticación (NextAuth)
│   │   ├── categories/       # Endpoints de categorías
│   │   ├── orders/           # Endpoints de órdenes y tracking
│   │   ├── products/         # Endpoints de productos y búsqueda
│   │   ├── upload/           # Upload de avatar
│   │   └── users/            # Endpoints de usuarios y perfil
│   ├── cart/                 # Página del carrito
│   ├── categories/           # Página de categorías
│   ├── checkout/             # Página de checkout
│   ├── login/                # Página de login
│   ├── register/             # Página de registro
│   ├── products/             # Catálogo y detalle de productos
│   ├── profile/              # Perfil, órdenes y configuración
│   ├── support/              # Página de soporte
│   ├── track/                # Seguimiento de pedidos
│   ├── wishlist/             # Lista de deseos
│   └── page.tsx              # Home
├── components/
│   ├── products/             # Componentes de producto (card, grid, detalle)
│   ├── ui/                   # Componentes base (shadcn/ui)
│   ├── app-sidebar.tsx       # Sidebar de navegación
│   ├── site-header.tsx       # Header principal
│   └── search-form.tsx       # Formulario de búsqueda
├── hooks/                    # Custom hooks (use-mobile)
├── lib/                      # Utilidades y configuración
│   ├── auth.ts               # Configuración de NextAuth
│   ├── prisma.ts             # Cliente de Prisma
│   ├── validations/          # Schemas de validación con Zod
│   └── utils.ts              # Funciones utilitarias
├── store/                    # Estado global con Zustand
│   ├── cart-store.ts
│   ├── orders-store.ts
│   ├── product-store.ts
│   └── user-store.ts
├── types/                    # Tipos TypeScript globales
└── middleware.ts             # Middleware de protección de rutas
```

---
