"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [isLogin, setIsLogin] = useState(false);
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
    if (!isLogin) {
      router.push("/login");
    } else {
      router.push("/signup");
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
              {isLogin ? "Нэвтрэх" : "Бүртгүүлэх"}
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
              {isLogin ? "Нэвтрэх" : "Бүртгүүлэх"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={handleToggle}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              {isLogin ? "Бүртгэлгүй юу? Бүртгүүлэх" : "Бүртгэлтэй юу? Нэвтрэх"}
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
