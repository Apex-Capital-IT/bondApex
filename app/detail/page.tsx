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
    <div
      className={`h-screen bg-white text-black flex flex-col ${anton.variable}`}
    >
      {/* Background Image */}
      {/*
        <div className="absolute inset-0 z-0">
        <Image
          src="/coin.png"
          alt="Background"
          fill
          className="object-contain"
          priority
        />
      </div>
  */}

      {/* Navigation */}
      <nav className="fixed w-full top-0 z-20 flex justify-between items-center p-6 md:px-28 md:p-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-black hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Буцах</span>
        </Link>
        <Image alt="Hydrogen Bond" width={90} height={90} src={"/Logo.svg"} />
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-40 pb-10 px-6 md:px-28 flex-1 flex items-center justify-center">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start">
          {/* Left Section: Text Content and Price Card */}
          <div className="flex-1 md:pr-8">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-6xl md:text-8xl font-extrabold mb-8 text-black leading-tight font-anton"
            >
              Богино хугацаат <br /> бонд
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-xl text-gray-700 leading-relaxed max-w-2xl mb-16"
            >
              Санхүүгийн хэрэглээндээ тохируулан богино хугацаанд уян хатан
              бондод хөрөнгө оруулах боломж. Албан байгууллагууд болон хувь
              хүмүүс харилцах дансандаа хүүгүй байршиж буй мөнгөн хөрөнгөө
              хугацаагүй бондод байршуулснаар мөнгөн хөрөнгөө үр өгөөжтэйгээр
              оновчтой удирдах шийдэл юм.
            </motion.p>
          </div>

          {/* Right Section: Давуу тал and Holbogdoh */}
          <div className="flex-1 flex flex-col justify-end h-full pb-20 md:pb-0">
            {/* Нөхцөл items styled like features - Moved to the right */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              <div className="flex flex-col gap-2">
                <label className="text-gray-600 text-lg">Хүү</label>
                <div className="bg-white p-4 rounded-lg shadow-sm text-gray-900 text-lg">
                  15.0% - 19.0%
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-600 text-lg">Хугацаа</label>
                <div className="bg-white p-4 rounded-lg shadow-sm text-gray-900 text-lg">
                  7 хоногоос 12 сар хүртэлх
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-600 text-lg">Доод дүн</label>
                <div className="bg-white p-4 rounded-lg shadow-sm text-gray-900 text-lg">
                  50 сая төгрөг
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-600 text-lg">
                  Хөрвөх чадвар өндөр
                </label>
                <div className="bg-white p-4 rounded-lg shadow-sm text-gray-900 text-lg">
                  Хүссэн үедээ буцаан худалдах боломжтой
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-600 text-lg">Өгөөж хүртэх</label>
                <div className="bg-white p-4 rounded-lg shadow-sm text-gray-900 text-lg">
                  Богино хугацаанд ашиглахаар төлөвлөсөн хөрөнгөөс
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-gray-600 text-lg">
                  Хүү бодох нөхцөлтэй
                </label>
                <div className="bg-white p-4 rounded-lg shadow-sm text-gray-900 text-lg">
                  Эзэмжсэн 1 хоногт ч
                </div>
              </div>

              {/* Холбогдох links - styled similarly */}
              <div className="flex flex-col gap-2">
                <label className="text-gray-600 text-lg">Мэдээлэл авах</label>
                <a
                  href="https://www.facebook.com/apexcapital.mn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-700 text-lg underline hover:no-underline"
                >
                  <div className="bg-white p-4 rounded-lg shadow-sm text-gray-900 text-lg">
                    Facebook
                  </div>
                </a>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-gray-600 text-lg">Холбогдох</label>
                <a
                  href="tel:75107500"
                  className="text-gray-700 text-lg underline hover:no-underline"
                >
                  <div className="bg-white p-4 rounded-lg shadow-sm text-gray-900 text-lg">
                    75107500
                  </div>
                </a>
              </div>
            </motion.div>

            {/* Horizontal features like in the image */}
          </div>
        </div>
      </main>
    </div>
  );
}
