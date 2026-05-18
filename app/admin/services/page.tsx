"use client";

import React, { useState, useMemo } from "react";
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
  AlertTriangle 
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

        {/* Unified Table Section Container */}
        <div className="flex flex-col gap-5 bg-white dark:bg-gray-900 rounded-lg border border-gray-100 dark:border-gray-800 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.015)] dark:shadow-none">
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
