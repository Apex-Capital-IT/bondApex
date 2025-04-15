"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [verified, setVerified] = useState(false);
  const router = useRouter();
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (emailSent) {
      // Focus the first OTP input when email is submitted
      inputRefs[0].current?.focus();
    }
  }, [emailSent]);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateEmail(email)) {
      setEmailSent(true);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value[value.length - 1];
    }
    if (value && !/^\d$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if current input is filled
    if (value && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.every((digit) => digit !== "")) {
      setVerified(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image */}
      <div className="fixed inset-0 h-screen w-full md:hidden">
        <Image
          src="/BOND-1x1.png"
          alt="Bond Image"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      <div className="flex flex-col md:flex-row relative h-full">
        {/* Form Section */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-8 bg-white/90 backdrop-blur-sm md:bg-white min-h-screen">
          <div className="w-full max-w-md">
            <Link
              href="/login"
              className="flex items-center text-gray-600 hover:text-gray-900 mb-8"
            >
              <ArrowLeft className="mr-2" size={20} />
              Буцах
            </Link>

            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold mb-2">Нууц үг сэргээх</h1>
              <p className="text-gray-600 text-sm">
                {!emailSent
                  ? "И-мэйл хаягаа оруулна уу. Нууц үг сэргээх холбоос илгээх болно."
                  : "И-мэйл хаяг руу илгээсэн 4 оронтой кодоо оруулна уу."}
              </p>
            </div>

            {!emailSent ? (
              <form onSubmit={handleSubmit} className="space-y-6">
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
                    required
                  />
                  {emailError && (
                    <p className="mt-1 text-sm text-red-600">{emailError}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500/20 to-yellow-500/20 text-black py-2 px-4 rounded-lg hover:from-blue-500/30 hover:to-yellow-500/30 transition-all"
                >
                  Илгээх
                </button>
              </form>
            ) : !verified ? (
              <form
                onSubmit={handleOtpSubmit}
                className="flex flex-col items-center"
              >
                <div className="flex flex-col items-center">
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Баталгаажуулах код
                  </label>
                  <div className="flex my-6 gap-4 justify-center">
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        ref={inputRefs[index]}
                        type="text"
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        className="w-12 h-12 text-3xl text-center border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        maxLength={1}
                        required
                      />
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-fit  bg-gradient-to-r from-blue-500/20 to-yellow-500/20 text-black py-2 px-4 rounded-lg hover:from-blue-500/30 hover:to-yellow-500/30 transition-all"
                >
                  Баталгаажуулах
                </button>
              </form>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-green-600"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold mb-2">Баталгаажлаа</h2>
                <p className="text-gray-600">
                  Нэвтрэх хуудсанд шилжиж байна...
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Image Section */}
        <div className="hidden md:block w-1/2 relative">
          <Image
            src="/BOND-1x1.png"
            alt="Bond Image"
            fill
            className="object-cover"
            priority
            sizes="50vw"
          />
        </div>
      </div>
    </div>
  );
}
