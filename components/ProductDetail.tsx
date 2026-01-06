'use client'

import { useState } from 'react'
import { FiHeart, FiShare2, FiTruck, FiShield, FiRefreshCw, FiMapPin } from 'react-icons/fi'
import { FaHeart } from 'react-icons/fa'
import { BsCheckCircleFill } from 'react-icons/bs'

const ProductDetail = () => {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [wishlisted, setWishlisted] = useState(false)
  const [selectedSize, setSelectedSize] = useState('Default')

  const product = {
    id: 1,
    name: 'Elegant Gold Necklace – 22KT',
    purity: '22KT',
    weight: '15.5g',
    price: 2399.0,
    originalPrice: 2799.0,
    discount: 14,
    sku: 'ABD-GN-22K-001',
    images: [
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=800',
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800',
      'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=800',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800',
    ],
    description:
      'Experience the epitome of traditional elegance with this exquisite 22KT gold necklace. Handcrafted by master artisans, this piece features intricate detailing that reflects timeless Indian heritage. Perfect for weddings, festivals, and special occasions.',
    features: [
      'BIS Hallmarked 22KT Gold',
      'Total Weight: 15.5g',
      'Handcrafted by Expert Artisans',
      'Traditional Design with Modern Finish',
      'Comes with Authenticity Certificate',
      'Complimentary Gift Box',
    ],
    priceBreakdown: {
      goldPrice: 1950.0,
      makingCharges: 449.0,
      gst: 0.0,
    },
  }

  const sizes = ['Small', 'Default', 'Large']

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <div>
            {/* Main Image with Zoom */}
            <div className="relative aspect-square mb-4 rounded-xl overflow-hidden bg-champagne-50 group">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover cursor-zoom-in transition-transform duration-500 group-hover:scale-150"
              />

              {/* Discount Badge */}
              {product.discount > 0 && (
                <div className="absolute top-6 left-6 px-4 py-2 bg-ruby-600 text-white font-bold rounded-lg shadow-lg">
                  Save {product.discount}%
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === index
                      ? 'border-gold-500 shadow-lg'
                      : 'border-gray-200 hover:border-gold-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} view ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div>
            {/* Product Title */}
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              {product.name}
            </h1>

            {/* SKU */}
            <p className="text-gray-600 mb-4">SKU: {product.sku}</p>

            {/* Price Section */}
            <div className="mb-6 p-6 bg-champagne-50 rounded-xl">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-gray-900">
                  €{product.price.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                </span>
                {product.originalPrice && (
                  <span className="text-2xl text-gray-500 line-through">
                    €{product.originalPrice.toLocaleString('de-DE', { minimumFractionDigits: 2 })}
                  </span>
                )}
              </div>
              <p className="text-green-600 font-semibold text-lg">
                You save €{((product.originalPrice || product.price) - product.price).toFixed(2)}
              </p>

              {/* Price Breakdown */}
              <div className="mt-4 pt-4 border-t border-gray-300">
                <p className="text-sm font-semibold text-gray-700 mb-2">Price Breakdown:</p>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Gold Rate ({product.weight}):</span>
                    <span>€{product.priceBreakdown.goldPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Making Charges:</span>
                    <span>€{product.priceBreakdown.makingCharges.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-semibold text-gray-900 pt-2 border-t">
                    <span>Total:</span>
                    <span>€{product.price.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="mb-6 flex items-center gap-4 text-sm">
              <div className="px-4 py-2 bg-gold-100 text-gold-800 rounded-lg font-semibold">
                {product.purity}
              </div>
              <div className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg font-semibold">
                Weight: {product.weight}
              </div>
            </div>

            {/* Size Selection */}
            <div className="mb-6">
              <p className="font-semibold text-gray-900 mb-3">Select Size:</p>
              <div className="flex gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      selectedSize === size
                        ? 'bg-gold-500 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mb-8 flex gap-4">
              <button className="flex-1 py-4 bg-gradient-to-r from-gold-600 to-gold-500 text-white text-lg font-bold rounded-lg hover:from-gold-700 hover:to-gold-600 transition-all shadow-lg hover:shadow-xl">
                Add to Cart
              </button>
              <button
                onClick={() => setWishlisted(!wishlisted)}
                className="p-4 border-2 border-gray-300 rounded-lg hover:border-gold-500 transition-all"
              >
                {wishlisted ? (
                  <FaHeart className="w-6 h-6 text-ruby-600" />
                ) : (
                  <FiHeart className="w-6 h-6 text-gray-700" />
                )}
              </button>
              <button className="p-4 border-2 border-gray-300 rounded-lg hover:border-gold-500 transition-all">
                <FiShare2 className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { icon: BsCheckCircleFill, text: 'Certified Gold' },
                { icon: FiRefreshCw, text: 'Lifetime Exchange' },
                { icon: FiTruck, text: 'Free Delivery' },
                { icon: FiShield, text: 'Secure Payments' },
              ].map((badge, index) => {
                const IconComponent = badge.icon
                return (
                  <div key={index} className="flex flex-col items-center text-center p-4 bg-champagne-50 rounded-lg">
                    <IconComponent className="w-8 h-8 text-gold-600 mb-2" />
                    <span className="text-sm font-medium text-gray-700">{badge.text}</span>
                  </div>
                )
              })}
            </div>

            {/* Delivery Options */}
            <div className="mb-8 p-6 border border-gray-200 rounded-xl">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FiMapPin className="w-5 h-5 text-gold-600" />
                Delivery & Pickup Options
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <FiTruck className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-medium text-gray-900">Home Delivery</p>
                    <p className="text-sm text-gray-600">Delivery within 5-7 business days</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiMapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">Store Pickup</p>
                    <p className="text-sm text-gray-600">Available at 25+ locations</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product Description */}
            <div className="mb-8">
              <h3 className="text-xl font-serif font-semibold text-gray-900 mb-4">
                Product Description
              </h3>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-xl font-serif font-semibold text-gray-900 mb-4">Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <BsCheckCircleFill className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
