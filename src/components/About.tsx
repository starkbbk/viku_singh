"use client";

import { motion } from "framer-motion";
import { Camera, MapPin, Award, Clock } from "lucide-react";
import Image from "next/image";

const stats = [
    { icon: Camera, label: "Shoots", value: "150+" },
    { icon: Clock, label: "Experience", value: "10+ Years" },
    { icon: Award, label: "Awards", value: "12" },
];

export default function About() {
    return (
        <section id="about" className="py-20 md:py-32 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-purple/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-cyan/10 rounded-full blur-[100px]" />
            </div>

            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="glass-panel rounded-3xl p-8 md:p-12"
                >
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        {/* Image Column */}
                        <div className="relative group">
                            <div className="relative h-[300px] md:h-[500px] w-full rounded-2xl overflow-hidden">
                                <Image
                                    src="/portfolio/35455759-90f9-47e3-a4d3-3f2f2dfc2136.JPG"
                                    alt="Viku Singh"
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            </div>

                            {/* Floating Badge */}
                            <div className="absolute -bottom-6 -right-6 glass-panel p-4 rounded-xl flex items-center gap-3 animate-bounce-slow">
                                <MapPin className="text-accent-cyan" />
                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">Based in</p>
                                    <p className="font-semibold">New York, NY</p>
                                </div>
                            </div>
                        </div>

                        {/* Text Column */}
                        <div>
                            <h2 className="text-accent-cyan font-medium tracking-widest mb-2 uppercase">About Me</h2>
                            <h3 className="text-3xl md:text-4xl font-bold mb-6">
                                Visual Storyteller & <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
                                    Light Chaser
                                </span>
                            </h3>

                            <div className="space-y-6 text-gray-300 leading-relaxed">
                                <p>
                                    Hello! I'm Viku, a photographer with a passion for capturing the raw beauty of life.
                                    My journey began over a decade ago when I picked up my first film camera, and I haven't
                                    stopped exploring since.
                                </p>
                                <p>
                                    I specialize in lifestyle, portrait, and editorial photography, focusing on natural light
                                    and genuine moments. My goal is to create images that not only look beautiful but also
                                    evoke deep emotion and tell a compelling story.
                                </p>
                            </div>

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10">
                                {stats.map((stat, index) => (
                                    <div key={index} className="glass p-4 rounded-xl text-center hover:bg-white/5 transition-colors">
                                        <stat.icon className="w-6 h-6 text-accent-cyan mx-auto mb-2" />
                                        <p className="text-xl font-bold text-white">{stat.value}</p>
                                        <p className="text-xs text-gray-400 uppercase tracking-wider">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
