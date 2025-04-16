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

export default function DetailPage() {
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
      <main className="relative z-10 pt-32 px-6 md:px-28">
        <div className="max-w-4xl mb-12 mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 font-[var(--font-anton)] text-transparent h-fit bg-clip-text bg-gradient-to-r from-blue-500/40 to-yellow-500/40">
              Хугацаа бага, боломж их.
            </h1>
            <p className="text-xl text-black/80">
              Apex Capital богино хугацаат бонд
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl border-2 border-gradient-to-r from-blue-500/40 to-yellow-500/40">
              <div className="relative">
                <h2 className="text-2xl font-bold mb-4 text-black/90">
                  Богино хугацаат бонд гэж юу вэ?
                </h2>
                <p className="text-black/80">
                  Богино хугацаат бонд нь хөрөнгө оруулагчдад богино хугацаанд
                  өндөр өгөөж олох боломжийг олгодог санхүүгийн хэрэгсэл юм.
                  <li>Хүү – 15.0%-19.0%</li>
                  <li>Хугацаа – 1 сараас 11 сар хүртэлх </li>
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl border-2 border-gradient-to-r from-blue-500/40 to-yellow-500/40">
              <div className="relative">
                <h2 className="text-2xl font-bold mb-4 text-black/90">
                  Давуу талууд
                </h2>
                <ul className="space-y-4 text-black/80">
                  <li>
                    • Хүссэн үедээ буцаан худалдах боломжтой хөрвөх чадвар өндөр{" "}
                  </li>
                  <li>
                    • Богино хугацаанд ашиглахаар төлөвлөсөн хөрөнгөө үр
                    өгөөжтэй байршуулах{" "}
                  </li>
                  <li>• Мөнгөн урсгалын оновчтой удирдлага </li>
                </ul>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl border-2 border-gradient-to-r from-blue-500/40 to-yellow-500/40">
              <div className="relative">
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <a
                    href="https://www.facebook.com/apexcapital.mn"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto px-6 py-3 text-center text-sm sm:text-base bg-gradient-to-r from-blue-500/40 to-yellow-500/40 text-white rounded-lg transition-colors"
                  >
                    Мэдээлэл авах
                  </a>
                  <a
                    href="tel:75107500"
                    className="w-full sm:w-auto px-6 py-3 text-center text-sm sm:text-base bg-gradient-to-r from-blue-500/40 to-yellow-500/40 text-white rounded-lg transition-colors"
                  >
                    Холбогдох
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
