# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start development server (http://localhost:3000)
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript validation without emit
```

## Architecture Overview

**Luxe Essence** is a Next.js 15 (App Router) e-commerce site for Arabic perfumes, targeting Argentine customers. It integrates with a live WooCommerce store as the backend.

### Request Flow

Frontend → Next.js API routes (`/api/products`, `/api/checkout`) → WooCommerce REST API (`luxefragancias.com/wp-json/wc/v3`)

The API routes act as middleware: they handle WooCommerce authentication server-side so credentials are never exposed to the client.

### Key Directories

- `src/app/` — Next.js App Router pages and API routes
  - `src/app/checkout/` — Multi-step checkout page (`/checkout`)
  - `src/app/coleccion/` — Full catalog page (`/coleccion`) with filter/sort UI; logic in `CollectionClient.tsx`
  - `src/app/api/products/` — Proxies WooCommerce product list
  - `src/app/api/checkout/` — Creates WooCommerce order, returns order ID
  - `src/app/api/order-status/` — Polls WooCommerce order status by ID (`?id=<orderId>`)
- `src/features/` — Feature-specific components organized by page section:
  - `hero/` — HeroSection, PerfumeShowcase3D, ShinyButton
  - `products/` — ProductCard, ProductsSection
  - `decants/` — DecantsSection
  - `offers/` — FeaturedCarousel, OffersCarousel
  - `banners/` — BannersSection, CTABanner (video-backed CTA banners)
  - `brand/` — BrandSection
  - `faq/` — FAQSection
  - `gallery/` — GaleriaSection
  - `checkout/` — WhatsAppCTA
  - `testimonials/` — TestimonialsSection
- `src/components/` — Shared/layout components:
  - `cart/` — CartDrawer, FloatingCart
  - `backgrounds/` — Blends, DarkVeil, Plasma (decorative backgrounds)
  - `layout/` — TopBanner
  - `footer/` — SocialFooter
  - `shared/` — PageLoader; `shared/ui/` — Button, Container, ErrorMessage, LoadingSkeleton, Section, ScrollVelocity, CursorSpotlight, GlowingEffect
  - `ui/` — shadcn/ui primitives (badge, button, dialog, input, label, select, separator, sheet, skeleton, sonner, tooltip)
- `src/core/` — Business logic:
  - `api/` — WooCommerce client and product fetching functions
  - `config/` — Site config and WooCommerce config
  - `data/` — Mock/fallback data for products and testimonials
  - `hooks/` — `useProducts()` and `useProduct()` hooks
  - `types/` — TypeScript interfaces (`Product`, `WCProduct`, `Testimonial`)
  - `utils/` — WooCommerce response mapper (`wc-mapper.ts`)
- `src/context/CartContext.tsx` — Global cart state (React Context + localStorage)
- `src/core/hooks/` — `useProducts()` and `useProduct()` — fetch from `/api/products` with SWR-like state
- `src/hooks/` — General-purpose hooks (e.g. `useScrollReveal`)
- `src/lib/` — Utilities: `utils.ts` (clsx + tailwind-merge `cn()`), `wordReveal.tsx`
- `src/styles/tailwind.css` — Tailwind v4 import + shadcn CSS variable definitions

### WooCommerce Integration

Credentials are in `.env.local`. The `woocommerce-client.ts` creates a singleton Axios instance with Basic auth. `wc-mapper.ts` transforms raw WooCommerce API responses into the internal `Product` type, including extraction of custom meta fields (`_brand`, `_decant_price`, `_olfactory_notes_*`, `_intensity`, `_longevity`).

`Product.category` is either `'masculino'` or `'femenino'`. The `/coleccion` page uses this plus `decantPrice` presence to drive its five filter tabs.

### Decants

Products support two purchase variants — full bottle ("Frasco") and sample ("Decant"). Decants have a separate price (`decantPrice`) stored in WooCommerce meta. In cart/checkout, decant items are identified by ID suffix: `${productId}-decant`.

### Checkout Flow

Multi-step page at `/checkout` (`src/app/checkout/page.tsx`) with three steps:

1. **Review** — shows cart items and total
2. **Details** — customer form (name, email, phone, address); submits to `/api/checkout` which creates a WooCommerce order
3. **Payment** — two options:
   - **WhatsApp** — formats cart as text message, opens `wa.me` URL
   - **Online** — opens Ualá payment URL in an iframe overlay (falls back to new tab if blocked)

The cart drawer (`CartDrawer.tsx`) also retains a quick WhatsApp-only path for direct checkout without the full page flow.

Toast notifications via **Sonner** (`sonner` package).

### Styling

Hybrid approach:
- **CSS Modules** (`.module.css`) per component — primary styling method for all custom components
- **Tailwind v4** (`src/styles/tailwind.css`) — used only within shadcn/ui components and utilities
- **shadcn/ui** (`src/components/ui/`) — Radix UI-based primitives with Tailwind; configured via `components.json`
- Global design tokens in `src/app/globals.css`

Design system:
- Gold accent: `#C5A059`
- Fonts: Cormorant Garamond (headings), Inter (body)
- Glassmorphism effects throughout

Do **not** add Tailwind utility classes to custom feature/layout components — those use CSS Modules only. Tailwind is scoped to `src/components/ui/` and `src/lib/utils.ts`.

### Animations

- **Framer Motion** and the `motion` library for UI animations
- **GSAP** (`gsap` + `@gsap/react`) for advanced scroll and timeline animations; always `gsap.registerPlugin(ScrollTrigger)` before use
- **Three.js + OGL** for the 3D hero section (`PerfumeShowcase3D`)
- **`useScrollReveal`** (`src/hooks/useScrollReveal.ts`) — lightweight IntersectionObserver hook for fade+slide-in on scroll
- **`react-bits`** — additional animated UI primitives

### Component Library (shadcn/ui)

Located in `src/components/ui/`. Primitive components: badge, button, dialog, input, label, select, separator, sheet, skeleton, sonner (toaster), tooltip. Add new primitives via `npx shadcn@latest add <component>`. The `cn()` helper in `src/lib/utils.ts` merges class names (clsx + tailwind-merge).

## Environment Variables

Copy `env.example` to `.env.local`. Required:
- `NEXT_PUBLIC_WC_URL` — WooCommerce store URL (`https://luxefragancias.com`)
- `WC_CONSUMER_KEY` / `WC_CONSUMER_SECRET` — WooCommerce REST API credentials
- `NEXT_PUBLIC_API_DEBUG` — Set to `true` to enable request/response logging

## Site Config

Business metadata (WhatsApp number, email, Instagram handle, locale `es-AR`, currency `ARS`) lives in `src/core/config/site.ts` (`siteConfig`). The WhatsApp number drives checkout message links and the cart drawer CTA.
