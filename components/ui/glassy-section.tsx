"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function GlassySection() {
  return (
    <div className="relative w-full h-screen">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/80" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Link href="/bond/1">
              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 border border-white/30 shadow-lg cursor-pointer"
              >
                <h3 className="text-2xl font-bold mb-4">АВТО ЗЭЭЛИЙН БОНД</h3>
                <p className="text-gray-200 mb-6">
                  Автомашины зээлийн бонд нь автомашины зээлийн үйлчилгээний хөрөнгө оруулалтын боломжийг олгодог.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">15%</span>
                  <span className="text-sm">Жилийн хүү</span>
                </div>
              </motion.div>
            </Link>

            <Link href="/bond/2">
              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 border border-white/30 shadow-lg cursor-pointer"
              >
                <h3 className="text-2xl font-bold mb-4">ОРОН СУУЦНЫ БОНД</h3>
                <p className="text-gray-200 mb-6">
                  Орон сууцны бонд нь орон сууцны зээлийн үйлчилгээний хөрөнгө оруулалтын боломжийг олгодог.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">18%</span>
                  <span className="text-sm">Жилийн хүү</span>
                </div>
              </motion.div>
            </Link>

            <Link href="/bond/3">
              <motion.div
                whileHover={{ scale: 1.05, y: -10 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/20 backdrop-blur-lg rounded-2xl p-8 border border-white/30 shadow-lg cursor-pointer"
              >
                <h3 className="text-2xl font-bold mb-4">БИЗНЕС ЗЭЭЛИЙН БОНД</h3>
                <p className="text-gray-200 mb-6">
                  Бизнес зээлийн бонд нь бизнес зээлийн үйлчилгээний хөрөнгө оруулалтын боломжийг олгодог.
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">20%</span>
                  <span className="text-sm">Жилийн хүү</span>
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 