'use client'

import { FiPercent, FiGift, FiTag, FiClock } from 'react-icons/fi'
import { BsLightning } from 'react-icons/bs'

const OffersPage = () => {
  const offers = [
    {
      id: 1,
      title: 'Up to 30% OFF – Diamond Jewellery',
      description: 'Exclusive festival discount on all diamond collections',
      code: 'DIAMOND30',
      validity: 'Valid till 31 Dec 2026',
      discount: '30%',
      color: 'from-blue-600 to-purple-600',
      icon: FiPercent,
    },
    {
      id: 2,
      title: 'Flat 20% OFF – Gold Jewellery',
      description: 'Special offer on 22KT and 18KT gold jewellery',
      code: 'GOLD20',
      validity: 'Valid till 15 Jan 2026',
      discount: '20%',
      color: 'from-gold-600 to-gold-700',
      icon: FiTag,
    },
    {
      id: 3,
      title: 'Limited-Time Festival Combos',
      description: 'Buy 2 Get 15% OFF, Buy 3 Get 25% OFF on select items',
      code: 'FESTIVAL25',
      validity: 'Festive Season Special',
      discount: '25%',
      color: 'from-ruby-600 to-pink-600',
      icon: BsLightning,
    },
    {
      id: 4,
      title: 'First-Time Buyer Coupon',
      description: 'Welcome offer for new customers on all purchases',
      code: 'ABIWELCOME',
      validity: 'One-time use per customer',
      discount: '15%',
      color: 'from-emerald-600 to-green-600',
      icon: FiGift,
    },
    {
      id: 5,
      title: 'Aadi Special Making Charges OFF',
      description: 'Zero making charges on gold jewellery during Aadi',
      code: 'AADI2026',
      validity: 'Aadi Month Only',
      discount: '0% Making',
      color: 'from-orange-600 to-red-600',
      icon: FiClock,
    },
    {
      id: 6,
      title: 'Wedding Collection Bundle',
      description: 'Complete bridal set with exclusive bundle pricing',
      code: 'WEDDING40',
      validity: 'Wedding Season Special',
      discount: '40%',
      color: 'from-pink-600 to-rose-600',
      icon: FiGift,
    },
  ]

  const bankOffers = [
    {
      id: 1,
      bank: 'HDFC Bank',
      offer: '10% Cashback up to €200',
      terms: 'On credit card purchases above €2,000',
    },
    {
      id: 2,
      bank: 'ICICI Bank',
      offer: '€150 Instant Discount',
      terms: 'On debit card transactions above €3,000',
    },
    {
      id: 3,
      bank: 'Axis Bank',
      offer: '12 Months No-Cost EMI',
      terms: 'Available on all purchases above €1,500',
    },
  ]

  return (
    <div className="min-h-screen bg-champagne-50 py-12">
      <div className="section-container">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="heading-primary mb-4">Exclusive Offers & Deals</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover amazing discounts on premium gold and diamond jewellery. Limited time offers curated just for you.
          </p>
        </div>

        {/* Featured Banner */}
        <div className="mb-12 relative h-64 rounded-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-gold-900 via-gold-700 to-gold-900">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-30" />
            </div>
          </div>
          <div className="relative h-full flex items-center justify-center text-center px-6">
            <div>
              <div className="inline-block mb-4 px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full">
                <span className="text-white font-bold text-sm tracking-wider">SUPER SAVER SALE</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">
                Save Up to 40% This Season
              </h2>
              <p className="text-xl text-gray-200">Use code <span className="font-bold text-gold-300">MEGA40</span> at checkout</p>
            </div>
          </div>
        </div>

        {/* Offers Grid */}
        <div className="mb-16">
          <h2 className="heading-tertiary mb-8">Active Promotions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map((offer) => {
              const IconComponent = offer.icon
              return (
                <div
                  key={offer.id}
                  className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Offer Header */}
                  <div className={`bg-gradient-to-r ${offer.color} p-6 text-white relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                    <div className="relative z-10">
                      <IconComponent className="w-10 h-10 mb-3" />
                      <div className="text-4xl font-bold mb-2">{offer.discount}</div>
                      <div className="text-sm font-medium opacity-90">OFF</div>
                    </div>
                  </div>

                  {/* Offer Details */}
                  <div className="p-6">
                    <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">
                      {offer.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{offer.description}</p>

                    {/* Coupon Code */}
                    <div className="mb-4 p-3 bg-champagne-100 border-2 border-dashed border-gold-400 rounded-lg flex items-center justify-between">
                      <span className="font-mono font-bold text-gold-800">{offer.code}</span>
                      <button className="text-sm text-gold-700 hover:text-gold-800 font-semibold">
                        COPY
                      </button>
                    </div>

                    {/* Validity */}
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FiClock className="w-4 h-4" />
                      <span>{offer.validity}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bank Offers */}
        <div className="mb-16">
          <h2 className="heading-tertiary mb-8">Bank Offers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bankOffers.map((bankOffer) => (
              <div
                key={bankOffer.id}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border-l-4 border-gold-500"
              >
                <h3 className="text-lg font-bold text-gray-900 mb-2">{bankOffer.bank}</h3>
                <p className="text-2xl font-bold text-gold-700 mb-3">{bankOffer.offer}</p>
                <p className="text-sm text-gray-600">{bankOffer.terms}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="bg-white p-8 rounded-xl shadow-md">
          <h3 className="text-xl font-serif font-bold text-gray-900 mb-4">
            Terms & Conditions
          </h3>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <span className="text-gold-600 mt-1">•</span>
              <span>All offers are valid for a limited period and subject to availability</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-600 mt-1">•</span>
              <span>Discounts cannot be combined with other promotional offers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-600 mt-1">•</span>
              <span>Making charges discount applies only to select categories</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-600 mt-1">•</span>
              <span>Final prices may vary based on gold rate fluctuations</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-600 mt-1">•</span>
              <span>Abi Diamond reserves the right to modify or withdraw offers without prior notice</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default OffersPage
