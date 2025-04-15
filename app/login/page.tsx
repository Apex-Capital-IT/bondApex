"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const router = useRouter();

  const validateEmail = (email: string) => {
    if (!email) {
      setEmailError("И-мэйл хаяг оруулна уу");
      return false;
    }
    if (!email.includes("@")) {
      setEmailError("И-мэйл хаяг @ тэмдэгт агуулсан байх ёстой");
      return false;
    }
    if (!email.includes(".")) {
      setEmailError("И-мэйл хаяг . тэмдэгт агуулсан байх ёстой");
      return false;
    }
    setEmailError("");
    return true;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    if (value) {
      validateEmail(value);
    } else {
      setEmailError("");
    }
  };

  const handleToggle = () => {
    if (isLogin) {
      router.push("/signup");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left side - Form */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 bg-white order-2 md:order-1">
        <div className="w-full max-w-md">
          <Link
            href="/"
            className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
          >
            <ArrowLeft className="mr-2" size={20} />
            Буцах
          </Link>

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">
              {isLogin ? "Нэвтрэх" : <span className="font-[var(--font-alfa-slab-one)]">Бүртгүүлэх</span>}
            </h1>
            <p className="text-gray-600">
              {isLogin
                ? "Тавтай морилно уу! Нэвтэрч орно уу."
                : "Шинээр бүртгүүлэх"}
            </p>
          </div>

          <form className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Нэр
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Нэрээ оруулна уу"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                И-мэйл
              </label>
              <input
                type=""
                value={email}
                onChange={handleEmailChange}
                className={`w-full px-4 py-2 border ${
                  emailError ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                placeholder="И-мэйл хаягаа оруулна уу"
              />
              {emailError && (
                <p className="mt-1 text-sm text-red-600">{emailError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Нууц үг
              </label>
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Нууц үгээ оруулна уу"
              />
              {isLogin && (
                <div className="mt-2 text-right">
                  <Link
                    href="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Нууц үгээ мартсан уу?
                  </Link>
                </div>
              )}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Нууц үг давтах
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Нууц үгээ дахин оруулна уу"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500/20 to-yellow-500/20 text-black py-2 px-4 rounded-lg hover:from-blue-500/30 hover:to-yellow-500/30 transition-all"
            >
              {isLogin ? "Нэвтрэх" : <span className="font-[var(--font-alfa-slab-one)]">Бүртгүүлэх</span>}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleToggle}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {isLogin ? "Бүртгэлгүй юу? " : "Бүртгэлтэй юу? "}
              <span className="font-[var(--font-alfa-slab-one)]">
                {isLogin ? "Бүртгүүлэх" : "Нэвтрэх"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Right side - Image */}
      <div className="w-full md:w-1/2 relative h-[300px] md:h-auto order-1 md:order-2">
        <Image
          src="/BOND-1x1.png"
          alt="Bond Image"
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </div>
  );
}
