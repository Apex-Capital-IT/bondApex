"use client";

import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function SocialLinks() {
  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50 hidden md:block">
      <div className="flex flex-col gap-4 p-4">
        <motion.a
          href="https://www.facebook.com/ApexCapitalMN"
          whileHover={{ x: -10 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500/20 to-yellow-500/20 border border-white/30 shadow-lg hover:from-blue-500/30 hover:to-yellow-500/30 transition-all"
        >
          <Facebook size={20} className="text-gray-600" />
        </motion.a>

        <motion.a
          href="https://www.instagram.com/apexcapitalmn"
          whileHover={{ x: -10 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500/20 to-yellow-500/20 border border-white/30 shadow-lg hover:from-blue-500/30 hover:to-yellow-500/30 transition-all"
        >
          <Instagram size={20} className="text-gray-600" />
        </motion.a>

        <motion.a
          href="https://twitter.com/apexcapitalmn"
          whileHover={{ x: -10 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-r from-blue-500/20 to-yellow-500/20 border border-white/30 shadow-lg hover:from-blue-500/30 hover:to-yellow-500/30 transition-all"
        >
          <Twitter size={20} className="text-gray-600" />
        </motion.a>
      </div>
    </div>
  );
}
