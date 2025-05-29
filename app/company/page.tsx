"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  Bell,
  Clock,
  Grid3X3,
  MessageSquare,
  Search,
  Settings,
  TrendingDown,
  TrendingUp,
  Users,
  Package,
  Target,
  Activity,
  Mail,
  Calendar,
  DollarSign,
  ShoppingCart,
  Eye,
  ChevronDown,
  User,
  LogOut,
  HelpCircle,
  Palette,
  ArrowLeft,
  Check,
  X,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import type { ChartOptions, TooltipItem } from "chart.js";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface BondRequest {
  _id: string;
  id: string;
  bondId: string;
  userEmail: string;
  status: "pending" | "accepted" | "rejected";
  timestamp: string;
  price?: string;
  name?: string;
  registration?: string;
  bondTitle?: string;
  phone?: string;
  nominalPrice?: string;
  unitPrice?: string;
  features?: string[];
  bondFeatures?: string[];
  declineReason?: string;
  saleRequest?: {
    status: "pending" | "accepted" | "normal";
    timestamp?: string;
    price?: {
      originalPrice: string;
      sellPrice: string;
      interestRate: number;
      daysHeld: number;
      interestAmount: string;
    };
  };
}

// Mongolian mock data
const mockData = {
  dashboard: [
    {
      id: 1,
      type: "metric",
      title: "Нийт орлого",
      value: "₮45,231,890",
      change: "+20.1%",
    },
    {
      id: 2,
      type: "metric",
      title: "Захиалгууд",
      value: "2,350",
      change: "+180.1%",
    },
    {
      id: 3,
      type: "metric",
      title: "Бүтээгдэхүүн",
      value: "12,234",
      change: "+19%",
    },
    {
      id: 4,
      type: "metric",
      title: "Идэвхтэй хэрэглэгчид",
      value: "573",
      change: "+201%",
    },
  ],
  statistics: [
    {
      id: 1,
      metric: "Орлогын хэмжээ",
      value: "125,432 ₮",
      period: "Сүүлийн 30 хоног",
      trend: "up",
    },
  ],
  bondStatistics: [
    { month: "1-р сар", value: 98.5 },
    { month: "2-р сар", value: 99.2 },
    { month: "3-р сар", value: 98.8 },
    { month: "4-р сар", value: 99.5 },
    { month: "5-р сар", value: 100.2 },
    { month: "6-р сар", value: 100.8 },
    { month: "6-р сар", value: 100.8 },
    { month: "7-р сар", value: 101.5 },
    { month: "8-р сар", value: 102.2 },
    { month: "9-р сар", value: 101.8 },
    { month: "10-р сар", value: 102.5 },
    { month: "11-р сар", value: 103.2 },
    { month: "12-р сар", value: 104.0 },
  ],
  audience: [
    {
      id: 1,
      name: "Батбаяр",
      email: "batbayar@example.com",
      location: "Улаанбаатар",
      status: "Идэвхтэй",
      joinDate: "2024-01-15",
    },
    {
      id: 2,
      name: "Сарангэрэл",
      email: "sarangerel@example.com",
      location: "Дархан",
      status: "Идэвхтэй",
      joinDate: "2024-02-20",
    },
    {
      id: 3,
      name: "Төмөрбаатар",
      email: "tumubaatar@example.com",
      location: "Эрдэнэт",
      status: "Идэвхгүй",
      joinDate: "2024-01-10",
    },
    {
      id: 4,
      name: "Оюунчимэг",
      email: "oyunchimeg@example.com",
      location: "Чойбалсан",
      status: "Идэвхтэй",
      joinDate: "2024-03-05",
    },
  ],
  messages: [
    {
      id: 1,
      from: "Алтанцэцэг",
      subject: "Бүтээгдэхүүний талаар асуулт",
      message:
        "Сайн байна уу, таны шинэ бүтээгдэхүүний талаар сонирхож байна...",
      time: "2 цагийн өмнө",
      read: false,
    },
    {
      id: 2,
      from: "Болдбаатар",
      subject: "Тусламжийн хүсэлт",
      message: "Миний захиалгатай холбоотой асуудал гарлаа...",
      time: "4 цагийн өмнө",
      read: true,
    },
    {
      id: 3,
      from: "Цэцэгмаа",
      subject: "Санал хүсэлт",
      message: "Маш сайн үйлчилгээ! Өөрийн туршлагаа хуваалцмаар байна...",
      time: "1 өдрийн өмнө",
      read: true,
    },
    {
      id: 4,
      from: "Дорждагва",
      subject: "Хамтын ажиллагаа",
      message: "Боломжит хамтын ажиллагааны талаар ярилцмаар байна...",
      time: "2 өдрийн өмнө",
      read: false,
    },
  ],
  campaigns: [
    {
      id: 1,
      name: "Зуны хямдрал 2024",
      status: "Идэвхтэй",
      budget: "₮5,000,000",
      spent: "₮3,200,000",
      clicks: "12,450",
      conversions: "234",
    },
    {
      id: 2,
      name: "Хар баасан",
      status: "Төлөвлөгдсөн",
      budget: "₮10,000,000",
      spent: "₮0",
      clicks: "0",
      conversions: "0",
    },
    {
      id: 3,
      name: "Хаврын цуглуулга",
      status: "Дууссан",
      budget: "₮3,500,000",
      spent: "₮3,500,000",
      clicks: "8,920",
      conversions: "156",
    },
    {
      id: 4,
      name: "Баярын тусгай санал",
      status: "Түр зогссон",
      budget: "₮7,500,000",
      spent: "₮4,200,000",
      clicks: "15,670",
      conversions: "298",
    },
  ],
  performance: [
    {
      id: 1,
      metric: "Bond орлогын харьцуулалт 1",
      current: "15.2%",
      target: "12%",
      status: "Зорилгоос дээш",
    },
    {
      id: 2,
      metric: "Bond орлогын харьцуулалт 2",
      current: "8.7%",
      target: "10%",
      status: "Зорилгоос доош",
    },
    {
      id: 3,
      metric: "Bond орлогын харьцуулалт 3",
      current: "92.1%",
      target: "90%",
      status: "Зорилгоос дээш",
    },
    {
      id: 4,
      metric: "Bond орлогын харьцуулалт 4",
      current: "₮127,500",
      target: "₮120,000",
      status: "Зорилгоос дээш",
    },
  ],

  history: [
    {
      id: 1,
      action: "Монголын хөгжлийн бонд худалдан авалт хийсэн",
      user: "Бат",
      type: "бонд",
      timestamp: "2025-01-15 10:30",
    },
    {
      id: 2,
      action: "Эрчим хүчний бонд худалдан авсан",
      user: "Саруул",
      type: "бонд",
      timestamp: "2025-03-01 14:10",
    },
    {
      id: 3,
      action: "Монголын хөгжлийн бондыг борлуулсан",
      user: "Бат",
      type: "бонд",
      timestamp: "2025-05-10 09:00",
    },
    {
      id: 4,
      action: "Нийтийн тээврийн бонд худалдан авсан",
      user: "Энхжин",
      type: "бонд",
      timestamp: "2025-05-25 16:45",
    },
  ],
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [activeSidebar, setActiveSidebar] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedButeegdehuun, setSelectedButeegdehuun] = useState("1");
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [selectedBondForSale, setSelectedBondForSale] = useState<{
    bondId: string;
    price: string;
  } | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // If loading or not authenticated, show loading state
  if (loading || !user) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Түр хүлээнэ үү...</p>
        </div>
      </div>
    );
  }

  const sidebarItems = [
    { id: "dashboard", icon: Grid3X3, label: "Хяналтын самбар" },
    { id: "statistics", icon: BarChart3, label: "Статистик" },
    { id: "history", icon: Clock, label: "Түүх" },
  ];

  // Filter data based on search query
  const filterData = (data: any[], searchFields: string[]) => {
    if (!searchQuery) return data;
    return data.filter((item) =>
      searchFields.some((field) =>
        item[field]
          ?.toString()
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
    );
  };

  const DashboardView = () => {
    const [requests, setRequests] = useState<BondRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedRequestId, setExpandedRequestId] = useState<string | null>(
      null
    );
    const [selectedView, setSelectedView] = useState<
      "details" | "payment" | null
    >(null);
    const { user } = useAuth();

    useEffect(() => {
      const fetchRequests = async () => {
        try {
          const response = await fetch("/api/bond/requests");
          if (response.ok) {
            const data = await response.json();
            const userRequests = data.filter(
              (request: BondRequest) => request.userEmail === user?.email
            );
            setRequests(userRequests);
          }
        } catch (error) {
        } finally {
          setIsLoading(false);
        }
      };

      if (user?.email) {
        fetchRequests();
      }
    }, [user?.email]);

    const handleSaleRequest = async (bondId: string, originalPrice: string) => {
      try {
        const response = await fetch("/api/users/sale-request", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bondId,
            userEmail: user?.email,
            originalPrice,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create sale request");
        }

        // Show success toast
        toast.success("Зарах хүсэлт амжилттай илгээгдлээ!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          style: {
            fontSize: "14px",
            fontWeight: 500,
          },
        });

        // Close the modal
        setIsSaleModalOpen(false);
        setSelectedBondForSale(null);

        // Refresh the requests list
        const updatedResponse = await fetch("/api/bond/requests");
        if (updatedResponse.ok) {
          const data = await updatedResponse.json();
          const userRequests = data.filter(
            (request: BondRequest) => request.userEmail === user?.email
          );
          setRequests(userRequests);
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to create sale request",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "light",
            style: {
              fontSize: "14px",
              fontWeight: 500,
            },
          }
        );
      }
    };

    const openSaleModal = (bondId: string, price: string) => {
      setSelectedBondForSale({ bondId, price });
      setIsSaleModalOpen(true);
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

    const calculatePayment = (
      amount: number,
      days: number,
      purchaseDate: string,
      isFutureProjection: boolean = false
    ) => {
      const annualRate = 0.19; // 19% annual rate
      const dailyRate = annualRate / 365;

      if (isFutureProjection) {
        // For future projections, use the specified days
        const interest = amount * dailyRate * days;
        return {
          total: amount + interest,
          interest: interest,
          days: days,
        };
      } else {
        // For current interest, calculate from purchase date
        const purchaseDateTime = new Date(purchaseDate);
        const today = new Date();
        const daysFromPurchase = Math.floor(
          (today.getTime() - purchaseDateTime.getTime()) / (1000 * 60 * 60 * 24)
        );
        const actualDays = Math.max(daysFromPurchase, 0);
        const interest = amount * dailyRate * actualDays;
        return {
          total: amount + interest,
          interest: interest,
          days: actualDays,
        };
      }
    };

    const handleViewChange = (
      requestId: string,
      view: "details" | "payment"
    ) => {
      if (expandedRequestId === requestId && selectedView === view) {
        setExpandedRequestId(null);
        setSelectedView(null);
      } else {
        setExpandedRequestId(requestId);
        setSelectedView(view);
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
      <div className="space-y-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Хөрөнгө оруулалтын хүсэлтүүд
          </h2>
        </div>

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
                className="bg-white rounded-lg p-4 sm:p-6 shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
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
                    {request.status === "accepted" && (
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleViewChange(request.id, "details")
                          }
                          className={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors ${
                            expandedRequestId === request.id &&
                            selectedView === "details"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          <Eye className="w-4 h-4" />
                          <span>Дэлгэрэнгүй</span>
                        </button>
                        <button
                          onClick={() =>
                            handleViewChange(request.id, "payment")
                          }
                          className={`flex items-center gap-2 px-3 py-1 rounded-md transition-colors ${
                            expandedRequestId === request.id &&
                            selectedView === "payment"
                              ? "bg-blue-100 text-blue-700"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          <CreditCard className="w-4 h-4" />
                          <span>тооцоолуур</span>
                        </button>
                        {(!request.saleRequest ||
                          request.saleRequest.status === "normal") && (
                          <button
                            onClick={() =>
                              openSaleModal(
                                request.bondId,
                                request.price || "0"
                              )
                            }
                            className="flex items-center gap-2 px-3 py-1 rounded-md bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span>Зарах</span>
                          </button>
                        )}
                        {request.saleRequest &&
                          request.saleRequest.status !== "normal" && (
                            <div
                              className={`flex items-center gap-2 px-3 py-1 rounded-md ${
                                request.saleRequest.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : request.saleRequest.status === "accepted"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              <ShoppingCart className="w-4 h-4" />
                              <div className="flex flex-col">
                                <span>
                                  {request.saleRequest.status === "pending"
                                    ? "Хүсэлт илгээгдсэн"
                                    : request.saleRequest.status === "accepted"
                                    ? "Зарах хүсэлт зөвшөөрөгдсөн"
                                    : "Хэвийн"}
                                </span>
                                {request.saleRequest.price && (
                                  <span className="text-xs">
                                    Зарах үнэ:{" "}
                                    {request.saleRequest.price.sellPrice}₮
                                    <br />
                                    Хүү:{" "}
                                    {request.saleRequest.price.interestAmount}₮
                                    <br />
                                    Хугацаа:{" "}
                                    {request.saleRequest.price.daysHeld} хоног
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded view */}
                {expandedRequestId === request.id && (
                  <motion.div
                    className="mt-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    {selectedView === "details" && (
                      <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
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
                                    <span className="text-gray-500">
                                      Регистр:
                                    </span>
                                    <span className="font-medium">
                                      {request.registration || "N/A"}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-500">
                                      И-мэйл:
                                    </span>
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
                                    <span className="text-gray-500">
                                      Үнийн дүн:
                                    </span>
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
                                <span className="font-medium">
                                  {request.bondId}
                                </span>
                              </div>

                              {request.nominalPrice && (
                                <div className="flex justify-between">
                                  <span className="text-gray-500">
                                    Нэрлэсэн үнэ:
                                  </span>
                                  <span className="font-medium">
                                    {request.nominalPrice}
                                  </span>
                                </div>
                              )}

                              {request.unitPrice && (
                                <div className="flex justify-between">
                                  <span className="text-gray-500">
                                    Нэгж үнэ:
                                  </span>
                                  <span className="font-medium">
                                    {request.unitPrice}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Features List */}
                            {(request.features || request.bondFeatures) && (
                              <div className="mt-3">
                                <h5 className="text-gray-500 mb-1">
                                  Онцлогууд:
                                </h5>
                                <ul className="list-disc list-inside space-y-1">
                                  {(
                                    request.features ||
                                    request.bondFeatures ||
                                    []
                                  ).map((feature: string, index: number) => (
                                    <li
                                      key={index}
                                      className="text-sm text-gray-700"
                                    >
                                      {feature}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedView === "payment" && (
                      <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                        <h4 className="font-medium text-gray-700 mb-3">
                          Төлбөрийн тооцоо
                        </h4>
                        <div className="space-y-2">
                          {[
                            { label: "Өнөөдөр", days: 0, isFuture: false },
                            {
                              label: "7 хоногийн дараа",
                              days: 7,
                              isFuture: true,
                            },
                            {
                              label: "1 сарын дараа",
                              days: 30,
                              isFuture: true,
                            },
                            {
                              label: "6 сарын дараа",
                              days: 180,
                              isFuture: true,
                            },
                            {
                              label: "1 жилийн дараа",
                              days: 365,
                              isFuture: true,
                            },
                          ].map((option) => {
                            const amount = parseFloat(
                              request.price?.replace(/[^0-9.-]+/g, "") || "0"
                            );
                            const result = calculatePayment(
                              amount,
                              option.days,
                              request.timestamp,
                              option.isFuture
                            );
                            const totalAmount = result.total;
                            const interest = result.interest;
                            const daysFromPurchase = result.days;

                            return (
                              <div
                                key={option.label}
                                className="flex justify-between items-center p-2 hover:bg-gray-100 rounded-md transition-colors"
                              >
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {option.label}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    Хүү: {interest.toLocaleString()}₮
                                  </p>
                                  {!option.isFuture && (
                                    <p className="text-xs text-gray-400">
                                      {daysFromPurchase} хоног өнгөрсөн
                                    </p>
                                  )}
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-gray-900">
                                    {totalAmount.toLocaleString()}₮
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {option.isFuture
                                      ? `${option.days} хоног`
                                      : "Өнөөдөр"}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {request.declineReason && (
                      <div className="mt-3 sm:mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        <p className="font-medium">Татгалзсан шалтгаан:</p>
                        <p>{request.declineReason}</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            ))
          )}
        </div>

        {/* Sale Confirmation Modal */}
        <Dialog open={isSaleModalOpen} onOpenChange={setIsSaleModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Бонд зарах</DialogTitle>
              <DialogDescription>
                Та энэ бондыг зарахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах
                боломжгүй.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <button
                onClick={() => setIsSaleModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                Цуцлах
              </button>
              <button
                onClick={() =>
                  selectedBondForSale &&
                  handleSaleRequest(
                    selectedBondForSale.bondId,
                    selectedBondForSale.price
                  )
                }
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Зарах
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  const StatisticsView = () => {
    const filteredData = filterData(mockData.statistics, ["metric", "value"]);

    // Get different statistics data based on selected бүтээгдэхүүн
    const getButeegdehuunStatistics = () => {
      switch (selectedButeegdehuun) {
        case "1":
          return {
            labels: [
              "5-р сарын 14",
              "5-р сарын 15",
              "5-р сарын 16",
              "5-р сарын 17",
              "5-р сарын 18",
              "5-р сарын 19",
              "5-р сарын 20",
            ],
            lastWeek: [12700, 13200, 12000, 15000, 17000, 16500, 16000],
            prevWeek: [11900, 12500, 11800, 14000, 15500, 15800, 15000],
            title: "Бүтээгдэхүүн 1 - Орлогын харьцуулалт",
          };
        case "2":
          return {
            labels: [
              "5-р сарын 14",
              "5-р сарын 15",
              "5-р сарын 16",
              "5-р сарын 17",
              "5-р сарын 18",
              "5-р сарын 19",
              "5-р сарын 20",
            ],
            lastWeek: [22700, 23200, 22000, 25000, 27000, 26500, 26000],
            prevWeek: [21900, 22500, 21800, 24000, 25500, 25800, 25000],
            title: "Бүтээгдэхүүн 2 - Орлогын харьцуулалт",
          };
        case "3":
          return {
            labels: [
              "5-р сарын 14",
              "5-р сарын 15",
              "5-р сарын 16",
              "5-р сарын 17",
              "5-р сарын 18",
              "5-р сарын 19",
              "5-р сарын 20",
            ],
            lastWeek: [32700, 33200, 32000, 35000, 37000, 36500, 36000],
            prevWeek: [31900, 32500, 31800, 34000, 35500, 35800, 35000],
            title: "Бүтээгдэхүүн 3 - Орлогын харьцуулалт",
          };
        case "4":
          return {
            labels: [
              "5-р сарын 14",
              "5-р сарын 15",
              "5-р сарын 16",
              "5-р сарын 17",
              "5-р сарын 18",
              "5-р сарын 19",
              "5-р сарын 20",
            ],
            lastWeek: [42700, 43200, 42000, 45000, 47000, 46500, 46000],
            prevWeek: [41900, 42500, 41800, 44000, 45500, 45800, 45000],
            title: "Бүтээгдэхүүн 4 - Орлогын харьцуулалт",
          };
        default:
          return {
            labels: [
              "5-р сарын 14",
              "5-р сарын 15",
              "5-р сарын 16",
              "5-р сарын 17",
              "5-р сарын 18",
              "5-р сарын 19",
              "5-р сарын 20",
            ],
            lastWeek: [12700, 13200, 12000, 15000, 17000, 16500, 16000],
            prevWeek: [11900, 12500, 11800, 14000, 15500, 15800, 15000],
            title: "Бүтээгдэхүүн 1 - Орлогын харьцуулалт",
          };
      }
    };

    const statisticsData = getButeegdehuunStatistics();

    const data = {
      labels: statisticsData.labels,
      datasets: [
        {
          label: "Өнгөрсөн 7 хоног",
          data: statisticsData.lastWeek,
          borderColor: "#2563eb",
          backgroundColor: "rgba(37,99,235,0.1)",
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: false,
        },
        {
          label: "Өмнөх 7 хоног",
          data: statisticsData.prevWeek,
          borderColor: "#a5b4fc",
          backgroundColor: "rgba(165,180,252,0.1)",
          borderDash: [5, 5],
          tension: 0.4,
          pointRadius: 5,
          pointHoverRadius: 7,
          fill: false,
        },
      ],
    };

    const options: ChartOptions<"line"> = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          labels: {
            font: { size: 14 },
            color: "#334155",
          },
        },
        title: {
          display: true,
          text: statisticsData.title,
          font: { size: 18 },
          color: "#0f172a",
        },
        tooltip: {
          callbacks: {
            label: function (context: TooltipItem<"line">) {
              return `${
                context.dataset.label
              }: ₮${context.parsed.y.toLocaleString()}`;
            },
          },
        },
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function (tickValue: string | number) {
              if (typeof tickValue === "number") {
                return `$${tickValue.toLocaleString()}`;
              }
              return tickValue;
            },
            color: "#64748b",
          },
          grid: { color: "#e5e7eb" },
        },
        x: {
          ticks: { color: "#64748b" },
          grid: { color: "#f1f5f9" },
        },
      },
    };

    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {statisticsData.title}
          </h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-[200px] justify-between">
                Бүтээгдэхүүн {selectedButeegdehuun}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem onClick={() => setSelectedButeegdehuun("1")}>
                Бүтээгдэхүүн 1
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedButeegdehuun("2")}>
                Бүтээгдэхүүн 2
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedButeegdehuun("3")}>
                Бүтээгдэхүүн 3
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedButeegdehuun("4")}>
                Бүтээгдэхүүн 4
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Card className="border-none shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">
              Бондын орлогын график
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-fit w-full">
              <Line data={data} options={options} />
            </div>
          </CardContent>
        </Card>

        {/* Bond Statistics Line Chart */}
      </div>
    );
  };

  const AudienceView = () => {
    const filteredData = filterData(mockData.audience, [
      "name",
      "email",
      "location",
    ]);

    return (
      <div className="space-y-8">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">
              Хэрэглэгчийн удирдлага
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-gray-500">Нэр</TableHead>
                  <TableHead className="text-gray-500">И-мэйл</TableHead>
                  <TableHead className="text-gray-500">Байршил</TableHead>
                  <TableHead className="text-gray-500">Төлөв</TableHead>
                  <TableHead className="text-gray-500">Элссэн огноо</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-medium text-gray-900">
                      {user.name}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {user.email}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {user.location}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "Идэвхтэй" ? "default" : "secondary"
                        }
                        className="px-2 py-1"
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {user.joinDate}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Нийт хэрэглэгчид</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    1,234
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-50 rounded-xl">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Идэвхтэй хэрэглэгчид</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    987
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-50 rounded-xl">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Энэ сарын шинэ</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    156
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const MessagesView = () => {
    const filteredData = filterData(mockData.messages, [
      "from",
      "subject",
      "message",
    ]);

    return (
      <div className="space-y-8">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Мессежүүд</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredData.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-xl transition-all duration-200 ${
                    !message.read
                      ? "bg-blue-50 border border-blue-100 hover:bg-blue-100/50"
                      : "bg-gray-50 border border-gray-100 hover:bg-gray-100/50"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border-2 border-white">
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
                          {message.from
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">
                          {message.from}
                        </p>
                        <p className="text-sm text-gray-500">{message.time}</p>
                      </div>
                    </div>
                    {!message.read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  <h4 className="font-medium text-gray-900 mb-1">
                    {message.subject}
                  </h4>
                  <p className="text-sm text-gray-600">{message.message}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-none shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Mail className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Нийт мессеж</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    247
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-50 rounded-xl">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Уншсан мессеж</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    189
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-50 rounded-xl">
                  <Bell className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Уншаагүй</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    58
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const CampaignsView = () => {
    const filteredData = filterData(mockData.campaigns, ["name", "status"]);

    return (
      <div className="space-y-8">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">
              Кампайны удирдлага
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-gray-500">Кампайны нэр</TableHead>
                  <TableHead className="text-gray-500">Төлөв</TableHead>
                  <TableHead className="text-gray-500">Төсөв</TableHead>
                  <TableHead className="text-gray-500">Зарцуулсан</TableHead>
                  <TableHead className="text-gray-500">Дарсан</TableHead>
                  <TableHead className="text-gray-500">Хөрвүүлэлт</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((campaign) => (
                  <TableRow key={campaign.id} className="hover:bg-gray-50/50">
                    <TableCell className="font-medium text-gray-900">
                      {campaign.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          campaign.status === "Идэвхтэй"
                            ? "default"
                            : campaign.status === "Төлөвлөгдсөн"
                            ? "secondary"
                            : campaign.status === "Дууссан"
                            ? "outline"
                            : "destructive"
                        }
                        className="px-2 py-1"
                      >
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {campaign.budget}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {campaign.spent}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {campaign.clicks}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {campaign.conversions}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-none shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-50 rounded-xl">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Идэвхтэй кампайнууд</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    3
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-50 rounded-xl">
                  <DollarSign className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Нийт төсөв</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    ₮26М
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-50 rounded-xl">
                  <Eye className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Нийт дарсан</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    37М
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-none shadow-sm hover:shadow-md transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-50 rounded-xl">
                  <ShoppingCart className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Хөрвүүлэлт</p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    688
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };

  const PerformanceView = () => {
    const filteredData = filterData(mockData.performance, [
      "metric",
      "current",
      "target",
    ]);

    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredData.map((item) => (
            <Card
              key={item.id}
              className="border-none shadow-sm hover:shadow-md transition-all duration-200"
            >
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  {item.metric}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                    <span className="text-sm text-gray-600">Одоогийн</span>
                    <span className="font-medium text-gray-900">
                      {item.current}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-gray-50">
                    <span className="text-sm text-gray-600">Зорилго</span>
                    <span className="font-medium text-gray-900">
                      {item.target}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const HistoryView = () => {
    const filteredData = filterData(mockData.history, [
      "action",
      "user",
      "type",
    ]);

    return (
      <div className="space-y-8">
        <Card className="border-none shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">
              Захиалгын түүх
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredData.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50/50 transition-colors"
                >
                  <div
                    className={`w-3 h-3 rounded-full mt-1.5 ${
                      item.type === "захиалга"
                        ? "bg-green-500"
                        : item.type === "бүтээгдэхүүн"
                        ? "bg-blue-500"
                        : item.type === "хэрэглэгч"
                        ? "bg-purple-500"
                        : "bg-orange-500"
                    }`}
                  ></div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.action}</p>
                    <p className="text-sm text-gray-600">{item.user}-аас</p>
                    <p className="text-xs text-gray-500">{item.timestamp}</p>
                  </div>
                  <Badge variant="outline" className="text-xs px-2 py-1">
                    {item.type}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSidebar) {
      case "dashboard":
        return <DashboardView />;
      case "statistics":
        return <StatisticsView />;
      case "audience":
        return <AudienceView />;
      case "messages":
        return <MessagesView />;
      case "campaigns":
        return <CampaignsView />;
      case "performance":
        return <PerformanceView />;
      case "history":
        return <HistoryView />;
      default:
        return <DashboardView />;
    }
  };

  const getPageTitle = () => {
    const item = sidebarItems.find((item) => item.id === activeSidebar);
    return item ? item.label : "Хяналтын самбар";
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Add ToastContainer */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />

      {/* Sidebar */}
      <div className="w-72 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">$$</span>
            </div>
            <div>
              <span className="font-semibold text-lg text-gray-900">Admin</span>
              <p className="text-sm text-gray-500">Хяналтын самбар</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {sidebarItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveSidebar(item.id)}
                  className={`w-full flex items-center gap-3 px-4 text-sm py-3 rounded-xl text-left transition-all duration-200 ${
                    activeSidebar === item.id
                      ? "bg-blue-50 text-blue-700 font-semibold shadow-sm"
                      : "text-gray-600 hover:bg-gray-50 font-semibold hover:text-gray-900"
                  }`}
                >
                  <item.icon
                    className={`w-5 h-5 ${
                      activeSidebar === item.id ? "text-blue-600" : ""
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <Avatar className="w-11 h-11 border-2 border-gray-100">
                  {user?.profileImage ? (
                    <AvatarImage src={user.profileImage} />
                  ) : (
                    <AvatarFallback className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
                      {user?.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex gap-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.lastName || "User"}{" "}
                    </p>
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {user?.firstName || "User"}{" "}
                    </p>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email || "user@example.com"}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 p-2">
              <DropdownMenuItem className="flex items-center gap-2 p-3 rounded-lg cursor-pointer hover:bg-gray-50">
                <User className="h-4 w-4 text-gray-500" />
                <span>Профайл</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-2 p-3 rounded-lg cursor-pointer hover:bg-gray-50">
                <HelpCircle className="h-4 w-4 text-gray-500" />
                <span>Тусламж</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-2" />
              <DropdownMenuItem className="flex items-center gap-2 p-3 rounded-lg cursor-pointer text-red-600 hover:bg-red-50">
                <LogOut className="h-4 w-4" />
                <span>Гарах</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {getPageTitle()}
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {activeSidebar === "dashboard"
                  ? "Таны хяналтын самбар"
                  : activeSidebar === "statistics"
                  ? "Статистик мэдээлэл"
                  : activeSidebar === "audience"
                  ? "Үйлчлүүлэгчдийн мэдээлэл"
                  : activeSidebar === "messages"
                  ? "Мессежүүд"
                  : activeSidebar === "campaigns"
                  ? "Кампайны удирдлага"
                  : activeSidebar === "performance"
                  ? "Мэдээлэл"
                  : "Захиалгын түүх"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Хайх..."
                  className="pl-10 w-80 bg-gray-50 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-8 bg-gray-50/50">
          <div className="max-w-7xl mx-auto">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}
