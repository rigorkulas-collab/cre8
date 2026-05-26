# Admin Panel Multi-Service Selection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable multiple service selection in the admin panel's appointment creation drawer, dynamically computing prices/durations and storing combined records.

**Architecture:** Fetch active services dynamically from local storage or mock services. Replace the single-select dropdown in the drawer with a list of checklist cards. Calculate combined properties (names joined by " + ", prices summed, durations summed) and save them to localStorage `cre8_appointments` on submit.

**Tech Stack:** React, Next.js, Tailwind CSS, LocalStorage APIs.

---

### Task 1: Update State and UI in Admin Appointments Drawer

**Files:**
- Modify: `app/admin/appointments/page.tsx`

- [ ] **Step 1: Load Services dynamically**
  Load services from `cre8_services` or fallback to `mockServices` from `@/lib/mock-data/mockServices`. Replace hardcoded `servicePrices` and single-service state with:
  ```typescript
  import { mockServices } from "@/lib/mock-data/mockServices";
  // Inside AdminAppointmentsPage:
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  ```
  And load them inside `useEffect` on mount.

- [ ] **Step 2: Update UI to show scrollable checklist**
  Replace the `<select>` service selector in the appointment creation form (around lines 603-622) with a scrollable checklist card list of active services:
  ```tsx
  <div className="flex flex-col gap-2">
    <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">
      Select Services
    </label>
    <div className="grid grid-cols-1 gap-2 max-h-[200px] overflow-y-auto pr-1 border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-white dark:bg-gray-800">
      {servicesList.map((service) => {
        const isSelected = selectedServices.includes(service.id);
        return (
          <label
            key={service.id}
            className={`flex items-center justify-between p-2.5 rounded-lg border text-left cursor-pointer transition-all duration-150 active:scale-[0.99] select-none ${
              isSelected
                ? "bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900"
                : "bg-white dark:bg-gray-850 border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/80"
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {
                  setSelectedServices(prev =>
                    prev.includes(service.id)
                      ? prev.filter(id => id !== service.id)
                      : [...prev, service.id]
                  );
                }}
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-750 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-900/10 accent-indigo-600 dark:accent-indigo-400 cursor-pointer"
              />
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">
                  {service.name}
                </span>
                <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500">
                  {service.category} · {service.duration}
                </span>
              </div>
            </div>
            <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 shrink-0">
              {service.price}
            </span>
          </label>
        );
      })}
    </div>
  </div>
  ```

- [ ] **Step 3: Update `handleCreateAppointment` submission logic**
  Sum up prices and durations, join service names by `" + "`, and join service IDs by `","`. Make sure that creating the appointment uses the combined values.
  ```typescript
  const handleCreateAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.trim() || selectedServices.length === 0) return;

    const chosenServicesObj = servicesList.filter(s => selectedServices.includes(s.id));
    const combinedServiceName = chosenServicesObj.map(s => s.name).join(" + ");
    const combinedServiceIds = chosenServicesObj.map(s => s.id).join(",");
    
    // Sum prices
    const totalRawPrice = chosenServicesObj.reduce((sum, s) => {
      const val = parseInt(s.price.replace(/[^0-9]/g, ""), 10) || 0;
      return sum + val;
    }, 0);
    const combinedPriceStr = `₱${totalRawPrice.toLocaleString()}`;

    // Sum durations
    const totalRawDuration = chosenServicesObj.reduce((sum, s) => {
      const val = parseInt(s.duration.replace(/[^0-9]/g, ""), 10) || 0;
      return sum + val;
    }, 0);
    const combinedDurationStr = `${totalRawDuration} Min`;

    const newApt: Appointment = {
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: newCustomer,
      serviceName: combinedServiceName,
      staffName: newStaff,
      time: newTime,
      price: combinedPriceStr,
      status: "confirmed",
      notes: newNotes,
    };

    setAppointments(prev => {
      const next = [newApt, ...prev];
      if (typeof window !== "undefined") {
        const customerApt = {
          id: newApt.id,
          serviceId: combinedServiceIds,
          serviceName: newApt.serviceName,
          category: chosenServicesObj[0]?.category || "Hair",
          stylistName: newApt.staffName,
          date: "May 20, 2026",
          time: newApt.time,
          price: newApt.price,
          duration: combinedDurationStr,
          status: newApt.status,
          refCode: `CRE8-${newApt.id.substring(4)}`,
          notes: newApt.notes,
          customerName: newApt.customerName
        };
        const stored = localStorage.getItem("cre8_appointments");
        const currentList = stored ? JSON.parse(stored) : [];
        localStorage.setItem("cre8_appointments", JSON.stringify([customerApt, ...currentList]));
      }
      return next;
    });

    // Reset selection to default (first service)
    setNewCustomer("");
    setSelectedServices(servicesList.length > 0 ? [servicesList[0].id] : []);
    setNewStaff("Alex Rivera");
    setNewTime("09:00 AM");
    setNewNotes("");
    setIsNewDrawerOpen(false);
  };
  ```

- [ ] **Step 4: Verify manually**
  Run the application, open the browser to the admin appointments page (`/admin/appointments`), click "New Appointment", fill in details, select multiple services, submit, and confirm that the appointment appears with the combined service names and total price.

- [ ] **Step 5: Commit changes**
  Run `git add app/admin/appointments/page.tsx` and commit with message `feat: enable multi-service selection in admin appointment form`.
