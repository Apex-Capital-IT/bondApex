"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BondRequest } from "@/app/models/BondRequest";
import { SaleRequest } from "@/app/models/SaleRequest";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Check, X, Clock, AlertCircle } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminDashboard() {
  const [buyRequests, setBuyRequests] = useState<BondRequest[]>([]);
  const [sellRequests, setSellRequests] = useState<SaleRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<BondRequest | SaleRequest | null>(null);
  const [declineReason, setDeclineReason] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');
  const [balance, setBalance] = useState(4000000000); // Initial balance
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const calculateBalance = () => {
    const acceptedBuyRequests = buyRequests.filter(
      (request) => request.status === "accepted"
    );
    const totalSpent = acceptedBuyRequests.reduce((sum, request) => {
      const price = typeof request.price === 'string' 
        ? parseInt(request.price.replace(/[^0-9.-]+/g, "")) 
        : 0;
      return sum + price;
    }, 0);
    return 4000000000 - totalSpent;
  };

  useEffect(() => {
    setBalance(calculateBalance());
  }, [buyRequests]);

  useEffect(() => {
    // Check if there's a saved code in localStorage
    const savedCode = localStorage.getItem("adminCode");
    const savedTime = localStorage.getItem("adminCodeTime");

    if (!savedCode || !savedTime) {
      router.push("/admin");
      return;
    }

    const currentTime = new Date().getTime();
    const savedTimeNum = parseInt(savedTime);
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

    if (currentTime - savedTimeNum >= fiveMinutes) {
      // Clear expired code and redirect
      localStorage.removeItem("adminCode");
      localStorage.removeItem("adminCodeTime");
      router.push("/admin");
      return;
    }

    const fetchRequests = async () => {
      try {
        const [buyResponse, sellResponse] = await Promise.all([
          fetch("/api/admin/buyRequests"),
          fetch("/api/admin/sellRequests")
        ]);
        
        if (buyResponse.ok) {
          const buyData = await buyResponse.json();
          setBuyRequests(buyData);
        }
        
        if (sellResponse.ok) {
          const sellData = await sellResponse.json();
          setSellRequests(sellData);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [router]);

  const handleStatusChange = async (
    request: BondRequest | SaleRequest,
    newStatus: "pending" | "accepted" | "declined" | "normal"
  ) => {
    try {
      setIsUpdating(true);
      const endpoint = 'bondRequestId' in request ? 
        `/api/admin/buyRequests/${request.id}` : 
        `/api/admin/sellRequests/${request.id}`;

      const response = await fetch(endpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: newStatus,
          declineReason: newStatus === "declined" ? declineReason : undefined,
        }),
      });

      if (response.ok) {
        if ('bondRequestId' in request) {
          setBuyRequests(
            buyRequests.map((r) =>
              r.id === request.id
                ? {
                    ...r,
                    status: newStatus as "pending" | "accepted" | "declined",
                    declineReason:
                      newStatus === "declined" ? declineReason : undefined,
                  }
                : r
            )
          );
        } else {
          setSellRequests(
            sellRequests.map((r) =>
              r.id === request.id
                ? {
                    ...r,
                    status: newStatus as "pending" | "accepted" | "normal",
                    declineReason:
                      newStatus === "declined" ? declineReason : undefined,
                  }
                : r
            )
          );
        }
        setSelectedRequest(null);
        setDeclineReason("");
        toast.success("Хүсэлт амжилттай шинэчлэгдлээ");
      }
    } catch (error) {
      console.error("Error updating request status:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, request: BondRequest | SaleRequest) => {
    setIsDragging(true);
    e.dataTransfer.setData("requestId", request.id);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (
    e: React.DragEvent,
    newStatus: "pending" | "accepted" | "declined" | "normal"
  ) => {
    e.preventDefault();
    if (isUpdating) return; // prevent multiple drops

    const requestId = e.dataTransfer.getData("requestId");
    const requests = activeTab === 'buy' ? buyRequests : sellRequests;
    const request = requests.find((r) => r.id === requestId);

    if (request && request.status !== newStatus) {
      setIsUpdating(true);

      if (newStatus === "declined") {
        setSelectedRequest(request);
        setIsUpdating(false); // allow further interaction immediately
      } else {
        await handleStatusChange(request, newStatus);
        setIsUpdating(false); // unlock drops
      }
    }
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

  const getUserRequestCount = (email: string) => {
    const requests = activeTab === 'buy' ? buyRequests : sellRequests;
    return requests.filter((request) => request.userEmail === email).length;
  };

  const getRequestBackgroundColor = (email: string) => {
    return getUserRequestCount(email) >= 2 ? "bg-gray-500" : "bg-white";
  };

  const getRequestsByStatus = (status: string) => {
    const requests = activeTab === 'buy' ? buyRequests : sellRequests;
    return requests.filter((request) => request.status === status);
  };

  // Toggle expanded view for request details
  const toggleRequestDetails = (
    requestId: string,
    event?: React.MouseEvent
  ) => {
    if (isDragging) return; // Don't toggle if we're dragging

    if (event) {
      event.stopPropagation();
    }
    setExpandedRequestId(expandedRequestId === requestId ? null : requestId);
  };

  const renderRequestDetails = (request: BondRequest | SaleRequest) => {
    if ('bondRequestId' in request) {
      // Sale Request
      return (
        <>
          <div className="text-sm text-gray-500">Бонд ID</div>
          <div className="font-medium">{request.bondId}</div>
          <div className="text-sm text-gray-500 mt-2">Хэрэглэгч</div>
          <div className="font-medium">{request.userEmail}</div>
          <div className="text-sm text-gray-500 mt-2">Үнэ</div>
          <div className="font-medium">
            <div>Анхны үнэ: {request.price.originalPrice}₮</div>
            <div>Зарах үнэ: {request.price.sellPrice}₮</div>
            <div>Хүү: {request.price.interestAmount}₮</div>
            <div>Хугацаа: {request.price.daysHeld} хоног</div>
          </div>
        </>
      );
    } else {
      // Buy Request
      return (
        <>
          <div className="text-sm text-gray-500">Бонд</div>
          <div className="font-medium">{request.bondTitle}</div>
          <div className="text-sm text-gray-500 mt-2">Хэрэглэгч</div>
          <div className="font-medium">{request.name}</div>
          <div className="text-sm text-gray-500 mt-2">Регистр</div>
          <div className="font-medium">{request.registration}</div>
          <div className="text-sm text-gray-500 mt-2">Утас</div>
          <div className="font-medium">{request.phone}</div>
          <div className="text-sm text-gray-500 mt-2">Үнэ</div>
          <div className="font-medium">{request.price}₮</div>
        </>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-3xl font-bold text-gray-900">Bond Requests</h1>
            <div className="flex space-x-2">
              <button
                onClick={() => setActiveTab('buy')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'buy'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Buy Requests
              </button>
              <button
                onClick={() => setActiveTab('sell')}
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'sell'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                Sell Requests
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-500">Үлдэгдэл</div>
            <div className="text-2xl font-bold text-gray-900">
              {balance.toLocaleString()}₮
            </div>
          </div>
        </div>
        {isUpdating && (
          <div className="fixed inset-0 bg-white/50 z-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          {["pending", "accepted", "declined"].map((status) => (
            <div
              key={status}
              className="bg-white rounded-lg shadow-sm p-4"
              onDragOver={handleDragOver}
              onDrop={(e) =>
                handleDrop(e, status as "pending" | "accepted" | "declined" | "normal")
              }
            >
              <div
                className={`flex items-center justify-between mb-4 p-2 rounded-md ${getStatusColor(
                  status
                )}`}
              >
                <div className="flex items-center">
                  {getStatusIcon(status)}
                  <span className="ml-2 font-medium capitalize">{status}</span>
                </div>
                <span className="text-sm font-medium">
                  {getRequestsByStatus(status).length}
                </span>
              </div>

              <div className="space-y-4 min-h-[200px]">
                {getRequestsByStatus(status).map((request) => (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div
                      draggable
                      onDragStart={(e: React.DragEvent<HTMLDivElement>) => handleDragStart(e, request)}
                      onDragEnd={handleDragEnd}
                      onClick={(e) => toggleRequestDetails(request.id, e)}
                      className={`p-4 rounded-lg shadow-sm cursor-pointer transition-colors ${
                        getRequestBackgroundColor(request.userEmail)
                      }`}
                    >
                      {renderRequestDetails(request)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}


