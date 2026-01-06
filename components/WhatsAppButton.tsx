'use client'

import { FaWhatsapp } from 'react-icons/fa'
import { useState } from 'react'

const WhatsAppButton = () => {
  const [isHovered, setIsHovered] = useState(false)
  const phoneNumber = '+442087673795' // Selvaraja Gold House: 020 8767 3795
  const message = 'Hello! I would like to inquire about your 22ct gold jewellery collection at Selvaraja Gold House.'

  const handleClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-110"
        aria-label="Contact us on WhatsApp"
      >
        {/* Icon */}
        <div className="flex items-center justify-center w-16 h-16 md:w-18 md:h-18">
          <FaWhatsapp className="w-9 h-9 md:w-10 md:h-10 animate-pulse" />
        </div>

        {/* Text Label - Shows on Hover */}
        <div
          className={`overflow-hidden transition-all duration-300 ${
            isHovered ? 'max-w-xs pr-6' : 'max-w-0'
          }`}
        >
          <span className="whitespace-nowrap font-bold text-base md:text-lg">
            Chat with Selvaraja Gold House
          </span>
        </div>

        {/* Notification Badge */}
        <div className="absolute -top-1 -right-1 w-7 h-7 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center text-xs font-extrabold border-2 border-white animate-bounce shadow-lg">
          <span className="text-white">💬</span>
        </div>

        {/* Ripple Effect */}
        <div className="absolute inset-0 rounded-full bg-green-400 opacity-0 group-hover:opacity-30 animate-ping" />
      </button>
    </div>
  )
}

export default WhatsAppButton
