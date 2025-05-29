"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Simple Modal Component
function DbxModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl p-8 shadow-xl relative min-w-[320px] text-center">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-800 text-xl"
          onClick={onClose}
          aria-label="close"
        >
          ×
        </button>
        <div className="mb-5 text-lg font-semibold text-gray-800">
          Энэ и-мэйл dbx системд бүртгэлгүй байна
        </div>
        <p className="mb-6 text-gray-600 text-sm">
          Хэрэв танд dbx системд бүртгэл байхгүй бол <br />
          доорх товчийг дарж dbx.apex.mn рүү орно уу.
        </p>
        <a
          href="https://dbx.apex.mn"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
        >
          DBX систем рүү очих
        </a>
      </div>
    </div>
  );
}

export default function SignupPage() {
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
    userType: "huvi_hun",
    dugaar: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState({
    lastName: "",
    firstName: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
    dugaar: "",
    phoneNumber: "",
  });
  const [excelNames, setExcelNames] = useState<{
    lastName: string;
    firstName: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDbxModal, setShowDbxModal] = useState(false); // NEW STATE
  const router = useRouter();

  // Email validation
  const validateEmail = (email: string) => {
    if (!email) return "И-мэйл хаяг оруулна уу";
    if (!email.includes("@"))
      return "И-мэйл хаяг @ тэмдэгт агуулсан байх ёстой";
    if (!email.includes("."))
      return "И-мэйл хаяг . тэмдэгт агуулсан байх ёстой";
    return "";
  };

  // Form validation
  const validateForm = () => {
    if (formData.userType === "baiguullaga") {
      const newErrors = {
        lastName: "",
        firstName: "",
        email: "",
        password: "",
        confirmPassword: "",
        otp: "",
        dugaar: !formData.dugaar ? "Дугаар оруулна уу" : "",
        phoneNumber: "",
      };
      setErrors(newErrors);
      return !Object.values(newErrors).some((error) => error);
    }

    const newErrors = {
      lastName: !formData.lastName ? "Овог оруулна уу" : "",
      firstName: !formData.firstName ? "Нэр оруулна уу" : "",
      email: validateEmail(formData.email),
      password: !formData.password
        ? "Нууц үг оруулна уу"
        : formData.password.length < 8
        ? "Нууц үг хамгийн багадаа 8 тэмдэгт байх ёстой"
        : "",
      confirmPassword:
        formData.password !== formData.confirmPassword
          ? "Нууц үг таарахгүй байна"
          : "",
      otp: showOTP && !formData.otp ? "OTP код оруулна уу" : "",
      dugaar: "",
      phoneNumber: !formData.phoneNumber
        ? "Утасны дугаар оруулна уу"
        : formData.phoneNumber.length !== 8
        ? "Утасны дугаар 8 оронтой байх ёстой"
        : !/^\d+$/.test(formData.phoneNumber)
        ? "Утасны дугаар зөвхөн тооноос бүрдэх ёстой"
        : "",
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  // On email blur, check Excel
  const handleEmailBlur = async () => {
    if (!formData.email || validateEmail(formData.email)) {
      setExcelNames(null);
      return;
    }
  };

  // Check email button handler
  const handleCheckEmail = async () => {
    if (!formData.email || validateEmail(formData.email)) {
      setExcelNames(null);
      return;
    }
    setIsLoading(true);
    try {
      const { data } = await axios.post("/api/check-email", {
        email: formData.email,
      });
      if (data.isAllowed) {
        setExcelNames({ lastName: data.lastName, firstName: data.firstName });
        setFormData((prev) => ({
          ...prev,
          lastName: data.lastName,
          firstName: data.firstName,
        }));
        setErrors((prev) => ({ ...prev, email: "" }));
      } else {
        setExcelNames(null);
        setShowDbxModal(true); // SHOW DBX MODAL
        setErrors((prev) => ({
          ...prev,
          email: "",
        }));
      }
    } catch (err: any) {
      setExcelNames(null);
      // show modal ONLY for "Dbx Бүртгэлгүй и-мэйл хаяг байна" error
      const errorMsg = err.response?.data?.error || "";
      if (
        err.response?.data?.isAllowed === false ||
        errorMsg.includes("Dbx Бүртгэлгүй и-мэйл хаяг байна")
      ) {
        setShowDbxModal(true);
        setErrors((prev) => ({
          ...prev,
          email: "",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          email: errorMsg || "Excel-ээс нэр шалгах үед алдаа гарлаа.",
        }));
      }
      // If email is already registered, disable the form
      if (
        err.response?.status === 400 &&
        errorMsg.includes("аль хэдийн бүртгэгдсэн")
      ) {
        setFormData((prev) => ({
          ...prev,
          email: "",
          lastName: "",
          firstName: "",
          password: "",
          confirmPassword: "",
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Controlled input handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    // Reset Excel autofill if user changes email
    if (name === "email") setExcelNames(null);
  };

  // Form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (formData.userType === "baiguullaga") {
      setIsLoading(true);
      try {
        const response = await axios.post("/api/company-request", {
          email: formData.email,
          dugaar: formData.dugaar,
        });

        if (response.status === 201) {
          toast.success("Амжилттай бүртгүүллээ!", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          setTimeout(() => {
            router.push("/login");
          }, 1000);
        }
      } catch (error: any) {
        if (error.response?.data?.error) {
          setErrors((prev) => ({
            ...prev,
            email: error.response.data.error,
          }));
        }
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (!showOTP) {
      setIsLoading(true);
      try {
        await proceedWithSignup();
      } finally {
        setIsLoading(false);
      }
    } else {
      proceedWithOTPVerification();
    }
  };

  // SIGNUP (call signup API)
  const proceedWithSignup = async () => {
    setIsLoading(true);
    try {
      const lastName = excelNames?.lastName || formData.lastName;
      const firstName = excelNames?.firstName || formData.firstName;

      const response = await axios.post("/api/signup", {
        lastName,
        firstName,
        email: formData.email,
        password: formData.password,
        phoneNumber: formData.phoneNumber,
      });

      if (response.status === 200) {
        setShowOTP(true);
      }
    } catch (error: any) {
      if (error.response?.data?.error) {
        setErrors((prev) => ({
          ...prev,
          email: error.response.data.error,
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // OTP Verification
  const proceedWithOTPVerification = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put("/api/signup", {
        email: formData.email,
        otp: formData.otp,
      });
      if (response.status === 201) {
        toast.success("Амжилттай бүртгүүллээ!", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (error: any) {
      if (error.response?.data?.error) {
        setErrors((prev) => ({
          ...prev,
          otp: error.response.data.error,
        }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Cancel with modal
  const handleCancel = () => {
    if (
      formData.lastName ||
      formData.firstName ||
      formData.email ||
      formData.password ||
      formData.confirmPassword
    ) {
      setShowCancelModal(true);
    } else {
      router.push("/");
    }
  };

  // --- UI ---
  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row relative">
        <div className="absolute inset-0 md:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
          <Image
            src="/BOND-1x1.png"
            alt="Bond Image"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>

        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-4 md:p-8 bg-white/95 md:bg-white relative z-10 order-2 md:order-1 min-h-screen md:min-h-0">
          <div className="w-full max-w-md">
            <button
              onClick={handleCancel}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
            >
              <ArrowLeft className="mr-2" size={20} />
              Буцах
            </button>

            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold mb-2">
                {showOTP ? "OTP баталгаажуулах" : "Бүртгүүлэх"}
              </h1>
              <p className="text-gray-600">
                {showOTP
                  ? "И-мэйл хаягаар ирсэн OTP кодыг оруулна уу"
                  : "Dbx хаягаар Бүртгүүлэх"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!showOTP ? (
                <>
                  {/* User Type Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Бүртгүүлэх төрөл
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="userType"
                          value="huvi_hun"
                          checked={formData.userType === "huvi_hun"}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        Хувь хүн
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="userType"
                          value="baiguullaga"
                          checked={formData.userType === "baiguullaga"}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        Байгууллага
                      </label>
                    </div>
                  </div>

                  {formData.userType === "huvi_hun" ? (
                    <>
                      {/* Email first */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Таны И-мэйл хаяг бүртгэгдсэн байгаа эсэхийг шалгана уу
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleEmailBlur}
                            className={`flex-1 px-4 py-2 border ${
                              errors.email
                                ? "border-red-500"
                                : "border-gray-300"
                            } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                            placeholder="И-мэйл хаягаа оруулна уу"
                            autoComplete="off"
                          />
                          <button
                            type="button"
                            onClick={handleCheckEmail}
                            disabled={
                              isLoading ||
                              !formData.email ||
                              !!validateEmail(formData.email)
                            }
                            className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-yellow-500/20 text-black rounded-lg hover:from-blue-500/30 hover:to-yellow-500/30 transition-all disabled:opacity-50 whitespace-nowrap"
                          >
                            {isLoading ? "Шалгаж байна..." : "Шалгах"}
                          </button>
                        </div>
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.email}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Утасны дугаар
                        </label>
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          maxLength={8}
                          className={`w-full px-4 py-2 border ${
                            errors.phoneNumber
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="Утасны дугаараа оруулна уу"
                        />
                        {errors.phoneNumber && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.phoneNumber}
                          </p>
                        )}
                      </div>
                      {/* Last Name (Овог) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Овог
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={
                            excelNames ? excelNames.lastName : formData.lastName
                          }
                          onChange={handleChange}
                          disabled={!!excelNames}
                          className={`w-full px-4 py-2 border ${
                            errors.lastName
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white ${
                            excelNames ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                          placeholder="Овогоо оруулна уу"
                        />
                        {errors.lastName && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.lastName}
                          </p>
                        )}
                      </div>

                      {/* First Name (Нэр) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Нэр
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={
                            excelNames
                              ? excelNames.firstName
                              : formData.firstName
                          }
                          onChange={handleChange}
                          disabled={!!excelNames}
                          className={`w-full px-4 py-2 border ${
                            errors.firstName
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white ${
                            excelNames ? "opacity-70 cursor-not-allowed" : ""
                          }`}
                          placeholder="Нэрээ оруулна уу"
                        />
                        {errors.firstName && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.firstName}
                          </p>
                        )}
                      </div>

                      {/* Password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Нууц үг
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border ${
                            errors.password
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="Нууц үгээ оруулна уу"
                        />
                        {errors.password && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.password}
                          </p>
                        )}
                      </div>

                      {/* Phone Number */}

                      {/* Confirm password */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Нууц үг давтах
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border ${
                            errors.confirmPassword
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="Нууц үгээ давтан оруулна уу"
                        />
                        {errors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.confirmPassword}
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      {/* Baiguullaga fields */}
                      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          Та байгууллага бол гэрээг zaaval tatan avch bugluud
                          biyeer avchirj uguh ёстой
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Дугаар
                        </label>
                        <input
                          type="text"
                          name="dugaar"
                          value={formData.dugaar}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border ${
                            errors.dugaar ? "border-red-500" : "border-gray-300"
                          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="Дугаараа оруулна уу"
                        />
                        {errors.dugaar && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.dugaar}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          И-мэйл
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full px-4 py-2 border ${
                            errors.email ? "border-red-500" : "border-gray-300"
                          } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                          placeholder="И-мэйл хаягаа оруулна уу"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.email}
                          </p>
                        )}
                      </div>

                      <div className="mt-6">
                        <p className="text-sm text-gray-600 mb-2 text-center">
                          Утгыг үнэн зөв бөглөсний дараа гэрээг татах боломжтой
                        </p>
                        <button
                          type="button"
                          onClick={async () => {
                            if (
                              !formData.email ||
                              !formData.dugaar ||
                              !formData.email.includes("@")
                            )
                              return;

                            // First download the PDF
                            const link = document.createElement("a");
                            link.href =
                              "https://drive.google.com/uc?export=download&id=1Cf7YnklkzEHH22U1jHcRyqB2jI2Cag1a";
                            link.download = "geree.pdf";
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);

                            // Then submit the form
                            setIsLoading(true);
                            try {
                              const response = await axios.post(
                                "/api/company-request",
                                {
                                  email: formData.email,
                                  dugaar: formData.dugaar,
                                }
                              );

                              if (response.status === 201) {
                                toast.success("Амжилттай бүртгүүллээ!", {
                                  position: "top-center",
                                  autoClose: 2000,
                                  hideProgressBar: false,
                                  closeOnClick: true,
                                  pauseOnHover: true,
                                  draggable: true,
                                });
                                setTimeout(() => {
                                  router.push("/login");
                                }, 2000);
                              }
                            } catch (error: any) {
                              if (error.response?.data?.error) {
                                setErrors((prev) => ({
                                  ...prev,
                                  email: error.response.data.error,
                                }));
                              }
                            } finally {
                              setIsLoading(false);
                            }
                          }}
                          disabled={
                            isLoading ||
                            !formData.email ||
                            !formData.dugaar ||
                            !formData.email.includes("@")
                          }
                          className="w-full bg-gradient-to-r from-blue-500/20 to-yellow-500/20 text-black py-2 px-4 rounded-lg hover:from-blue-500/30 hover:to-yellow-500/30 transition-all disabled:opacity-50"
                        >
                          {isLoading
                            ? "Түр хүлээнэ үү..."
                            : "Гэрээ татаж хүсэлт илгээх"}
                        </button>
                      </div>
                    </>
                  )}

                  {formData.userType === "huvi_hun" && (
                    <button
                      type="submit"
                      disabled={
                        isLoading ||
                        !formData.email ||
                        !formData.password ||
                        !formData.confirmPassword ||
                        !excelNames
                      }
                      className="w-full bg-gradient-to-r from-blue-500/20 to-yellow-500/20 text-black py-2 px-4 rounded-lg hover:from-blue-500/30 hover:to-yellow-500/30 transition-all disabled:opacity-50"
                    >
                      {isLoading
                        ? "Түр хүлээнэ үү..."
                        : showOTP
                        ? "Баталгаажуулах"
                        : "Бүртгүүлэх"}
                    </button>
                  )}
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    OTP код
                  </label>
                  <input
                    type="text"
                    name="otp"
                    value={formData.otp}
                    onChange={handleChange}
                    className={`w-full px-4 py-2 border ${
                      errors.otp ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                    placeholder="OTP кодоо оруулна уу"
                  />
                  {errors.otp && (
                    <p className="mt-1 text-sm text-red-600">{errors.otp}</p>
                  )}
                  <button
                    type="submit"
                    disabled={isLoading || !formData.otp}
                    className="w-full mt-4 bg-gradient-to-r from-blue-500/20 to-yellow-500/20 text-black py-2 px-4 rounded-lg hover:from-blue-500/30 hover:to-yellow-500/30 transition-all disabled:opacity-50"
                  >
                    {isLoading ? "Түр хүлээнэ үү..." : "Баталгаажуулах"}
                  </button>
                </div>
              )}
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Бүртгэлтэй юу? Нэвтрэх
              </Link>
            </div>
          </div>
        </div>

        {/* Right side - Image - Desktop Only */}
        <div className="w-full md:w-1/2 relative h-[300px] md:h-auto order-1 md:order-2 hidden md:block">
          <Image
            src="/BOND-1x1.png"
            alt="Signup illustration"
            fill
            className="object-cover"
            sizes="50vw"
          />
        </div>
      </div>

      <DbxModal open={showDbxModal} onClose={() => setShowDbxModal(false)} />

      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={() => router.push("/")}
        title="Бүртгэл цуцлах"
        message="Та бүртгэлээ цуцлахдаа итгэлтэй байна уу? Оруулсан мэдээлэл устах болно."
        confirmText="Тийм"
        cancelText="Үгүй"
      />
      <ToastContainer />
    </>
  );
}
