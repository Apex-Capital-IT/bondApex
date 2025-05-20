"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import { User, LogOut } from "lucide-react";

export default function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const { scrollY } = useScroll();

  const headerWidth = useTransform(scrollY, [0, 100], ["100%", "55%"]);
  const headerOpacity = useTransform(scrollY, [0, 20, 21, 100], [1, 1, 1, 1]);
  const headerBlur = useTransform(scrollY, [0, 20, 21, 100], [0, 0, 0, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
  };

  return (
    <motion.nav
      className={`fixed top-0 left-1/2 -translate-x-1/2 z-[100] transition-all duration-300 ${
        mobileMenuOpen
          ? `bg-white text-black shadow-md rounded-t-3xl mt-2`
          : isScrolled
          ? `bg-white text-black shadow-md rounded-3xl mt-2`
          : "bg-transparent text-white"
      }`}
      style={{
        opacity: isScrolled ? 1 : headerOpacity,
        width: headerWidth,
        backdropFilter: isScrolled ? undefined : `blur(${headerBlur}px)`,
      }}
    >
      <div className="container mx-auto px-4 py-4 sm:p-6 md:px-12 flex justify-between items-center">
        <Link href={"/"} className="flex items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold"
          >
            <Image
              alt="Hydrogen Bond"
              width={100}
              height={100}
              className="w-[100px] h-auto"
              src={isScrolled ? "/Logo.png" : "/image.png"}
            />
          </motion.div>
        </Link>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`md:hidden p-2 rounded-md ${
            isScrolled ? "text-black" : "text-black"
          }`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <motion.div
            animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {mobileMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-x"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-menu"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            )}
          </motion.div>
        </motion.button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden rounded-b-3xl"
          >
            <div className="flex flex-col p-4 space-y-4">
              <Link
                target="_blank"
                href="https://www.facebook.com/apexcapital.mn"
                className="px-4 py-2 rounded-full bg-gradient-to-r backdrop-blur-xl border border-black/30 text-black/70 transition-all shadow-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact us
              </Link>
              <Link
                href="coming-soon"
                className="px-4 py-2 rounded-full bg-gradient-to-r backdrop-blur-xl border border-black/30 text-black/70 transition-all shadow-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                For Company
              </Link>
              <Link
                href="/about"
                className="px-4 py-2 rounded-full bg-gradient-to-r backdrop-blur-xl border border-black/30 text-black/70 transition-all shadow-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                About us
              </Link>
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="w-full px-4 py-2 rounded-full bg-gradient-to-r backdrop-blur-xl border border-black/30 text-black/70 transition-all shadow-lg flex items-center gap-2"
                  >
                    {user.profileImage ? (
                      <Image
                        src={user.profileImage}
                        alt="Profile"
                        width={24}
                        height={24}
                        className="rounded-full w-6 h-6 object-cover"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                    )}
                    <span className="text-sm">Профайл</span>
                  </button>
                  {profileDropdownOpen && (
                    <div className="mt-2 w-full rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                      <div className="py-1">
                        <Link
                          href="/profile"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            setMobileMenuOpen(false);
                          }}
                        >
                          <User className="w-4 h-4" />
                          Профайл
                        </Link>
                        <button
                          onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                          <LogOut className="w-4 h-4" />
                          Гарах
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/signup"
                    className="px-4 py-2 rounded-full bg-gradient-to-r backdrop-blur-xl border border-black/30 text-black/70 transition-all shadow-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Бүртгүүлэх
                  </Link>
                  <Link
                    href="/login"
                    className="px-4 py-2 rounded-full bg-gradient-to-r backdrop-blur-xl border border-black/30 text-black/70 transition-all shadow-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Нэвтрэх
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="hidden md:flex items-center space-x-4 text-xl lg:space-x-10"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link
              target="_blank"
              href="https://www.facebook.com/apexcapital.mn"
              className={`font-bold transition-colors ${
                isScrolled ? "text-black" : "text-white"
              }`}
            >
              Contact us{" "}
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link
              href="coming-soon"
              className={`font-bold transition-colors ${
                isScrolled ? "text-black" : "text-white"
              }`}
            >
              For Company
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link
              href="/about"
              className={`font-bold transition-colors ${
                isScrolled ? "text-black" : "text-white"
              }`}
            >
              About us
            </Link>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="hidden md:flex text-xl items-center gap-4"
        >
          {user ? (
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 0 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className={`px-4 py-2 rounded-full bg-gradient-to-r backdrop-blur-xl border transition-all shadow-lg flex items-center gap-2 ${
                    isScrolled
                      ? "text-black border-black/30"
                      : "text-white border-white/30"
                  }`}
                >
                  {user.profileImage ? (
                    <Image
                      src={user.profileImage}
                      alt="Profile"
                      width={24}
                      height={24}
                      className="rounded-full w-6 h-6 object-cover"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                  )}
                  <span className="text-sm">Профайл</span>
                </button>
              </motion.div>

              {profileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5"
                >
                  <div className="py-1">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      Профайл
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Гарах
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <>
              <motion.div
                whileHover={{ scale: 1.05, rotate: 0 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link
                  href="/signup"
                  className={`px-4 py-2 text-sm rounded-full bg-gradient-to-r backdrop-blur-xl border border-white/30 transition-all shadow-lg ${
                    isScrolled ? "text-black border-black/30" : "text-white"
                  }`}
                >
                  Бүртгүүлэх
                </Link>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05, rotate: 0 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Link
                  href="/login"
                  className={`px-4 py-2 text-sm rounded-full bg-gradient-to-r backdrop-blur-xl border border-white/30 transition-all shadow-lg ${
                    isScrolled ? "text-black border-black/30" : "text-white"
                  }`}
                >
                  Нэвтрэх
                </Link>
              </motion.div>
            </>
          )}
        </motion.div>
      </div>
    </motion.nav>
  );
}
