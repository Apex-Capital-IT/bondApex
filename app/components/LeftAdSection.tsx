"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Youtube, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function LeftAdSection() {
  const [showDetail, setShowDetail] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (detailRef.current && !detailRef.current.contains(event.target as Node)) {
        setShowDetail(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed left-0 md:top-1/2 md:-translate-y-1/2 bottom-0 md:bottom-auto z-50 p-4">
      <motion.div
        whileHover={{ x: 10 }}
        whileTap={{ scale: 0.95 }}
        className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500/20 to-yellow-500/20 hover:from-blue-500/30 hover:to-yellow-500/30 border border-white/30 shadow-lg transition-all overflow-visible"
      >
        <div
          className="w-full h-full flex items-center justify-center cursor-pointer"
          onClick={() => {
            if (window.innerWidth < 768) {
              setShowDetail(!showDetail);
            }
          }}
        >
          <Youtube size={24} className="text-gray-600" />
        </div>
        <div className="absolute -left-2 top-1/2 -translate-y-1/2 hidden md:group-hover:block transition-all duration-300 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center justify-center w-24 h-32 md:w-[100px] md:h-[160px] rounded-2xl bg-gradient-to-r from-blue-500/20 to-yellow-500/20 border border-white/30 shadow-lg overflow-hidden relative"
          >
            <div className="relative w-full h-full">
              <Image
                src="/BOND-1x1.png"
                alt="Advertisement"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
                <Link
                  target="blank"
                  href="https://www.youtube.com/@ApexCapitalLLC"
                  className="bg-white/80 text-black px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium hover:bg-white transition-all"
                >
                  Заавар
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Mobile Detail View */}
      {showDetail && (
        <motion.div
          ref={detailRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="md:hidden absolute left-0 bottom-full mb-4 w-24 h-32 rounded-2xl bg-gradient-to-r from-blue-500/20 to-yellow-500/20 border border-white/30 shadow-lg overflow-hidden"
        >
          <div className="relative w-full h-full">
            <Image
              src="/BOND-1x1.png"
              alt="Advertisement"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
              <Link
                target="blank"
                href="https://www.youtube.com/@ApexCapitalLLC"
                className="bg-white/80 text-black px-3 py-1.5 rounded-full text-xs font-medium hover:bg-white transition-all"
              >
                Заавар
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
