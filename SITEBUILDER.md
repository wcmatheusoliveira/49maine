# 49Maine Sitebuilder Documentation

## Overview
A dynamic content management system for the 49Maine restaurant website, built with Next.js, Prisma, and SQLite.

## Features
- **Dynamic Content Management**: Manage all website content through an admin dashboard
- **Menu Management**: Create categories, add items with pricing, mark as popular/unavailable
- **Business Information**: Update hours, location, contact details, and social media
- **Page Builder**: Create and manage dynamic pages with reusable sections
- **Component System**: Modular components that can be configured via the database

## Getting Started

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Database Setup
```bash
# Run initial migration
pnpm db:migrate

# Seed database with sample content
pnpm db:seed

# Open Prisma Studio to view/edit database
pnpm db:studio
```

### 3. Start Development Server
```bash
pnpm dev
```

### 4. Access the Application
- **Frontend**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin

## Admin Dashboard

### Menu Management
Navigate to `/admin/menu` to:
- Create and organize menu categories
- Add menu items with descriptions and pricing
- Mark items as popular or unavailable
- Reorder categories and items

### Business Information
Navigate to `/admin/business` to:
- Update restaurant name and contact details
- Set business hours for each day
- Add social media links
- Configure Google Maps embed

### Pages (Coming Soon)
Navigate to `/admin/pages` to:
- Create new pages
- Edit existing pages
- Manage SEO metadata
- Configure page sections

## Database Schema

### Core Models
- **Site**: Global site configuration
- **Page**: Dynamic pages with SEO metadata
- **Section**: Page sections (hero, menu, location, etc.)
- **Component**: Reusable content blocks
- **MenuCategory**: Restaurant menu categories
- **MenuItem**: Individual menu items
- **BusinessInfo**: Restaurant details and hours
- **SpecialOffer**: Promotional announcements
- **Testimonial**: Customer reviews
- **Media**: Image and video assets

## API Endpoints

### Menu Management
- `GET /api/admin/menu/categories` - List all categories
- `POST /api/admin/menu/categories` - Create category
- `PUT /api/admin/menu/categories?id=` - Update category
- `DELETE /api/admin/menu/categories?id=` - Delete category

- `GET /api/admin/menu/items` - List all items
- `POST /api/admin/menu/items` - Create item
- `PUT /api/admin/menu/items?id=` - Update item
- `DELETE /api/admin/menu/items?id=` - Delete item

### Business Information
- `GET /api/admin/business` - Get business info
- `POST /api/admin/business` - Update business info

### Pages & Sections
- `GET /api/admin/pages` - List all pages
- `POST /api/admin/pages` - Create page
- `PUT /api/admin/pages?id=` - Update page
- `DELETE /api/admin/pages?id=` - Delete page

## Dynamic Components

### DynamicHero
Configurable hero section with:
- Headlines and taglines
- Background video/image
- CTA buttons
- Special announcements

### DynamicMenu
Database-driven menu display with:
- Categories and items
- Pricing options
- Popular/availability indicators

### DynamicLocation
Business location section with:
- Google Maps integration
- Business hours
- Contact information
- Social media links

### DynamicSection
Generic section renderer that:
- Loads section data from database
- Renders appropriate component based on type
- Supports custom configurations

## Development Workflow

1. **Content Updates**: Use the admin dashboard to update content
2. **Database Changes**: Modify `prisma/schema.prisma` and run `pnpm db:migrate`
3. **New Components**: Add to `src/components/dynamic/` and register in `DynamicSection.tsx`
4. **API Extensions**: Add routes to `src/app/api/admin/`

## Future Enhancements

- [ ] User authentication and role management
- [ ] Multi-location support
- [ ] Advanced page builder with drag-and-drop
- [ ] Content versioning and rollback
- [ ] Media library with image optimization
- [ ] Email notification system
- [ ] Reservation management
- [ ] Analytics dashboard
- [ ] Multi-language support
- [ ] Custom theme builder

## Troubleshooting

### Database Issues
```bash
# Reset database
rm prisma/dev.db
pnpm db:migrate
pnpm db:seed
```

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next
pnpm dev
```

### Prisma Client Issues
```bash
# Regenerate Prisma client
pnpm dlx prisma generate
```