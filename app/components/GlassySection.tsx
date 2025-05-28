"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";

interface BondDetails {
  title: string;
  description: string;
  features: string[];
}

interface BondDetailsMap {
  [key: number]: BondDetails;
}

interface GlassySectionProps {
  ref: React.RefObject<HTMLDivElement>;
}

export default function GlassySection({ ref }: GlassySectionProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredBond, setHoveredBond] = useState<number | null>(null);

  const handleMouseMove = (e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const bondDetails: BondDetailsMap = {
    1: {
      title: "Домог Импекс",
      description: "Улирал тутам хүү төлөлттэй, 12 сарын хугацаатай хаалттай бонд",
      features: [
        "Өндөр хүүтэй",
        "Тогтвортой орлого",
        "Хаалттай хөрөнгө оруулалт",
      ],
    },
    2: {
      title: "ЦБОН",
      description: "Улирал тутам хүү төлөлттэй, 18 сарын хугацаатай хаалттай бонд",
      features: [
        "Өндөр хүүтэй",
        "Тогтвортой орлого",
        "Хаалттай хөрөнгө оруулалт",
      ],
    },
  };

  return (
    <div
      ref={ref}
      className="min-h-screen relative bg-container bg-no-repeat bg-right-bottom"
      style={{
        backgroundImage: "url('/coin.png')",
      }}
    >
      {/* Hover Detail Panel - Only show on desktop */}
      {hoveredBond && (
        <motion.div
          className="fixed pointer-events-none z-50 px-4 py-2 rounded-full  bg-gradient-to-br from-[white] via-[#004a85] to-[#1782e0]/70 border border-white/30 shadow-2xl hidden md:block"
          style={{
            left: mousePosition.x - 40,
            top: mousePosition.y - 20,
            transform: "translate(-50%, -50%)",
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <span className="text-white font-medium">Танилцах ?</span>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col items-center mt-[200px] gap-12">
          {/* Top Content */}
          <div className="text-center text-black/80">
            <h1 className="text-7xl font-bold mb-6">Apex capital</h1>
            <p className="text-2xl text-black/70 font-bold font-['Cormorant_Garamond'] mb-8">
              Дээр арилжаалагдаж буй богино хугацаат бондын төрлүүд
            </p>
          </div>

          {/* Cards Section */}
          <div className="w-full font-['Cormorant_Garamond'] max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1 - Домог Импекс */}
              <Link href="/bond/1">
                <motion.div
                  className="p-6 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/30 shadow-xl cursor-none"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  onMouseEnter={() => setHoveredBond(1)}
                  onMouseLeave={() => setHoveredBond(null)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500/20 to-yellow-500/20 backdrop-blur-xl flex items-center justify-center shadow-lg">
                      <svg
                        className="w-6 h-6 text-black/70"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <text
                          x="50%"
                          y="50%"
                          dominantBaseline="middle"
                          textAnchor="middle"
                          fontSize="20"
                          fontWeight="bold"
                        >
                          ₮
                        </text>
                      </svg>
                    </div>
                    <div className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-yellow-500/20 backdrop-blur-xl shadow-lg md:hidden">
                      <span className="text-black/80 font-medium">
                        Танилцах ?
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-black/70 mb-4">
                    Домог Импекс
                  </h3>
                  <div className="space-y-2 font-semibold text-black/80">
                    <p className="flex justify-between">
                      <span>Төрөл:</span>
                      <span className="font-medium">Хаалттай</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Хүү:</span>
                      <span className="font-medium">19.0%</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Хүү төлөлт:</span>
                      <span className="font-medium">Улирал тутам</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Хугацаа:</span>
                      <span className="font-medium">12 сар</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Нэрлэсэн үнэ:</span>
                      <span className="font-medium">₮1,000,000</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Доод хэмжээ:</span>
                      <span className="font-medium">₮5,000,000</span>
                    </p>
                  </div>
                </motion.div>
              </Link>

              {/* Card 2 - ЦБОН */}
              <Link href="/bond/2">
                <motion.div
                  className="p-6 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/30 shadow-xl cursor-none"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                  onMouseEnter={() => setHoveredBond(2)}
                  onMouseLeave={() => setHoveredBond(null)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500/20 to-yellow-500/20 backdrop-blur-xl flex items-center justify-center shadow-lg">
                      <svg
                        className="w-6 h-6 text-black/70"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <text
                          x="50%"
                          y="50%"
                          dominantBaseline="middle"
                          textAnchor="middle"
                          fontSize="20"
                          fontWeight="bold"
                        >
                          ₮
                        </text>
                      </svg>
                    </div>
                    <div className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-yellow-500/20 backdrop-blur-xl shadow-lg md:hidden">
                      <span className="text-black/80 font-medium">
                        Танилцах ?
                      </span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-black/70 mb-4">
                    ЦБОН
                  </h3>
                  <div className="space-y-2 font-semibold text-black/80">
                    <p className="flex justify-between">
                      <span>Төрөл:</span>
                      <span className="font-medium">Хаалттай</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Хүү:</span>
                      <span className="font-medium">20.5%</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Хүү төлөлт:</span>
                      <span className="font-medium">Улирал тутам</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Хугацаа:</span>
                      <span className="font-medium">18 сар</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Нэрлэсэн үнэ:</span>
                      <span className="font-medium">₮1,000,000</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Доод хэмжээ:</span>
                      <span className="font-medium">₮5,000,000</span>
                    </p>
                  </div>
                </motion.div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
