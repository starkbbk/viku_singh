"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook, Send, Sparkles } from "lucide-react";

export default function Contact() {
  return (
    <section
      id="contact"
      className="min-h-screen flex flex-col justify-center items-center py-20 relative overflow-hidden bg-[#08070b]"
    >
      {/* Background Ambient Glow */}
      <div className="absolute inset-0 darkroom-grid opacity-20 pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[180px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.93 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="container mx-auto px-6 relative z-10 w-full my-auto"
      >
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/30 bg-amber-950/40 text-amber-300 text-xs tracking-widest uppercase mb-4">
              <Sparkles size={13} className="text-amber-400" />
              <span>STUDIO COMMISSIONS & BOOKINGS</span>
            </div>

            <h2 className="text-xs uppercase font-mono tracking-[0.3em] text-amber-400 mb-2 font-semibold">
              GET IN TOUCH
            </h2>
            <h3 className="text-3xl sm:text-5xl font-serif text-white uppercase tracking-tight mb-4 sm:mb-6 font-normal">
              Let&apos;s Create <br />
              <span className="text-amber-300">Timeless Imagery</span>
            </h3>

            <p className="text-stone-300 text-base md:text-lg mb-10 leading-relaxed font-light">
              Available for high-fashion editorial, worldwide wedding destination commissions,
              monumental concert stages, and private portrait sittings.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3.5 glass rounded-2xl text-amber-400 border border-amber-400/30">
                  <Mail size={22} />
                </div>
                <div>
                  <h4 className="text-white font-serif font-semibold text-base mb-0.5">Email Inquiries</h4>
                  <a
                    href="mailto:vikashtkd19@gmail.com"
                    className="text-stone-300 hover:text-amber-300 font-mono text-sm transition-colors"
                  >
                    vikashtkd19@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3.5 glass rounded-2xl text-amber-400 border border-amber-400/30">
                  <Phone size={22} />
                </div>
                <div>
                  <h4 className="text-white font-serif font-semibold text-base mb-0.5">Direct Line & WhatsApp</h4>
                  <a
                    href="tel:+917428441649"
                    className="text-stone-300 hover:text-amber-300 font-mono text-sm transition-colors"
                  >
                    +91 74284 41649
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3.5 glass rounded-2xl text-amber-400 border border-amber-400/30">
                  <MapPin size={22} />
                </div>
                <div>
                  <h4 className="text-white font-serif font-semibold text-base mb-0.5">Primary Darkroom & Studio</h4>
                  <p className="text-stone-300 text-sm">New Delhi, India (Worldwide Travel)</p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h4 className="text-stone-400 font-mono text-xs uppercase tracking-widest mb-4">
                Social Archives
              </h4>
              <div className="flex gap-4">
                {[
                  { Icon: Instagram, href: "https://www.instagram.com/ind_god_vkt", label: "Instagram" },
                  { Icon: Twitter, href: "#", label: "Twitter" },
                  { Icon: Facebook, href: "#", label: "Facebook" },
                ].map(({ Icon, href, label }, index) => (
                  <a
                    key={index}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    aria-label={label}
                    className="p-3.5 glass rounded-2xl text-white hover:text-amber-300 hover:border-amber-400/50 transition-all duration-300"
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Instagram Direct Salon Card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass-panel p-6 sm:p-12 md:p-14 rounded-3xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.8)] text-center relative overflow-hidden"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-300 rounded-2xl mb-5 sm:mb-6 mx-auto flex items-center justify-center shadow-[0_10px_30px_rgba(245,158,11,0.3)]">
              <Instagram size={34} className="text-black" />
            </div>

            <h3 className="text-xl sm:text-3xl font-serif text-white uppercase mb-2 sm:mb-3 font-normal">
              Direct DM on Instagram
            </h3>
            <p className="text-stone-300 text-xs sm:text-base mb-6 sm:mb-8 max-w-sm mx-auto font-light leading-relaxed">
              The fastest way to connect for shooting dates, rates, collaborations, or custom visual direction.
            </p>

            <a
              href="https://www.instagram.com/ind_god_vkt"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 sm:py-4 bg-amber-400 text-black font-semibold uppercase text-xs tracking-wider rounded-full hover:bg-amber-300 transition-all shadow-[0_0_25px_rgba(245,158,11,0.3)] transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>Send Instagram DM</span>
              <Send size={15} />
            </a>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
