"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BondRequest } from "@/app/models/BondRequest";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Check, X, Clock, AlertCircle } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AdminDashboard() {
  const [requests, setRequests] = useState<BondRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<BondRequest | null>(
    null
  );
  const [declineReason, setDeclineReason] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [expandedRequestId, setExpandedRequestId] = useState<string | null>(
    null
  );
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

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
        const response = await fetch("/api/bond/requests");
        if (response.ok) {
          const data = await response.json();
          setRequests(data);
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
    request: BondRequest,
    newStatus: "pending" | "accepted" | "declined"
  ) => {
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/bond/request/${request.id}`, {
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
        setRequests(
          requests.map((r) =>
            r.id === request.id
              ? {
                  ...r,
                  status: newStatus,
                  declineReason:
                    newStatus === "declined" ? declineReason : undefined,
                }
              : r
          )
        );
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

  const handleDragStart = (e: React.DragEvent, request: BondRequest) => {
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
    newStatus: "pending" | "accepted" | "declined"
  ) => {
    e.preventDefault();
    if (isUpdating) return; // prevent multiple drops

    const requestId = e.dataTransfer.getData("requestId");
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

  const getRequestsByStatus = (status: string) => {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Bond Requests</h1>
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
                handleDrop(e, status as "pending" | "accepted" | "declined")
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
                    draggable
                    onDragStart={(e) => handleDragStart(e, request)}
                    onDragEnd={handleDragEnd}
                    onClick={(e) => toggleRequestDetails(request.id, e)}
                    className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {request.bondTitle}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {request.userEmail}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(request.timestamp), "PPP p")}
                        </p>
                      </div>
                      <div className="text-gray-400">
                        {expandedRequestId === request.id ? "▲" : "▼"}
                      </div>
                    </div>

                    {/* Expanded View with Form Details */}
                    {expandedRequestId === request.id && (
                      <motion.div
                        className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                      >
                        <h4 className="font-medium text-gray-700 mb-2">
                          Form Details
                        </h4>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {/* Submitted Form Details */}
                          {request.name && (
                            <div className="flex flex-col gap-2">
                              <p className="text-gray-500">Name:</p>
                              <p className="font-medium">{request.name}</p>

                              <p className="text-gray-500">Registration:</p>
                              <p className="font-medium">
                                {request.registration || "N/A"}
                              </p>

                              <p className="text-gray-500">Email:</p>
                              <p className="font-medium">{request.userEmail}</p>

                              <p className="text-gray-500">Phone:</p>
                              <p className="font-medium">
                                {request.phone || "N/A"}
                              </p>

                              <p className="text-gray-500">Price:</p>
                              <p className="font-medium">
                                {request.price || "N/A"}
                              </p>
                            </div>
                          )}

                          <div className="col-span-2 mt-2">
                            <h4 className="font-medium text-gray-700 mb-1">
                              Bond Details
                            </h4>
                            <p className="text-gray-500">
                              Bond ID:{" "}
                              <span className="font-medium">
                                {request.bondId}
                              </span>
                            </p>

                            {request.nominalPrice && (
                              <p className="text-gray-500">
                                Nominal Price:{" "}
                                <span className="font-medium">
                                  {request.nominalPrice}
                                </span>
                              </p>
                            )}

                            {request.unitPrice && (
                              <p className="text-gray-500">
                                Unit Price:{" "}
                                <span className="font-medium">
                                  {request.unitPrice}
                                </span>
                              </p>
                            )}

                            {request.features &&
                              request.features.length > 0 && (
                                <div className="mt-1">
                                  <p className="text-gray-500">Features:</p>
                                  <ul className="list-disc list-inside ml-2">
                                    {request.features.map((feature, index) => (
                                      <li key={index} className="text-xs">
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

                    {selectedRequest?.id === request.id && (
                      <div className="mt-4">
                        <input
                          type="text"
                          value={declineReason}
                          onChange={(e) => setDeclineReason(e.target.value)}
                          placeholder="Enter decline reason"
                          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        <button
                          onClick={() =>
                            handleStatusChange(request, "declined")
                          }
                          className="mt-2 w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                        >
                          Confirm Decline
                        </button>
                      </div>
                    )}
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
