"use client";

import { motion } from "framer-motion";
import { Anton } from "next/font/google";
import Navigation from "../components/Navigation";
import SocialLinks from "@/components/ui/social-links";
import LeftAdSection from "../components/LeftAdSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

export default function AboutPage() {
  return (
    <div className={`min-h-screen font-['Cormorant_Garamond'] flex flex-col ${anton.variable}`}>
      <div className="bg-white text-black overflow-hidden flex flex-col flex-1">
        <Navigation />

        <section className="relative min-h-screen w-full flex items-center justify-start">
          <div className="w-full min-h-screen bg-gradient-to-br from-[white] via-[#004a85] to-[#1782e0] pt-16 pb-12 flex items-center relative">
            <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-white via-[#1782e0]/90 to-transparent"></div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-8">
                  Бидний тухай
                </h1>

                <div className="space-y-6 text-white/90 text-lg md:text-xl">
                  <p>
                    Бид санхүүгийн зах зээлд шинэлэг шийдэл санал болгож, хөрөнгө оруулагчдад
                    уян хатан, найдвартай санхүүгийн хэрэгсэл санал болгож байна.
                  </p>

                  <p>
                    Манай платформ нь хөрөнгө оруулагчдад богино хугацаанд өндөр өгөөжтэй
                    бондод хөрөнгө оруулах боломжийг олгож, санхүүгийн зах зээлийг илүү
                    хүртээмжтэй болгох зорилготой.
                  </p>

                  <p>
                    Бид технологийн шийдэл, санхүүгийн мэргэжлийн багаас бүрдсэн багтайгаа
                    хамт таны санхүүгийн зорилгод хүрэхэд туслахад бэлэн байна.
                  </p>
                </div>

                <div className="mt-12">
                  <Link href="/">
                    <Button
                      className="bg-white text-[#1782e0] hover:bg-white/90 px-8 py-6 text-lg font-semibold rounded-full shadow-sm transition-colors flex items-center gap-2"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      Нүүр хуудас руу буцах
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SocialLinks />
        <LeftAdSection />
      </div>
    </div>
  );
} 