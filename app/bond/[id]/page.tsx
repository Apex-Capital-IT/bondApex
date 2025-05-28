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
import { format, addMonths, isWeekend, addDays, isSameMonth } from "date-fns";

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
  agreed: boolean;
  [key: string]: string | boolean; // Update index signature to include boolean
}

interface CalculationResult {
  date: string;
  days: number;
  interest: number;
  tax: number;
  principal: number;
  total: number;
}

const bonds: Bond[] = [
  {
    id: "1",
    title: "Домог Импекс",
    features: [
      "Жилийн 19.0% хүүтэй",
      "12 сарын хугацаатай",
      "Улирал тутам",
      "Хөрөнгө оруулалтын хамгаалалттай",
      "Нэрлэсэн үнэ: ₮1,000,000",
      "Нэгж үнэ: ₮5,000,000",
    ],
    image: "/BOND-1x1.png",
  },
  {
    id: "2",
    title: "ЦБОН",
    features: [
      "Жилийн 20.5% хүүтэй",
      "18 сарын хугацаатай",
      "Улирал тутам",
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
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [hasViewedTerms, setHasViewedTerms] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    registration: "",
    email: "",
    phone: "",
    price: "",
    agreed: false,
  });

  // New state for calculator
  const [calculatorData, setCalculatorData] = useState({
    amount: "",
    startDate: format(new Date(), "yyyy-MM-dd"),
    tax: "10",
  });
  const [calculationResults, setCalculationResults] = useState<
    CalculationResult[]
  >([]);
  const [showResults, setShowResults] = useState(false);

  // Function to get the last working day of a month
  const getLastWorkingDayOfMonth = (date: Date): Date => {
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    let currentDay = lastDay;

    // Keep going back until we find a working day
    while (isWeekend(currentDay)) {
      currentDay = addDays(currentDay, -1);
    }
    return currentDay;
  };

  // Function to calculate working days between two dates
  const getWorkingDays = (startDate: Date, endDate: Date): number => {
    let count = 0;
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      if (!isWeekend(currentDate)) {
        count++;
      }
      currentDate = addDays(currentDate, 1);
    }
    return count;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData((prevState) => ({ ...prevState, [id]: checked }));
    } else if (id === "price") {
      const cleanedValue = value.replace(/[^0-9]/g, "");
      const formattedValue = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setFormData((prevState) => ({ ...prevState, [id]: formattedValue }));
    } else {
      setFormData((prevState) => ({ ...prevState, [id]: value }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bond || !formData.agreed) {
      toast.error("Та нөхцөлүүдтэй танилцаж зөвшөөрөх шаардлагатай");
      return;
    }

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
          agreed: false,
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

  const isFormValid = () => {
    return (
      formData.name.trim() !== "" &&
      formData.registration.trim() !== "" &&
      formData.email.trim() !== "" &&
      formData.phone.trim() !== "" &&
      formData.price.trim() !== "" &&
      formData.agreed &&
      hasViewedTerms
    );
  };

  const handleCalculatorInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    if (name === "amount") {
      const cleanedValue = value.replace(/[^0-9]/g, "");
      const formattedValue = cleanedValue.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      setCalculatorData((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setCalculatorData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const calculateBond = () => {
    if (!bond) return;

    const amount = Number(calculatorData.amount.replace(/,/g, ""));
    const startDate = new Date(calculatorData.startDate);
    const taxRate = Number(calculatorData.tax) / 100;

    // Get interest rate from bond features
    const interestRateFeature = bond.features.find((f) => f.includes("хүүтэй"));
    const interestRate = interestRateFeature
      ? Number(interestRateFeature.match(/(\d+(?:\.\d+)?)/)?.[1] || "19") / 100
      : 0.19;

    // Get term from bond features
    const termFeature = bond.features.find((f) => f.includes("хугацаатай"));
    const termMonths = termFeature
      ? Number(termFeature.match(/(\d+)/)?.[1] || "12")
      : 12;

    // Get payment frequency
    const frequencyFeature = bond.features.find(
      (f) =>
        f.includes("Сар тутам") ||
        f.includes("Улирал тутам") ||
        f.includes("Хагас жил тутам")
    );
    const frequency = frequencyFeature?.includes("Сар тутам")
      ? 1
      : frequencyFeature?.includes("Улирал тутам")
      ? 3
      : 6;

    const results: CalculationResult[] = [];
    let currentDate = new Date(startDate);
    let remainingAmount = amount;

    for (let i = 0; i < termMonths / frequency; i++) {
      const paymentDate = getLastWorkingDayOfMonth(
        addMonths(startDate, (i + 1) * frequency)
      );
      const days = getWorkingDays(currentDate, paymentDate);

      const interest = (remainingAmount * interestRate * days) / 365;
      const tax = interest * taxRate;
      const principal = i === termMonths / frequency - 1 ? remainingAmount : 0;
      const total = interest - tax + principal;

      results.push({
        date: format(paymentDate, "M/d/yyyy"),
        days,
        interest,
        tax,
        principal,
        total,
      });

      currentDate = paymentDate;
    }

    setCalculationResults(results);
    setShowResults(true);
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
              <ArrowLeft className="mr-2" size={20} />
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

                {/* Bond Calculator */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.2 }}
                  className="mt-8 bg-white/10 backdrop-blur-sm p-6 rounded-2xl"
                >
                  <h2 className="text-2xl font-bold text-white mb-4">
                    Бонд тооцоолуур
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white mb-2">
                        Хөрөнгө оруулалтын дүн
                      </label>
                      <input
                        type="text"
                        name="amount"
                        value={calculatorData.amount}
                        onChange={handleCalculatorInputChange}
                        className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-white/50 focus:ring-2 focus:ring-white/20"
                        placeholder="Жишээ: 25,000,000"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2">
                        Эхлэх өдөр
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        value={calculatorData.startDate}
                        onChange={handleCalculatorInputChange}
                        className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-white/50 focus:ring-2 focus:ring-white/20"
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2">
                        Татвар (%)
                      </label>
                      <input
                        type="text"
                        name="tax"
                        value={calculatorData.tax}
                        onChange={handleCalculatorInputChange}
                        className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/50 border border-white/30 focus:border-white/50 focus:ring-2 focus:ring-white/20"
                      />
                    </div>
                    <div className="bg-white/20 p-4 rounded-lg">
                      <div className="flex justify-between items-center text-white">
                        <span>Хугацаа:</span>
                        <span className="font-semibold">
                          {bond?.features.find(f => f.includes("хугацаатай"))?.match(/(\d+)/)?.[1] || "12"} сар
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-white mt-2">
                        <span>Хүү:</span>
                        <span className="font-semibold">
                          {bond?.features.find(f => f.includes("хүүтэй"))?.match(/(\d+(?:\.\d+)?)/)?.[1] || "19"}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-white mt-2">
                        <span>Төлбөрийн давтамж:</span>
                        <span className="font-semibold">
                          {bond?.features.find(f => 
                            f.includes("Сар тутам") || 
                            f.includes("Улирал тутам") || 
                            f.includes("Хагас жил тутам")
                          )?.replace("Хагас жил тутам", "6 сар тутам") || "Сар тутам"}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={calculateBond}
                      className="w-full bg-white text-[#1782e0] hover:bg-white/90 px-6 py-3 text-lg font-semibold rounded-lg shadow-sm transition-colors"
                    >
                      Тооцоолол хийх
                    </button>
                  </div>
                </motion.div>

                {/* Calculation Results */}
                {showResults && calculationResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mt-8 bg-white/10 backdrop-blur-sm p-6 rounded-2xl overflow-x-auto"
                  >
                    <h2 className="text-2xl font-bold text-white mb-4">
                      Тооцооллын үр дүн
                    </h2>
                    <table className="w-full text-black">
                      <thead>
                        <tr>
                          <th className="p-2 text-left">№</th>
                          <th className="p-2 text-left">Огноо</th>
                          <th className="p-2 text-left">Хоног</th>
                          <th className="p-2 text-left">Хүүгийн төлбөр</th>
                          <th className="p-2 text-left">
                            Татвар суутгасан дүн
                          </th>
                          <th className="p-2 text-left">Үндсэн төлбөр</th>
                          <th className="p-2 text-left">Нийт дүн</th>
                        </tr>
                      </thead>
                      <tbody>
                        {calculationResults.map((result, index) => (
                          <tr key={index} className="border-t border-white/20">
                            <td className="p-2">{index + 1}</td>
                            <td className="p-2">{result.date}</td>
                            <td className="p-2">{result.days}</td>
                            <td className="p-2">
                              {result.interest.toLocaleString()}
                            </td>
                            <td className="p-2">
                              {result.tax.toLocaleString()}
                            </td>
                            <td className="p-2">
                              {index === calculationResults.length - 1 
                                ? Number(calculatorData.amount.replace(/,/g, "")).toLocaleString()
                                : "0"}
                            </td>
                            <td className="p-2">
                              {result.total.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                        <tr className="border-t border-white/20 font-bold">
                          <td className="p-2" colSpan={2}>
                            Нийт
                          </td>
                          <td className="p-2">
                            {calculationResults.reduce(
                              (sum, r) => sum + r.days,
                              0
                            )}
                          </td>
                          <td className="p-2">
                            {calculationResults
                              .reduce((sum, r) => sum + r.interest, 0)
                              .toLocaleString()}
                          </td>
                          <td className="p-2">
                            {calculationResults
                              .reduce((sum, r) => sum + r.tax, 0)
                              .toLocaleString()}
                          </td>
                          <td className="p-2">
                            {Number(
                              calculatorData.amount.replace(/,/g, "")
                            ).toLocaleString()}
                          </td>
                          <td className="p-2">
                            {calculationResults
                              .reduce((sum, r) => sum + r.total, 0)
                              .toLocaleString()}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Terms Modal */}
      {isTermsModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto relative"
          >
            <button
              onClick={() => {
                setIsTermsModalOpen(false);
                setHasViewedTerms(true);
              }}
              className="absolute top-4 right-4 text-2xl text-gray-600 hover:text-gray-900"
            >
              &times;
            </button>

            <h2 className="text-3xl font-bold mb-6 text-center font-[var(--font-anton)] text-transparent bg-clip-text bg-gradient-to-r from-blue-500/40 to-yellow-500/40">
              Нөхцөлүүд
            </h2>

            <div className="prose prose-lg max-w-none">
              <h3 className="text-xl font-semibold mb-4">
                Бонд худалдан авах нөхцөлүүд
              </h3>
              <p className="mb-4">
                1. Бонд худалдан авахдаа дараах нөхцөлүүдийг хүлээн зөвшөөрөх
                шаардлагатай:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Бонд нь хөрөнгө оруулалтын эрсдэлтэй бүтээгдэхүүн юм</li>
                <li>
                  Өмнөх гүйцэтгэл нь ирээдүйн гүйцэтгэлийг баталгаажуулахгүй
                </li>
                <li>
                  Хөрөнгө оруулалтын шийдвэрээ өөрийн эрсдэл, хариуцлагаар
                  гаргах
                </li>
                <li>Бүх мэдээллийг сайтар судлах</li>
              </ul>
              <p className="mb-4">
                2. Худалдан авахдаа дараах баримт бичгүүд шаардлагатай:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Иргэний үнэмлэхний хуулбар</li>
                <li>Регистрийн гэрчилгээ</li>
                <li>Худалдан авах хүсэлтийн маягт</li>
              </ul>
            </div>

            <div className="mt-8 flex justify-center">
              <button
                onClick={() => {
                  setIsTermsModalOpen(false);
                  setHasViewedTerms(true);
                  setFormData((prev) => ({ ...prev, agreed: true }));
                }}
                className="bg-gradient-to-r from-blue-500/20 to-yellow-500/20 text-black py-3 px-8 rounded-lg text-lg font-semibold transition-all hover:from-blue-500/30 hover:to-yellow-500/30"
              >
                Зөвшөөрч байна
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[90]">
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
                    value={formData[field.id] as string}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/20 transition-all"
                    required
                  />
                </div>
              ))}

              <div className="mb-6">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="agreed"
                    checked={formData.agreed}
                    onChange={handleInputChange}
                    disabled={!hasViewedTerms}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50"
                    required
                  />
                  <span className="text-sm text-gray-600">
                    Би{" "}
                    <button
                      type="button"
                      onClick={() => setIsTermsModalOpen(true)}
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      нөхцөлүүдтэй
                    </button>{" "}
                    танилцаж зөвшөөрч байна
                  </span>
                </label>
              </div>

              <motion.button
                type="submit"
                disabled={isRequesting || !isFormValid()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full bg-gradient-to-r from-blue-500/20 to-yellow-500/20 text-black py-4 px-6 rounded-lg text-lg font-semibold transition-all disabled:opacity-50 "
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
