"use client";

import Link from "next/link";
import { Instagram, Twitter, Facebook } from "lucide-react";

export default function Footer() {
    return (
        <footer className="py-8 border-t border-white/10 bg-black/40 backdrop-blur-md">
            <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-gray-400 text-sm">
                    &copy; {new Date().getFullYear()} Viku Singh Photography. All rights reserved.
                </div>

                <div className="flex items-center gap-6">
                    <Link href="#hero" className="text-gray-400 hover:text-white text-sm transition-colors">
                        Home
                    </Link>
                    <Link href="#portfolio" className="text-gray-400 hover:text-white text-sm transition-colors">
                        Portfolio
                    </Link>
                    <Link href="#contact" className="text-gray-400 hover:text-white text-sm transition-colors">
                        Contact
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                        <Instagram size={18} />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                        <Twitter size={18} />
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                        <Facebook size={18} />
                    </a>
                </div>
            </div>
        </footer>
    );
}
