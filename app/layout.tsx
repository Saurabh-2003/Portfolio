import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import NavBar from '@/components/NavBar'
import Footer from '@/components/Footer'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'My Portfolio',
  description: 'This is Saurabh Thapliyal Portfolio',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      
      <body className='dark:bg-gradient-radial dark:from-blue-950 dark:to-black
   bg-gradient-radial from-blue-300 to-slate-300 antialiased'>
        <NavBar />
        {children}
        <Footer/>
        </body>
    </html>
  )
}
