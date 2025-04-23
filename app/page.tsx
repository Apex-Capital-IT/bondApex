"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import GlassySection from "./components/GlassySection";
import { Anton } from "next/font/google";
import { useEffect, useState } from "react";
import SocialLinks from "@/components/ui/social-links";
import LeftAdSection from "./components/LeftAdSection";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Navigation from "./components/Navigation";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen font-['Cormorant_Garamond']  flex flex-col">
      <div
        className={`min-h-screen bg-white text-black overflow-hidden flex flex-col ${anton.variable}`}
      >
        <Navigation />

        {/* Main Content */}
        <main className="flex-1">
          <div className="relative flex-1 flex justify-start items-center h-screen">
            {/* Main Text */}
            <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-1 justify-end gap-4 items-center pointer-events-none h-full">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7, delay: 0.5 }}
                className="absolute text-black text-4xl sm:text-5xl md:text-6xl mx-4 font-bold z-40 leading-tight px-4 sm:px-6 md:top-[40%] md:left-[30%] transform -translate-x-1/2 -translate-y-1/2 rounded-3xl bg-gray-100/50 backdrop-blur-[10px]"
              >
                <div className="relative z-20 p-4 sm:p-6 md:p-8 rounded-3xl">
                  <div className="text-transparent font-extrabold bg-clip-text bg-gradient-to-r from-black/70 to-black   text-3xl sm:text-4xl md:text-5xl lg:text-7xl tracking-wider">
                    Хугацаа бага, боломж их.{" "}
                  </div>
                  <div className="text-black/80  text-sm sm:text-base md:text-lg lg:text-xl mt-2 sm:mt-4 font-semibold">
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
              className="z-0 absolute inset-0 w-full h-screen"
            >
              <Image
                src="Cover.jpg"
                alt="Hydrogen Bond"
                fill
                className="object-cover bg-black/50"
                priority
              />
            </motion.div>
          </div>

          {/* Bottom Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.3 }}
            className="absolute bottom-[20px] sm:bottom-[30px] md:bottom-[40px] left-1/2 md:left-[47%] -translate-x-1/2"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 0 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <button className="bg-gradient-to-r from-blue-500/20 to-yellow-500/20 backdrop-blur-xl border border-white/30 text-black/70 px-4 sm:px-6 md:px-8 py-2 md:py-3 rounded-full flex items-center gap-2 sm:gap-3 hover:bg-white/30 transition-all shadow-lg">
                <Link href="/detail">
                  <span className="text-sm sm:text-base">Дэлгэрэнгүй</span>
                </Link>
                <motion.div
                  className="from-blue-500/20 to-yellow-500/20 rounded-full p-1"
                  whileHover={{ rotate: 90 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-black/70" />
                </motion.div>
              </button>
            </motion.div>
          </motion.div>
        </main>

        <SocialLinks />
        <LeftAdSection />
      </div>
      <GlassySection />
    </div>
  );
}
