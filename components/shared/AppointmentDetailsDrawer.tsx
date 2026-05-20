"use client";

import React, { useState, useEffect } from "react";
import Drawer from "./Drawer";
import StatusBadge from "@/components/shared/badges/StatusBadge";

interface Appointment {
  id: string;
  customerName: string;
  serviceName: string;
  time: string;
  staffName: string;
  status: string;
  price: string;
  notes?: string;
}

interface AppointmentDetailsDrawerProps {
  appointment: Appointment | null;
  onClose: () => void;
  onApprove?: (id: string) => void;
  onCancel?: (id: string) => void;
  onComplete?: (id: string) => void;
  onSendCustomAlert?: (id: string, message: string) => void;
}

export default function AppointmentDetailsDrawer({
  appointment,
  onClose,
  onApprove,
  onCancel,
  onComplete,
  onSendCustomAlert,
}: AppointmentDetailsDrawerProps) {
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    if (appointment) {
      setAlertMessage("");
    }
  }, [appointment]);

  if (!appointment) return null;

  const hasActions = onApprove || onCancel || onComplete;

  return (
    <Drawer
      isOpen={appointment !== null}
      onClose={onClose}
      title="Appointment Details"
      description="Complete booking information, stylist assignment, and transaction details."
      size="md"
      footer={
        hasActions && (
          <div className="flex items-center justify-between select-none w-full border-t border-gray-100 dark:border-gray-800 pt-4 bg-white dark:bg-gray-900">
            {/* Left Side: Cancel trigger (if active) otherwise empty spacer */}
            <div>
              {appointment.status !== "cancelled" && appointment.status !== "completed" && onCancel ? (
                <button
                  onClick={() => onCancel(appointment.id)}
                  className="px-4 py-2.5 text-xs font-bold border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 hover:border-red-300 dark:hover:border-red-800 rounded-lg transition-all cursor-pointer shadow-2xs flex items-center justify-center h-[38px]"
                >
                  Cancel Booking
                </button>
              ) : (
                <span className="text-[11px] font-semibold text-gray-400 dark:text-gray-500">
                  Archived Appointment
                </span>
              )}
            </div>

            {/* Right Side: Close View & Primary Action Button */}
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all cursor-pointer shadow-2xs flex items-center justify-center h-[38px]"
              >
                Close View
              </button>

              {appointment.status === "pending" && onApprove && (
                <button
                  onClick={() => onApprove(appointment.id)}
                  className="px-4 py-2.5 text-xs font-bold bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-white text-white dark:text-gray-900 rounded-lg transition-all cursor-pointer shadow-sm flex items-center justify-center h-[38px]"
                >
                  Approve Appointment
                </button>
              )}

              {appointment.status === "confirmed" && onComplete && (
                <button
                  onClick={() => onComplete(appointment.id)}
                  className="px-4 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all cursor-pointer shadow-sm flex items-center justify-center h-[38px]"
                >
                  Mark Completed
                </button>
              )}

              {appointment.status === "completed" && (
                <button
                  disabled
                  className="px-4 py-2.5 text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center h-[38px] cursor-not-allowed"
                >
                  Completed
                </button>
              )}

              {appointment.status === "cancelled" && (
                <button
                  disabled
                  className="px-4 py-2.5 text-xs font-bold bg-gray-100 dark:bg-gray-800 text-red-400 dark:text-red-600 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center h-[38px] cursor-not-allowed"
                >
                  Cancelled
                </button>
              )}
            </div>
          </div>
        )
      }
    >
      <div className="space-y-6 animate-fade-in-quick">
        {/* Customer Profile Block */}
        <div className="flex items-center gap-4 pb-5 border-b border-gray-100 dark:border-gray-800">
          <div className="h-12 w-12 rounded-full bg-gray-900 dark:bg-gray-700 flex items-center justify-center text-white font-extrabold text-base border border-gray-200 dark:border-gray-600 shadow-2xs">
            {appointment.customerName.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <h4 className="text-base font-semibold text-gray-900 dark:text-gray-100 leading-none">
              {appointment.customerName}
            </h4>
            <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mt-1.5">
              Customer Reference ID: {appointment.id}
            </p>
          </div>
        </div>

        {/* Grid Details */}
        <div className="grid grid-cols-2 gap-y-5 gap-x-4">
          <div>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 leading-none">
              Service Selected
            </span>
            <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1.5">
              {appointment.serviceName}
            </span>
          </div>

          <div>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 leading-none">
              Assigned Stylist
            </span>
            <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1.5">
              {appointment.staffName}
            </span>
          </div>

          <div>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 leading-none">
              Scheduled Time
            </span>
            <span className="block text-sm font-semibold text-gray-900 dark:text-gray-100 mt-1.5">
              Today, {appointment.time}
            </span>
          </div>

          <div>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 leading-none">
              Price Rate
            </span>
            <span className="block text-sm font-bold text-gray-900 dark:text-gray-100 mt-1.5">
              {appointment.price}
            </span>
          </div>
        </div>

        {/* Booking Status Box */}
        <div className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg p-4 flex items-center justify-between">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
            Current Status
          </span>
          <StatusBadge status={appointment.status} />
        </div>

        {/* Notes & Instructions */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
            Notes & Instructions
          </h4>
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-lg p-3.5 leading-relaxed">
            {appointment.notes || "Customer requested styling with standard soft curling iron treatment. Prefers zero scented products if available."}
          </p>
        </div>

        {/* Send Custom Alert to Customer */}
        {onSendCustomAlert && (
          <div className="space-y-3 border-t border-gray-100 dark:border-gray-800 pt-5">
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Send Alert/Message to Customer
            </h4>
            <div className="flex flex-col gap-2">
              <textarea
                value={alertMessage}
                onChange={(e) => setAlertMessage(e.target.value)}
                placeholder="Type a custom message, push reminder, or update notification to send to the client..."
                rows={2}
                className="w-full text-xs font-medium border border-gray-200 dark:border-gray-700 rounded-lg p-2.5 focus:border-gray-905 dark:focus:border-gray-450 focus:outline-none bg-gray-50/20 dark:bg-gray-800 placeholder:text-gray-400 dark:placeholder:text-gray-600 text-gray-900 dark:text-gray-100 leading-normal"
              />
              <button
                type="button"
                onClick={() => {
                  if (alertMessage.trim()) {
                    onSendCustomAlert(appointment.id, alertMessage.trim());
                    setAlertMessage("");
                    alert("Notification message successfully pushed to customer inbox.");
                  }
                }}
                disabled={!alertMessage.trim()}
                className="self-end px-3.5 py-2 text-[10px] font-extrabold uppercase tracking-wider text-white dark:text-gray-900 bg-gray-900 dark:bg-gray-100 hover:bg-gray-800 dark:hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Send Message Alert
              </button>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}
