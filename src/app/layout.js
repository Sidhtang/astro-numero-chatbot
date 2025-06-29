import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Cosmic Oracle - Astrology & Numerology Chatbot',
  description: 'Your personal guide to astrology and numerology powered by AI',
  keywords: 'astrology, numerology, horoscope, birth chart, AI chatbot',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
