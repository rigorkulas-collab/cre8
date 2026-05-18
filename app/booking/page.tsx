"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import CustomerLayout from "@/components/layout/customer/CustomerLayout";
import FormTextarea from "@/components/shared/forms/FormTextarea";
import Button from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Clock, 
  Calendar as CalendarIcon, 
  Check, 
  ChevronRight, 
  ArrowLeft, 
  CalendarCheck2,
  Wallet,
  CreditCard,
  Lock,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Service, Staff } from "@/types";
import { mockServices } from "@/lib/mock-data/mockServices";
import { mockStylists } from "@/lib/mock-data/mockStaff";
import { mockTimeSlots } from "@/lib/mock-data/mockBookings";

// Helper to generate dynamic touch-friendly calendar dates
const generateDays = () => {
  const days = [];
  const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date();
  
  for (let i = 0; i < 10; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    days.push({
      dateStr: nextDate.toISOString().split("T")[0],
      dayName: weekdayNames[nextDate.getDay()],
      dayNum: nextDate.getDate(),
      fullStr: nextDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    });
  }
  return days;
};

function BookingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId");

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedStylist, setSelectedStylist] = useState<Staff | null>(mockStylists[3]);
  const [selectedDay, setSelectedDay] = useState<any>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [isConfirming, setIsConfirming] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"salon" | "online">("salon");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [paymentErrors, setPaymentErrors] = useState<{ [key: string]: string }>({});

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const formatted = rawVal.match(/.{1,4}/g)?.join(" ") || rawVal;
    setCardNumber(formatted.substring(0, 19)); // Max 16 digits + 3 spaces
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let rawVal = e.target.value.replace(/[^0-9]/gi, "");
    if (rawVal.length > 2) {
      rawVal = `${rawVal.substring(0, 2)}/${rawVal.substring(2, 4)}`;
    }
    setCardExpiry(rawVal.substring(0, 5)); // Max MM/YY
  };

  const days = useMemo(() => generateDays(), []);

  // Pre-fill active service item
  const activeService = useMemo(() => {
    return mockServices.find(s => s.id === serviceId) || mockServices[0];
  }, [serviceId]);

  // Set default day selection
  useEffect(() => {
    if (days.length > 0 && !selectedDay) {
      setSelectedDay(days[0]);
    }
  }, [days, selectedDay]);

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleConfirm = () => {
    if (paymentMethod === "online") {
      const errors: { [key: string]: string } = {};
      
      if (!cardName.trim()) {
        errors.name = "Cardholder name is required";
      }
      
      const cleanNum = cardNumber.replace(/\s+/g, "");
      if (cleanNum.length < 15 || cleanNum.length > 16) {
        errors.number = "Enter a valid 15 or 16-digit card number";
      }
      
      if (!cardExpiry.includes("/")) {
        errors.expiry = "Use MM/YY format";
      } else {
        const [month, year] = cardExpiry.split("/");
        const mNum = parseInt(month, 10);
        if (isNaN(mNum) || mNum < 1 || mNum > 12) {
          errors.expiry = "Month must be 01-12";
        }
      }
      
      if (cardCvc.replace(/[^0-9]/g, "").length < 3) {
        errors.cvc = "Min 3 digits";
      }
      
      if (Object.keys(errors).length > 0) {
        setPaymentErrors(errors);
        return;
      }
    }
    
    setPaymentErrors({});
    // Generate simple premium transaction ref code
    const randCode = Math.random().toString(36).substring(2, 7).toUpperCase();
    setBookingRef(`CRE8-${randCode}`);
    setIsConfirming(true);
  };

  const canProceed = () => {
    if (currentStep === 1) return true;
    if (currentStep === 2) return selectedStylist !== null;
    if (currentStep === 3) return selectedDay !== null;
    if (currentStep === 4) return selectedTimeSlot !== null;
    return true;
  };

  return (
    <CustomerLayout
      showBottomNav={true}
      headerProps={{
        title: `STEP ${currentStep} OF 5`,
        showBackButton: currentStep > 1,
        onBackClick: handleBack,
      }}
    >
      <div className="flex flex-col h-full bg-white dark:bg-gray-900 select-none relative animate-page-in transition-colors duration-200">
        
        {/* Step indicator progress bar */}
        <div className="w-full bg-gray-100 dark:bg-gray-800 h-1 shrink-0 relative overflow-hidden">
          <div 
            className="bg-gradient-to-r from-amber-400 to-amber-600 shadow-[0_1px_6px_rgba(245,158,11,0.25)] h-full transition-all duration-300 ease-in-out" 
            style={{ width: `${(currentStep / 5) * 100}%` }}
          />
        </div>

        {/* Scrollable central content area */}
        <div className="flex-1 overflow-y-auto p-4 pb-24 scrollbar-none">
          
          {/* STEP 1: SERVICE REVIEW */}
          {currentStep === 1 && (
            <div className="flex flex-col gap-6 animate-fade-in-quick">
              <div className="flex flex-col gap-1.5 text-center pt-2">
                <h2 className="text-base font-extrabold text-gray-900 dark:text-gray-100 tracking-wide leading-none">
                  Review Selected Service
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1">
                  Ensure this is the desired styling treatment before picking your stylist
                </p>
              </div>

              {/* Service Details Card */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 rounded-2xl p-6 flex flex-col gap-5 shadow-xs transition-colors duration-200">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-[9px] font-extrabold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                      {activeService.category} Treatment
                    </span>
                    <h3 className="text-sm font-extrabold text-gray-900 dark:text-gray-100 truncate">
                      {activeService.name}
                    </h3>
                  </div>
                  <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 shrink-0">
                    {activeService.price}
                  </span>
                </div>
                
                <p className="text-[10px] font-semibold text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg p-3 transition-colors duration-200">
                  {activeService.description}
                </p>

                <div className="flex items-center gap-2 text-[10px] font-extrabold text-gray-600 dark:text-gray-400 transition-colors duration-200">
                  <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400 shrink-0" />
                  <span>Duration: {activeService.duration}</span>
                </div>
              </div>

              <button
                onClick={() => router.push("/browse-services")}
                className="w-full flex items-center justify-between border border-gray-200 dark:border-gray-800 rounded-2xl p-4.5 bg-gray-50/50 dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 active:scale-[0.99] transition-all text-xs font-bold text-gray-900 dark:text-gray-200 cursor-pointer"
              >
                <span>Browse other options</span>
                <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          )}

          {/* STEP 2: STYLIST SELECTION [NEW] */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-6 animate-fade-in-quick">
              <div className="flex flex-col gap-1.5 text-center pt-2">
                <h2 className="text-base font-extrabold text-gray-900 dark:text-gray-100 tracking-wide leading-none">
                  Select Styling Professional
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1">
                  Choose a favorite specialist or pick any stylist for the first available slot
                </p>
              </div>

              {/* Stylists Vertical Stack */}
              <div className="flex flex-col gap-3 select-none">
                {mockStylists.map((stylist, index) => {
                  const isSelected = selectedStylist?.id === stylist.id;
                  
                  // Generate circular initials
                  const initials = stylist.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase();

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedStylist(stylist)}
                      className={cn(
                        "flex items-center justify-between p-4.5 rounded-2xl border text-left cursor-pointer transition-all duration-150 active:scale-[0.99] select-none",
                        isSelected
                          ? "bg-white dark:bg-gray-800 border-gray-900 dark:border-gray-100 shadow-2xs ring-1 ring-gray-900 dark:ring-gray-100"
                          : "bg-gray-50/50 dark:bg-gray-900 border-gray-200 dark:border-gray-700/60 hover:bg-white dark:hover:bg-gray-850"
                      )}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        {/* Custom HSL Avatar initials badge */}
                        <div className={cn(
                          "h-11 w-11 rounded-full flex items-center justify-center text-xs font-bold shrink-0 tracking-wider transition-colors select-none",
                          isSelected
                            ? "bg-gray-950 text-white dark:bg-white dark:text-gray-900"
                            : "bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        )}>
                          {initials}
                        </div>

                        <div className="flex flex-col gap-0.5 min-w-0">
                          <span className="text-xs font-extrabold text-gray-900 dark:text-gray-100 truncate">
                            {stylist.name}
                          </span>
                          <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400/90 leading-none mt-0.5">
                            {stylist.role}
                          </span>
                        </div>
                      </div>

                      {/* Right rating & select check container */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-100/40 dark:border-amber-900/30 px-2 py-1 rounded-md">
                          <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 leading-none">
                            ★ {stylist.rating}
                          </span>
                        </div>

                        {isSelected && (
                          <div className="h-5 w-5 rounded-full bg-gray-900 dark:bg-gray-100 flex items-center justify-center text-white dark:text-gray-900 transition-all select-none">
                            <Check className="h-3 w-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: DATE SELECTION */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-6 animate-fade-in-quick">
              <div className="flex flex-col gap-1.5 text-center pt-2">
                <h2 className="text-base font-extrabold text-gray-900 dark:text-gray-100 tracking-wide leading-none">
                  Choose Appointment Date
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1">
                  Select a convenient day for your schedule this week
                </p>
              </div>

              {/* Horizontal Scroll tactile Date Picker */}
              <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2 select-none border-b border-gray-100/50 dark:border-gray-800 transition-colors duration-200">
                {days.map((day, index) => {
                  const isSelected = selectedDay?.dateStr === day.dateStr;
                  return (
                    <button
                      key={index}
                      onClick={() => setSelectedDay(day)}
                      className={cn(
                        "flex flex-col items-center justify-center gap-1.5 w-16 py-4 shrink-0 rounded-2xl border transition-all duration-150 active:scale-90 cursor-pointer select-none",
                        isSelected
                          ? "bg-gray-900 dark:bg-gray-100 border-gray-900 dark:border-gray-100 text-white dark:text-gray-900 shadow-xs"
                          : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                      )}
                    >
                      <span className="text-[9px] font-bold uppercase tracking-wider">
                        {day.dayName}
                      </span>
                      <span className="text-sm font-extrabold">
                        {day.dayNum}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Summary of Active Selection */}
              {selectedDay && (
                <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700 rounded-2xl p-5 flex items-center gap-3.5 transition-colors duration-200">
                  <CalendarIcon className="h-5 w-5 text-gray-500 dark:text-gray-400 shrink-0" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                      Selected Date
                    </span>
                    <span className="text-xs font-extrabold text-gray-900 dark:text-gray-100 mt-0.5">
                      {selectedDay.fullStr}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: TIME SLOT SELECTION */}
          {currentStep === 4 && (
            <div className="flex flex-col gap-6 animate-fade-in-quick">
              <div className="flex flex-col gap-1.5 text-center pt-2">
                <h2 className="text-base font-extrabold text-gray-900 dark:text-gray-100 tracking-wide leading-none">
                  Pick Available Time Slot
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1">
                  Available sessions for {selectedDay?.fullStr}
                </p>
              </div>

              {/* Time Slots Grid */}
              <div className="grid grid-cols-2 gap-3 select-none">
                {mockTimeSlots.map((slot, index) => {
                  const isSelected = selectedTimeSlot === slot.time;
                  return (
                    <button
                      key={index}
                      disabled={!slot.available}
                      onClick={() => setSelectedTimeSlot(slot.time)}
                      className={cn(
                        "py-4 px-5 rounded-2xl border text-sm font-bold transition-all duration-150 active:scale-95 cursor-pointer transition-colors duration-150",
                        !slot.available && "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-800 text-gray-300 dark:text-gray-600 cursor-not-allowed",
                        slot.available && !isSelected && "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:border-gray-900 dark:hover:border-gray-100",
                        slot.available && isSelected && "bg-gray-900 dark:bg-gray-100 border-gray-900 dark:border-gray-100 text-white dark:text-gray-900 shadow-xs"
                      )}
                    >
                      {slot.time}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 5: REVIEW SUMMARY & NOTES */}
          {currentStep === 5 && (
            <div className="flex flex-col gap-6 animate-fade-in-quick">
              <div className="flex flex-col gap-1.5 text-center pt-2">
                <h2 className="text-base font-extrabold text-gray-900 dark:text-gray-100 tracking-wide leading-none">
                  Review & Confirm Bookings
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-1">
                  Double check selected parameters before initiating scheduling
                </p>
              </div>

              {/* Visual specification cards */}
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/60 rounded-2xl p-6 flex flex-col gap-5 shadow-xs transition-colors duration-200">
                
                {/* Service */}
                <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800 pb-3 transition-colors duration-200">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-extrabold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                      Treatment
                    </span>
                    <span className="text-xs font-extrabold text-gray-900 dark:text-gray-100 mt-0.5">
                      {activeService.name}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400">{activeService.price}</span>
                </div>

                {/* Schedule */}
                <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800 pb-3 transition-colors duration-200">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-extrabold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                      Date & Time Slot
                    </span>
                    <span className="text-xs font-extrabold text-gray-900 dark:text-gray-100 mt-0.5">
                      {selectedDay?.fullStr}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-gray-900 dark:text-gray-100">{selectedTimeSlot}</span>
                </div>

                {/* Duration */}
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-gray-600 dark:text-gray-400 uppercase tracking-widest text-[9px]">
                    Expected Duration
                  </span>
                  <span className="font-extrabold text-gray-900 dark:text-gray-100">{activeService.duration}</span>
                </div>

              </div>

              {/* Special appointment instructions notes */}
              <FormTextarea
                label="Appointment Notes"
                placeholder="Specify hair textures, styling preferences, or allergy alerts..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />

              {/* Payment Method Selector Block */}
              <div className="flex flex-col gap-3 text-left">
                <label className="text-[10px] font-extrabold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentMethod("salon");
                      setPaymentErrors({});
                    }}
                    className={cn(
                      "flex flex-col items-start gap-1.5 p-4 rounded-2xl border text-left cursor-pointer transition-all duration-150 active:scale-[0.98] select-none",
                      paymentMethod === "salon"
                        ? "bg-white dark:bg-gray-800 border-gray-900 dark:border-gray-100 shadow-2xs ring-1 ring-gray-900 dark:ring-gray-100"
                        : "bg-gray-50/50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:bg-white dark:hover:bg-gray-850"
                    )}
                  >
                    <Wallet className="h-5 w-5 text-gray-600 dark:text-gray-400 shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[11px] font-extrabold text-gray-900 dark:text-gray-100 leading-none">
                        Pay at Salon
                      </span>
                      <span className="text-[9px] font-semibold text-gray-500 dark:text-gray-500 mt-1 leading-none">
                        Pay after treatment
                      </span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("online")}
                    className={cn(
                      "flex flex-col items-start gap-1.5 p-4 rounded-2xl border text-left cursor-pointer transition-all duration-150 active:scale-[0.98] select-none",
                      paymentMethod === "online"
                        ? "bg-white dark:bg-gray-800 border-gray-900 dark:border-gray-100 shadow-2xs ring-1 ring-gray-900 dark:ring-gray-100"
                        : "bg-gray-50/50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 hover:bg-white dark:hover:bg-gray-850"
                    )}
                  >
                    <CreditCard className="h-5 w-5 text-gray-600 dark:text-gray-400 shrink-0" />
                    <div className="flex flex-col">
                      <span className="text-[11px] font-extrabold text-gray-900 dark:text-gray-100 leading-none">
                        Pay Online Now
                      </span>
                      <span className="text-[9px] font-semibold text-gray-500 dark:text-gray-500 mt-1 leading-none">
                        Secure checkout
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Dynamic Online Payment Details Form */}
              {paymentMethod === "online" && (
                <div className="flex flex-col gap-4 border border-gray-100 dark:border-gray-800/80 rounded-2xl p-5 bg-gray-50/30 dark:bg-gray-800/20 transition-all duration-200 animate-fade-in-quick">
                  
                  {/* Apple Pay placeholder button */}
                  <button
                    type="button"
                    onClick={() => alert("Apple Pay simulated successfully!")}
                    className="w-full bg-black hover:bg-black/90 text-white rounded-xl py-3 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer select-none"
                  >
                    Apple Pay
                  </button>

                  <div className="flex items-center gap-2 select-none justify-center">
                    <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
                    <span className="text-[9px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                      Or pay with card
                    </span>
                    <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
                  </div>

                  {/* Card Name */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[10px] font-extrabold text-gray-600 dark:text-gray-400 uppercase tracking-widest leading-none">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Jane Doe"
                      className="px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all font-medium"
                    />
                    {paymentErrors.name && (
                      <span className="text-[9px] font-bold text-red-500 mt-0.5">{paymentErrors.name}</span>
                    )}
                  </div>

                  {/* Card Number */}
                  <div className="flex flex-col gap-1.5 text-left">
                    <label className="text-[10px] font-extrabold text-gray-600 dark:text-gray-400 uppercase tracking-widest leading-none">
                      Card Number
                    </label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4111 2222 3333 4444"
                        className="w-full pl-3.5 pr-10 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all font-mono tracking-wider font-semibold"
                      />
                      <Lock className="absolute right-3.5 h-3.5 w-3.5 text-gray-400" />
                    </div>
                    {paymentErrors.number && (
                      <span className="text-[9px] font-bold text-red-500 mt-0.5">{paymentErrors.number}</span>
                    )}
                  </div>

                  {/* Expiry & CVC horizontal split */}
                  <div className="grid grid-cols-2 gap-3.5">
                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-[10px] font-extrabold text-gray-600 dark:text-gray-400 uppercase tracking-widest leading-none">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        className="px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all font-mono font-semibold"
                      />
                      {paymentErrors.expiry && (
                        <span className="text-[9px] font-bold text-red-500 mt-0.5">{paymentErrors.expiry}</span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5 text-left">
                      <label className="text-[10px] font-extrabold text-gray-600 dark:text-gray-400 uppercase tracking-widest leading-none">
                        CVC / CVV
                      </label>
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/[^0-9]/g, "").substring(0, 4))}
                        placeholder="•••"
                        className="px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-xs placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all font-mono font-semibold"
                      />
                      {paymentErrors.cvc && (
                        <span className="text-[9px] font-bold text-red-500 mt-0.5">{paymentErrors.cvc}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 select-none pt-1">
                    <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
                    <span className="text-[9px] font-bold text-gray-500 dark:text-gray-400 leading-none">
                      Your transactional billing details are completely encrypted
                    </span>
                  </div>

                </div>
              )}

              {/* Promo input code placeholder */}
              <div className="flex flex-col gap-1.5 text-left">
                <label className="text-[10px] font-extrabold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                  Promo / Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="e.g. MONOCHROME10"
                    className="flex-1 px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xs text-xs placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all font-medium uppercase"
                  />
                  <button
                    type="button"
                    onClick={() => alert("Promo code verified simulated successfully!")}
                    className="px-4 py-2 bg-gray-900 dark:bg-gray-800 hover:bg-gray-800 dark:hover:bg-gray-700 text-white dark:text-gray-100 rounded-lg text-xs font-extrabold cursor-pointer transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Sticky bottom CTA actions container */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-gray-900/95 border-t border-gray-100 dark:border-gray-800 z-10 shrink-0 backdrop-blur-xs flex items-center gap-3 transition-colors duration-200">
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={handleBack}
              size="default"
              className="py-4 px-5 rounded-2xl shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          )}
          
          <Button
            variant="primary"
            disabled={!canProceed()}
            onClick={currentStep === 5 ? handleConfirm : handleNext}
            size="default"
            className="flex-1 rounded-2xl py-4 text-sm font-bold"
          >
            {currentStep === 5 
              ? paymentMethod === "online"
                ? `Complete Payment & Book` 
                : `Confirm Booking • Pay at Checkout` 
              : "Continue Selection"}
          </Button>
        </div>

      </div>

      {/* STEP 6: CONFIRMATION RADIX DIALOG MODAL */}
      <Dialog open={isConfirming} onOpenChange={(open) => !open && setIsConfirming(false)}>
        <DialogContent className="max-w-md gap-6 rounded-xl sm:rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 shadow-2xl z-[150] select-none text-center">
          <DialogHeader className="flex flex-col items-center gap-4">
            
            {/* Visual Success Accent Icon */}
            <div className="h-12 w-12 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 animate-bounce">
              <CalendarCheck2 className="h-6 w-6" />
            </div>

            <DialogTitle className="text-base font-extrabold text-gray-900 dark:text-gray-100 tracking-wide">
              Appointment Secured!
            </DialogTitle>

            <DialogDescription className="text-xs font-semibold text-gray-500 dark:text-gray-400 leading-relaxed">
              Your appointment is fully confirmed. Salon staff will prepare for your arrival.
            </DialogDescription>
          </DialogHeader>

          {/* Collated Confirmed specifications block */}
          <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700/80 rounded-xl p-4 flex flex-col gap-3 text-left transition-colors duration-200">
            <div className="flex justify-between items-center text-xs">
              <span className="font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-[9px]">
                Reference ID
              </span>
              <span className="font-extrabold text-gray-900 dark:text-gray-100 select-text bg-gray-100 dark:bg-gray-900 px-2 py-0.5 rounded-md font-mono">
                {bookingRef}
              </span>
            </div>
            
            <div className="flex justify-between items-center text-xs border-t border-gray-200/50 dark:border-gray-800 pt-2.5 transition-colors duration-200">
              <span className="font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-[9px]">
                Service Treatment
              </span>
              <span className="font-bold text-gray-900 dark:text-gray-100">
                {activeService.name}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs border-t border-gray-200/50 dark:border-gray-800 pt-2.5 transition-colors duration-200">
              <span className="font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-[9px]">
                Schedule Slot
              </span>
              <span className="font-bold text-gray-900 dark:text-gray-100">
                {selectedDay?.dateStr} • {selectedTimeSlot}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs border-t border-gray-200/50 dark:border-gray-800 pt-2.5 transition-colors duration-200">
              <span className="font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-[9px]">
                Payment Mode
              </span>
              <span className="font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wide text-[10px]">
                {paymentMethod === "online" ? "Paid (Card Online)" : "Pay at Checkout"}
              </span>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 select-none shrink-0 w-full pt-1.5 flex flex-col gap-2">
            <Button
              variant="primary"
              onClick={() => {
                setIsConfirming(false);
                router.push("/bookings"); // Redirect to history/bookings center
              }}
              className="w-full rounded-2xl py-3.5 text-xs font-extrabold"
            >
              View My Bookings
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setIsConfirming(false);
                router.push("/browse-services"); // Return home browse services
              }}
              className="w-full rounded-2xl py-3.5 text-xs font-extrabold bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-350 border-gray-200 dark:border-gray-700"
            >
              Return to Catalog Menu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </CustomerLayout>
  );
}

export default function BookingPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 transition-colors duration-200">
        <div className="animate-pulse text-xs font-bold text-gray-405 dark:text-gray-500">Loading booking portal...</div>
      </div>
    }>
      <BookingPageContent />
    </React.Suspense>
  );
}
