// "use client";

// import { useState, useEffect } from "react";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";

// interface CompanyRequest {
//   _id: string;
//   companyName: string;
//   email: string;
//   phone: string;
//   status: "pending" | "accepted" | "declined";
//   createdAt: string;
// }

// export default function DashboardPage() {
//   const [requests, setRequests] = useState<CompanyRequest[]>([]);
//   const [status, setStatus] = useState("pending");
//   const [loading, setLoading] = useState(true);

//   const fetchRequests = async () => {
//     try {
//       const response = await fetch(
//         `/api/admin/company-requests?status=${status}`
//       );
//       const data = await response.json();
//       setRequests(data);
//     } catch (error) {
//       toast.error("Failed to fetch requests");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleStatusChange = async (
//     requestId: string,
//     newStatus: "accepted" | "declined"
//   ) => {
//     try {
//       const response = await fetch("/api/admin/company-requests", {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ requestId, status: newStatus }),
//       });

//       if (response.ok) {
//         toast.success("Status updated successfully");
//         fetchRequests();
//       } else {
//         toast.error("Failed to update status");
//       }
//     } catch (error) {
//       toast.error("Failed to update status");
//     }
//   };

//   useEffect(() => {
//     fetchRequests();
//   }, [status]);

//   return (
//     <div className="container mx-auto py-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Company Requests</CardTitle>
//           <div className="flex items-center space-x-4">
//             <Select value={status} onValueChange={setStatus}>
//               <SelectTrigger className="w-[180px]">
//                 <SelectValue placeholder="Select status" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="pending">Pending</SelectItem>
//                 <SelectItem value="accepted">Accepted</SelectItem>
//                 <SelectItem value="declined">Declined</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Company Name</TableHead>
//                 <TableHead>Email</TableHead>
//                 <TableHead>Phone</TableHead>
//                 <TableHead>Date</TableHead>
//                 <TableHead>Status</TableHead>
//                 <TableHead>Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {loading ? (
//                 <TableRow>
//                   <TableCell colSpan={6} className="text-center">
//                     Loading...
//                   </TableCell>
//                 </TableRow>
//               ) : requests.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={6} className="text-center">
//                     No requests found
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 requests.map((request) => (
//                   <TableRow key={request._id}>
//                     <TableCell>{request.companyName}</TableCell>
//                     <TableCell>{request.email}</TableCell>
//                     <TableCell>{request.phone}</TableCell>
//                     <TableCell>
//                       {new Date(request.createdAt).toLocaleDateString()}
//                     </TableCell>
//                     <TableCell>{request.status}</TableCell>
//                     <TableCell>
//                       {request.status === "pending" && (
//                         <div className="flex space-x-2">
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() =>
//                               handleStatusChange(request._id, "accepted")
//                             }
//                           >
//                             Accept
//                           </Button>
//                           <Button
//                             variant="outline"
//                             size="sm"
//                             onClick={() =>
//                               handleStatusChange(request._id, "declined")
//                             }
//                           >
//                             Decline
//                           </Button>
//                         </div>
//                       )}
//                     </TableCell>
//                   </TableRow>
//                 ))
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
