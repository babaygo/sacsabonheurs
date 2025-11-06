# Sacs à Bonheurs

> Full-stack e-commerce platform for handmade bags crafted in France [1](#0-0) 

🖥️ **[Live Demo](https://sacsabonheurs.fr)** [3](#0-2) 

## Overview

Sacs à Bonheurs is a modern e-commerce web application built with Next.js and Express, featuring a complete shopping experience with Stripe payment integration, admin dashboard, and Mondial Relay delivery options<cite />. The platform follows a JAMstack architecture with clear separation between frontend (Vercel) and backend (Render) services<cite />.

## Features

### Customer Features
- **Product Catalog**: Browse handmade bags with category filtering and detailed product pages<cite />
- **Shopping Cart**: Persistent cart state with Zustand for seamless shopping experience<cite />
- **Secure Checkout**: Stripe-powered payment processing with webhook-driven order creation<cite />
- **Mondial Relay Integration**: Choose delivery points using the ParcelShopPicker widget<cite />
- **Order History**: View past orders and track delivery status<cite />
- **User Authentication**: Secure login/signup with better-auth (v1.3.23)<cite />

### Admin Features
- **Product Management**: CRUD operations with image upload to Cloudflare R2 [4](#0-3) 
- **Category Management**: Organize products with slug-based categories [5](#0-4) 
- **Order Management**: Process orders, update statuses, and manage fulfillment<cite />
- **Legal Content Editor**: Rich text editor with PDF import for legal documents [6](#0-5) 
- **Banner Management**: Create site-wide announcements with dismissible options<cite />
- **Shipping Rates**: Configure Stripe shipping rates for different delivery methods<cite />

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | Next.js | 15.5.4 |
| **UI Library** | React | 19.1.0 |
| **Backend** | Express.js | Latest |
| **Database** | PostgreSQL | Latest |
| **ORM** | Prisma | Latest |
| **Authentication** | better-auth | 1.3.23 |
| **Payments** | Stripe | Latest |
| **Storage** | Cloudflare R2 | S3-compatible |
| **Email** | Resend | Latest |
| **State Management** | Zustand | 5.0.8 |
| **Styling** | Tailwind CSS | 4.1.13 |
| **Rich Text** | TipTap | 3.7.2 |

<cite />

## Installation

### Prerequisites
- Node.js 22.x
- Docker & Docker Compose
- PostgreSQL database
- Stripe account
- Cloudflare R2 bucket
- Resend API key

### Clone Repository
```sh
git clone https://github.com/babaygo/sacsabonheurs.git
cd sacsabonheurs
``` [7](#0-6) 

### Backend Setup
```sh
cd backend
npm install
docker-compose up --build -d
npx prisma generate
npx prisma migrate dev
npx prisma db seed
``` [8](#0-7) 

**Environment Variables** (create `.env` file):
```env
DATABASE_URL="postgresql://..."
URL_FRONT="http://localhost:3000"
STRIPE_SECRET_KEY="sk_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
R2_ACCOUNT_ID="..."
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
R2_BUCKET_NAME="..."
RESEND_API_KEY="re_..."
BETTER_AUTH_SECRET="..."
```
<cite />

### Frontend Setup
```sh
cd frontend
npm install
npm run dev
``` [9](#0-8) 

Access the application at **http://localhost:3000** [10](#0-9) 

**Environment Variables** (create `.env.local` file):
```env
NEXT_PUBLIC_URL_FRONT="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3001"
BETTER_AUTH_SECRET="..."
BETTER_AUTH_URL="http://localhost:3001"
```
<cite />

## Architecture

```
┌─────────────────┐
│   Next.js App   │  (Vercel)
│   Port 3000     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Express API    │  (Render)
│   Port 3001     │
└────────┬────────┘
         │
    ┌────┴────┬──────────┬──────────┐
    ▼         ▼          ▼          ▼
┌────────┐ ┌──────┐ ┌────────┐ ┌────────┐
│Postgres│ │Stripe│ │   R2   │ │ Resend │
└────────┘ └──────┘ └────────┘ └────────┘
```
<cite />

### Key Design Patterns
- **Snapshot Pattern**: Order items store product details at purchase time to preserve history<cite />
- **Webhook-Driven Orders**: Stripe webhooks trigger order creation after payment confirmation<cite />
- **Role-Based Access**: Three-tier access control (public, authenticated, admin)<cite />
- **Server-Side Rendering**: Legal pages and product catalog use Next.js SSR for SEO [11](#0-10) 

## Database Schema

Core entities:
- **User**: Customer accounts with role-based permissions<cite />
- **Product**: Catalog items with images, stock, and category relationships<cite />
- **Order**: Customer orders with Stripe session tracking and delivery details<cite />
- **OrderItem**: Line items preserving product snapshots<cite />
- **Category**: Product categorization with slugs<cite />
- **Legal**: Site-wide legal content (mentions, CGV, privacy) [12](#0-11) 
- **Banner**: Dismissible site announcements<cite />

## Deployment

### Frontend (Vercel)
- Build command: `next build --turbopack`<cite />
- Environment variables: `NEXT_PUBLIC_*`, better-auth credentials<cite />
- Automatic deployments from main branch<cite />

### Backend (Render)
- Docker container with Node 22.x<cite />
- PostgreSQL addon for database<cite />
- Environment variables: Database URL, API keys, secrets<cite />
- Auto-deploy on push to backend-preprod<cite />

## API Endpoints

### Public
- `GET /api/products` - List all products<cite />
- `GET /api/products/:slug` - Get product by slug<cite />
- `GET /api/categories` - List categories<cite />
- `GET /api/banners` - Get active banners<cite />
- `GET /api/admin/legal` - Get legal content [13](#0-12) 

### Authenticated
- `POST /api/checkout` - Create Stripe checkout session<cite />
- `GET /api/orders` - Get user's orders<cite />
- `POST /api/order/:sessionId/relay` - Set Mondial Relay point<cite />
- `POST /api/contact` - Submit contact form [14](#0-13) 

### Admin
- `POST/PUT/DELETE /api/admin/products` - Manage products<cite />
- `POST/PUT/DELETE /api/admin/categories` - Manage categories<cite />
- `POST /api/admin/legal` - Update legal content [15](#0-14) 
- `GET/POST/DELETE /api/admin/shipping-rates` - Manage Stripe shipping<cite />
- `POST/PUT/DELETE /api/admin/banners` - Manage banners<cite />

### Webhooks
- `POST /webhook` - Stripe payment events<cite />

## License

This project is proprietary software for Sacs à Bonheurs.
