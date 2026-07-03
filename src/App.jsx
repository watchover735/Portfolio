import { useState } from 'react'
import Preloader from './components/Preloader'
import Navbar from './components/Navbar'
import Hero from './sections/Hero'
import About from './sections/About'
import TechStack from './sections/TechStack'
import FeaturedWork from './sections/FeaturedWork'
import Skills from './sections/Skills'
import Services from './sections/Services'
import Contact from './sections/Contact'
import Footer from './sections/Footer'

export default function App() {
  const [ready, setReady] = useState(false)

  return (
    <>
      <Preloader onDone={() => setReady(true)} />

      <div
        className={`transition-opacity duration-700 ${ready ? 'opacity-100' : 'opacity-0'}`}
        style={{ transitionTimingFunction: 'var(--premium)' }}
      >
        <Navbar />
        <main>
          <Hero />
          {/* Alternate animation ↔ content: About (content) sits between Hero
              and the Tech Stack / Work reveals. */}
          <About />
          <TechStack />
          <FeaturedWork />
          <Skills />
          <Services />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  )
}
