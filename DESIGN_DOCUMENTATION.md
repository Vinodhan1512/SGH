# Abi Diamond - Complete Design & UX Documentation

## 🎨 Visual Design System

### Brand Identity

**Brand Name**: Abi Diamond
**Tagline**: "Crafting Timeless Elegance"
**Brand Essence**: Premium luxury meets traditional heritage
**Market Position**: Top-tier European gold & diamond jewellery retailer

---

## 🌈 Color Palette

### Primary Colors

```
Gold Primary:     #D4AF37  |  rgb(212, 175, 55)
Gold Light:       #F5E6C8  |  rgb(245, 230, 200)
Gold Dark:        #B8941F  |  rgb(184, 148, 31)

Champagne:        #F5F0E6  |  rgb(245, 240, 230)
Champagne Dark:   #C0A878  |  rgb(192, 168, 120)
```

### Accent Colors

```
Ruby Red:         #DC2626  |  rgb(220, 38, 38)  - Sale badges
Emerald Green:    #059669  |  rgb(5, 150, 105)  - Success states
Deep Purple:      #7C3AED  |  rgb(124, 58, 237) - Diamond section
Rose Pink:        #F43F5E  |  rgb(244, 63, 94)  - Bridal section
```

### Neutral Colors

```
White:            #FFFFFF  |  Background
Light Gray:       #F9FAFB  |  Subtle backgrounds
Medium Gray:      #6B7280  |  Secondary text
Dark Gray:        #1F2937  |  Primary text
Black:            #111827  |  Headers, emphasis
```

### Color Usage Guidelines

- **Gold**: Primary brand color, CTAs, highlights, badges
- **Champagne**: Section backgrounds, card backgrounds
- **Ruby**: Discount badges, urgency indicators
- **Emerald**: Success messages, certification badges
- **Neutrals**: Text hierarchy, borders, shadows

---

## 📝 Typography System

### Font Families

**Serif (Display & Headings)**
```css
font-family: 'Playfair Display', Georgia, serif;
font-family: 'Cormorant Garamond', serif;
```
**Use Cases**:
- Page titles
- Section headings
- Product names
- Luxury messaging

**Sans-Serif (Body & UI)**
```css
font-family: 'Inter', system-ui, sans-serif;
```
**Use Cases**:
- Body text
- Navigation
- Buttons
- Form inputs
- Product descriptions

### Type Scale

```
Heading XL:       60px / 3.75rem  (Hero titles)
Heading Large:    48px / 3rem     (Page titles)
Heading Medium:   36px / 2.25rem  (Section titles)
Heading Small:    24px / 1.5rem   (Card titles)

Body Large:       20px / 1.25rem  (Intro text)
Body Regular:     16px / 1rem     (Standard text)
Body Small:       14px / 0.875rem (Meta info)
Caption:          12px / 0.75rem  (Labels, tags)
```

### Font Weights

```
Light:      300  (Subtitles, descriptions)
Regular:    400  (Body text)
Medium:     500  (Navigation, labels)
Semibold:   600  (Subheadings, emphasis)
Bold:       700  (Headings, CTAs)
Extra Bold: 800  (Hero titles)
```

### Line Heights

```
Tight:      1.2   (Headings)
Snug:       1.375 (Subheadings)
Normal:     1.5   (Body text)
Relaxed:    1.625 (Long-form content)
Loose:      2     (Spaced content)
```

---

## 🎭 Component Design Specifications

### 1. Header Component

**Height**: 140px (with gold rate ticker)
**Background**: White with shadow

**Structure**:
```
┌─────────────────────────────────────────┐
│ Gold Rate Ticker (Gold gradient, 32px)  │
├─────────────────────────────────────────┤
│ Logo | Search Bar | Store | Account |   │
│                    | Wishlist | Cart    │
├─────────────────────────────────────────┤
│  Navigation Menu (10 items, centered)   │
└─────────────────────────────────────────┘
```

**Elements**:
- Logo: 180px width, left-aligned
- Search: Max-width 640px, rounded-full
- Icons: 24px, hover gold-600
- Nav items: 16px font, gold underline on hover

---

### 2. Hero Banner Carousel

**Dimensions**:
- Desktop: 1920x700px
- Tablet: 1024x600px
- Mobile: 375x500px

**Slide Structure**:
```
┌─────────────────────────────────────────┐
│  ┌────────────────┐                     │
│  │ Offer Badge    │  (Gold, rounded)    │
│  └────────────────┘                     │
│                                         │
│  MAIN HEADLINE (60px, white, bold)     │
│  Subtitle text (24px, gray-200)        │
│                                         │
│  ┌──────────────┐                      │
│  │ CTA Button   │  (Gold gradient)     │
│  └──────────────┘                      │
│                                         │
│  ●  ●  ○  (Indicators)                 │
└─────────────────────────────────────────┘
```

**Transition**: Fade, 1000ms
**Auto-play**: 5 seconds
**Controls**: Arrow buttons (left/right)

---

### 3. Product Card

**Dimensions**:
- Card: 320x480px
- Image: 320x320px (square)

**Structure**:
```
┌──────────────────────┐
│  ┌──────────────┐  ♥ │ Wishlist
│  │              │    │
│  │   Product    │    │
│  │    Image     │    │
│  │              │    │
│  └──────────────┘    │
│ [14% OFF]            │ Discount badge
│                      │
│ Product Name (18px)  │
│ [22KT] 15.5g         │ Purity + Weight
│                      │
│ €2,399.00  €2,799.00 │ Price
│                      │
│ [Add to Cart Button] │
└──────────────────────┘
```

**Hover Effects**:
- Image: Scale 1.1
- Shadow: Elevation increase
- Quick View overlay: Fade in

---

### 4. Category Icon Grid

**Icon Container**:
- Size: 112px diameter
- Background: Gold gradient
- Icon: 56px, white
- Border: 2px white/30%

**Layout**: 7 columns on desktop, 3 on tablet, 2 on mobile
**Spacing**: 24px gap
**Hover**: Scale 1.1, glow animation

---

### 5. Festive Offer Section

**Background**: Ruby gradient with decorative blurs
**Countdown Timer**:
```
┌────┐  ┌────┐  ┌────┐  ┌────┐
│ 07 │  │ 14 │  │ 32 │  │ 45 │
└────┘  └────┘  └────┘  └────┘
 Days   Hours    Mins    Secs
```

**Timer Box**:
- Size: 96x96px
- Background: White/20% blur
- Font: 48px, bold, white

---

## 🎬 Animation Guidelines

### Entrance Animations

**Fade In**:
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
Duration: 600ms
Timing: ease-in-out
```

**Slide Up**:
```css
@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
Duration: 500ms
Timing: ease-out
```

### Interaction Animations

**Hover Lift**:
```css
transform: translateY(-5px);
box-shadow: 0 20px 40px rgba(0,0,0,0.15);
Duration: 300ms
```

**Gold Glow**:
```css
@keyframes glow {
  from { box-shadow: 0 0 5px rgba(245,158,11,0.2); }
  to { box-shadow: 0 0 20px rgba(245,158,11,0.6); }
}
Duration: 2s
Iteration: infinite alternate
```

**Image Zoom**:
```css
transform: scale(1.1);
Duration: 700ms
Timing: ease
```

---

## 📐 Layout & Spacing System

### Container Widths

```
Max-width:   1280px  (Desktop)
Padding:     24px    (Mobile)
             48px    (Tablet)
             64px    (Desktop)
```

### Spacing Scale

```
xs:   4px    (0.25rem)
sm:   8px    (0.5rem)
md:   16px   (1rem)
lg:   24px   (1.5rem)
xl:   32px   (2rem)
2xl:  48px   (3rem)
3xl:  64px   (4rem)
4xl:  96px   (6rem)
```

### Grid System

**Product Grid**:
- Desktop: 4 columns
- Tablet: 3 columns
- Large Mobile: 2 columns
- Small Mobile: 1 column
- Gap: 24px

**Category Grid**:
- Desktop: 7 columns
- Tablet: 3 columns
- Mobile: 2 columns
- Gap: 24px

---

## 🎯 Button Styles

### Primary Button (CTA)

```css
Background: linear-gradient(to right, #D97706, #F59E0B)
Color: White
Padding: 12px 32px
Border-radius: 8px
Font-weight: 600
Font-size: 16px

Hover:
  Background: linear-gradient(to right, #B45309, #D97706)
  Shadow: 0 10px 25px rgba(245,158,11,0.4)
  Transform: scale(1.02)
```

### Secondary Button

```css
Background: White
Color: #B45309 (Gold-700)
Border: 2px solid #D97706
Padding: 12px 32px
Border-radius: 8px
Font-weight: 600

Hover:
  Background: #FEF3C7 (Gold-50)
  Border-color: #B45309
```

### Icon Button

```css
Size: 40x40px
Background: White/90%
Border-radius: 50%
Icon: 20px

Hover:
  Background: White
  Transform: scale(1.1)
```

---

## 📱 Responsive Breakpoints

```css
Mobile:       320px - 639px
Tablet:       640px - 1023px
Desktop:      1024px - 1279px
Large Desktop: 1280px+
```

### Mobile Optimizations

- Stack columns vertically
- Full-width buttons
- Larger touch targets (min 44px)
- Simplified navigation (hamburger menu)
- Reduced font sizes
- Condensed spacing

---

## 🛡️ Trust Signal Design

### Certification Badges

**BIS Hallmark**:
- Size: 48x48px
- Gold border, white background
- Checkmark icon in gold

**Lifetime Exchange**:
- Refresh icon
- Green color (#059669)

**Secure Payments**:
- Shield icon
- Blue color (#3B82F6)

### Payment Icons

- Height: 24px
- Grayscale filter: 70%
- Spacing: 16px gap
- Hover: Full color

---

## 🎨 Image Guidelines

### Product Images

**Format**: JPG (photos), PNG (with transparency)
**Resolution**: Minimum 800x800px
**Aspect Ratio**: 1:1 (square)
**Background**: White (#FFFFFF) or Champagne (#F5F0E6)
**File Size**: Max 200KB (optimized)

### Banner Images

**Resolution**: 1920x700px
**Format**: JPG
**Overlay**: Dark gradient (left to right, 60% to transparent)
**File Size**: Max 300KB

### Category Icons

**Format**: SVG (preferred) or PNG
**Size**: 64x64px
**Style**: Line icons or solid
**Color**: White (on gold background)

---

## ♿ Accessibility Standards

### WCAG 2.1 AA Compliance

**Color Contrast Ratios**:
- Headings: Minimum 4.5:1
- Body text: Minimum 4.5:1
- Large text (18pt+): Minimum 3:1

**Keyboard Navigation**:
- All interactive elements focusable
- Clear focus indicators (gold outline)
- Logical tab order

**Screen Reader Support**:
- Semantic HTML
- ARIA labels on icons
- Alt text on all images

**Touch Targets**:
- Minimum 44x44px
- Adequate spacing (8px minimum)

---

## 📊 Performance Guidelines

### Loading Optimization

**Images**:
- Lazy loading for below-fold content
- WebP format with JPG fallback
- Responsive images with srcset

**Fonts**:
- Preload critical fonts
- Font-display: swap

**Code Splitting**:
- Route-based splitting
- Component lazy loading

### Target Metrics

```
First Contentful Paint:  < 1.5s
Largest Contentful Paint: < 2.5s
Time to Interactive:      < 3.5s
Cumulative Layout Shift:  < 0.1
```

---

## 🔍 SEO Best Practices

### Meta Tags

```html
<title>Abi Diamond - Premium Gold & Diamond Jewellery | Europe</title>
<meta name="description" content="Discover exquisite gold and diamond jewellery for weddings, festivals, and everyday elegance. BIS certified, lifetime exchange, free shipping across Europe.">
<meta name="keywords" content="gold jewellery, diamond jewellery, wedding jewellery, bridal sets, gold coins, engagement rings">
```

### Open Graph

```html
<meta property="og:title" content="Abi Diamond - Premium Jewellery">
<meta property="og:description" content="Luxury gold & diamond jewellery">
<meta property="og:image" content="https://abidiamond.com/og-image.jpg">
<meta property="og:type" content="website">
```

### Structured Data (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "JewelryStore",
  "name": "Abi Diamond",
  "priceRange": "€€€",
  "currenciesAccepted": "EUR"
}
```

---

## 🎉 Festive Design Variants

### Aadi Festival Theme

**Primary Color**: Ruby Red (#DC2626)
**Accent**: Gold
**Imagery**: Traditional temple jewellery
**Messaging**: "Prosperity in Every Gram"

### Diamond Festival Theme

**Primary Color**: Deep Purple (#7C3AED)
**Accent**: Silver/White
**Imagery**: Sparkling diamonds
**Messaging**: "Own the Light"

### Wedding/Bridal Theme

**Primary Color**: Rose Pink (#F43F5E)
**Accent**: Gold + White
**Imagery**: Bridal sets, mangalsutra
**Messaging**: "Begin Forever"

---

## 📋 Component Checklist

✅ Header with sticky navigation
✅ Hero banner carousel (3 slides)
✅ Shop by Category grid (7 categories)
✅ Featured Collections (3 tiles)
✅ Aadi Festive Offer with countdown
✅ Product listing grid
✅ Product detail page
✅ Offers/Discounts page
✅ Footer with newsletter
✅ WhatsApp floating button

---

**Design System Version**: 1.0
**Last Updated**: January 2026
**Status**: Production Ready

---

*This design system ensures consistent, premium user experience across all pages of the Abi Diamond e-commerce platform.*
