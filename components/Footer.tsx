'use client'

import { FiFacebook, FiInstagram, FiTwitter, FiYoutube, FiMail, FiPhone, FiMapPin } from 'react-icons/fi'
import { useState } from 'react'

const Footer = () => {
  const [email, setEmail] = useState('')

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Thank you for subscribing with: ${email}`)
    setEmail('')
  }

  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-yellow-600 via-amber-500 to-yellow-600 py-12 shadow-2xl">
        <div className="section-container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">
                Stay Updated with Exclusive Offers
              </h3>
              <p className="text-white/95 font-medium">
                Subscribe to our newsletter and get the latest collections & special offers from Selvaraja Gold House
              </p>
            </div>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="px-6 py-3.5 rounded-lg w-full md:w-80 text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/50 border-2 border-white/30"
              />
              <button
                type="submit"
                className="px-8 py-3.5 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors whitespace-nowrap shadow-xl"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="section-container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <h3 className="text-3xl font-display font-extrabold bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent mb-1">
                SELVARAJA
              </h3>
              <h3 className="text-4xl font-display font-extrabold bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-600 bg-clip-text text-transparent">
                GOLD HOUSE
              </h3>
              <p className="text-xs text-yellow-500 font-bold tracking-widest mt-1 border-t border-yellow-700 pt-1">
                22 CT GOLD JEWELLERY
              </p>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Your trusted destination for premium 22ct gold and diamond jewellery. Quality craftsmanship and authentic gold since establishment.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <FiMapPin className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
                <p className="text-sm">162b High Street, London, United Kingdom</p>
              </div>
              <div className="flex items-center gap-3">
                <FiPhone className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <p className="text-sm font-bold">020 8767 3795</p>
              </div>
              <div className="flex items-center gap-3">
                <FiMail className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                <p className="text-sm">info@selvaragagoldhouse.com</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-serif font-semibold text-white mb-6 border-b-2 border-yellow-600 pb-2">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { name: 'About Us', href: '/about' },
                { name: 'Store Location', href: '/stores' },
                { name: 'Gold Jewellery', href: '/gold' },
                { name: 'Diamond Jewellery', href: '/diamond' },
                { name: 'Jewellery Care', href: '/care' },
                { name: 'Size Guide', href: '/size-guide' },
                { name: '22ct Gold Certification', href: '/certification' },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-yellow-500 transition-colors inline-block font-medium"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-serif font-semibold text-white mb-6 border-b-2 border-yellow-600 pb-2">Customer Service</h4>
            <ul className="space-y-3">
              {[
                { name: 'Returns & Exchange', href: '/returns' },
                { name: 'Shipping Information', href: '/shipping' },
                { name: 'Payment Options', href: '/payment' },
                { name: 'Purchase Plan', href: '/purchase-plan' },
                { name: 'FAQs', href: '/faq' },
                { name: 'Contact Us', href: '/contact' },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-yellow-500 transition-colors inline-block font-medium"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h4 className="text-lg font-serif font-semibold text-white mb-6 border-b-2 border-yellow-600 pb-2">Legal & Connect</h4>
            <ul className="space-y-3 mb-8">
              {[
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Terms & Conditions', href: '/terms' },
                { name: 'Cookie Policy', href: '/cookies' },
                { name: 'Sitemap', href: '/sitemap' },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-yellow-500 transition-colors inline-block font-medium"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>

            <h4 className="text-lg font-serif font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex gap-4">
              {[
                { icon: FiFacebook, href: 'https://facebook.com' },
                { icon: FiInstagram, href: 'https://instagram.com' },
                { icon: FiTwitter, href: 'https://twitter.com' },
                { icon: FiYoutube, href: 'https://youtube.com' },
              ].map((social, index) => {
                const IconComponent = social.icon
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gradient-to-br hover:from-yellow-500 hover:to-amber-600 transition-all hover:scale-110 border border-gray-700 hover:border-yellow-500"
                  >
                    <IconComponent className="w-5 h-5" />
                  </a>
                )
              })}
            </div>

            {/* Store Badge */}
            <div className="mt-6 p-4 bg-gradient-to-br from-yellow-900/30 to-amber-900/30 rounded-lg border border-yellow-700">
              <p className="text-yellow-500 font-bold text-sm mb-1">🏆 AUTHENTIC GOLD</p>
              <p className="text-xs text-gray-400">BIS Hallmarked 22ct Gold Jewellery</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="section-container py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
            <p>© 2026 Selvaraja Gold House. All rights reserved. | Registered Company</p>
            <div className="flex items-center gap-6">
              <img src="https://via.placeholder.com/50x30/fbbf24/666666?text=VISA" alt="Visa" className="h-6 opacity-70 hover:opacity-100 transition-opacity" />
              <img src="https://via.placeholder.com/50x30/fbbf24/666666?text=MC" alt="Mastercard" className="h-6 opacity-70 hover:opacity-100 transition-opacity" />
              <img src="https://via.placeholder.com/50x30/fbbf24/666666?text=AMEX" alt="Amex" className="h-6 opacity-70 hover:opacity-100 transition-opacity" />
              <img src="https://via.placeholder.com/50x30/fbbf24/666666?text=PayPal" alt="PayPal" className="h-6 opacity-70 hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
