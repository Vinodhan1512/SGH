import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Selvaraja Gold House - Premium 22ct Gold & Diamond Jewellery',
  description: 'Discover exquisite 22ct gold and diamond jewellery at Selvaraja Gold House. Premium craftsmanship, certified quality, lifetime exchange. Call 020 8767 3795',
  keywords: '22ct gold jewellery, selvaraja gold house, diamond jewellery, wedding jewellery, bridal jewellery, gold coins, engagement rings, SG Jewells',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
