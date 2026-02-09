# Operations Products Management System

A production-grade full-stack CRUD application for managing products and product owners, built with modern technologies and clean architecture principles.

## Screenshots

| Dashboard | Products List |
|-----------|---------------|
| ![Dashboard](project%20images/dashboard.png) | ![Products](project%20images/products.png) |

| Create Product | Owners |
|----------------|--------|
| ![Create Product](project%20images/create%20product.png) | ![Owners](project%20images/owners%20page.png) |

## Tech Stack

| Layer | Technology | Version | Description |
|-------|------------|---------|-------------|
| **Monorepo** | pnpm workspaces | 9.x | Fast, disk-efficient package management |
| **Frontend** | React + Vite | React 19, Vite 6 | Modern React with fast HMR |
| **Backend** | Express + TypeScript | Express 5, TS 5.x | Mature, flexible Node.js framework |
| **Database** | PostgreSQL + Prisma | PG 16, Prisma 6 | Type-safe ORM with migrations |
| **Validation** | Zod | 3.x | Schema validation with TypeScript inference |
| **Forms** | React Hook Form | 7.x | Performant form handling |
| **Data Fetching** | TanStack Query | 5.x | Caching, optimistic updates, devtools |
| **Styling** | Tailwind CSS + shadcn/ui | 4.x | Utility-first CSS with components |
| **Charts** | Recharts | 2.x | Composable charting library |

## Features

### Product Management
- Full CRUD operations with validation
- SKU uniqueness validation (uppercase alphanumeric with hyphens)
- Price and inventory tracking
- Status management (Draft → Active → Archived)
- Image support (URL input)

### Dashboard
- Statistics cards with real-time data
- Products by owner bar chart
- Status distribution pie chart
- Recent products quick view

### Product Owners
- Pre-seeded 4 owners with avatars
- Product count per owner
- Quick filter to view owner's products

### Search & Filters
- Real-time search by product name (debounced)
- Filter by SKU, owner, status
- Sortable columns (name, SKU, price, inventory)
- Pagination with page size selector (10/25/50)

### UI/UX
- Modern, clean design with Inter font
- Responsive layout (mobile-friendly)
- Loading skeletons
- Form validation with error messages
- Confirmation dialogs for destructive actions
- Status badges with color coding

## Architecture

### Backend (Clean Architecture)
```
apps/backend/src/
├── modules/           # Feature modules
│   ├── products/      # Repository → Service → Controller pattern
│   │   ├── product.repository.ts
│   │   ├── product.service.ts
│   │   ├── product.controller.ts
│   │   └── product.routes.ts
│   ├── owners/
│   ├── upload/
│   └── stats/
├── core/              # Infrastructure
│   ├── middleware/    # Error handling, validation
│   ├── errors/        # Custom error classes
│   └── utils/         # Response helpers, pagination
└── config/            # Environment configuration
```

### Frontend (Feature-based)
```
apps/frontend/src/
├── modules/           # Feature modules
│   ├── products/
│   │   ├── api/       # API client functions
│   │   ├── hooks/     # TanStack Query hooks
│   │   ├── components/
│   │   └── pages/
│   ├── owners/
│   └── dashboard/
├── components/        # Shared components
│   ├── ui/            # shadcn/ui components
│   └── shared/        # Pagination, StatusBadge, etc.
├── layouts/           # Page layouts
├── hooks/             # Shared hooks (useDebounce)
└── lib/               # Utilities, API client
```

## Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (for PostgreSQL)

## Getting Started

### 1. Clone & Install

```bash
git clone <repository-url>
cd ops-products-management-system
pnpm install
```

### 2. Environment Setup

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

### 3. Start Database

```bash
docker-compose up -d postgres
```

### 4. Initialize Database

```bash
pnpm db:generate    # Generate Prisma client
pnpm db:push        # Apply schema to database
pnpm db:seed        # Seed with sample data (4 owners, 12 products)
```

### 5. Start Development

```bash
pnpm dev            # Start both frontend and backend

# Or individually:
pnpm dev:frontend   # http://localhost:5173
pnpm dev:backend    # http://localhost:3001
```

## API Reference

### Products

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | List products (paginated, filterable) |
| `POST` | `/api/products` | Create a product |
| `GET` | `/api/products/:id` | Get product by ID |
| `PUT` | `/api/products/:id` | Update a product |
| `DELETE` | `/api/products/:id` | Delete a product |

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, options: 10/25/50)
- `search` - Search by product name
- `sku` - Filter by SKU
- `ownerId` - Filter by owner ID
- `status` - Filter by status (DRAFT, ACTIVE, ARCHIVED)
- `sortBy` - Sort field (name, sku, price, inventory, createdAt)
- `sortOrder` - Sort direction (asc, desc)

### Other Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/owners` | List all product owners |
| `GET` | `/api/owners/:id` | Get owner by ID |
| `POST` | `/api/upload` | Upload an image (multipart/form-data) |
| `GET` | `/api/stats` | Dashboard statistics |
| `GET` | `/api/health` | Health check |

### Response Format

```typescript
// Success
{
  success: true,
  data: T,
  meta?: { page, limit, total, totalPages }
}

// Error
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  }
}
```

## Scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start all development servers |
| `pnpm dev:frontend` | Start frontend only |
| `pnpm dev:backend` | Start backend only |
| `pnpm build` | Build all packages |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format with Prettier |
| `pnpm typecheck` | TypeScript type checking |
| `pnpm db:generate` | Generate Prisma client |
| `pnpm db:push` | Push schema to database |
| `pnpm db:seed` | Seed sample data |
| `pnpm db:studio` | Open Prisma Studio |

## Database Schema

```prisma
model Owner {
  id        String    @id @default(cuid())
  name      String
  email     String    @unique
  avatar    String?
  products  Product[]
}

model Product {
  id        String        @id @default(cuid())
  name      String
  sku       String        @unique
  price     Decimal       @db.Decimal(10, 2)
  inventory Int           @default(0)
  status    ProductStatus @default(DRAFT)
  image     String?
  ownerId   String
  owner     Owner         @relation(...)
}

enum ProductStatus {
  DRAFT
  ACTIVE
  ARCHIVED
}
```

## Assumptions & Decisions

1. **SKU Format**: Uppercase alphanumeric with hyphens (e.g., `PROD-001`)
2. **Price Precision**: Up to 2 decimal places, max $999,999.99
3. **Inventory**: Whole units only, max 999,999
4. **Owner Deletion**: Restricted if owner has assigned products
5. **Image Upload**: Supports JPEG, PNG, WebP up to 5MB
6. **Authentication**: Not implemented (as per requirements)
7. **Low Inventory**: Threshold set at < 10 units

## Docker Deployment

Run the entire stack with Docker:

```bash
docker-compose build
docker-compose up -d
```

Services:
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- PostgreSQL: localhost:5434

## Future Improvements

- [ ] Unit and integration tests
- [ ] Authentication and authorization
- [ ] Bulk operations (import/export CSV)
- [ ] Product categories/tags
- [ ] Activity logging/audit trail
- [ ] Real-time updates with WebSockets
- [ ] Dark mode support

## License

MIT
