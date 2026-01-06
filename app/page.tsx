import Header from '@/components/Header'
import HeroBanner from '@/components/HeroBanner'
import ShopByCategory from '@/components/ShopByCategory'
import FeaturedCollections from '@/components/FeaturedCollections'
import AadiFestiveOffer from '@/components/AadiFestiveOffer'
import ProductListing from '@/components/ProductListing'
import Footer from '@/components/Footer'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <HeroBanner />
      <ShopByCategory />
      <FeaturedCollections />
      <AadiFestiveOffer />
      <ProductListing />
      <Footer />
      <WhatsAppButton />
    </main>
  )
}
