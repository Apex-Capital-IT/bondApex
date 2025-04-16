"use client";

import { motion } from "framer-motion";
import { Anton } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

export default function ComingSoonPage() {
  return (
    <div className="min-h-screen bg-white text-black relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute bottom-0 right-0 z-0 w-[400px] h-[500px]">
        <Image
          src="/coin.png"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 flex justify-between items-center p-6 md:px-28 md:p-6 bg-white/10 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2 text-black">
          <ArrowLeft className="w-5 h-5" />
          <span>Буцах</span>
        </Link>
        <Image alt="Hydrogen Bond" width={105} height={105} src={"/Logo.svg"} />
      </nav>

      {/* Main Content */}
      <main className="relative z-10 min-h-screen flex items-center justify-center px-6 md:px-28">
        <div className="max-w-4xl w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-5xl p-2 md:text-6xl font-bold mb-6 font-[var(--font-anton)] text-transparent h-fit bg-clip-text bg-gradient-to-r from-blue-500/40 to-yellow-500/40">
              Coming soon
            </h1>

            <div className="flex justify-center gap-4">
              <a
                href="https://www.facebook.com/apexcapital.mn"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-gradient-to-r from-blue-500/40 to-yellow-500/40 text-white rounded-lg transition-colors"
              >
                Facebook
              </a>
              <a
                href="tel:75107500"
                className="px-6 py-3 bg-gradient-to-r from-blue-500/40 to-yellow-500/40 text-white rounded-lg transition-colors"
              >
                75107500
              </a>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
