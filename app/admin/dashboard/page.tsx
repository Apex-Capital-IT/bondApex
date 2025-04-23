'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BondRequest } from '@/app/models/BondRequest';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Check, X, Clock, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const [requests, setRequests] = useState<BondRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<BondRequest | null>(null);
  const [declineReason, setDeclineReason] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if there's a saved code in localStorage
    const savedCode = localStorage.getItem('adminCode');
    const savedTime = localStorage.getItem('adminCodeTime');
    
    if (!savedCode || !savedTime) {
      router.push('/admin');
      return;
    }

    const currentTime = new Date().getTime();
    const savedTimeNum = parseInt(savedTime);
    const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds
    
    if (currentTime - savedTimeNum >= fiveMinutes) {
      // Clear expired code and redirect
      localStorage.removeItem('adminCode');
      localStorage.removeItem('adminCodeTime');
      router.push('/admin');
      return;
    }

    const fetchRequests = async () => {
      try {
        const response = await fetch('/api/bond/requests');
        if (response.ok) {
          const data = await response.json();
          setRequests(data);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRequests();
  }, [router]);

  const handleStatusChange = async (request: BondRequest, newStatus: 'pending' | 'accepted' | 'declined') => {
    try {
      const response = await fetch(`/api/bond/request/${request.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
          declineReason: newStatus === 'declined' ? declineReason : undefined,
        }),
      });

      if (response.ok) {
        setRequests(requests.map(r => 
          r.id === request.id 
            ? { ...r, status: newStatus, declineReason: newStatus === 'declined' ? declineReason : undefined }
            : r
        ));
        setSelectedRequest(null);
        setDeclineReason('');
      }
    } catch (error) {
      console.error('Error updating request status:', error);
    }
  };

  const handleDragStart = (e: React.DragEvent, request: BondRequest) => {
    e.dataTransfer.setData('requestId', request.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, newStatus: 'pending' | 'accepted' | 'declined') => {
    e.preventDefault();
    const requestId = e.dataTransfer.getData('requestId');
    const request = requests.find(r => r.id === requestId);
    
    if (request && request.status !== newStatus) {
      if (newStatus === 'declined') {
        setSelectedRequest(request);
      } else {
        handleStatusChange(request, newStatus);
      }
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Check className="w-5 h-5 text-green-500" />;
      case 'declined':
        return <X className="w-5 h-5 text-red-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'declined':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRequestsByStatus = (status: string) => {
    return requests.filter(request => request.status === status);
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
        
        <div className="grid grid-cols-3 gap-6">
          {['pending', 'accepted', 'declined'].map((status) => (
            <div 
              key={status} 
              className="bg-white rounded-lg shadow-sm p-4"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status as 'pending' | 'accepted' | 'declined')}
            >
              <div className={`flex items-center justify-between mb-4 p-2 rounded-md ${getStatusColor(status)}`}>
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
                    className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-move"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{request.bondTitle}</h3>
                        <p className="text-sm text-gray-500">
                          {request.userEmail}
                        </p>
                        <p className="text-sm text-gray-500">
                          {format(new Date(request.timestamp), 'PPP p')}
                        </p>
                      </div>
                    </div>

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
                          onClick={() => handleStatusChange(request, 'declined')}
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
    </div>
  );
} 