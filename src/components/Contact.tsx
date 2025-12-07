"use client";

import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook, Send } from "lucide-react";
import { useState } from "react";

export default function Contact() {
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        phone: "",
        type: "",
        date: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log(formState);
        alert("Message sent! (Demo only)");
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    return (
        <section id="contact" className="py-20 md:py-32 relative">
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
                            Whether you're planning a wedding, need a portfolio update, or want to collaborate on a creative project,
                            I'd love to hear from you.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4">
                                <div className="p-3 glass rounded-full text-accent-cyan">
                                    <Mail size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold mb-1">Email</h4>
                                    <p className="text-gray-400">hello@vikusingh.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 glass rounded-full text-accent-cyan">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold mb-1">Phone</h4>
                                    <p className="text-gray-400">+1 (555) 123-4567</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="p-3 glass rounded-full text-accent-cyan">
                                    <MapPin size={24} />
                                </div>
                                <div>
                                    <h4 className="text-white font-semibold mb-1">Studio</h4>
                                    <p className="text-gray-400">123 Creative Ave, New York, NY 10012</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12">
                            <h4 className="text-white font-semibold mb-4">Follow Me</h4>
                            <div className="flex gap-4">
                                {[Instagram, Twitter, Facebook].map((Icon, index) => (
                                    <a
                                        key={index}
                                        href="#"
                                        className="p-3 glass rounded-full text-white hover:text-accent-cyan hover:bg-white/10 transition-all duration-300"
                                    >
                                        <Icon size={20} />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="glass-panel p-8 md:p-10 rounded-3xl"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400 uppercase tracking-wider">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-cyan focus:bg-white/10 transition-all"
                                        placeholder="John Doe"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400 uppercase tracking-wider">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-cyan focus:bg-white/10 transition-all"
                                        placeholder="john@example.com"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400 uppercase tracking-wider">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-cyan focus:bg-white/10 transition-all"
                                        placeholder="+1 (555) 000-0000"
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-400 uppercase tracking-wider">Shoot Type</label>
                                    <select
                                        name="type"
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-cyan focus:bg-white/10 transition-all appearance-none"
                                        onChange={handleChange}
                                    >
                                        <option value="" className="bg-gray-900">Select Type</option>
                                        <option value="wedding" className="bg-gray-900">Wedding</option>
                                        <option value="portrait" className="bg-gray-900">Portrait</option>
                                        <option value="fashion" className="bg-gray-900">Fashion</option>
                                        <option value="event" className="bg-gray-900">Event</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 uppercase tracking-wider">Preferred Date</label>
                                <input
                                    type="date"
                                    name="date"
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-cyan focus:bg-white/10 transition-all"
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-gray-400 uppercase tracking-wider">Message</label>
                                <textarea
                                    name="message"
                                    rows={4}
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent-cyan focus:bg-white/10 transition-all resize-none"
                                    placeholder="Tell me about your project..."
                                    onChange={handleChange}
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-accent-cyan text-black font-bold rounded-lg hover:bg-cyan-400 transition-colors flex items-center justify-center gap-2"
                            >
                                Send Message
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
