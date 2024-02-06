'use client'
import React, { useEffect } from 'react'
import Hero from '@/components/Hero'
import { Metadata } from 'next'
import Skills from '@/components/Skills'
import Projects from '@/components/Projects'
import Socials from '@/components/Socials'
import TechStack from '@/components/TechStack'
import Contact from '@/components/Contact'

const Home = () => {

  return (
   <main >
     <section id='home'>
      <Hero />
    </section>
    <section id='skills' >
      <Skills/>
    </section>
    <section>
      <TechStack/>
    </section>
    <section id='projects'>
      <Projects/>
    </section>
    <section id='socials'>
      <Socials/>
    </section>
    <section>
      <Contact/>
    </section>
   </main>
  )
}

export default Home