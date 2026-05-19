"use client";

import React, { useState, useMemo, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import CustomerLayout from "@/components/layout/customer/CustomerLayout";
import SearchBar from "@/components/shared/ui/SearchBar";
import Drawer from "@/components/shared/Drawer";
import Button from "@/components/ui/Button";
import { Clock, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

import { Service } from "@/types";
import { mockServices } from "@/lib/mock-data/mockServices";

const categories = ["All", "Hair", "Nails", "Facial", "Massage", "Packages"];

export default function BrowseServicesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleServiceSelection = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedServiceIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const totalPrice = useMemo(() => {
    return selectedServiceIds.reduce((sum, id) => {
      const service = mockServices.find((s) => s.id === id);
      if (service) {
        const val = parseInt(service.price.replace(/[^0-9]/g, ""), 10) || 0;
        return sum + val;
      }
      return sum;
    }, 0);
  }, [selectedServiceIds]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        setScrollProgress((scrollLeft / maxScroll) * 100);
      }
    }
  };

  const catScrollRef = useRef<HTMLDivElement>(null);
  const [catScrollProgress, setCatScrollProgress] = useState(0);
  const [isCatScrollable, setIsCatScrollable] = useState(false);

  const handleCatScroll = () => {
    if (catScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = catScrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      setIsCatScrollable(maxScroll > 0);
      if (maxScroll > 0) {
        setCatScrollProgress((scrollLeft / maxScroll) * 100);
      }
    }
  };

  useLayoutEffect(() => {
    if (catScrollRef.current) {
      const { scrollWidth, clientWidth } = catScrollRef.current;
      setIsCatScrollable(scrollWidth > clientWidth);
    }
    const handleResize = () => {
      if (catScrollRef.current) {
        const { scrollWidth, clientWidth } = catScrollRef.current;
        setIsCatScrollable(scrollWidth > clientWidth);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // In-memory filter execution
  const filteredServices = useMemo(() => {
    let result = mockServices.filter(s => s.status === "active");

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        s =>
          s.name.toLowerCase().includes(query) ||
          s.category.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter(s => s.category === selectedCategory);
    }

    return result;
  }, [searchQuery, selectedCategory]);

  // Highlight popular treatments on homepage view state
  const featuredServices = useMemo(() => {
    return mockServices.filter(s => s.popular && s.status === "active");
  }, []);

  // Group services by category for luxury salon menu list grouping
  const groupedServices = useMemo(() => {
    const groups: Record<string, Service[]> = {};
    filteredServices.forEach(s => {
      if (!groups[s.category]) {
        groups[s.category] = [];
      }
      groups[s.category].push(s);
    });
    return Object.entries(groups);
  }, [filteredServices]);

  return (
    <CustomerLayout
      showBottomNav={true}
      headerProps={{ title: "CRE8 MENU", showBackButton: false }}
    >
      <div className="flex flex-col h-full bg-white dark:bg-gray-900 select-none animate-page-in transition-colors duration-200">
        
        {/* Search input bar segment */}
        <div className="px-4 py-3 shrink-0">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Search treatments, hair, nails..."
          />
        </div>

        {/* Scrollable category selection pill bar */}
        <div className="px-4 py-2 shrink-0 border-b border-gray-100 dark:border-gray-800 pb-3 transition-colors duration-200">
          <div 
            ref={catScrollRef}
            onScroll={handleCatScroll}
            className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl overflow-x-auto scrollbar-none gap-1 transition-colors duration-200"
          >
            {categories.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "py-2 px-4.5 text-center text-xs font-bold rounded-xl transition-all duration-150 whitespace-nowrap cursor-pointer select-none",
                    isActive
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {isCatScrollable && (
            <div className="flex justify-center mt-2 shrink-0 select-none animate-fade-in-quick">
              <div className="w-12 h-[2.5px] bg-gray-200 dark:bg-gray-800 rounded-full relative overflow-hidden">
                <div 
                  className="absolute top-0 h-full bg-gray-400 dark:bg-gray-500 rounded-full transition-all duration-75 ease-out"
                  style={{ 
                    left: `${(catScrollProgress / 100) * (100 - 35)}%`, 
                    width: '35%' 
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Dynamic Nested Content Panel */}
        <div className="flex-1 overflow-y-auto scrollbar-none">
          
          {/* Elegant Carousel Recommendation Banners */}
          {selectedCategory === "All" && !searchQuery && (
            <div className="flex flex-col gap-3 px-4 py-4 border-b border-gray-100/50 dark:border-gray-800 shrink-0 bg-gray-50/20 dark:bg-gray-800/10 transition-colors duration-200">
              <h3 className="text-xs font-bold text-gray-900 dark:text-gray-200 leading-none select-none">
                Signature Collections
              </h3>
              <div 
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex gap-4 overflow-x-auto scrollbar-none pb-1 select-none"
              >
                 {featuredServices.map((service) => {
                  const isSelected = selectedServiceIds.includes(service.id);
                  return (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className="flex-shrink-0 w-[220px] bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 border border-amber-500/20 hover:border-amber-500/40 hover:shadow-[0_4px_20px_rgba(245,158,11,0.08)] rounded-2xl p-5 flex flex-col gap-4 cursor-pointer select-none active:scale-[0.98] transition-all duration-150 shadow-md"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <button
                          type="button"
                          onClick={(e) => toggleServiceSelection(service.id, e)}
                          className={cn(
                            "text-[10px] font-extrabold px-2.5 py-1.5 rounded-md leading-none select-none uppercase tracking-wider transition-colors border cursor-pointer",
                            isSelected
                              ? "bg-emerald-500 text-white border-emerald-500"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
                          )}
                        >
                          {isSelected ? "Selected ✓" : "Select"}
                        </button>
                        <span className="text-sm font-extrabold text-emerald-400">
                          {service.price}
                        </span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <h4 className="text-sm font-extrabold text-white truncate">
                          {service.name}
                        </h4>
                        <div className="flex items-center gap-2 text-[11px] font-semibold text-gray-400 dark:text-gray-500">
                          <div className="flex items-center gap-0.5">
                            <Clock className="h-3.5 w-3.5 text-gray-400 dark:text-gray-500 shrink-0" />
                            <span>{service.duration}</span>
                          </div>
                          <span>•</span>
                          <span className="text-yellow-500 font-extrabold">★ {service.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs font-medium text-gray-300 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Sleek Minimalist Scroll Indicator Track */}
              <div className="flex justify-center mt-2.5 shrink-0 select-none">
                <div className="w-16 h-[3px] bg-gray-100 dark:bg-gray-800 rounded-full relative overflow-hidden">
                  <div 
                    className="absolute top-0 h-full bg-amber-500 rounded-full transition-all duration-75 ease-out"
                    style={{ 
                      left: `${(scrollProgress / 100) * (100 - 37.5)}%`, 
                      width: '37.5%' 
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* High-End Salon Menu Style Listings */}
          <div className="flex flex-col gap-6 p-4">
            {groupedServices.map(([category, items]) => (
              <div key={category} className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-gray-900 dark:text-gray-200 border-b border-gray-100 dark:border-gray-800 pb-2 leading-none select-none">
                  {category}
                </h3>
                <div className="flex flex-col">
                  {items.map((service) => {
                    const isSelected = selectedServiceIds.includes(service.id);
                    return (
                      <div
                        key={service.id}
                        onClick={() => setSelectedService(service)}
                        className="group flex items-center justify-between gap-4 p-4 mb-2 bg-white dark:bg-gray-800/40 hover:bg-gray-50/60 dark:hover:bg-gray-800/60 border border-gray-150 dark:border-gray-800/60 hover:border-gray-200 dark:hover:border-gray-700 rounded-2xl cursor-pointer transition-all duration-150 active:scale-[0.99] shadow-2xs select-none"
                      >
                        <div className="flex flex-col gap-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-extrabold text-gray-900 dark:text-gray-100 group-hover:underline truncate">
                              {service.name}
                            </h4>
                            <span className="text-[10.5px] font-bold text-gray-600 dark:text-gray-400 shrink-0">
                              ({service.duration})
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 line-clamp-1 leading-normal">
                            {service.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                            {service.price}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => toggleServiceSelection(service.id, e)}
                            className={cn(
                              "h-6 w-6 rounded-full flex items-center justify-center border transition-all cursor-pointer",
                              isSelected
                                ? "bg-emerald-500 border-emerald-500 text-white"
                                : "border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600"
                            )}
                          >
                            {isSelected && (
                              <span className="text-[10px] font-bold">✓</span>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {groupedServices.length === 0 && (
              <div className="py-16 flex flex-col items-center justify-center text-center">
                <p className="text-xs font-bold text-gray-600 dark:text-gray-400">
                  No treatments found
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-500 mt-1">
                  Try adjusting your search terms or filters
                </p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Reusable Specifications Drawer Detail Panel */}
      <Drawer
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        title={selectedService?.name || ""}
        description={selectedService?.category ? `${selectedService.category} Specification` : undefined}
        size="sm"
        footer={
          selectedService && (
            <div className="flex flex-col gap-2 w-full select-none">
              <button
                type="button"
                onClick={() => {
                  toggleServiceSelection(selectedService.id);
                }}
                className={cn(
                  "w-full rounded-2xl py-3.5 text-xs font-extrabold border transition-all cursor-pointer",
                  selectedServiceIds.includes(selectedService.id)
                    ? "bg-red-50 dark:bg-red-950/20 text-red-600 border-red-200 dark:border-red-900/40 hover:bg-red-100/50"
                    : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/80"
                )}
              >
                {selectedServiceIds.includes(selectedService.id)
                  ? "Remove from Booking Selection"
                  : "Add to Booking Selection"}
              </button>
              
              <Button
                variant="primary"
                onClick={() => {
                  let ids = [...selectedServiceIds];
                  if (!ids.includes(selectedService.id)) {
                    ids.push(selectedService.id);
                  }
                  setSelectedService(null);
                  router.push(`/booking?serviceIds=${ids.join(",")}`);
                }}
                className="w-full rounded-2xl py-3.5 text-xs font-bold"
              >
                Book Now {selectedServiceIds.includes(selectedService.id) ? "Selection" : ""} • {selectedService.price}
              </Button>
            </div>
          )
        }
      >
        {selectedService && (
          <div className="flex flex-col gap-5 animate-fade-in-quick">
            <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 border border-gray-200/50 dark:border-gray-700 rounded-xl p-4 transition-colors duration-200">
              <div className="flex flex-col gap-0.5">
                <span className="text-[9px] font-extrabold text-gray-500 dark:text-gray-400 leading-none">
                  Duration
                </span>
                <span className="text-xs font-extrabold text-gray-900 dark:text-gray-100 leading-none mt-1">
                  {selectedService.duration}
                </span>
              </div>
              <div className="flex flex-col gap-0.5 text-right">
                <span className="text-[9px] font-extrabold text-gray-500 dark:text-gray-400 leading-none">
                  Rating
                </span>
                <span className="text-xs font-extrabold text-gray-900 dark:text-gray-100 leading-none mt-1">
                  ★ {selectedService.rating || "4.8"}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <span className="text-[9px] font-extrabold text-gray-500 dark:text-gray-400">
                Treatment Details
              </span>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50/20 dark:bg-gray-800/10 border border-gray-100 dark:border-gray-800 rounded-xl p-4 transition-colors duration-200">
                {selectedService.description}
              </p>
            </div>
          </div>
        )}
      </Drawer>

      {/* Floating Sticky Selection Bar */}
      {mounted && selectedServiceIds.length > 0 && typeof document !== "undefined" && document.getElementById("customer-modal-portal")
        ? createPortal(
            <div className="absolute bottom-[92px] left-4 right-4 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-150 dark:border-gray-800/85 rounded-2xl p-4 shadow-lg flex items-center justify-between pointer-events-auto animate-page-in transition-all duration-200">
              <div className="flex flex-col">
                <span className="text-[10px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-widest leading-none">
                  {selectedServiceIds.length} Treatment{selectedServiceIds.length > 1 ? "s" : ""} Selected
                </span>
                <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 leading-none">
                  ₱{totalPrice.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedServiceIds([])}
                  className="text-[11px] font-extrabold text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 cursor-pointer"
                >
                  Clear All
                </button>
                <Button
                  variant="primary"
                  onClick={() => router.push(`/booking?serviceIds=${selectedServiceIds.join(",")}`)}
                  className="rounded-xl px-5 py-2.5 text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white"
                >
                  Book Selection
                </Button>
              </div>
            </div>,
            document.getElementById("customer-modal-portal")!
          )
        : null}
    </CustomerLayout>
  );
}
