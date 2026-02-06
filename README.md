# Vijay Kumar Kosireddy - Artist Portfolio

A modern, premium portfolio website showcasing Carnatic music and mono-realistic pencil sketch artistry. Built with Next.js 16, featuring a comprehensive admin panel, SEO optimizations, and progressive web capabilities.

---

## 🎨 Features

### Core Functionality
- **Art Gallery**: Showcase mono-realistic pencil sketches with individual detail pages
- **Music Portfolio**: Integration with YouTube and Spotify for music tracks
- **Blog System**: Full-featured blog with Markdown support, tagging, and publishing controls
- **Testimonials**: Client reviews with image support
- **Contact & Bookings**: Inquiry system with email notifications
- **Admin Panel**: Comprehensive dashboard for content management

### Technical Features

#### 🔐 Authentication & Security
- Admin authentication with httpOnly cookies
- Token-based session management with automatic rotation
- Secure push notification subscriptions
- Alt+A keyboard shortcut for quick admin access

#### 📝 Blog System
- Markdown content support with live preview
- Tag management and filtering
- Draft and publish workflow
- Featured images (base64 stored in database)
- SEO-friendly slug generation
- Individual blog post pages

#### 🖼️ Image Optimization
- Automatic image compression using **Sharp**
- WebP format generation for modern browsers
- Blur placeholder generation for progressive loading
- Responsive image sizing
- Bulk upload support for artworks

#### 🔔 Push Notifications
- Browser push notifications (PWA enabled)
- Admin-controlled subscriptions
- Notification management interface
- VAPID authentication

#### 📧 Email Integration
- Contact form submissions via Resend
- Booking confirmations
- Testimonial notifications
- Beautiful HTML email templates

#### 🚀 SEO & Performance
- **Dynamic Sitemap**: Auto-generated from database content (arts, music, blogs)
- **Structured Data**: Schema.org markup for all content types
  - BreadcrumbList for navigation
  - FAQPage schema component
  - ItemList, MusicRecording, Review schemas (ready to integrate)
- **OpenGraph Images**: Dynamic OG image generation using `next/og`
- **Breadcrumbs**: Accessible navigation with chevron-left icons
-**Social Sharing**: Optimized meta tags for all platforms
- Image optimization with Sharp (compression, WebP, blur placeholders)
- Server-side rendering for fast initial load
- Route caching strategies

#### 🎨 UI/UX
- Dark theme with gold accents
- Glassmorphism effects
- Smooth animations and transitions
- Mobile-first responsive design
- Premium aesthetic throughout
- Custom cursor (planned feature)
- Accessible ARIA labels and semantic HTML

---

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.5 (App Router + Turbopack)
- **Language**: TypeScript
- **Database**: MongoDB
- **Styling**: Tailwind CSS + CSS Variables
- **Icons**: Lucide React
- **Image Processing**: Sharp
- **Email**: Resend
- **Authentication**: Cookie-based sessions
- **Push Notifications**: Web Push with VAPID
- **Deployment**: Vercel

---

## 📁 Project Structure

```
/app                    # Next.js App Router
  /admin               # Admin panel
  /api                 # API routes
    /arts             # Arts CRUD
    /auth             # Authentication
    /blogs            # Blog management
    /bookings         # Inquiry handling
    /music            # Music CRUD
    /og               # OpenGraph image generation
    /push             # Push notifications
    /testimonials     # Testimonials CRUD
    /upload           # File upload with optimization
  /arts               # Art gallery pages
  /music              # Music portfolio pages
  sitemap.ts          # Dynamic sitemap generator
/components
  /admin              # Admin components (forms, tables, managers)
  /arts               # Art display components
  /music              # Music player components
  /shared             # Reusable UI components (Breadcrumbs, FAQSchema, ShareButton)
/constants            # App configuration
  database.ts         # MongoDB collection names
  content.ts          # Site content
/lib
  /hooks              # Custom React hooks
    useDataFetch.ts   # Multi-collection data fetching
    useFileUpload.ts  # File upload with progress
    useCrudOperations.ts # Generic CRUD operations
  db-helpers.ts       # MongoDB database utilities
  mongodb.ts          # MongoDB connection
/public
  /uploads            # User-uploaded files

```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- MongoDB instance
- Resend API key (for email)
- VAPID keys (for push notifications)

### Installation

```bash
# Clone the repository
git clone https://github.com/vijaykumarkosireddy/vijay.git
cd vijay

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Configure your .env.local file (see Environment Variables)

# Run development server
npm run dev
```

Visit `http://localhost:3000`

---

## ⚙️ Environment Variables

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Admin Authentication
ADMIN_PASSWORD=your_secure_password

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=noreply@yourdomain.com
EMAIL_TO=your@email.com

# Push Notifications
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_vapid_public_key
VAPID_PRIVATE_KEY=your_vapid_private_key

# YouTube API (optional, for music sync)
YOUTUBE_API_KEY=your_youtube_api_key
YOUTUBE_CHANNEL_ID=your_channel_id

# Site Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### Generating VAPID Keys
```bash
npx web-push generate-vapid-keys
```

---

## 📚 Admin Panel Guide

Access the admin panel:
- **URL**: `/admin`
- **Shortcut**: Press `Alt+A` from anywhere on the site
- ** Login**: Use your `ADMIN_PASSWORD`

### Features
1. **Music Tab**: Add/edit YouTube/Spotify links, auto-sync from YouTube
2. **Arts Tab**: Upload artwork images (single or bulk), manage gallery
3. **Blogs Tab**: Create/edit blog posts with Markdown, manage tags and publish status
4. **Testimonials Tab**: Add client testimonials with optional images
5. **Bookings Tab**: View contact form submissions and inquiries
6. **Push Notifications**: Enable/manage browser push notifications
7. **Database Explorer**: View, edit, and delete all entries

---

## 🎯 API Routes

| Endpoint | Method | Description |
|-------------|-----------|--------------------------------------|
| `/api/music` | GET, POST | Fetch/create music items |
| `/api/music/[id]` | GET, PUT, DELETE | Individual music operations |
| `/api/arts` | GET, POST | Fetch/create art pieces |
| `/api/arts/[id]` | GET, PUT, DELETE | Individual art operations |
| `/api/blogs` | GET, POST | Fetch/create blog posts (with filters) |
| `/api/blogs/[id]` | GET, PUT, DELETE | Individual blog operations |
| `/api/testimonials` | GET, POST | Fetch/create testimonials |
| `/api/bookings` | GET, POST | Fetch/create inquiries |
| `/api/upload` | POST | File upload with image optimization |
| `/api/auth/*` | POST | Login, logout, verify authentication |
| `/api/push/*` | GET, POST | Push notification management |
| `/api/og` | GET | Dynamic OpenGraph image generation |

---

## 🎨 Database Schema

### Collections

#### MUSIC
```typescript
{
  title: string
  url: string
  platform: "YouTube" | "Spotify"
  imageUrl?: string
  favorite?: boolean
  createdAt: Date
  updatedAt: Date
}
```

#### ARTS
```typescript
{
  title: string
  imageUrl: string
  instagramUrl?: string
  favorite?: boolean
  createdAt: Date
  updatedAt: Date
}
```

#### BLOGS
```typescript
{
  title: string
  slug: string  // auto-generated from title
  excerpt: string
  content: string  // Markdown
  tags: string[]
  image?: string  // base64 encoded
  published: boolean
  createdAt: Date
  updatedAt: Date
}
```

#### TESTIMONIALS
```typescript
{
  name: string
  role: string
  text: string
  imageUrl?: string
  createdAt: Date
}
```

#### BOOKINGS
```typescript
{
  name: string
  email: string
  phone?: string
  message: string
  eventType?: string
  eventDate?: string
  createdAt: Date
}
```

---

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server (Turbopack)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Key Hooks

- **useDataFetch**: Fetch multiple collections with auto-refresh
- **useFileUpload**: Handle file uploads with progress tracking
- **useCrudOperations**: Generic create/update/delete operations
- **useYouTubeSync**: Sync music from YouTube channel

---

## 🎨 Customization

### Theming
Edit `/app/globals.css` to customize colors:
```css
:root {
  --gold: 197 160 89;        /* Primary accent */
  --background: 10 10 10;     /* Dark background */
  --foreground: 250 250 250;  /* Text color */
}
```

### Content
Update `/constants/content.ts` for site-wide content like name, bio, social links.

---

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Environment Variables on Vercel
Add all variables from `.env.local` to your Vercel project settings.

### MongoDB Atlas
Ensure your MongoDB connection string includes proper network access settings for Vercel's IP ranges.

---

## 📝 Roadmap / Planned Features

- [ ] Blog frontend pages (listing and individual posts)
- [ ] Enhanced structured data for all pages
- [ ] Custom cursor implementation
- [ ] Spotify widget integration
- [ ] Interview prep lab
- [ ] Newsletter subscription
- [ ] Case study template
- [ ] FAQ section with schema
- [ ] Performance monitoring
- [ ] Analytics integration

---

## 📄 License

This project is proprietary and belongs to Vijay Kumar Kosireddy.

---

## 🤝 Contact

- **Website**: [vijaykumarkosireddy.vercel.app](https://vijaykumarkosireddy.vercel.app)
- **Email**: Available via contact form on website
- **Instagram**: [@vijaykumarkosireddy](https://instagram.com/vijaykumarkosireddy)

---

## 🙏 Acknowledgments

Built with modern web technologies and best practices for performance, SEO, and user experience.

---

**Last Updated**: February 2026
