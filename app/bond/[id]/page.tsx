"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const bonds = [
  {
    id: "1",
    title: "БАЯЛАГ БҮТЭЭГЧ БОНД 1",
    features: [
      "Жилийн 19% хүүтэй",
      "12 сарын хугацаатай",
      "Сар тутам",
      "Хөрөнгө оруулалтын хамгаалалттай",
      "Нэрлэсэн үнэ: ₮1,000,000",
      "Нэгж үнэ: ₮5,000,000",
    ],
    image: "/BOND-1x1.png",
  },
  {
    id: "2",
    title: "БАЯЛАГ БҮТЭЭГЧ БОНД 2",
    features: [
      "Жилийн 19,5% хүүтэй",
      "12 сарын хугацаатай",
      "Улирал тутам",
      "Хөрөнгө оруулалтын хамгаалалттай",
      "Нэрлэсэн үнэ: ₮1,000,000",
      "Нэгж үнэ: ₮5,000,000",
    ],
    image: "/BOND-1x1.png",
  },
  {
    id: "3",
    title: "БАЯЛАГ БҮТЭЭГЧ БОНД 3",
    features: [
      "Жилийн 19% хүүтэй",
      "18 сарын хугацаатай",
      "Хагас жил тутам",
      "Хөрөнгө оруулалтын хамгаалалттай",
      "Нэрлэсэн үнэ: ₮1,000,000",
      "Нэгж үнэ: ₮5,000,000",
    ],
    image: "/BOND-1x1.png",
  },
];

export default function BondPage() {
  const params = useParams();
  const bond = bonds.find((b) => b.id === params.id);
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestStatus, setRequestStatus] = useState<"idle" | "success" | "error">("idle");
  const [requestId, setRequestId] = useState<string | null>(null);
  const { user } = useAuth();
  const router = useRouter();

  const handleRequest = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setIsRequesting(true);
    setRequestStatus("idle");
    
    try {
      const response = await fetch('/api/bond/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bondId: bond?.id,
          bondTitle: bond?.title,
          timestamp: new Date().toISOString(),
          userEmail: user.email,
        }),
      });

      const data = await response.json();
      console.log("Request response:", data);

      if (response.ok) {
        setRequestStatus("success");
        setRequestId(data.id);
      } else {
        setRequestStatus("error");
      }
    } catch (error) {
      console.error("Error submitting request:", error);
      setRequestStatus("error");
    } finally {
      setIsRequesting(false);
    }
  };

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
              className="mt-8 space-y-4"
            >
              <button 
                onClick={handleRequest}
                disabled={isRequesting}
                className="w-full md:w-auto bg-gradient-to-r from-blue-500/20 to-yellow-500/20 text-black py-3 px-8 rounded-lg hover:from-blue-500/30 hover:to-yellow-500/30 transition-all disabled:opacity-50"
              >
                {isRequesting ? "Илгээж байна..." : "Хөрөнгө оруулах"}
              </button>
              
              {requestStatus === "success" && (
                <p className="text-green-600 text-center">Хүсэлт амжилттай илгээгдлээ</p>
              )}
              {requestStatus === "error" && (
                <p className="text-red-600 text-center">Алдаа гарлаа. Дахин оролдоно уу</p>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
