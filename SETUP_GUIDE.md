# Abi Diamond - Complete Setup Guide

## 🚀 Quick Start (5 Minutes)

### Prerequisites

Before you begin, ensure you have installed:
- **Node.js** 18.x or higher ([Download](https://nodejs.org/))
- **npm** or **yarn** package manager
- A code editor (VS Code recommended)

---

## 📦 Installation Steps

### Step 1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

This will install all required packages:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- React Icons
- Framer Motion

**Installation time**: ~2-3 minutes

---

### Step 2: Start Development Server

```bash
npm run dev
```

The application will start at: **http://localhost:3000**

You should see:
```
✓ Ready in 2.5s
○ Local:        http://localhost:3000
```

---

### Step 3: Verify Installation

Open your browser and navigate to `http://localhost:3000`

You should see:
✅ Abi Diamond header with navigation
✅ Hero banner carousel
✅ Shop by Category section
✅ Featured Collections
✅ Aadi Festive Offer with countdown timer
✅ Product listing
✅ Footer
✅ WhatsApp floating button

---

## 🎨 Customization Guide

### 1. Update Brand Logo

**Current**: Text-based "Abi Diamond" logo

**To add your logo image**:

Edit `components/Header.tsx`:

```typescript
// Replace this:
<div className="text-3xl font-display font-bold text-gradient-gold">
  Abi Diamond
</div>

// With this:
<img
  src="/logo.png"
  alt="Abi Diamond"
  className="h-12 md:h-14"
/>
```

Place your logo file in the `/public` folder as `logo.png`

---

### 2. Configure WhatsApp Number

Edit `components/WhatsAppButton.tsx`:

```typescript
const phoneNumber = '+491234567890' // Replace with your number
const message = 'Hello! I would like to inquire about your jewellery collection.'
```

Format: Include country code without spaces (e.g., +4912345678)

---

### 3. Update Contact Information

Edit `components/Footer.tsx`:

```typescript
// Update these values:
<p>123 Jewellery Street, Gold District, Europe</p>
<p>+49 123 456 7890</p>
<p>info@abidiamond.com</p>
```

---

### 4. Customize Color Scheme

Edit `tailwind.config.js`:

```javascript
colors: {
  gold: {
    500: '#F59E0B', // Change primary gold color
    600: '#D97706',
    // ... other shades
  },
  // Modify other colors as needed
}
```

---

### 5. Add Real Product Data

Edit `components/ProductListing.tsx`:

```typescript
const products = [
  {
    id: 1,
    name: 'Your Product Name',
    image: 'https://your-image-url.com/product.jpg',
    purity: '22KT',
    weight: '15.5g',
    price: 2399.00,
    originalPrice: 2799.00,
    discount: 14,
  },
  // Add more products...
]
```

**Image requirements**:
- Format: JPG or PNG
- Size: 800x800px minimum
- Background: White or champagne
- File size: < 200KB

---

### 6. Update Offers & Discounts

Edit `components/OffersPage.tsx`:

```typescript
const offers = [
  {
    id: 1,
    title: 'Your Offer Title',
    description: 'Offer description',
    code: 'COUPONCODE',
    validity: 'Valid till DD MMM YYYY',
    discount: '30%',
    // ... other fields
  },
]
```

---

### 7. Modify Hero Banner Content

Edit `components/HeroBanner.tsx`:

```typescript
const slides = [
  {
    id: 1,
    title: 'Your Custom Headline',
    subtitle: 'Your subtext',
    offerBadge: 'Your offer',
    cta: 'Button Text',
    ctaLink: '/your-link',
    background: 'linear-gradient(...)',
    image: 'https://your-image-url.com/banner.jpg',
  },
]
```

**Banner image specs**:
- Resolution: 1920x700px
- Format: JPG
- File size: < 300KB

---

## 🌍 Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Site Configuration
NEXT_PUBLIC_SITE_NAME="Abi Diamond"
NEXT_PUBLIC_SITE_URL="https://abidiamond.com"

# Contact
NEXT_PUBLIC_WHATSAPP_NUMBER="+491234567890"
NEXT_PUBLIC_EMAIL="info@abidiamond.com"
NEXT_PUBLIC_PHONE="+49 123 456 7890"

# Currency
NEXT_PUBLIC_CURRENCY="EUR"
NEXT_PUBLIC_CURRENCY_SYMBOL="€"

# Social Media
NEXT_PUBLIC_FACEBOOK_URL="https://facebook.com/abidiamond"
NEXT_PUBLIC_INSTAGRAM_URL="https://instagram.com/abidiamond"
NEXT_PUBLIC_TWITTER_URL="https://twitter.com/abidiamond"

# Gold Rate API (if using)
NEXT_PUBLIC_GOLD_RATE_API_KEY="your-api-key"
```

---

## 🎯 Production Build

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `.next` folder.

### Test Production Build Locally

```bash
npm start
```

Access at `http://localhost:3000`

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

**Easiest deployment for Next.js**

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Click "Deploy"

**Done!** Your site will be live in ~2 minutes.

Custom domain setup:
- Go to Project Settings → Domains
- Add your domain (e.g., abidiamond.com)
- Follow DNS configuration steps

---

### Option 2: Netlify

1. Build the project: `npm run build`
2. Go to [netlify.com](https://netlify.com)
3. Drag & drop the `.next` folder
4. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

---

### Option 3: Self-Hosted (VPS/Server)

**Requirements**:
- Node.js 18+ installed
- PM2 for process management

**Steps**:

```bash
# On your server
git clone your-repo-url
cd Gold
npm install
npm run build

# Install PM2
npm install -g pm2

# Start with PM2
pm2 start npm --name "abi-diamond" -- start

# Make it persistent
pm2 save
pm2 startup
```

Configure Nginx reverse proxy:

```nginx
server {
    listen 80;
    server_name abidiamond.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔧 Troubleshooting

### Issue: `npm install` fails

**Solution**:
```bash
# Clear cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

---

### Issue: Port 3000 already in use

**Solution**:
```bash
# Use different port
PORT=3001 npm run dev

# Or kill process on port 3000
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

---

### Issue: Tailwind styles not working

**Solution**:
1. Ensure `tailwind.config.js` is in root
2. Check `globals.css` has Tailwind directives:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```
3. Restart dev server

---

### Issue: Images not loading

**Solution**:
1. Check image URLs are valid
2. For local images, place in `/public` folder
3. Update `next.config.js` domains:
   ```javascript
   images: {
     domains: ['your-image-domain.com'],
   }
   ```

---

## 📱 Testing Checklist

Before deploying, test:

### Desktop (1920px)
- [ ] Header navigation works
- [ ] Hero carousel auto-plays
- [ ] All sections visible
- [ ] Footer links work
- [ ] WhatsApp button functional

### Tablet (768px)
- [ ] Hamburger menu appears
- [ ] Grid layouts adjust (3 columns)
- [ ] Images scale properly
- [ ] Touch targets adequate

### Mobile (375px)
- [ ] Mobile menu functional
- [ ] Single column layout
- [ ] Buttons full-width
- [ ] Text readable
- [ ] WhatsApp button not blocking content

### Functionality
- [ ] Search bar works
- [ ] Product cards clickable
- [ ] Wishlist toggle works
- [ ] Countdown timer updates
- [ ] Newsletter signup works
- [ ] All links navigate correctly

### Performance
- [ ] Page loads under 3 seconds
- [ ] Images optimized
- [ ] No console errors
- [ ] Smooth animations

---

## 🎓 Learning Resources

### Next.js Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [React Documentation](https://react.dev)

### Tailwind CSS
- [Tailwind Docs](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com)

### TypeScript
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

## 📞 Support

Need help? Contact:

- **Email**: info@abidiamond.com
- **Phone**: +49 123 456 7890
- **Documentation**: See README.md and DESIGN_DOCUMENTATION.md

---

## 🎉 You're All Set!

Your Abi Diamond jewellery website is ready to shine!

### Next Steps:

1. ✅ Customize brand assets (logo, colors)
2. ✅ Add real product data
3. ✅ Update contact information
4. ✅ Configure WhatsApp integration
5. ✅ Test on all devices
6. ✅ Deploy to production
7. ✅ Set up analytics (Google Analytics)
8. ✅ Configure SEO settings
9. ✅ Add SSL certificate
10. ✅ Launch! 🚀

---

**Happy selling! May your jewellery business sparkle!** ✨💎
