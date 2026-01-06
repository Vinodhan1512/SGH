# Abi Diamond - Premium Gold & Diamond Jewellery E-Commerce Platform

A luxury e-commerce website for **Abi Diamond**, a premium gold and diamond jewellery brand targeting Europe-based customers. Built with Next.js, TypeScript, and Tailwind CSS.

---

## 🌟 Brand Overview

- **Brand Name**: Abi Diamond
- **Industry**: Gold & Diamond Jewellery
- **Positioning**: Premium, festive, bridal & daily-wear luxury
- **Target Audience**: Europe-based customers, bridal buyers, festival shoppers
- **Currency**: Euro (€) ONLY

---

## ✨ Key Features

### 🏠 Homepage Components

1. **Premium Header**
   - Sticky navigation with gold rate ticker
   - Advanced search functionality
   - Store locator, Account, Wishlist, Cart icons
   - Mobile-responsive menu
   - Currency fixed to EUR (€)

2. **Hero Banner Carousel**
   - 3 festival-grade promotional slides:
     - Aadi Thiruvizha Festival Offer
     - Diamond Brilliance Festival
     - Bridal Collection Special
   - Auto-playing with manual controls
   - Premium animations

3. **Shop by Category**
   - Elegant circular icon grid
   - 7 categories: Earrings, Necklaces, Rings, Bangles, Mangalsutra, Chains, Gold Coins
   - Hover effects with gold glow animation

4. **Featured Collections**
   - 3 premium collection tiles:
     - Traditional Gold Jewellery
     - Dazzling Diamond Collection
     - Engagement Rings
   - Hover zoom effects

5. **Aadi Festive Offer Section**
   - Live countdown timer
   - Festival offer highlights:
     - Flat 25% OFF on Making Charges
     - Free Gold Coin on €5,000+ purchases
   - Eye-catching gradient background

6. **Product Listing**
   - Premium product cards with:
     - High-quality images
     - Gold purity badges (22KT/18KT)
     - Weight information
     - Price in EUR with discounts
     - Wishlist functionality
     - Quick view overlay

7. **Footer**
   - Newsletter signup
   - Company information
   - Quick links & customer service
   - Social media integration
   - Payment method icons

8. **WhatsApp Support Button**
   - Floating action button
   - Animated notification badge
   - Direct chat integration

---

## 📄 Additional Pages

### Product Detail Page (PDP)
- Image gallery with zoom functionality
- Price breakdown (Gold + Making + GST)
- Size selection
- Delivery estimate
- Store pickup option
- EMI/Monthly plan information
- Trust badges (Certified Gold, Lifetime Exchange, Secure Payments)
- Detailed product description

### Offers Page
- Active promotions grid:
  - Up to 30% OFF on Diamond Jewellery
  - Flat 20% OFF on Gold Jewellery
  - Festival Combos
  - First-time buyer coupon: **ABIWELCOME**
- Bank offers section
- Coupon code functionality
- Terms & conditions

---

## 🎨 Design System

### Color Palette

**Primary Colors:**
- Gold: `#D4AF37` (Primary brand color)
- Champagne: `#F5F0E6` (Background accent)
- Ruby Red: `#DC2626` (Sale badges)
- Emerald Green: `#059669` (Success states)

**Gradients:**
- Gold gradient: `from-gold-600 to-gold-500`
- Premium overlays with opacity control

### Typography

**Font Families:**
- **Display/Headings**: Playfair Display, Cormorant Garamond (Serif)
- **Body Text**: Inter (Sans-serif)

**Font Sizes:**
- Heading Primary: `text-4xl md:text-5xl lg:text-6xl`
- Heading Secondary: `text-3xl md:text-4xl`
- Body: `text-base md:text-lg`

### Animations

- **Fade In**: Smooth entrance animations
- **Slide Up**: Content reveal on scroll
- **Hover Lift**: Card elevation on hover
- **Glow Effect**: Gold shimmer for premium elements
- **Zoom**: Image scaling on hover

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: React Icons (Feather, Font Awesome)
- **Animations**: CSS transitions + custom keyframes

---

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Development Server

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📱 Responsive Design

Fully responsive across all devices:
- **Desktop**: 1920px+ (Full experience)
- **Laptop**: 1024px - 1919px
- **Tablet**: 768px - 1023px
- **Mobile**: 320px - 767px

---

## 🎯 Premium Features

### User Experience
- Smooth scrolling
- Premium hover effects
- Loading states
- Error handling
- Form validation

### E-Commerce Features
- Product filtering
- Wishlist management
- Shopping cart
- Size/weight selection
- Price calculator
- Discount badges
- Coupon codes

### Trust Signals
- BIS Hallmarked certification
- Lifetime exchange guarantee
- Free shipping thresholds
- Secure payment badges
- Customer reviews

---

## 🌐 SEO Optimization

- Semantic HTML structure
- Meta tags configured
- Open Graph tags
- Schema markup for products
- Optimized images
- Fast loading times

---

## 📋 Project Structure

```
Gold/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Homepage
├── components/
│   ├── Header.tsx           # Site header
│   ├── HeroBanner.tsx       # Hero carousel
│   ├── ShopByCategory.tsx   # Category grid
│   ├── FeaturedCollections.tsx
│   ├── AadiFestiveOffer.tsx
│   ├── ProductCard.tsx      # Product card component
│   ├── ProductListing.tsx   # Products grid
│   ├── ProductDetail.tsx    # PDP
│   ├── OffersPage.tsx       # Offers page
│   ├── Footer.tsx           # Site footer
│   └── WhatsAppButton.tsx   # Support button
├── public/                  # Static assets
├── tailwind.config.js       # Tailwind configuration
├── tsconfig.json           # TypeScript config
├── next.config.js          # Next.js config
└── package.json            # Dependencies
```

---

## 💎 Brand Guidelines

### Visual Identity
- Maintain gold, champagne, ruby accent colors
- Use serif fonts for headings (elegance)
- Premium white space usage
- Avoid clutter

### Tone of Voice
- Elegant and sophisticated
- Trustworthy and authoritative
- Celebratory for festivals
- Heritage meets modernity

### Image Guidelines
- High-resolution jewellery photography
- Lifestyle shots for collections
- Product shots on white/champagne backgrounds
- Consistent lighting and color grading

---

## 🔧 Customization Guide

### Updating Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  gold: { ... },
  champagne: { ... },
  ruby: { ... }
}
```

### Adding New Products
Update product arrays in components with:
- Product name
- Image URL
- Purity (22KT/18KT)
- Weight
- Price & original price
- Discount percentage

### WhatsApp Number
Update in `components/WhatsAppButton.tsx`:
```typescript
const phoneNumber = '+491234567890'
```

---

## 📞 Support & Contact

For technical support or customization requests:
- **Email**: info@abidiamond.com
- **Phone**: +49 123 456 7890
- **WhatsApp**: Available on website

---

## 📄 License

Proprietary - © 2026 Abi Diamond. All rights reserved.

---

## 🎉 Credits

**Designed & Developed for**: Abi Diamond Premium Jewellery
**Inspiration**: Bhima, Malabar Gold, GRT, Khazana
**Target Market**: Europe (EUR currency)

---

## 🚀 Deployment

### Recommended Platforms
- **Vercel** (Recommended for Next.js)
- **Netlify**
- **AWS Amplify**

### Environment Variables
```env
NEXT_PUBLIC_WHATSAPP_NUMBER=+491234567890
NEXT_PUBLIC_SITE_URL=https://abidiamond.com
```

---

**Built with ❤️ for premium jewellery experiences**
