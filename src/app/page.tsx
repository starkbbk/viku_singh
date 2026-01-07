import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Portfolio from "@/components/Portfolio";

import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-transparent text-white selection:bg-accent-cyan selection:text-black">
      <Navbar />
      <Hero />
      <About />
      <Portfolio />

      <Testimonials />
      <Contact />
      <Footer />
    </main>
  );
}
