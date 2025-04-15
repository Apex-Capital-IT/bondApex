"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef, useEffect } from "react";

export default function GlassySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, {
    amount: 0.5, // Trigger when 50% of the section is in view
    once: true, // Only trigger once
  });

  useEffect(() => {
    if (isInView && sectionRef.current) {
      // Get the section's position and dimensions
      const section = sectionRef.current;
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      // Scroll to the end of the section smoothly
      window.scrollTo({
        top: sectionTop + sectionHeight,
        behavior: "smooth",
      });
    }
  }, [isInView]);

  const containerVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      ref={sectionRef}
      className="min-h-screen relative bg-container bg-no-repeat bg-right-bottom"
      style={{
        backgroundImage: "url('/coin.png')",
      }}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {/* Overlay for better text visibility */}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16  relative z-10">
        <div className="flex flex-col items-center mt-[200px] gap-12">
          {/* Top Content */}
          <motion.div
            className="text-center text-black/80"
            variants={itemVariants}
          >
            <h1 className="text-6xl font-bold mb-6">Apex capital</h1>
            <p className="text-xl text-black/70 mb-8">
              Дээр арилжаалагдаж буй богино хугацаат бондын төрлүүд
            </p>
          </motion.div>

          {/* Cards Section */}
          <motion.div className="w-full max-w-4xl" variants={itemVariants}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1 - Bond 1 */}
              <Link href="/bond/1">
                <motion.div
                  className="p-6 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/30 shadow-xl"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 mb-4 rounded-full bg-gradient-to-r from-blue-500/20 to-yellow-500/20 backdrop-blur-xl flex items-center justify-center shadow-lg">
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
                  <h3 className="text-xl font-semibold text-black/70 mb-4">
                    Бонд-1
                  </h3>
                  <div className="space-y-2 text-black/80">
                    <p className="flex justify-between">
                      <span>Төрөл:</span>
                      <span className="font-medium">Хаалттай</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Хүү:</span>
                      <span className="font-medium">19%</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Хүү төлөлт:</span>
                      <span className="font-medium">Сар тутам</span>
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

              {/* Card 2 - Bond 2 */}
              <Link href="/bond/2">
                <motion.div
                  className="p-6 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/30 shadow-xl"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 mb-4 rounded-full bg-gradient-to-r from-blue-500/20 to-yellow-500/20 backdrop-blur-xl flex items-center justify-center shadow-lg">
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
                  <h3 className="text-xl font-semibold text-black/70 mb-4">
                    Бонд-2
                  </h3>
                  <div className="space-y-2 text-black/80">
                    <p className="flex justify-between">
                      <span>Төрөл:</span>
                      <span className="font-medium">Хаалттай</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Хүү:</span>
                      <span className="font-medium">19.5%</span>
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

              {/* Card 3 - Bond 3 */}
              <Link href="/bond/3">
                <motion.div
                  className="p-6 rounded-2xl bg-white/10 backdrop-blur-2xl border border-white/30 shadow-xl"
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-12 h-12 mb-4 rounded-full bg-gradient-to-r from-blue-500/20 to-yellow-500/20 backdrop-blur-xl flex items-center justify-center shadow-lg">
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
                  <h3 className="text-xl font-semibold text-black/70 mb-4">
                    Бонд-3
                  </h3>
                  <div className="space-y-2 text-black/80">
                    <p className="flex justify-between">
                      <span>Төрөл:</span>
                      <span className="font-medium">Хаалттай</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Хүү:</span>
                      <span className="font-medium">19%</span>
                    </p>
                    <p className="flex justify-between">
                      <span>Хүү төлөлт:</span>
                      <span className="font-medium">Хагас жил тутам</span>
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
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
