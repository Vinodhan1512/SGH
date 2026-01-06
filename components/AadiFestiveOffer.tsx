'use client'

import { useState, useEffect } from 'react'
import { FiGift, FiPercent, FiClock } from 'react-icons/fi'

const AadiFestiveOffer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    // Set end date to 7 days from now
    const endDate = new Date()
    endDate.setDate(endDate.getDate() + 7)

    const timer = setInterval(() => {
      const now = new Date().getTime()
      const distance = endDate.getTime() - now

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const offers = [
    {
      id: 1,
      icon: FiPercent,
      title: 'Up to 30% OFF',
      description: 'On Making Charges',
      color: 'from-red-600 to-red-700',
      emoji: '🔥',
    },
    {
      id: 2,
      icon: FiGift,
      title: 'Free Gold Coin',
      description: 'On purchases above €5,000',
      color: 'from-green-600 to-green-700',
      emoji: '🎁',
    },
    {
      id: 3,
      icon: FiClock,
      title: 'Limited Period',
      description: 'Festival Special Offer',
      color: 'from-yellow-500 to-amber-600',
      emoji: '⚡',
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-br from-red-900 via-red-800 to-amber-900 relative overflow-hidden">
      {/* Enhanced Decorative Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-400 rounded-full blur-3xl" />
      </div>

      <div className="section-container relative z-10">
        {/* Enhanced Main Banner */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6 px-8 py-3 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full shadow-2xl border-2 border-yellow-300 animate-pulse">
            <span className="text-2xl">🪔</span>
            <span className="text-sm md:text-base font-extrabold tracking-wider text-white drop-shadow-lg">
              AADI SPECIAL FESTIVAL
            </span>
            <span className="text-2xl">🪔</span>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-display font-extrabold text-white mb-6 drop-shadow-2xl leading-tight">
            Aadi Special – Prosperity in Every Gram
          </h2>
          <p className="text-xl md:text-2xl text-yellow-100 max-w-3xl mx-auto font-semibold drop-shadow-lg">
            Celebrate the auspicious Aadi season with exclusive offers on 22ct gold and diamond jewellery
          </p>
        </div>

        {/* Enhanced Countdown Timer */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-10 border-4 border-yellow-400/50 shadow-2xl">
            <h3 className="text-3xl md:text-4xl font-display font-extrabold text-yellow-100 text-center mb-8 drop-shadow-lg">
              ⏰ Offer Ends In
            </h3>
            <div className="grid grid-cols-4 gap-4 md:gap-8">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="bg-gradient-to-br from-yellow-400 to-amber-500 backdrop-blur-md rounded-2xl p-6 md:p-8 mb-3 shadow-2xl border-4 border-white transform hover:scale-105 transition-transform">
                    <div className="text-4xl md:text-6xl font-extrabold text-gray-900 font-display drop-shadow-lg">
                      {String(item.value).padStart(2, '0')}
                    </div>
                  </div>
                  <div className="text-sm md:text-lg text-yellow-100 font-bold uppercase tracking-wide">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Enhanced Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {offers.map((offer) => {
            const IconComponent = offer.icon
            return (
              <div
                key={offer.id}
                className="bg-white/15 backdrop-blur-xl rounded-2xl p-8 border-2 border-white/30 hover:bg-white/25 transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-yellow-500/30"
              >
                <div className={`w-20 h-20 bg-gradient-to-br ${offer.color} rounded-2xl flex items-center justify-center mb-6 shadow-xl border-4 border-white relative`}>
                  <IconComponent className="w-10 h-10 text-white" />
                  <div className="absolute -top-3 -right-3 text-3xl">{offer.emoji}</div>
                </div>
                <h4 className="text-3xl font-extrabold text-white mb-3 font-display drop-shadow-lg">{offer.title}</h4>
                <p className="text-yellow-100 text-lg font-semibold">{offer.description}</p>
              </div>
            )
          })}
        </div>

        {/* Enhanced CTA Button */}
        <div className="text-center">
          <a
            href="/offers"
            className="inline-flex items-center gap-4 px-14 py-6 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 text-gray-900 text-xl font-extrabold rounded-full hover:from-yellow-300 hover:via-amber-300 hover:to-yellow-400 transition-all duration-300 shadow-2xl hover:shadow-yellow-400/50 hover:scale-110 border-4 border-white"
          >
            <span>Shop Aadi Collection</span>
            <span className="text-2xl">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}

export default AadiFestiveOffer
