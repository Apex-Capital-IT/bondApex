"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const { user } = useAuth();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    registration: "",
    email: "",
    phone: "",
    price: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    if (id === "price") {
      const cleanedValue = value.replace(/[^0-9]/g, "");
      const formattedValue = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setFormData((prevState) => ({ ...prevState, [id]: formattedValue }));
    } else {
      setFormData((prevState) => ({ ...prevState, [id]: value }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRequesting(true);

    const nominalPrice = bond.features.find((feature) =>
      feature.includes("Нэрлэсэн үнэ:")
    );
    const unitPrice = bond.features.find((feature) =>
      feature.includes("Нэгж үнэ:")
    );

    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          bondId: bond.id,
          bondTitle: bond.title,
          bondFeatures: bond.features,
          bondImage: bond.image,
          nominalPrice,
          unitPrice,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        toast.success("Хүсэлт амжилттай илгээгдлээ");
        setFormData({
          name: "",
          registration: "",
          email: "",
          phone: "",
          price: "",
        });
        setIsModalOpen(false);
      } else {
        toast.error("Алдаа гарлаа. Дахин оролдоно уу");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Алдаа гарлаа. Дахин оролдоно уу");
    } finally {
      setIsRequesting(false);
    }
  };

  const handleRequest = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    setIsModalOpen(true);
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
                {isRequesting ? "Илгээж байна..." : "Форм бөглөх"}
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Modal for Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg relative"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-2xl text-gray-600 hover:text-gray-900"
            >
              &times;
            </button>

            <h2 className="text-2xl font-bold mb-6 text-center">Мэдээлэл</h2>

            <form onSubmit={handleFormSubmit}>
              {[
                { label: "Нэр", id: "name", type: "text" },
                { label: "Регистр", id: "registration", type: "text" },
                { label: "Мэйл", id: "email", type: "email" },
                { label: "Утасны дугаар", id: "phone", type: "text" },
                { label: "Үнийн дүн", id: "price", type: "text" },
              ].map((field) => (
                <div key={field.id} className="mb-4">
                  <label
                    htmlFor={field.id}
                    className="block text-lg font-semibold"
                  >
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    id={field.id}
                    value={formData[field.id]}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              ))}

              <motion.button
                type="submit"
                disabled={isRequesting}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full bg-gradient-to-r from-blue-500/20 to-yellow-500/20 text-black py-3 px-6 rounded-md transition-all disabled:opacity-50"
              >
                {isRequesting ? "Илгээж байна..." : "Илгээх"}
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
}
