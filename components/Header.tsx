'use client'

import { useState } from 'react'
import { FiSearch, FiMapPin, FiUser, FiHeart, FiShoppingBag, FiMenu, FiX, FiPhone } from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi'

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const navLinks = [
    { name: 'All Jewellery', href: '/all-jewellery' },
    { name: 'Gold', href: '/gold' },
    { name: 'Diamond', href: '/diamond' },
    { name: 'Rings', href: '/rings' },
    { name: 'Earrings', href: '/earrings' },
    { name: 'Wedding Jewellery', href: '/wedding' },
    { name: 'Coins & Bars', href: '/coins' },
    { name: 'Offers', href: '/offers', special: true },
    { name: 'Gift Cards', href: '/gift-cards' },
    { name: 'Purchase Plan', href: '/purchase-plan' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-white shadow-xl">
      {/* Top Contact Banner */}
      <div className="bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 text-white py-2.5 shadow-lg relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAgTSAwIDIwIEwgNDAgMjAgTSAyMCAwIEwgMjAgNDAgTSAwIDMwIEwgNDAgMzAgTSAzMCAwIEwgMzAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC4zIiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20"></div>
        <div className="section-container relative">
          <div className="flex items-center justify-between text-xs md:text-sm font-semibold">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-2">
                <FiPhone className="w-4 h-4" />
                <span className="font-bold">020 8767 3795</span>
              </span>
              <span className="hidden md:inline">|</span>
              <span className="hidden md:inline">22 ct GOLD JEWELLERY</span>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <span className="hidden sm:inline">Gold 22KT: €52.50/g</span>
              <span className="hidden md:inline">•</span>
              <span className="text-yellow-100">🎉 Special Offers Available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-gradient-to-b from-yellow-50 to-white border-b-4 border-yellow-500">
        <div className="section-container py-4 md:py-6">
          <div className="flex items-center justify-between gap-4">
            {/* Premium Logo - Selvaraja Gold House */}
            <div className="flex items-center">
              <a href="/" className="flex items-center gap-3 group">
                {/* Gold House Icon/Badge */}
                <div className="relative w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-500 via-amber-400 to-yellow-600 rounded-lg shadow-2xl group-hover:shadow-yellow-500/50 transition-all duration-300 group-hover:scale-105 border-4 border-yellow-400 flex items-center justify-center">
                  <div className="text-4xl md:text-5xl">🏛️</div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <span className="text-xs font-bold text-white">SG</span>
                  </div>
                </div>

                {/* Brand Text */}
                <div className="flex flex-col">
                  <span className="text-xl md:text-3xl lg:text-4xl font-display font-extrabold leading-none tracking-tight">
                    <span className="bg-gradient-to-r from-yellow-700 via-amber-600 to-yellow-800 bg-clip-text text-transparent">
                      SELVARAJA
                    </span>
                  </span>
                  <span className="text-2xl md:text-4xl lg:text-5xl font-display font-extrabold bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-700 bg-clip-text text-transparent leading-tight">
                    GOLD HOUSE
                  </span>
                  <span className="text-[9px] md:text-xs text-yellow-800 font-bold tracking-[0.25em] mt-0.5 border-t-2 border-yellow-400 pt-1">
                    22 CT GOLD JEWELLERY
                  </span>
                </div>
              </a>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full group">
                <input
                  type="text"
                  placeholder="Search for Gold, Diamond, Rings, Earrings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-3.5 pr-14 border-3 border-yellow-300 rounded-full focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 focus:outline-none transition-all shadow-md bg-white"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-full hover:from-yellow-600 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl">
                  <FiSearch className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Action Icons */}
            <div className="flex items-center gap-3 md:gap-5">
              {/* Currency Display */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-yellow-100 to-amber-100 rounded-xl border-2 border-yellow-400 shadow-md">
                <span className="text-xs md:text-sm font-extrabold text-yellow-900">EUR €</span>
              </div>

              {/* Store Locator */}
              <a href="/stores" className="hidden md:flex flex-col items-center group cursor-pointer">
                <div className="relative">
                  <FiMapPin className="w-6 h-6 text-yellow-700 group-hover:text-yellow-900 transition-colors" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
                </div>
                <span className="text-xs mt-1 text-yellow-800 group-hover:text-yellow-900 font-bold">Store</span>
              </a>

              {/* Account */}
              <a href="/account" className="hidden md:flex flex-col items-center group cursor-pointer">
                <FiUser className="w-6 h-6 text-yellow-700 group-hover:text-yellow-900 transition-colors" />
                <span className="text-xs mt-1 text-yellow-800 group-hover:text-yellow-900 font-bold">Account</span>
              </a>

              {/* Wishlist */}
              <a href="/wishlist" className="flex flex-col items-center group cursor-pointer relative">
                <div className="relative">
                  <FiHeart className="w-6 h-6 text-yellow-700 group-hover:text-red-600 transition-colors" />
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg animate-bounce border border-white">
                    3
                  </span>
                </div>
                <span className="text-xs mt-1 text-yellow-800 group-hover:text-yellow-900 hidden md:block font-bold">Wishlist</span>
              </a>

              {/* Cart */}
              <a href="/cart" className="flex flex-col items-center group cursor-pointer relative">
                <div className="relative">
                  <FiShoppingBag className="w-6 h-6 text-yellow-700 group-hover:text-yellow-900 transition-colors" />
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold shadow-lg border border-white">
                    2
                  </span>
                </div>
                <span className="text-xs mt-1 text-yellow-800 group-hover:text-yellow-900 hidden md:block font-bold">Cart</span>
              </a>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-yellow-800 hover:text-yellow-900 bg-yellow-100 rounded-lg border-2 border-yellow-300"
              >
                {mobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Search Bar - Mobile */}
          <div className="lg:hidden mt-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search jewellery..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pr-12 border-2 border-yellow-300 rounded-full focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 focus:outline-none shadow-sm"
              />
              <button className="absolute right-1 top-1/2 -translate-y-1/2 p-2.5 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-full shadow-md">
                <FiSearch className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className={`${mobileMenuOpen ? 'block' : 'hidden'} lg:block bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-500 shadow-lg`}>
        <div className="section-container">
          <ul className="flex flex-col lg:flex-row lg:items-center lg:justify-center lg:space-x-1 py-2">
            {navLinks.map((link) => (
              <li key={link.name}>
                <a
                  href={link.href}
                  className={`block py-3 lg:py-3 px-4 font-bold rounded-lg transition-all ${
                    link.special
                      ? 'text-white bg-red-600 hover:bg-red-700'
                      : 'text-white hover:bg-yellow-600'
                  }`}
                >
                  {link.name}
                  {link.special && (
                    <span className="ml-2 px-2.5 py-1 bg-white text-red-600 text-xs rounded-full font-extrabold shadow-md animate-pulse">
                      🔥 HOT
                    </span>
                  )}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  )
}

export default Header
