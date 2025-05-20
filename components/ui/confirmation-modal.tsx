"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  loading?: boolean;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false,
}: ConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {typeof message === "string" ? (
            <p className="text-sm text-gray-600">{message}</p>
          ) : (
            message
          )}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="bg-gradient-to-r bg-gray-100 backdrop-blur-xl text-gray-600 border-0"
          >
            {cancelText}
          </Button>
          <Button
            variant="outline"
            onClick={onConfirm}
            disabled={loading}
            className="bg-gradient-to-r from-blue-500/20 to-yellow-500/20 backdrop-blur-xl text-gray-600 border-0"
          >
            {loading ? "Processing..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
