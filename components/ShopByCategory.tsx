'use client'

import { GiEarrings, GiNecklace, GiDiamondRing, GiBigDiamondRing } from 'react-icons/gi'
import { IoDiamondOutline } from 'react-icons/io5'
import { TbCircleDotted } from 'react-icons/tb'
import { HiSparkles } from 'react-icons/hi'

const ShopByCategory = () => {
  const categories = [
    {
      id: 1,
      name: 'Earrings',
      icon: GiEarrings,
      href: '/earrings',
      color: 'from-amber-400 via-yellow-400 to-amber-500',
    },
    {
      id: 2,
      name: 'Necklaces',
      icon: GiNecklace,
      href: '/necklaces',
      color: 'from-amber-500 via-yellow-500 to-amber-600',
    },
    {
      id: 3,
      name: 'Finger Rings',
      icon: GiDiamondRing,
      href: '/rings',
      color: 'from-amber-400 via-yellow-400 to-amber-500',
    },
    {
      id: 4,
      name: 'Bangles & Bracelets',
      icon: TbCircleDotted,
      href: '/bangles',
      color: 'from-amber-500 via-yellow-500 to-amber-600',
    },
    {
      id: 5,
      name: 'Mangalsutra',
      icon: GiBigDiamondRing,
      href: '/mangalsutra',
      color: 'from-amber-400 via-yellow-400 to-amber-500',
    },
    {
      id: 6,
      name: 'Chains',
      icon: GiNecklace,
      href: '/chains',
      color: 'from-amber-500 via-yellow-500 to-amber-600',
    },
    {
      id: 7,
      name: 'Gold Coins',
      icon: IoDiamondOutline,
      href: '/coins',
      color: 'from-amber-400 via-yellow-400 to-amber-500',
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-amber-50 via-yellow-50/30 to-white relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
      </div>

      <div className="section-container relative">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full mb-4 border border-amber-200">
            <HiSparkles className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-bold text-amber-800 tracking-wider">EXPLORE OUR COLLECTIONS</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-extrabold bg-gradient-to-r from-amber-800 via-yellow-700 to-amber-900 bg-clip-text text-transparent mb-4">
            Shop by Category
          </h2>
          <p className="text-amber-800 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Explore our exquisite collection of handcrafted jewellery for every occasion
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-6 md:gap-8">
          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <a
                key={category.id}
                href={category.href}
                className="group flex flex-col items-center transform transition-all duration-300 hover:-translate-y-2"
              >
                {/* Icon Circle */}
                <div className={`relative w-28 h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br ${category.color} flex items-center justify-center mb-4 shadow-2xl hover:shadow-amber-500/50 transition-all duration-500 group-hover:scale-110 border-4 border-white`}>
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
                  <IconComponent className="w-14 h-14 md:w-16 md:h-16 text-white relative z-10 drop-shadow-lg" />

                  {/* Animated Ring */}
                  <div className="absolute inset-0 rounded-full border-4 border-white/40 group-hover:border-white/80 transition-all group-hover:scale-110 duration-500" />

                  {/* Glow Effect */}
                  <div className="absolute inset-0 rounded-full bg-amber-400 opacity-0 group-hover:opacity-30 blur-xl transition-all duration-500" />

                  {/* Sparkle Dot */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-yellow-300 to-amber-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <span className="text-xs">✨</span>
                  </div>
                </div>

                {/* Category Name */}
                <span className="text-center font-bold text-amber-900 group-hover:text-amber-700 transition-colors text-sm md:text-base px-2">
                  {category.name}
                </span>

                {/* Underline Animation */}
                <div className="h-1 w-0 group-hover:w-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-300 mt-2 rounded-full"></div>
              </a>
            )
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-16">
          <a href="/all-jewellery" className="inline-flex items-center gap-3 px-10 py-4 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-white font-bold rounded-full hover:from-amber-700 hover:via-yellow-600 hover:to-amber-700 transition-all duration-300 shadow-2xl hover:shadow-amber-500/50 hover:scale-105 border-2 border-amber-400">
            <span>View All Collections</span>
            <HiSparkles className="w-5 h-5 animate-pulse" />
          </a>
        </div>
      </div>
    </section>
  )
}

export default ShopByCategory
