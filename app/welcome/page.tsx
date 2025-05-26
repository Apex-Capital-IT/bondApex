"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Anton } from "next/font/google";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});

export default function WelcomePage() {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically handle the login logic
    // For now, we'll just redirect to the company page
    router.push("/company");
  };

  return (
    <div
      className={`min-h-screen font-['Cormorant_Garamond'] flex flex-col ${anton.variable}`}
    >
      <div className="bg-white text-black overflow-hidden flex flex-col flex-1">
        <section className="relative h-screen w-full flex items-center justify-start">
          <div className="w-full h-screen bg-gradient-to-bl from-[#6ab7f7] via-[#1c88e8]/90 to-[#1c88e8] pt-16 pb-12 flex items-center relative">
            <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-white via-[#1c88e8] to-transparent"></div>
            <div className="container mx-auto px-4 relative z-10">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight max-w-4xl mb-6">
                  Хугацаа бага, боломж их.
                </h1>

                <p className="text-white/90 text-lg md:text-xl max-w-2xl mb-8">
                  Бондын хөрөнгө оруулалт хийхийн тулд эхлээд MSE бүртгэлээрээ
                  нэвтэрнэ үү.
                </p>

                <Button
                  className="bg-white text-[#1782e0] hover:bg-white/90 px-8 py-6 text-lg font-semibold rounded-full shadow-sm transition-colors"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  Үргэлжлүүлэх
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Login Modal */}
        <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center mb-6">
                Нэвтрэх
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  И-мэйл
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="И-мэйл хаягаа оруулна уу"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Нууц үг
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Нууц үгээ оруулна уу"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-[#1782e0] text-white hover:bg-[#1782e0]/90"
              >
                Нэвтрэх
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
