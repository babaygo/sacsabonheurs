# Sacs à Bonheurs

> Full-stack e-commerce platform for handmade bags crafted in France

🖥️ **[Live Demo](https://sacsabonheurs.fr)**

## Overview

Sacs à Bonheurs is a modern e-commerce web application built with Next.js and Express, featuring a complete shopping experience with Stripe payment integration, admin dashboard, and Mondial Relay delivery options. The platform follows a JAMstack architecture with clear separation between frontend (Vercel) and backend (Render) services.

## Features

### Customer Features
- **Product Catalog**: Browse handmade bags with category filtering and detailed product pages
- **Shopping Cart**: Persistent cart state with Zustand for seamless shopping experience
- **Secure Checkout**: Stripe-powered payment processing with webhook-driven order creation
- **Mondial Relay Integration**: Choose delivery points using the ParcelShopPicker widget
- **Order History**: View past orders and track delivery status
- **User Authentication**: Secure login/signup with better-auth (v1.3.23)

### Admin Features
- **Product Management**: CRUD operations with image upload to Cloudflare R2
- **Category Management**: Organize products with slug-based categories 
- **Order Management**: Process orders, update statuses, and manage fulfillment
- **Legal Content Editor**: Rich text editor with PDF import for legal documents
- **Banner Management**: Create site-wide announcements with dismissible options
- **Shipping Rates**: Configure Stripe shipping rates for different delivery methods

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
```

### Backend Setup
```sh
cd backend
npm install
docker-compose up --build -d
npx prisma generate
npx prisma migrate dev
npx prisma db seed
``` 

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


### Frontend Setup
```sh
cd frontend
npm install
npm run dev
``` 

Access the application at **http://localhost:3000**

**Environment Variables** (create `.env.local` file):
```env
NEXT_PUBLIC_URL_FRONT="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3001"
BETTER_AUTH_SECRET="..."
BETTER_AUTH_URL="http://localhost:3001"
```


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


### Key Design Patterns
- **Snapshot Pattern**: Order items store product details at purchase time to preserve history
- **Webhook-Driven Orders**: Stripe webhooks trigger order creation after payment confirmation
- **Role-Based Access**: Three-tier access control (public, authenticated, admin)
- **Server-Side Rendering**: Legal pages and product catalog use Next.js SSR for SEO 

## Database Schema

Core entities:
- **User**: Customer accounts with role-based permissions
- **Product**: Catalog items with images, stock, and category relationships
- **Order**: Customer orders with Stripe session tracking and delivery details
- **OrderItem**: Line items preserving product snapshots
- **Category**: Product categorization with slugs
- **Legal**: Site-wide legal content (mentions, CGV, privacy) 
- **Banner**: Dismissible site announcements

## Deployment

### Frontend (Vercel)
- Build command: `next build --turbopack`
- Environment variables: `NEXT_PUBLIC_*`, better-auth credentials
- Automatic deployments from main branch

### Backend (Render)
- Docker container with Node 22.x
- PostgreSQL addon for database
- Environment variables: Database URL, API keys, secrets
- Auto-deploy on push to backend-preprod

## License

This project is proprietary software for Sacs à Bonheurs.
