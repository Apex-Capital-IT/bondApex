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
import { Anton } from "next/font/google";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

interface Bond {
  id: string;
  title: string;
  features: string[];
  image: string;
}

interface FormData {
  name: string;
  registration: string;
  email: string;
  phone: string;
  price: string;
  [key: string]: string; // Add index signature
}

const bonds: Bond[] = [
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
  const [formData, setFormData] = useState<FormData>({
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
    if (!bond) return;

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
    <div
      className={`min-h-screen font-['Cormorant_Garamond'] flex flex-col ${anton.variable}`}
    >
      <div className="bg-white text-black overflow-hidden flex flex-col flex-1">
        <div className="w-full min-h-screen bg-gradient-to-br from-[white] via-[#004a85] to-[#1782e0] pt-16 pb-12 flex items-center relative">
          <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-white via-[#1782e0]/90 to-transparent"></div>
          <div className="container mx-auto px-4 relative z-10">
            <Link href="/" className="flex items-center text-black mb-8">
              <ArrowLeft className="mr-2 " size={20} />
              Буцах
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-12"
            >
              <div className="relative h-[400px] md:h-[600px] rounded-2xl overflow-hidden shadow-2xl">
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
                  className="text-4xl md:text-6xl font-black text-white mb-6"
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
                      <div className="w-2 h-2 rounded-full bg-white/50" />
                      <span className="text-white/90 text-lg">{feature}</span>
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
                    className="w-full md:w-auto bg-white text-[#1782e0] hover:bg-white/90 px-8 py-6 text-lg font-semibold rounded-full shadow-sm transition-colors disabled:opacity-50"
                  >
                    {isRequesting ? "Илгээж байна..." : "Форм бөглөх"}
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modal for Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg relative"
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-gray-900"
            >
              &times;
            </button>

            <h2 className="text-3xl font-bold mb-6 text-center font-[var(--font-anton)] text-transparent bg-clip-text bg-gradient-to-r from-blue-500/40 to-yellow-500/40">
              Мэдээлэл
            </h2>

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
                    className="block text-lg font-semibold text-gray-700"
                  >
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    id={field.id}
                    value={formData[field.id]}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20 transition-all"
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
                className="w-full bg-gradient-to-r from-blue-500/20 to-yellow-500/20 text-black py-4 px-6 rounded-lg text-lg font-semibold transition-all disabled:opacity-50 hover:from-blue-500/30 hover:to-yellow-500/30"
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
