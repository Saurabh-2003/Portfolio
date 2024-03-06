import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import NavBar from '@/components/NavBar'
import ToasterProvider from '@/components/ToasterProvider'

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
      
      <body >
    <ToasterProvider/>
        <NavBar />
        {children}
        
        </body>
    </html>
  )
}
