"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook, Send } from "lucide-react";


export default function Contact() {
    return (
        <section id="contact" className="py-20 md:py-32 relative overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Contact Info */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-accent-cyan font-medium tracking-widest mb-2 uppercase">Get in Touch</h2>
                        <h3 className="text-4xl md:text-5xl font-bold text-white mb-8">Let's Create Something Beautiful</h3>
                        <p className="text-gray-300 text-lg mb-12 leading-relaxed">
                            Whether you need a portfolio update, want to collaborate on a creative project, or capture a special event,
                            I'd love to hear from you.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="p-3 glass rounded-full text-accent-cyan">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold mb-1">Email</h4>
                                    <p className="text-gray-400">vikashtkd19@gmail.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 glass rounded-full text-accent-cyan">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold mb-1">Phone</h4>
                                    <p className="text-gray-400">+917428441649</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 glass rounded-full text-accent-cyan">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold mb-1">Studio</h4>
                                    <p className="text-gray-400">New Delhi, India</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <h4 className="text-white font-semibold mb-4">Follow Me</h4>
                            <div className="flex gap-4">
                                {[Instagram, Twitter, Facebook].map((Icon, index) => (
                                    <a
                                        key={index}
                                        href={index === 0 ? "https://www.instagram.com/ind_god_vkt" : "#"}
                                        target={index === 0 ? "_blank" : undefined}
                                        rel={index === 0 ? "noopener noreferrer" : undefined}
                                        className="p-3 glass rounded-full text-white hover:text-accent-cyan hover:bg-white/10 transition-all duration-300"
                                    >
                                        <Icon size={20} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Instagram CTA */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="glass-panel p-8 md:p-12 rounded-3xl flex flex-col items-center justify-center text-center text-white"
                    >
                        <div className="w-20 h-20 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 rounded-2xl mb-6 flex items-center justify-center shadow-lg">
                            <Instagram size={40} className="text-white" />
                        </div>

                        <h3 className="text-2xl md:text-3xl font-bold mb-4">Chat on Instagram</h3>
                        <p className="text-gray-300 mb-8 max-w-md">
                            The quickest way to reach me! Send me a DM for bookings, collaborations, or just to say hi.
                        </p>

                        <a
                            href="https://www.instagram.com/ind_god_vkt"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full sm:w-auto px-8 py-4 bg-accent-cyan text-black font-bold rounded-full hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 transform hover:scale-105"
                        >
                            Send Message
                            <Send size={18} />
                        </a>
                    </motion.div>
                </div>
            </div>
        </section >
    );
}
