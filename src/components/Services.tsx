"use client";

import { motion } from "framer-motion";
import { Camera, Heart, Users, Briefcase } from "lucide-react";

const services = [
    {
        icon: Heart,
        title: "Wedding Photography",
        description: "Capturing the magic of your special day with a blend of candid moments and artistic portraits.",
        price: "From $2,500",
    },
    {
        icon: Users,
        title: "Portrait & Headshots",
        description: "Professional portraits that reveal your personality. Perfect for actors, models, and corporate profiles.",
        price: "From $350",
    },
    {
        icon: Camera,
        title: "Fashion & Editorial",
        description: "High-end fashion photography for brands, magazines, and designers looking for a unique visual language.",
        price: "Custom Quote",
    },
    {
        icon: Briefcase,
        title: "Events & Commercial",
        description: "Dynamic coverage for corporate events, product launches, and brand campaigns.",
        price: "From $800",
    },
];

export default function Services() {
    return (
        <section id="services" className="py-20 md:py-32 relative">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent-purple/5 rounded-full blur-[120px] -z-10" />

            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-accent-cyan font-medium tracking-widest mb-2 uppercase">Services</h2>
                    <h3 className="text-3xl md:text-4xl font-bold text-white">What I Offer</h3>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="glass p-8 rounded-2xl glass-hover group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                <service.icon size={100} />
                            </div>

                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-accent-cyan/20 transition-colors">
                                    <service.icon className="text-white group-hover:text-accent-cyan transition-colors" size={28} />
                                </div>

                                <h4 className="text-xl font-bold text-white mb-3">{service.title}</h4>
                                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                    {service.description}
                                </p>

                                <div className="pt-6 border-t border-white/10">
                                    <p className="text-accent-cyan font-semibold">{service.price}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}