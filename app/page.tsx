"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import GlassySection from "./components/GlassySection";
import { Anton } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import SocialLinks from "@/components/ui/social-links";
import LeftAdSection from "./components/LeftAdSection";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Navigation from "./components/Navigation";
import { Button } from "@/components/ui/button";
import AboutSection from "./components/AboutSection";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

export default function Home() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const nextSectionRef = useRef<HTMLDivElement>(null);

  const scrollToNextSection = () => {
    nextSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div
      className={`min-h-screen font-['Cormorant_Garamond'] flex flex-col ${anton.variable}`}
    >
      <div className="bg-white text-black overflow-hidden flex flex-col flex-1">
        <Navigation />

        <section className="relative h-screen w-full flex items-center justify-start">
          <div className="w-full h-screen bg-gradient-to-bl from-[#6ab7f7] via-[#1c88e8]/90 to-[#1c88e8] pt-16 pb-12 flex items-center relative">
            <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-white via-[#1c88e8] to-transparent"></div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight max-w-4xl mb-6">
                  Хугацаа бага, боломж их.
                </h1>

                <p className="text-white/90 text-lg md:text-xl max-w-2xl mb-8">
                  Санхүүгийн хэрэглээндээ тохируулан богино хугацаанд уян хатан
                  бондод хөрөнгө оруулах боломж.
                </p>

                <Button
                  className="bg-white text-[#1782e0] hover:bg-white/90 px-8 py-6 text-lg font-semibold rounded-full shadow-sm transition-colors"
                  onClick={scrollToNextSection}
                >
                  Танилцах
                </Button>
              </div>
            </div>
          </div>
        </section>

        <AboutSection ref={nextSectionRef} />
        <GlassySection />

        <SocialLinks />
        <LeftAdSection />
      </div>
    </div>
  );
}
