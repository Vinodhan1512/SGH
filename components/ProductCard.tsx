'use client'

import { FiHeart } from 'react-icons/fi'
import { FaHeart } from 'react-icons/fa'
import { useState } from 'react'

interface ProductCardProps {
  id: number
  name: string
  image: string
  purity: string
  weight: string
  price: number
  originalPrice?: number
  discount?: number
  isWishlisted?: boolean
  badge?: string
}

const ProductCard = ({
  id,
  name,
  image,
  purity,
  weight,
  price,
  originalPrice,
  discount,
  isWishlisted = false,
  badge,
}: ProductCardProps) => {
  const [wishlisted, setWishlisted] = useState(isWishlisted)

  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    setWishlisted(!wishlisted)
  }

  const getBadgeColor = (badgeText?: string) => {
    switch (badgeText) {
      case 'Hot Deal':
        return 'from-red-600 to-red-700'
      case 'Best Seller':
        return 'from-purple-600 to-purple-700'
      case 'Trending':
        return 'from-pink-600 to-pink-700'
      case 'New Arrival':
        return 'from-green-600 to-green-700'
      default:
        return 'from-amber-600 to-amber-700'
    }
  }

  return (
    <a
      href={`/product/${id}`}
      className="group block bg-white rounded-xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden hover-lift border-2 border-transparent hover:border-amber-200"
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          style={{ filter: 'brightness(1.05) contrast(1.05)' }}
        />

        {/* Badge */}
        {badge && (
          <div className={`absolute top-4 left-4 px-3 py-1.5 bg-gradient-to-r ${getBadgeColor(badge)} text-white text-xs font-extrabold rounded-full shadow-xl border-2 border-white uppercase tracking-wide`}>
            {badge}
          </div>
        )}

        {/* Discount Badge */}
        {discount && (
          <div className="absolute top-16 left-4 px-3 py-1.5 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-extrabold rounded-full shadow-xl border-2 border-white animate-pulse">
            {discount}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={toggleWishlist}
          className="absolute top-4 right-4 w-11 h-11 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-xl hover:scale-110 border-2 border-amber-200"
          aria-label="Add to wishlist"
        >
          {wishlisted ? (
            <FaHeart className="w-5 h-5 text-red-600" />
          ) : (
            <FiHeart className="w-5 h-5 text-amber-700" />
          )}
        </button>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="px-8 py-3.5 bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 font-extrabold rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 shadow-2xl border-2 border-white">
            Quick View
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        {/* Product Name */}
        <h3 className="text-lg font-display font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-amber-700 transition-colors leading-tight">
          {name}
        </h3>

        {/* Product Details */}
        <div className="flex items-center gap-3 mb-4 text-sm">
          <span className="px-3 py-1.5 bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-900 rounded-lg font-bold border border-amber-300">
            {purity}
          </span>
          <span className="font-bold text-amber-800">{weight}</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-5">
          <span className="text-2xl font-extrabold bg-gradient-to-r from-amber-800 to-yellow-700 bg-clip-text text-transparent">
            €{price.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
          </span>
          {originalPrice && (
            <span className="text-base text-gray-500 line-through font-semibold">
              €{originalPrice.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button className="w-full py-3.5 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-white font-extrabold rounded-full hover:from-amber-700 hover:via-yellow-600 hover:to-amber-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 border-2 border-amber-400">
          Add to Cart
        </button>
      </div>
    </a>
  )
}

export default ProductCard
