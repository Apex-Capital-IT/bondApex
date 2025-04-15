"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";

const bonds = [
  {
    id: "1",
    title: "АВТО ЗЭЭЛИЙН БОНД",
    description:
      "Автомашины зээлийн бонд нь автомашины зээлийн үйлчилгээний хөрөнгө оруулалтын боломжийг олгодог. Энэхүү бонд нь автомашины зээлийн үйлчилгээний хөрөнгө оруулалтын боломжийг олгодог.",
    features: [
      "Жилийн 15% хүүтэй",
      "3 жилийн хугацаатай",
      "Сарын төлбөртэй",
      "Хөрөнгө оруулалтын хамгаалалттай",
    ],
    image: "/BOND-1x1.png",
  },
  {
    id: "2",
    title: "ОРОН СУУЦНЫ БОНД",
    description:
      "Орон сууцны бонд нь орон сууцны зээлийн үйлчилгээний хөрөнгө оруулалтын боломжийг олгодог. Энэхүү бонд нь орон сууцны зээлийн үйлчилгээний хөрөнгө оруулалтын боломжийг олгодог.",
    features: [
      "Жилийн 18% хүүтэй",
      "5 жилийн хугацаатай",
      "Сарын төлбөртэй",
      "Хөрөнгө оруулалтын хамгаалалттай",
    ],
    image: "/BOND-1x1.png",
  },
  {
    id: "3",
    title: "БИЗНЕС ЗЭЭЛИЙН БОНД",
    description:
      "Бизнес зээлийн бонд нь бизнес зээлийн үйлчилгээний хөрөнгө оруулалтын боломжийг олгодог. Энэхүү бонд нь бизнес зээлийн үйлчилгээний хөрөнгө оруулалтын боломжийг олгодог.",
    features: [
      "Жилийн 20% хүүтэй",
      "7 жилийн хугацаатай",
      "Сарын төлбөртэй",
      "Хөрөнгө оруулалтын хамгаалалттай",
    ],
    image: "/BOND-1x1.png",
  },
];

export default function BondPage() {
  const params = useParams();
  const bond = bonds.find((b) => b.id === params.id);

  if (!bond) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-2xl font-bold">Бонд олдсонгүй</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
        >
          <ArrowLeft className="mr-2" size={20} />
          Буцах
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-12"
        >
          <div className="relative h-[400px] md:h-[600px] rounded-xl overflow-hidden">
            <Image
              src={bond.image}
              alt={bond.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="flex flex-col justify-center">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl font-bold mb-6"
            >
              {bond.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-gray-600 mb-8"
            >
              {bond.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="space-y-4"
            >
              {bond.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500/20 to-yellow-500/20" />
                  <span className="text-gray-700">{feature}</span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
              className="mt-8"
            >
              <button className="w-full md:w-auto bg-gradient-to-r from-blue-500/20 to-yellow-500/20 text-black py-3 px-8 rounded-lg hover:from-blue-500/30 hover:to-yellow-500/30 transition-all">
                Хөрөнгө оруулах
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
