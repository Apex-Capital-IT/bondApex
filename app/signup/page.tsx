"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

export default function SignupPage() {
  const [isLogin, setIsLogin] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [errors, setErrors] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [showSignupConfirmModal, setShowSignupConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const router = useRouter();

  const validateEmail = (email: string) => {
    if (!email) {
      return "И-мэйл хаяг оруулна уу";
    }
    if (!email.includes("@")) {
      return "И-мэйл хаяг @ тэмдэгт агуулсан байх ёстой";
    }
    if (!email.includes(".")) {
      return "И-мэйл хаяг . тэмдэгт агуулсан байх ёстой";
    }
    return "";
  };

  const validateForm = () => {
    const newErrors = {
      username: !formData.username ? "Хэрэглэгчийн нэр оруулна уу" : "",
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
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!showOTP) {
      proceedWithSignup();
    } else {
      proceedWithOTPVerification();
    }
  };

  const proceedWithSignup = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/signup", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
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
      setShowSignupConfirmModal(false);
    }
  };

  const proceedWithOTPVerification = async () => {
    setIsLoading(true);
    try {
      const response = await axios.put("/api/signup", {
        email: formData.email,
        otp: formData.otp,
      });

      if (response.status === 201) {
        router.push("/login");
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

  const handleCancel = () => {
    if (
      formData.username ||
      formData.email ||
      formData.password ||
      formData.confirmPassword
    ) {
      setShowCancelModal(true);
    } else {
      router.push("/");
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col md:flex-row relative">
        {/* Background Image - Mobile */}
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

        {/* Left side - Form */}
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
                  : "Шинээр бүртгүүлэх"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!showOTP ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Хэрэглэгчийн нэр
                    </label>
                    <input
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      className={`w-full px-4 py-2 border ${
                        errors.username ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Хэрэглэгчийн нэрээ оруулна уу"
                    />
                    {errors.username && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.username}
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
                        errors.password ? "border-red-500" : "border-gray-300"
                      } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                      placeholder="Нууц үгээ оруулна уу"
                    />
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.password}
                      </p>
                    )}
                  </div>

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
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500/20 to-yellow-500/20 text-black py-2 px-4 rounded-lg hover:from-blue-500/30 hover:to-yellow-500/30 transition-all disabled:opacity-50"
              >
                {isLoading
                  ? "Түр хүлээнэ үү..."
                  : showOTP
                  ? "Баталгаажуулах"
                  : "Бүртгүүлэх"}
              </button>
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

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={() => router.push("/")}
        title="Бүртгэл цуцлах"
        message="Та бүртгэлээ цуцлахдаа итгэлтэй байна уу? Оруулсан мэдээлэл устах болно."
        confirmText="Тийм"
        cancelText="Үгүй"
      />
    </>
  );
}
