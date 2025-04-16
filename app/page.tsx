"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import GlassySection from "./components/GlassySection";
import { Anton } from "next/font/google";
import { useEffect, useState } from "react";
import SocialLinks from "@/components/ui/social-links";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <div
        className={`min-h-screen bg-white text-black overflow-hidden flex flex-col ${anton.variable}`}
      >
        {/* Navigation */}
        <nav
          className={`fixed w-full top-0 z-50 flex justify-between items-center p-6 md:px-28 md:p-6 transition-all duration-300 backdrop-blur-md ${
            isScrolled ? "bg-white/80" : "bg-transparent"
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-black text-2xl font-bold"
          >
            <Image
              alt="Hydrogen Bond"
              width={105}
              height={105}
              src={"/Logo.svg"}
            />
          </motion.div>

          {/* Mobile menu button - only visible on small screens */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:hidden text-black p-2 rounded-md"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-menu"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            )}
          </motion.button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hidden md:flex items-center space-x-10 text-white"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link
                href="https://www.facebook.com/apexcapital.mn"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-yellow-500/20 backdrop-blur-xl border border-white/30 text-black/70 transition-all shadow-lg"
              >
                Contact us{" "}
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link
                href="coming-soon"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-yellow-500/20 backdrop-blur-xl border border-white/30 text-black/70 transition-all shadow-lg"
              >
                For business
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link
                href="https://www.facebook.com/apexcapital.mn"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-yellow-500/20 backdrop-blur-xl border border-white/30 text-black/70 transition-all shadow-lg"
              >
                About us
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="hidden md:flex space-x-3"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 0 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link
                href="/coming-soon"
                className="px-4 py-2 rounded-full font-medium bg-gradient-to-r from-blue-500/20 to-yellow-500/20 backdrop-blur-xl border border-white/30 text-black/70 transition-all shadow-lg"
              >
                Бүртгүүлэх
              </Link>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05, rotate: 0 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Link
                href="/coming-soon"
                className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-yellow-500/20 backdrop-blur-xl border border-white/30 text-black/70 transition-all shadow-lg"
              >
                Нэвтрэх
              </Link>
            </motion.div>
          </motion.div>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed top-[80px] left-0 right-0 bg-white/95 backdrop-blur-md z-40 shadow-lg"
          >
            <div className="flex flex-col items-center space-y-4 py-6">
              <Link
                href="https://www.facebook.com/apexcapital.mn"
                className="px-4 py-2 w-4/5 text-center rounded-full bg-gradient-to-r from-blue-500/20 to-yellow-500/20 backdrop-blur-xl border border-white/30 text-black/70 transition-all shadow-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact us
              </Link>
              <Link
                href="coming-soon"
                className="px-4 py-2 w-4/5 text-center rounded-full bg-gradient-to-r from-blue-500/20 to-yellow-500/20 backdrop-blur-xl border border-white/30 text-black/70 transition-all shadow-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                For business
              </Link>
              <Link
                href="https://www.facebook.com/apexcapital.mn"
                className="px-4 py-2 w-4/5 text-center rounded-full bg-gradient-to-r from-blue-500/20 to-yellow-500/20 backdrop-blur-xl border border-white/30 text-black/70 transition-all shadow-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                About us
              </Link>
              <div className="flex flex-col space-y-3 w-4/5">
                <Link
                  href="/coming-soon"
                  className="px-4 py-2 text-center rounded-full font-medium bg-gradient-to-r from-blue-500/20 to-yellow-500/20 backdrop-blur-xl border border-white/30 text-black/70 transition-all shadow-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Бүртгүүлэх
                </Link>
                <Link
                  href="/coming-soon"
                  className="px-4 py-2 text-center rounded-full bg-gradient-to-r from-blue-500/20 to-yellow-500/20 backdrop-blur-xl border border-white/30 text-black/70 transition-all shadow-lg"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Нэвтрэх
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <main className="flex-1">
          <div className="relative flex-1 flex justify-start items-center">
            {/* Main Text */}
            <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-1 justify-end gap-4 items-center pointer-events-none">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="relative text-black text-6xl md:text-6xl font-bold leading-tight px-6 md:pl-[700px]"
              >
                <div className="relative z-20 p-4 md:p-8 rounded-2xl">
                  <div className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500/40 to-yellow-500/40 font-[var(--font-anton)] text-4xl md:text-7xl tracking-wider">
                    Хугацаа бага, боломж их.{" "}
                  </div>
                  <div className="text-black/80 text-base md:text-xl mt-4 font-medium">
                    Санхүүгийн хэрэглээндээ тохируулан богино хугацаанд уян
                    хатан бондод хөрөнгө оруулах боломж.
                  </div>
                </div>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.8,
                delay: 0.9,
                type: "spring",
                stiffness: 100,
              }}
              className="z-10 w-full flex justify-end h-screen items-end max-w-xl"
            >
              <Image
                src="Apex.png"
                alt="Hydrogen Bond"
                width={800}
                height={667}
                className="w-full h-[60vh] md:h-[80vh] object-contain"
                priority
              />
            </motion.div>
          </div>

          {/* Bottom Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.3 }}
            className="absolute bottom-[40px] z-20 left-1/2 md:left-[47%] -translate-x-1/2"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 0 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <button className="bg-gradient-to-r from-blue-500/20 to-yellow-500/20 backdrop-blur-xl border border-white/30 text-black/70 px-6 md:px-8 py-2 md:py-3 rounded-full flex items-center gap-3 hover:bg-white/30 transition-all shadow-lg">
                <Link href="/detail">
                  <span>Дэлгэрэнгүй</span>
                </Link>
                <motion.div
                  className="from-blue-500/20 to-yellow-500/20 rounded-full p-1"
                  whileHover={{ rotate: 90 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <ArrowRight className="w-4 h-4 text-black/70" />
                </motion.div>
              </button>
            </motion.div>
          </motion.div>
        </main>

        {/* Glassy Section */}
        <GlassySection />

        {/* Social Links */}
        <SocialLinks />
      </div>
    </div>
  );
}
