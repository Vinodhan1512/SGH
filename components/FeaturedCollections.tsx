'use client'

const FeaturedCollections = () => {
  const collections = [
    {
      id: 1,
      title: 'Bridal Gold Collection',
      description: 'Timeless elegance for your special day',
      image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=1200&q=90',
      href: '/traditional-gold',
      gradient: 'from-amber-900/90 to-yellow-800/70',
      badge: '22ct Gold',
    },
    {
      id: 2,
      title: 'Diamond Jewellery Sets',
      description: 'Sparkle with confidence and grace',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=1200&q=90',
      href: '/diamond',
      gradient: 'from-purple-900/90 to-pink-800/70',
      badge: 'Premium Diamonds',
    },
    {
      id: 3,
      title: 'Wedding Collection',
      description: 'Complete your forever look',
      image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1200&q=90',
      href: '/engagement-rings',
      gradient: 'from-rose-900/90 to-amber-800/70',
      badge: 'Exclusive Sets',
    },
  ]

  return (
    <section className="py-20 bg-gradient-to-b from-white via-amber-50/30 to-white">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-amber-100 to-yellow-100 rounded-full mb-4 border border-amber-200">
            <span className="text-2xl">💎</span>
            <span className="text-sm font-bold text-amber-800 tracking-wider">PREMIUM COLLECTIONS</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-extrabold bg-gradient-to-r from-amber-800 via-yellow-700 to-amber-900 bg-clip-text text-transparent mb-4">
            Featured Collections
          </h2>
          <p className="text-amber-800 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Discover our handpicked selections designed to celebrate life's precious moments
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((collection) => (
            <a
              key={collection.id}
              href={collection.href}
              className="group relative h-[450px] md:h-[550px] rounded-2xl overflow-hidden hover-lift shadow-2xl border-4 border-white"
            >
              {/* Background Image with Enhanced Effect */}
              <div className="absolute inset-0">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{
                    backgroundImage: `url(${collection.image})`,
                    filter: 'brightness(0.9) contrast(1.1)',
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/40" />
              </div>

              {/* Enhanced Gradient Overlay */}
              <div className={`absolute inset-0 bg-gradient-to-t ${collection.gradient} group-hover:opacity-95 transition-opacity duration-500`} />

              {/* Badge */}
              <div className="absolute top-6 right-6 z-10">
                <div className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full shadow-xl border-2 border-white">
                  <span className="text-sm font-extrabold text-white drop-shadow-lg">
                    {collection.badge}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="relative h-full flex flex-col justify-end p-8">
                <div className="transform transition-transform duration-500 group-hover:-translate-y-3">
                  <h3 className="text-3xl md:text-4xl font-display font-extrabold text-white mb-3 drop-shadow-2xl">
                    {collection.title}
                  </h3>
                  <p className="text-lg md:text-xl text-yellow-100 mb-6 font-semibold drop-shadow-lg">
                    {collection.description}
                  </p>
                  <div className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-yellow-400 via-amber-400 to-yellow-500 backdrop-blur-md rounded-full text-gray-900 font-extrabold group-hover:from-yellow-300 group-hover:via-amber-300 group-hover:to-yellow-400 transition-all duration-300 shadow-2xl hover:shadow-yellow-500/50 border-2 border-white group-hover:scale-105">
                    <span>Explore Collection</span>
                    <span className="inline-block group-hover:translate-x-2 transition-transform text-xl">
                      →
                    </span>
                  </div>
                </div>
              </div>

              {/* Decorative Corner Elements */}
              <div className="absolute top-0 right-0 w-32 h-32">
                <div className="absolute top-6 right-6 w-20 h-20 border-t-4 border-r-4 border-yellow-400/50 group-hover:border-yellow-300 transition-colors rounded-tr-2xl" />
              </div>
              <div className="absolute bottom-0 left-0 w-32 h-32">
                <div className="absolute bottom-6 left-6 w-20 h-20 border-b-4 border-l-4 border-yellow-400/50 group-hover:border-yellow-300 transition-colors rounded-bl-2xl" />
              </div>

              {/* Sparkle Effect */}
              <div className="absolute top-10 left-10 w-24 h-24 bg-yellow-400/20 rounded-full blur-2xl animate-pulse group-hover:bg-yellow-300/30" />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedCollections
