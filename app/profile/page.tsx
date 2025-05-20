"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Bell,
  User,
  LogOut,
  Menu,
  UserPen,
  CircleX,
  CircleMinus,
  Check,
  X,
  Clock,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Navigation from "../components/ProfileNavigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Loading from "@/components/ui/loading";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { BondRequest } from "@/app/models/BondRequest";

// Add this type definition at the top of the file, after imports
type ConfirmationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | React.ReactNode;
  loading: boolean;
  confirmText: string;
  cancelText: string;
};

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { user, logout, updateUser } = useAuth();
  const router = useRouter();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
    setShowLogoutModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navigation />

      <div className="h-screen mx-auto px-2 sm:px-4 md:px-6 lg:px-28 py-4 sm:py-6 md:py-8 pt-20 md:pt-24 sm:pt-24">
        <div className="bg-white rounded-xl sm:rounded-2xl h-full shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row h-full">
            <div
              className={cn(
                "flex flex-col bg-white transition-all duration-300",
                isSidebarOpen
                  ? "w-full md:w-[250px] md:border-r"
                  : "w-full md:w-[60px] md:border-r"
              )}
            >
              <div className="flex h-14 items-center border-b px-4">
                <div className="flex items-center gap-2 font-semibold justify-center">
                  {isSidebarOpen ? (
                    <span className="text-xl sm:text-2xl font-bold text-gray-800">
                      Профайл
                    </span>
                  ) : (
                    <span className="sr-only">Профайл</span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto">
                <div className="p-2 sm:p-6">
                  {isSidebarOpen && (
                    <p className="text-sm text-gray-500">
                      Хэрэглэгчийн тохиргоо
                    </p>
                  )}
                </div>
                <nav
                  className={cn(
                    "space-y-1 px-2 py-2",
                    !isSidebarOpen && "flex flex-row justify-center gap-2"
                  )}
                >
                  <div
                    className={cn(
                      "flex flex-row md:flex-col gap-2 md:gap-1",
                      !isSidebarOpen && "flex-row"
                    )}
                  >
                    <button
                      onClick={() => setActiveTab("profile")}
                      className={cn(
                        "flex items-center px-2 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                        activeTab === "profile"
                          ? "bg-gradient-to-r from-blue-500/20 to-yellow-500/20 backdrop-blur-xl text-gray-600 shadow-sm"
                          : "text-gray-600 hover:bg-gray-50",
                        !isSidebarOpen && "justify-center px-2"
                      )}
                    >
                      <User className="h-5 w-5 flex-shrink-0" />
                      {isSidebarOpen && <span className="ml-3">Профайл</span>}
                    </button>
                    <button
                      onClick={() => setActiveTab("notifications")}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                        activeTab === "notifications"
                          ? "bg-gradient-to-r from-blue-500/20 to-yellow-500/20 backdrop-blur-xl text-gray-600 shadow-sm"
                          : "text-gray-600 hover:bg-gray-50",
                        !isSidebarOpen && "justify-center px-2"
                      )}
                    >
                      <Bell className="h-5 w-5 flex-shrink-0" />
                      {isSidebarOpen && <span className="ml-3">Мэдэгдэл</span>}
                    </button>
                    <button
                      onClick={() => setShowLogoutModal(true)}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200",
                        !isSidebarOpen && "justify-center px-2"
                      )}
                    >
                      <LogOut className="h-5 w-5 flex-shrink-0" />
                      {isSidebarOpen && <span className="ml-3">Гарах</span>}
                    </button>
                  </div>
                </nav>
              </div>
            </div>
            <div className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
              <div className="h-full">
                {activeTab === "profile" ? (
                  <div className="relative">
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="absolute top-0 right-0 px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500/20 to-yellow-500/20 backdrop-blur-xl text-gray-600 rounded-lg transition-colors duration-200"
                    >
                      {isEditing ? (
                        <CircleMinus className="w-4 h-4" />
                      ) : (
                        <div className="flex items-center gap-2">
                          <UserPen className="w-4 h-4" />
                          <div className="text-sm">Edit</div>
                        </div>
                      )}
                    </button>
                    <ProfileContent isEditing={isEditing} />
                  </div>
                ) : (
                  <NotificationSettings />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Гарах"
        message="Та системээс гарахдаа итгэлтэй байна уу?"
        loading={false}
        confirmText="Тийм"
        cancelText="Үгүй"
      />
    </div>
  );
}

function ProfileContent({ isEditing }: { isEditing: boolean }) {
  const { user, updateUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showDeleteImageModal, setShowDeleteImageModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showResetPasswordModal, setShowResetPasswordModal] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [resetStep, setResetStep] = useState(1);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPasswordError, setShowPasswordError] = useState(false);
  const [passwordErrorTimeout, setPasswordErrorTimeout] =
    useState<NodeJS.Timeout | null>(null);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPasswordSuccess, setShowPasswordSuccess] = useState(false);

  // Add useEffect to handle password error timeout
  useEffect(() => {
    return () => {
      if (passwordErrorTimeout) {
        clearTimeout(passwordErrorTimeout);
      }
    };
  }, [passwordErrorTimeout]);

  const handlePasswordInput = () => {
    setShowPasswordError(false);
    if (passwordErrorTimeout) {
      clearTimeout(passwordErrorTimeout);
    }
  };

  const handlePasswordChange = () => {
    if (
      !formData.currentPassword ||
      !formData.newPassword ||
      !formData.confirmPassword
    ) {
      setShowPasswordError(true);
      setError("Бүх талбарыг бөглөнө үү");

      // Set timeout to hide error after 5 seconds
      const timeout = setTimeout(() => {
        setShowPasswordError(false);
        setError("");
      }, 5000);
      setPasswordErrorTimeout(timeout);
      return;
    }
    if (formData.newPassword !== formData.confirmPassword) {
      setShowPasswordError(true);
      setError("Шинэ нууц үг таарахгүй байна");

      // Set timeout to hide error after 5 seconds
      const timeout = setTimeout(() => {
        setShowPasswordError(false);
        setError("");
      }, 5000);
      setPasswordErrorTimeout(timeout);
      return;
    }
    setShowPasswordModal(true);
  };

  // Add useEffect to clear success message after 3 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  // Initialize form data when user data is available
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.username || "",
        email: user.email || "",
      }));
      if (user.profileImage) {
        setImagePreview(user.profileImage);
      }
    }
  }, [user]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Зөвхөн зураг оруулна уу");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Зургийн хэмжээ 5MB-с бага байх ёстой");
        return;
      }
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleDeleteImage = async () => {
    if (!user?._id) {
      setError("Хэрэглэгчийн ID олдсонгүй");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/profile/delete-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user._id,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Зураг устгахад алдаа гарлаа");
      }

      const updatedUser = await response.json();
      updateUser(updatedUser);
      setSuccess("Профайл зураг амжилттай устгагдлаа");
      setImagePreview("");
    } catch (err: any) {
      setError(err.message || "Зураг устгахад алдаа гарлаа");
    } finally {
      setLoading(false);
      setShowDeleteImageModal(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setShowUpdateModal(true);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Нэрээ оруулна уу");
      return false;
    }
    if (!formData.email.trim()) {
      setError("И-мэйл хаягаа оруулна уу");
      return false;
    }
    if (!user?._id) {
      setError("Хэрэглэгчийн ID олдсонгүй");
      return false;
    }
    if (
      formData.newPassword &&
      formData.newPassword !== formData.confirmPassword
    ) {
      setError("Шинэ нууц үг таарахгүй байна");
      return false;
    }
    return true;
  };

  const proceedWithUpdate = async () => {
    if (!user?._id) {
      setError("Хэрэглэгчийн ID олдсонгүй");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("userId", user._id);

      if (formData.currentPassword) {
        formDataToSend.append("currentPassword", formData.currentPassword);
        formDataToSend.append("newPassword", formData.newPassword);
      }

      if (profileImage) {
        formDataToSend.append("profileImage", profileImage);
      }

      const response = await fetch("/api/profile/update", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      updateUser(data);
      if (formData.currentPassword) {
        setSuccess("Нууц үг амжилттай солигдлоо");
        setShowPasswordSuccess(true);
        // Clear password fields
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        // Hide modal and success message after 2 seconds
        setTimeout(() => {
          setShowPasswordSuccess(false);
          setShowPasswordModal(false);
        }, 2000);
      } else {
        setSuccess("Профайл амжилттай шинэчлэгдлээ");
      }
    } catch (err: any) {
      setError(err.message || "Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const sendOTP = async () => {
    if (!newEmail.trim()) {
      setError("Шинэ и-мэйл хаягаа оруулна уу");
      return;
    }

    setVerifying(true);
    try {
      const response = await fetch("/api/profile/send-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: newEmail,
          userId: user?._id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setOtpSent(true);
      setSuccess("Баталгаажуулах код илгээгдлээ");
    } catch (err: any) {
      setError(err.message || "Код илгээхэд алдаа гарлаа");
    } finally {
      setVerifying(false);
    }
  };

  const verifyOTP = async () => {
    if (!otpCode.trim()) {
      setError("Баталгаажуулах кодоо оруулна уу");
      return;
    }

    setVerifying(true);
    try {
      const response = await fetch("/api/profile/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: newEmail,
          otp: otpCode,
          userId: user?._id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      // Update the user's email using the returned user data
      updateUser(data.user);
      setFormData((prev) => ({ ...prev, email: newEmail }));
      setSuccess("И-мэйл хаяг амжилттай шинэчлэгдлээ");

      // Reset and close modal
      setOtpSent(false);
      setOtpCode("");
      setNewEmail("");
      setShowEmailModal(false);
    } catch (err: any) {
      setError(err.message || "Баталгаажуулахад алдаа гарлаа");
    } finally {
      setVerifying(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) {
      setError("И-мэйл хаяг олдсонгүй");
      return;
    }

    setVerifying(true);
    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user.email,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setResetStep(2);
      setSuccess("Баталгаажуулах код илгээгдлээ");
    } catch (err: any) {
      setError(err.message || "Код илгээхэд алдаа гарлаа");
    } finally {
      setVerifying(false);
    }
  };

  const verifyResetOTP = async () => {
    if (!otpCode.trim()) {
      setError("Баталгаажуулах кодоо оруулна уу");
      return;
    }

    setVerifying(true);
    try {
      const response = await fetch("/api/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user?.email,
          otp: otpCode,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setResetStep(3);
      setSuccess("Баталгаажуулах код зөв байна");
    } catch (err: any) {
      setError(err.message || "Баталгаажуулахад алдаа гарлаа");
    } finally {
      setVerifying(false);
    }
  };

  const submitNewPassword = async () => {
    if (!newPassword || !confirmNewPassword) {
      setError("Шинэ нууц үгээ оруулна уу");
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("Нууц үг таарахгүй байна");
      return;
    }

    setVerifying(true);
    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: user?.email,
          otp: otpCode,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setSuccess("Нууц үг амжилттай сэргээгдлээ");
      setResetStep(1);
      setOtpCode("");
      setNewPassword("");
      setConfirmNewPassword("");
      setShowResetPasswordModal(false);
    } catch (err: any) {
      setError(err.message || "Нууц үг сэргээхэд алдаа гарлаа");
    } finally {
      setVerifying(false);
    }
  };

  return (
    <>
      <div className="mx-auto">
        <h2 className="text-lg sm:text-2xl font-bold mb-4 text-gray-800">
          Профайл мэдээлэл
        </h2>

        <div className="mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 group">
              {imagePreview ? (
                <>
                  <Image
                    src={imagePreview || "/placeholder.svg"}
                    alt="Profile"
                    fill
                    className="rounded-full object-cover ring-4 ring-white shadow-lg transition-transform duration-300 group-hover:scale-105"
                  />
                  {isEditing && (
                    <button
                      onClick={() => setShowDeleteImageModal(true)}
                      className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
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
                    </button>
                  )}
                </>
              ) : (
                <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center shadow-lg">
                  <User className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
                </div>
              )}
              {isEditing && (
                <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                  <span className="text-white text-sm font-medium">
                    Зураг солих
                  </span>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="basic">Үндсэн мэдээлэл</TabsTrigger>
            {isEditing && <TabsTrigger value="password">Нууц үг</TabsTrigger>}
          </TabsList>
          <TabsContent value="basic" className="mt-4 sm:mt-6">
            <div className="space-y-4 sm:space-y-6">
              <div className="p-3 sm:p-4 bg-white rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Нэр
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  disabled={!isEditing}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-lg transition-colors duration-200 ${
                    !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
                  }`}
                  placeholder="Нэрээ оруулна уу"
                />
              </div>

              {/* Email Section */}
              <div className="p-3 sm:p-4 bg-white rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  И-мэйл
                </label>
                <div className="flex">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-l-lg transition-colors duration-200 ${
                      !isEditing ? "bg-gray-50 cursor-not-allowed" : ""
                    }`}
                    readOnly
                  />
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => setShowEmailModal(true)}
                      className="px-3 sm:px-4 py-2 bg-gradient-to-r rounded-r-xl from-blue-500/20 to-yellow-500/20 backdrop-blur-xl text-gray-600 transition-colors duration-200"
                    >
                      Солих
                    </button>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={loading}
                    className="px-3 sm:px-4 py-2 bg-gradient-to-r rounded-xl from-blue-500/20 to-yellow-500/20 backdrop-blur-xl text-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Түр хүлээнэ үү..." : "Хадгалах"}
                  </button>
                </div>
              )}
            </div>
          </TabsContent>
          {isEditing && (
            <TabsContent value="password" className="mt-4 sm:mt-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="p-3 sm:p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-base sm:text-lg font-medium text-gray-800">
                      Нууц үг солих
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowResetPasswordModal(true)}
                      className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                    >
                      Нууц үг сэргээх ?
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Одоогийн нууц үг
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          value={formData.currentPassword}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              currentPassword: e.target.value,
                            }));
                            handlePasswordInput();
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg transition-colors duration-200"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Шинэ нууц үг
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          value={formData.newPassword}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              newPassword: e.target.value,
                            }));
                            handlePasswordInput();
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg transition-colors duration-200"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showNewPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Шинэ нууц үг давтах
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={(e) => {
                            setFormData((prev) => ({
                              ...prev,
                              confirmPassword: e.target.value,
                            }));
                            handlePasswordInput();
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg transition-colors duration-200"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {showPasswordError && (
                      <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        {error}
                      </div>
                    )}

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handlePasswordChange}
                        disabled={loading}
                        className="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500/20 to-yellow-500/20 backdrop-blur-xl rounded-lg text-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? "Түр хүлээнэ үү..." : "Нууц үг солих"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>

        {success && (
          <div className="p-3 bg-green-50 text-green-600 rounded-lg text-sm mt-4">
            {success}
          </div>
        )}
      </div>

      <ConfirmationModal
        isOpen={showDeleteImageModal}
        onClose={() => setShowDeleteImageModal(false)}
        onConfirm={handleDeleteImage}
        title="Зураг устгах"
        message="Та профайл зургаа устгахдаа итгэлтэй байна уу?"
        loading={loading}
        confirmText="Тийм"
        cancelText="Үгүй"
      />

      <ConfirmationModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onConfirm={proceedWithUpdate}
        title="Профайл шинэчлэх"
        message="Та профайлын мэдээллээ шинэчлэхдээ итгэлтэй байна уу?"
        loading={loading}
        confirmText="Тийм"
        cancelText="Үгүй"
      />

      <ConfirmationModal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setShowPasswordSuccess(false);
        }}
        onConfirm={proceedWithUpdate}
        title="Нууц үг солих"
        message={
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Та нууц үгээ солихдоо итгэлтэй байна уу?</p>
            {showPasswordSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg flex items-center gap-2">
                <Check className="h-5 w-5" />
                <span>Нууц үг амжилттай солигдлоо</span>
              </div>
            )}
          </div>
        }
        loading={loading}
        confirmText="Тийм"
        cancelText="Үгүй"
      />

      {/* Email Update Modal */}
      <div
        className={`fixed inset-0 bg-black/50 z-[100] flex items-center justify-center transition-opacity duration-300 ${
          showEmailModal ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden relative z-[101]">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              И-мэйл хаяг шинэчлэх
            </h3>

            {!otpSent ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Шинэ и-мэйл хаяг
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg  transition-colors duration-200"
                    placeholder="example@domain.com"
                  />
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-3 bg-green-50 text-green-600 rounded-lg text-sm">
                    {success}
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEmailModal(false);
                      setError("");
                      setSuccess("");
                      setNewEmail("");
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    Цуцлах
                  </button>
                  <button
                    type="button"
                    onClick={sendOTP}
                    disabled={verifying}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-yellow-500/20 backdrop-blur-xl text-gray-600 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {verifying ? "Түр хүлээнэ үү..." : "Код илгээх"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Баталгаажуулах код
                  </label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg  transition-colors duration-200"
                    placeholder="123456"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {newEmail} хаяг руу илгээсэн кодыг оруулна уу
                  </p>
                </div>

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="p-3 bg-green-50 text-green-600 rounded-lg text-sm">
                    {success}
                  </div>
                )}

                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setOtpSent(false);
                      setError("");
                      setSuccess("");
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors duration-200"
                  >
                    Буцах
                  </button>
                  <button
                    type="button"
                    onClick={verifyOTP}
                    disabled={verifying}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {verifying ? "Түр хүлээнэ үү..." : "Баталгаажуулах"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reset Password Modal */}
      <div
        className={`fixed inset-0 bg-black/50 z-[100] flex items-center justify-center transition-opacity duration-300 ${
          showResetPasswordModal
            ? "opacity-100"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 overflow-hidden relative z-[101]">
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Нууц үг сэргээх
            </h3>

            {resetStep === 1 && (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Таны и-мэйл хаяг руу баталгаажуулах код илгээх болно.
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowResetPasswordModal(false);
                      setError("");
                      setSuccess("");
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Цуцлах
                  </button>
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    disabled={verifying}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-yellow-500/20 backdrop-blur-xl text-gray-600 rounded-lg transition-colors duration-200 disabled:opacity-50"
                  >
                    {verifying ? "Түр хүлээнэ үү..." : "Код илгээх"}
                  </button>
                </div>
              </div>
            )}

            {resetStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Баталгаажуулах код
                  </label>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg transition-colors duration-200"
                    placeholder="Кодоо оруулна уу"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setResetStep(1);
                      setOtpCode("");
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Буцах
                  </button>
                  <button
                    type="button"
                    onClick={verifyResetOTP}
                    disabled={verifying}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-yellow-500/20 backdrop-blur-xl text-gray-600 rounded-lg transition-colors duration-200 disabled:opacity-50"
                  >
                    {verifying ? "Түр хүлээнэ үү..." : "Баталгаажуулах"}
                  </button>
                </div>
              </div>
            )}

            {resetStep === 3 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Шинэ нууц үг
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg transition-colors duration-200"
                    placeholder="Шинэ нууц үгээ оруулна уу"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Шинэ нууц үг давтах
                  </label>
                  <input
                    type="password"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg transition-colors duration-200"
                    placeholder="Шинэ нууц үгээ дахин оруулна уу"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setResetStep(2);
                      setNewPassword("");
                      setConfirmNewPassword("");
                    }}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                  >
                    Буцах
                  </button>
                  <button
                    type="button"
                    onClick={submitNewPassword}
                    disabled={verifying}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-yellow-500/20 backdrop-blur-xl text-gray-600 rounded-lg transition-colors duration-200 disabled:opacity-50"
                  >
                    {verifying ? "Түр хүлээнэ үү..." : "Нууц үг сэргээх"}
                  </button>
                </div>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-50 text-green-600 rounded-lg text-sm mt-4">
                {success}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function NotificationSettings() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<BondRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch("/api/bond/requests");
        if (response.ok) {
          const data = await response.json();
          // Filter requests for the current user
          const userRequests = data.filter(
            (request: BondRequest) => request.userEmail === user?.email
          );
          setRequests(userRequests);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.email) {
      fetchRequests();
    }
  }, [user?.email]);

  // Toggle expanded view for request details
  const toggleRequestDetails = (requestId: string) => {
    setExpandedRequestId(expandedRequestId === requestId ? null : requestId);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <Check className="w-5 h-5 text-green-500" />;
      case "declined":
        return <X className="w-5 h-5 text-red-500" />;
      case "pending":
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-100 text-green-800";
      case "declined":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">
        Миний хөрөнгө оруулалтын хүсэлтүүд
      </h2>
      <div className="space-y-3 sm:space-y-4">
        {requests.length === 0 ? (
          <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
            <p className="text-gray-600">
              Хөрөнгө оруулалтын хүсэлт оруулаагүй байна
            </p>
          </div>
        ) : (
          requests.map((request) => (
            <motion.div
              key={request.id}
              className="bg-white rounded-lg p-4 sm:p-6 shadow-sm cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => toggleRequestDetails(request.id)}
            >
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {request.bondTitle}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {format(new Date(request.timestamp), "PPP p")}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-md ${getStatusColor(
                      request.status
                    )}`}
                  >
                    {getStatusIcon(request.status)}
                    <span className="capitalize">{request.status}</span>
                  </div>
                  <div className="text-gray-400">
                    {expandedRequestId === request.id ? "▲" : "▼"}
                  </div>
                </div>
              </div>

              {/* Expanded detail view */}
              {expandedRequestId === request.id && (
                <motion.div
                  className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Left column - Form details */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">
                        Хүсэлтийн дэлгэрэнгүй
                      </h4>
                      <div className="space-y-2">
                        {request.name && (
                          <>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Нэр:</span>
                              <span className="font-medium">
                                {request.name}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Регистр:</span>
                              <span className="font-medium">
                                {request.registration || "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">И-мэйл:</span>
                              <span className="font-medium">
                                {request.userEmail}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Утас:</span>
                              <span className="font-medium">
                                {request.phone || "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-500">Үнийн дүн:</span>
                              <span className="font-medium">
                                {request.price || "N/A"}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Right column - Bond details */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">
                        Бондын мэдээлэл
                      </h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-500">ID:</span>
                          <span className="font-medium">{request.bondId}</span>
                        </div>

                        {request.nominalPrice && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Нэрлэсэн үнэ:</span>
                            <span className="font-medium">
                              {request.nominalPrice}
                            </span>
                          </div>
                        )}

                        {request.unitPrice && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Нэгж үнэ:</span>
                            <span className="font-medium">
                              {request.unitPrice}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Features List */}
                      {(request.features || request.bondFeatures) && (
                        <div className="mt-3">
                          <h5 className="text-gray-500 mb-1">Онцлогууд:</h5>
                          <ul className="list-disc list-inside space-y-1">
                            {(
                              request.features ||
                              request.bondFeatures ||
                              []
                            ).map((feature, index) => (
                              <li key={index} className="text-sm text-gray-700">
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {request.declineReason && (
                <div className="mt-3 sm:mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                  <p className="font-medium">Татгалзсан шалтгаан:</p>
                  <p>{request.declineReason}</p>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
