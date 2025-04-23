'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BondRequest } from '@/app/models/BondRequest';
import { format } from 'date-fns';

interface SortableItemProps {
  id: string;
  request: BondRequest;
  selectedRequest: BondRequest | null;
  setSelectedRequest: (request: BondRequest | null) => void;
  declineReason: string;
  setDeclineReason: (reason: string) => void;
  handleStatusChange: (request: BondRequest, status: 'pending' | 'accepted' | 'declined') => void;
}

export function SortableItem({
  id,
  request,
  selectedRequest,
  setSelectedRequest,
  declineReason,
  setDeclineReason,
  handleStatusChange,
}: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-move"
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
    </div>
  );
} 