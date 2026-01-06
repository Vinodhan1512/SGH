'use client'

import ProductCard from './ProductCard'

const ProductListing = () => {
  const products = [
    {
      id: 1,
      name: 'Exquisite Gold Necklace Set – 22KT',
      image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=700&q=85',
      purity: '22KT',
      weight: '15.5g',
      price: 2399.0,
      originalPrice: 2799.0,
      discount: 14,
      badge: 'Trending',
    },
    {
      id: 2,
      name: 'Brilliant Diamond Stud Earrings – 18KT',
      image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=700&q=85',
      purity: '18KT',
      weight: '3.2g',
      price: 1849.0,
      originalPrice: 2199.0,
      discount: 16,
      badge: 'Best Seller',
    },
    {
      id: 3,
      name: 'Traditional Temple Jewellery Set',
      image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=700&q=85',
      purity: '22KT',
      weight: '42.8g',
      price: 5249.0,
      originalPrice: 6499.0,
      discount: 19,
      badge: 'Hot Deal',
    },
    {
      id: 4,
      name: 'Luxury Solitaire Diamond Ring',
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=700&q=85',
      purity: '18KT',
      weight: '4.5g',
      price: 3199.0,
      discount: 0,
      badge: 'New Arrival',
    },
    {
      id: 5,
      name: 'Premium Gold Bangles – 22KT (Set of 4)',
      image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=700&q=85',
      purity: '22KT',
      weight: '28.3g',
      price: 3899.0,
      originalPrice: 4599.0,
      discount: 15,
      badge: 'Trending',
    },
    {
      id: 6,
      name: 'Elegant Diamond Pendant with Chain',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=700&q=85',
      purity: '18KT',
      weight: '6.8g',
      price: 2549.0,
      originalPrice: 2999.0,
      discount: 15,
      badge: 'Best Seller',
    },
    {
      id: 7,
      name: 'Royal Antique Jhumka Earrings',
      image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=700&q=85',
      purity: '22KT',
      weight: '12.4g',
      price: 1999.0,
      originalPrice: 2399.0,
      discount: 17,
      badge: 'Trending',
    },
    {
      id: 8,
      name: 'Classic Mangalsutra – 22KT Gold',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=700&q=85',
      purity: '22KT',
      weight: '8.2g',
      price: 1449.0,
      discount: 0,
      badge: 'Traditional',
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-white via-yellow-50/20 to-white">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-full mb-4 border border-yellow-200">
            <span className="text-2xl">✨</span>
            <span className="text-sm font-bold text-amber-800 tracking-wider">LATEST ARRIVALS</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-extrabold bg-gradient-to-r from-amber-800 via-yellow-700 to-amber-900 bg-clip-text text-transparent mb-4">
            Trending Jewellery
          </h2>
          <p className="text-amber-800 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Explore our latest collection of 22ct gold and diamond jewellery with exclusive offers
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-16">
          <a
            href="/all-jewellery"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-white text-lg font-extrabold rounded-full hover:from-amber-700 hover:via-yellow-600 hover:to-amber-700 transition-all duration-300 shadow-2xl hover:shadow-amber-500/50 hover:scale-105 border-2 border-amber-400"
          >
            <span>View All Products</span>
            <span className="text-2xl">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default ProductListing
