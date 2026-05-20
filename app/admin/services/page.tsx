"use client";

import React, { useState, useMemo, useEffect } from "react";
import AdminLayout from "@/components/layout/AdminLayout";
import SectionHeader from "@/components/shared/ui/SectionHeader";
import StatsCard from "@/components/shared/StatsCard";
import DataTable, { ColumnDef } from "@/components/tables/DataTable";
import StatusBadge from "@/components/shared/badges/StatusBadge";
import Drawer from "@/components/shared/Drawer";
import TableToolbar from "@/components/tables/TableToolbar";
import { 
  Scissors, 
  Clock, 
  Tag, 
  Layers, 
  Plus, 
  Trash2, 
  AlertTriangle,
  Star,
  Eye,
  EyeOff,
  Check,
  X
} from "lucide-react";

interface Service {
  id: string;
  name: string;
  category: string;
  price: string;
  duration: string;
  status: "active" | "inactive";
  description: string;
}

const initialServices: Service[] = [
  { id: "SRV-001", name: "Premium Cut", category: "Hair", price: "₱500", duration: "45 Min", status: "active", description: "Precision tailored haircut with hot towel finish and rejuvenating styling tonic." },
  { id: "SRV-002", name: "Hair Color", category: "Hair", price: "₱2,500", duration: "120 Min", status: "active", description: "Vibrant full color or subtle highlights using premium imported organic ammonia-free dyes." },
  { id: "SRV-003", name: "Beard Sculpt", category: "Hair", price: "₱350", duration: "30 Min", status: "active", description: "Detailed beard shaping, trim, and conditioning balm application with straight razor edging." },
  { id: "SRV-004", name: "Keratin Rebond", category: "Hair", price: "₱3,500", duration: "180 Min", status: "active", description: "Advanced straightening treatment infused with Brazilian keratin for ultra-silky, smooth hair." },
  { id: "SRV-005", name: "Manicure & Gel", category: "Nails", price: "₱650", duration: "60 Min", status: "active", description: "Deluxe hand soak, cuticle care, nail shaping, and long-lasting premium gel polish." },
  { id: "SRV-006", name: "Deep Facial Glow", category: "Facial", price: "₱1,200", duration: "60 Min", status: "active", description: "Purifying steam, gentle exfoliation, pore extraction, and nourishing collagen mask." },
  { id: "SRV-007", name: "Scalp Massage", category: "Massage", price: "₱850", duration: "45 Min", status: "active", description: "Therapeutic acupressure head and shoulder massage with invigorating peppermint scalp tonic." },
  { id: "SRV-008", name: "Ultimate Royal Package", category: "Packages", price: "₱4,500", duration: "240 Min", status: "active", description: "The complete grooming ritual: Premium Cut, Deep Facial Glow, Scalp Massage, and Deluxe Pedicure." }
];

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [activeTab, setActiveTab] = useState<"services" | "reviews">("services");
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedSrvs = localStorage.getItem("cre8_services");
      if (storedSrvs) {
        setServices(JSON.parse(storedSrvs));
      } else {
        localStorage.setItem("cre8_services", JSON.stringify(initialServices));
      }

      const storedReviews = localStorage.getItem("cre8_reviews");
      if (storedReviews) {
        setReviews(JSON.parse(storedReviews));
      } else {
        const defaultReviews = [
          {
            id: "REV-001",
            appointmentId: "APT-003",
            serviceId: "SRV-004",
            serviceName: "Keratin Rebond",
            stylistName: "Elena Rostova",
            customerName: "Emma Watson",
            rating: 5,
            comment: "Absolutely gorgeous results! Elena is an artist, my hair is so shiny and smooth.",
            date: "May 18, 2026",
            approved: true
          },
          {
            id: "REV-002",
            appointmentId: "APT-001",
            serviceId: "SRV-002",
            serviceName: "Hair Color",
            stylistName: "Elena Rostova",
            customerName: "Sophia Martinez",
            rating: 4,
            comment: "Loved the organic hair dye. Very bright color and scalp felt clean.",
            date: "May 17, 2026",
            approved: true
          }
        ];
        localStorage.setItem("cre8_reviews", JSON.stringify(defaultReviews));
        setReviews(defaultReviews);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && services !== initialServices) {
      localStorage.setItem("cre8_services", JSON.stringify(services));
    }
  }, [services]);

  const handleToggleReviewApproval = (reviewId: string) => {
    setReviews(prev => {
      const next = prev.map(r => r.id === reviewId ? { ...r, approved: !r.approved } : r);
      localStorage.setItem("cre8_reviews", JSON.stringify(next));
      return next;
    });
  };

  const handleDeleteReview = (reviewId: string) => {
    if (confirm("Are you sure you want to delete this customer feedback review permanently?")) {
      setReviews(prev => {
        const next = prev.filter(r => r.id !== reviewId);
        localStorage.setItem("cre8_reviews", JSON.stringify(next));
        return next;
      });
    }
  };

  // Group reviews by stylist to calculate performance metrics
  const stylistRatings = useMemo(() => {
    const map: Record<string, { totalStars: number; count: number; name: string }> = {};
    reviews.forEach(r => {
      if (!map[r.stylistName]) {
        map[r.stylistName] = { totalStars: 0, count: 0, name: r.stylistName };
      }
      map[r.stylistName].totalStars += r.rating;
      map[r.stylistName].count += 1;
    });
    return Object.values(map).map(item => ({
      name: item.name,
      avg: (item.totalStars / item.count).toFixed(1),
      count: item.count
    }));
  }, [reviews]);
  
  // Drawer States
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isAddDrawerOpen, setIsAddDrawerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Add / Edit Form States
  const [formName, setFormName] = useState("");
  const [formCategory, setFormCategory] = useState("Hair");
  const [formPrice, setFormPrice] = useState("");
  const [formDuration, setFormDuration] = useState("60 Min");
  const [formStatus, setFormStatus] = useState<"active" | "inactive">("active");
  const [formDescription, setFormDescription] = useState("");

  // Categories set for filtering
  const categories = useMemo(() => {
    return ["All", ...Array.from(new Set(services.map(s => s.category)))];
  }, [services]);

  // Compute Page-Level Metrics
  const metrics = useMemo(() => {
    const total = services.length;
    const activeCount = services.filter(s => s.status === "active").length;
    const catsCount = new Set(services.map(s => s.category)).size;
    
    // Average duration math
    const totalDuration = services.reduce((acc, s) => {
      const minutes = parseInt(s.duration.replace(/[^\d]/g, "")) || 0;
      return acc + minutes;
    }, 0);
    const avgDuration = total > 0 ? Math.round(totalDuration / total) : 0;

    // Highest price computation
    const maxPrice = services.reduce((max, s) => {
      const value = parseInt(s.price.replace(/[^\d]/g, "")) || 0;
      return value > max ? value : max;
    }, 0);

    return {
      total,
      activeCount,
      catsCount,
      avgDuration: `${avgDuration} Min`,
      maxPrice: `₱${maxPrice.toLocaleString()}`
    };
  }, [services]);

  // Table Columns Definition
  const columns: ColumnDef<Service>[] = [
    {
      header: "Service Name",
      accessor: "name",
      className: "font-semibold text-gray-900",
    },
    {
      header: "Category",
      accessor: "category",
      className: "text-gray-900",
    },
    {
      header: "Duration",
      accessor: "duration",
      className: "text-gray-500 font-medium",
    },
    {
      header: "Status",
      accessor: (row) => <StatusBadge status={row.status} />,
      align: "center",
    },
    {
      header: "Price",
      accessor: "price",
      className: "font-bold text-gray-900",
      align: "right",
    },
  ];

  // Real-time Search and Category Filtering
  const filteredServices = useMemo(() => {
    let result = services;

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
  }, [services, searchQuery, selectedCategory]);

  // Handle Form Openings
  const openAddDrawer = () => {
    setFormName("");
    setFormCategory("Hair");
    setFormPrice("");
    setFormDuration("60 Min");
    setFormStatus("active");
    setFormDescription("");
    setIsAddDrawerOpen(true);
  };

  const openDetailsDrawer = (service: Service) => {
    setSelectedService(service);
    setIsEditMode(false);
    
    // Prefill form states in case admin edits
    setFormName(service.name);
    setFormCategory(service.category);
    setFormPrice(service.price.replace(/[^\d]/g, ""));
    setFormDuration(service.duration);
    setFormStatus(service.status);
    setFormDescription(service.description);
  };

  // Create Service Handler
  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice.trim()) return;

    const priceNum = parseInt(formPrice.replace(/[^\d]/g, "")) || 0;

    const newService: Service = {
      id: `SRV-${Math.floor(100 + Math.random() * 900)}`,
      name: formName,
      category: formCategory,
      price: `₱${priceNum.toLocaleString()}`,
      duration: formDuration,
      status: formStatus,
      description: formDescription,
    };

    setServices(prev => [newService, ...prev]);
    setIsAddDrawerOpen(false);
  };

  // Update Service Handler
  const handleUpdateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService || !formName.trim() || !formPrice.trim()) return;

    const priceNum = parseInt(formPrice.replace(/[^\d]/g, "")) || 0;

    setServices(prev =>
      prev.map(s =>
        s.id === selectedService.id
          ? {
              ...s,
              name: formName,
              category: formCategory,
              price: `₱${priceNum.toLocaleString()}`,
              duration: formDuration,
              status: formStatus,
              description: formDescription,
            }
          : s
      )
    );

    // Update locally selected service state as well to sync UI
    setSelectedService({
      id: selectedService.id,
      name: formName,
      category: formCategory,
      price: `₱${priceNum.toLocaleString()}`,
      duration: formDuration,
      status: formStatus,
      description: formDescription,
    });
    setIsEditMode(false);
  };

  // Delete Service Handler
  const handleDeleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
    setSelectedService(null);
  };

  // Toggle Single Status Handler
  const handleToggleStatus = (service: Service) => {
    const nextStatus = service.status === "active" ? "inactive" : "active";
    setServices(prev =>
      prev.map(s => (s.id === service.id ? { ...s, status: nextStatus } : s))
    );
    setSelectedService(prev => (prev ? { ...prev, status: nextStatus } : null));
  };

  return (
    <AdminLayout>
      <div className="flex flex-col gap-6">
        {/* Header Slot */}
        <SectionHeader
          title="Services"
          description="Manage the salon service catalog, categories, pricing structure, and durations."
          action={
            <button
              onClick={openAddDrawer}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer select-none shadow-sm"
            >
              <Plus className="h-4 w-4 shrink-0" />
              Add Service
            </button>
          }
        />

        {/* Catalog Dashboard Metrics */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Services"
            value={`${metrics.total} Registered`}
            description={`${metrics.activeCount} active catalog items`}
            icon={Scissors}
            iconColor="blue"
          />
          <StatsCard
            title="Categories"
            value={`${metrics.catsCount} Sections`}
            description="Salon service segmentation"
            icon={Layers}
            iconColor="indigo"
          />
          <StatsCard
            title="Avg. Duration"
            value={metrics.avgDuration}
            description="Processing time per appointment"
            icon={Clock}
            iconColor="emerald"
          />
          <StatsCard
            title="Highest Price Tier"
            value={metrics.maxPrice}
            description="Premium packages threshold"
            icon={Tag}
            iconColor="amber"
          />
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-6 select-none">
          <button
            onClick={() => setActiveTab("services")}
            className={`pb-3 text-xs font-bold transition-all cursor-pointer ${
              activeTab === "services"
                ? "text-gray-900 dark:text-gray-100"
                : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
            }`}
          >
            Treatment Services
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`pb-3 text-xs font-bold transition-all cursor-pointer ${
              activeTab === "reviews"
                ? "text-gray-900 dark:text-gray-100"
                : "text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-400"
            }`}
          >
            Customer Reviews & Feedback
          </button>
        </div>

        {activeTab === "services" ? (
          /* Unified Table Section Container */
          <div className="flex flex-col gap-5 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] dark:shadow-none animate-fade-in-quick">
            {/* Action Toolbar */}
            <TableToolbar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              searchPlaceholder="Search services, categories, descriptions..."
              filters={
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all cursor-pointer shadow-sm pr-8"
                >
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat === "All" ? "All Categories" : cat}
                    </option>
                  ))}
                </select>
              }
              actions={
                <span className="text-xs font-semibold text-gray-400 select-none">
                  Showing {filteredServices.length} of {services.length}
                </span>
              }
            />

            {/* Catalog Data Grid */}
            <div className="overflow-hidden">
              <DataTable
                columns={columns}
                data={filteredServices}
                isLoading={false}
                onRowClick={openDetailsDrawer}
              />
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 animate-fade-in-quick">
            {/* Stylists Aggregate Rating Section */}
            <div className="flex flex-col gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-450 dark:text-gray-500">
                Stylist Performance Summary
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {stylistRatings.length > 0 ? (
                  stylistRatings.map((rating, idx) => (
                    <div key={idx} className="bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 rounded-xl p-4.5 flex items-center gap-3 shadow-3xs transition-all hover:scale-[1.01]">
                      <div className="h-9 w-9 rounded-full bg-gray-50 dark:bg-gray-850 flex items-center justify-center font-bold text-xs text-gray-705 dark:text-gray-350 border border-gray-100 dark:border-gray-800 shrink-0">
                        {rating.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">{rating.name}</span>
                        <div className="flex items-center gap-1.5 mt-0.5 select-none">
                          <Star className="h-3 w-3 text-amber-500 fill-amber-500 shrink-0" />
                          <span className="text-[10px] font-extrabold text-gray-805 dark:text-gray-300">{rating.avg}</span>
                          <span className="text-[9px] font-semibold text-gray-400">({rating.count} reviews)</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-8 text-center border border-dashed border-gray-200 dark:border-gray-850 rounded-xl">
                    <span className="text-xs text-gray-400 font-semibold">No performance data yet. Reviews will generate ratings automatically.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Customer Feedback Feed List */}
            <div className="flex flex-col gap-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-150 dark:border-gray-800 p-6 shadow-3xs">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800 mb-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Reviews Catalog ({reviews.length})
                </h3>
                <span className="text-[10px] text-gray-400 font-semibold select-none">
                  Approve or Hide comments to control visibility on the services catalog menu.
                </span>
              </div>

              <div className="flex flex-col gap-4">
                {reviews.length > 0 ? (
                  reviews.map((review, idx) => (
                    <div key={idx} className="border-b border-gray-100 dark:border-gray-800 last:border-0 pb-4 last:pb-0 flex flex-col md:flex-row justify-between gap-4">
                      <div className="flex flex-col gap-1.5 max-w-2xl">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-gray-900 dark:text-gray-100">{review.customerName}</span>
                          <span className="text-[9px] font-semibold text-gray-400">{review.date}</span>
                          <div className="flex gap-0.5 ml-1 select-none">
                            {Array.from({ length: 5 }).map((_, sIdx) => (
                              <Star
                                key={sIdx}
                                className={`h-3 w-3 ${
                                  sIdx < review.rating ? "text-amber-500 fill-amber-500" : "text-gray-200 dark:text-gray-800"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-semibold text-gray-500 dark:text-gray-400">
                          <span>Treatment: <strong className="text-gray-700 dark:text-gray-300">{review.serviceName}</strong></span>
                          <span>•</span>
                          <span>Specialist: <strong className="text-gray-700 dark:text-gray-300">{review.stylistName}</strong></span>
                        </div>

                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50/50 dark:bg-gray-850 p-3 rounded-lg border border-gray-100/50 dark:border-gray-800/40">
                          {review.comment || "No comment provided."}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0 self-end md:self-center select-none">
                        <button
                          onClick={() => handleToggleReviewApproval(review.id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold rounded-lg border cursor-pointer transition-colors ${
                            review.approved
                              ? "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-250 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100/60"
                              : "bg-amber-50 dark:bg-amber-950/20 border-amber-250 text-amber-600 dark:text-amber-400 hover:bg-amber-100/60"
                          }`}
                        >
                          {review.approved ? (
                            <>
                              <Eye className="h-3 w-3 shrink-0" />
                              <span>Publicly Visible</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3 w-3 shrink-0" />
                              <span>Hidden from Menu</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleDeleteReview(review.id)}
                          className="p-1.5 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 border border-gray-200 dark:border-gray-805 hover:border-red-200 dark:hover:border-red-900 bg-white dark:bg-gray-900 rounded-lg cursor-pointer transition-colors"
                          title="Delete Review"
                        >
                          <Trash2 className="h-3.5 w-3.5 shrink-0" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center text-center">
                    <Star className="h-8 w-8 text-gray-200 dark:text-gray-700 shrink-0 mb-3" />
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-450">No customer reviews submitted yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Details Side-Sheet Drawer */}
      <Drawer
        isOpen={!!selectedService}
        onClose={() => setSelectedService(null)}
        title={isEditMode ? "Edit Service Parameters" : "Service Specification"}
        description={isEditMode ? "Adjust the catalog details, pricing levels, and slot durations." : "View complete registration records, description, and status."}
        size="md"
        footer={
          selectedService && (
            <div className="flex w-full items-center justify-between gap-3 select-none">
              {isEditMode ? (
                <>
                  <button
                    onClick={() => setIsEditMode(false)}
                    className="px-3.5 py-2 text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                  >
                    Back to Specs
                  </button>
                  <button
                    onClick={handleUpdateService}
                    disabled={!formName.trim() || !formPrice.trim()}
                    className="px-3.5 py-2 text-xs font-bold bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleDeleteService(selectedService.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete Service
                  </button>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleStatus(selectedService)}
                      className="px-3.5 py-2 text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                    >
                      {selectedService.status === "active" ? "Set Inactive" : "Set Active"}
                    </button>
                    <button
                      onClick={() => setIsEditMode(true)}
                      className="px-3.5 py-2 text-xs font-bold bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer"
                    >
                      Edit Service
                    </button>
                  </div>
                </>
              )}
            </div>
          )
        }
      >
        {selectedService && (
          <div className="space-y-6">
            {isEditMode ? (
              <form onSubmit={handleUpdateService} className="space-y-5 animate-fade-in-quick">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Service Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Balayage Highlights"
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100"
                  />
                </div>

                {/* Category */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Category Group
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm text-gray-900 dark:text-gray-100 cursor-pointer"
                  >
                    <option value="Hair">Hair</option>
                    <option value="Nails">Nails</option>
                    <option value="Facial">Facial</option>
                    <option value="Massage">Massage</option>
                    <option value="Packages">Packages</option>
                  </select>
                </div>

                {/* Price */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Price (PHP ₱)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-sm font-semibold text-gray-400 pointer-events-none">
                      ₱
                    </span>
                    <input
                      type="text"
                      required
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                      placeholder="e.g. 1500"
                      className="w-full pl-8 pr-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                {/* Duration */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Slot Duration
                  </label>
                  <select
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm text-gray-900 dark:text-gray-100 cursor-pointer"
                  >
                    <option value="15 Min">15 Min</option>
                    <option value="30 Min">30 Min</option>
                    <option value="45 Min">45 Min</option>
                    <option value="60 Min">60 Min</option>
                    <option value="90 Min">90 Min</option>
                    <option value="120 Min">120 Min</option>
                    <option value="180 Min">180 Min</option>
                    <option value="240 Min">240 Min</option>
                  </select>
                </div>

                {/* Status */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Catalog Status
                  </label>
                  <div className="flex gap-4 select-none">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={formStatus === "active"}
                        onChange={() => setFormStatus("active")}
                        className="h-4 w-4 text-gray-900 border-gray-300 focus:ring-gray-950 focus:ring-2 dark:border-gray-700 dark:bg-gray-800"
                      />
                      Active
                    </label>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={formStatus === "inactive"}
                        onChange={() => setFormStatus("inactive")}
                        className="h-4 w-4 text-gray-900 border-gray-300 focus:ring-gray-950 focus:ring-2 dark:border-gray-700 dark:bg-gray-800"
                      />
                      Inactive
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Service Description
                  </label>
                  <textarea
                    rows={4}
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    placeholder="Provide a brief specification of what the service entails..."
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 resize-none leading-relaxed"
                  />
                </div>
              </form>
            ) : (
              <div className="space-y-6 animate-fade-in-quick">
                {/* Header card info */}
                <div className="bg-gray-50/50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700 rounded-lg p-5 flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 leading-none">
                      Service ID
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-none">
                      {selectedService.id}
                    </span>
                  </div>
                  <StatusBadge status={selectedService.status} />
                </div>

                {/* Specs list */}
                <div className="grid grid-cols-2 gap-y-5 gap-x-4 border-b border-gray-100 dark:border-gray-800 pb-6">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Service Name
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {selectedService.name}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Category
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {selectedService.category}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Duration
                    </span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {selectedService.duration}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                      Pricing Rate
                    </span>
                    <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {selectedService.price}
                    </span>
                  </div>
                </div>

                {/* Description block */}
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Service Description
                  </span>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 leading-relaxed bg-gray-50/30 dark:bg-gray-800/30 border border-gray-100/50 dark:border-gray-700/50 rounded-lg p-4">
                    {selectedService.description || "No description provided."}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>

      {/* Add New Service Drawer */}
      <Drawer
        isOpen={isAddDrawerOpen}
        onClose={() => setIsAddDrawerOpen(false)}
        title="Add Catalog Service"
        description="Configure new styling procedures, baseline pricing, and standard slot durations."
        size="md"
        footer={
          <div className="flex justify-end gap-3 select-none">
            <button
              onClick={() => setIsAddDrawerOpen(false)}
              className="px-3.5 py-2 text-xs font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateService}
              disabled={!formName.trim() || !formPrice.trim()}
              className="px-3.5 py-2 text-xs font-bold bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Create Service
            </button>
          </div>
        }
      >
        <form onSubmit={handleCreateService} className="space-y-5 animate-fade-in-quick">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Service Name
            </label>
            <input
              type="text"
              required
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              placeholder="e.g. Balayage Highlights"
              className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Category Group
            </label>
            <select
              value={formCategory}
              onChange={(e) => setFormCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm text-gray-900 dark:text-gray-100 cursor-pointer"
            >
              <option value="Hair">Hair</option>
              <option value="Nails">Nails</option>
              <option value="Facial">Facial</option>
              <option value="Massage">Massage</option>
              <option value="Packages">Packages</option>
            </select>
          </div>

          {/* Price */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Price (PHP ₱)
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-sm font-semibold text-gray-400 pointer-events-none">
                ₱
              </span>
              <input
                type="text"
                required
                value={formPrice}
                onChange={(e) => setFormPrice(e.target.value)}
                placeholder="e.g. 1500"
                className="w-full pl-8 pr-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>

          {/* Duration */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Slot Duration
            </label>
            <select
              value={formDuration}
              onChange={(e) => setFormDuration(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm text-gray-900 dark:text-gray-100 cursor-pointer"
            >
              <option value="15 Min">15 Min</option>
              <option value="30 Min">30 Min</option>
              <option value="45 Min">45 Min</option>
              <option value="60 Min">60 Min</option>
              <option value="90 Min">90 Min</option>
              <option value="120 Min">120 Min</option>
              <option value="180 Min">180 Min</option>
              <option value="240 Min">240 Min</option>
            </select>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Catalog Status
            </label>
            <div className="flex gap-4 select-none">
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="addStatus"
                  checked={formStatus === "active"}
                  onChange={() => setFormStatus("active")}
                  className="h-4 w-4 text-gray-900 border-gray-300 focus:ring-gray-950 focus:ring-2 dark:border-gray-700 dark:bg-gray-800"
                />
                Active
              </label>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="radio"
                  name="addStatus"
                  checked={formStatus === "inactive"}
                  onChange={() => setFormStatus("inactive")}
                  className="h-4 w-4 text-gray-900 border-gray-300 focus:ring-gray-950 focus:ring-2 dark:border-gray-700 dark:bg-gray-800"
                />
                Inactive
              </label>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Service Description
            </label>
            <textarea
              rows={4}
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              placeholder="Provide a brief specification of what the service entails..."
              className="w-full px-3.5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 dark:focus:ring-gray-400/20 focus:border-gray-900 dark:focus:border-gray-500 transition-all text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 text-gray-900 dark:text-gray-100 resize-none leading-relaxed"
            />
          </div>
        </form>
      </Drawer>
    </AdminLayout>
  );
}
