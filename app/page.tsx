'use client'
import React, { useEffect } from 'react'
import Hero from '@/components/Hero'
import { Metadata } from 'next'
import Skills from '@/components/Skills'
import Projects from '@/components/Projects'
import Socials from '@/components/Socials'
import TechStack from '@/components/TechStack'
import Contact from '@/components/Contact'
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  weight: '500',
  subsets: ['latin'],
  display: 'swap',
});


const Home = () => {

  return (
   <main className={`${montserrat.className} bg-gradient-to-b from-gray-900 to-gray-800`}>
     <section id='home'>
      <Hero />
    </section>
    <section id='skills' >
      <Skills/>
    </section>
    <section id='projects'>
      <Projects/>
    </section>
    <section id='socials'>
      <Socials/>
    </section>
    <section id='contact'>
      <Contact/>
    </section>
   </main>
  )
}

export default Home