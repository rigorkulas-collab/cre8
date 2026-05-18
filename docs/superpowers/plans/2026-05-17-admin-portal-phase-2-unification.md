# Admin Portal Phase 2 Component Unification Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Standardize the design, sizes, and colors of all status badges and data grid tables across all admin portal pages, completely removing any lingering hover transitions or timing utilities.

**Architecture:** Refactor Payments status pills, Dashboard status pills, AppointmentTable, PaymentsTable, and ServiceTable components to ensure unified class specifications and pure-static instantaneous hovers.

**Tech Stack:** Next.js, React 19, Tailwind CSS, Lucide React

---

## File Map

- **Modify**: `components/admin/payments/StatusBadge.tsx`
- **Modify**: `components/admin/dashboard/StatusBadge.tsx`
- **Modify**: `components/admin/tables/AppointmentTable.tsx`
- **Modify**: `components/admin/payments/PaymentsTable.tsx`
- **Modify**: `components/admin/services/ServiceTable.tsx`

---

## Tasks

### Task 1: Unify Payments Status Badges & Standardize Pill Styling

**Files:**
- Modify: `components/admin/payments/StatusBadge.tsx`

- [ ] **Step 1: Locate active code in Payments StatusBadge**
  Review lines 13-40 of [StatusBadge.tsx](file:///home/zachary/Desktop/cre8/components/admin/payments/StatusBadge.tsx) to align it with standard sizes and the simplified static colors mapping.

- [ ] **Step 2: Modify `components/admin/payments/StatusBadge.tsx`**
  Unify class specifications to match the standard text size (`text-[9px]`), extra bold padding weights (`font-black`), and static border/background color indices.

  *Target Content to replace:*
  ```tsx
  export default function StatusBadge({ status }: StatusBadgeProps) {
    const getStyles = () => {
      switch (status) {
        case "Paid":
          return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50";
        case "Partial":
          return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50";
        case "Unpaid":
          return "bg-red-50 text-red-700 border-red-200 hover:bg-red-50";
        case "Refunded":
          return "bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-50";
        default:
          return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-50";
      }
    };
  
    return (
      <Badge
        variant="outline"
        className={cn(
          "px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full border select-none shrink-0",
          getStyles()
        )}
      >
        {status}
      </Badge>
    );
  }
  ```

  *Replacement Content:*
  ```tsx
  export default function StatusBadge({ status }: StatusBadgeProps) {
    const getStyles = () => {
      switch (status) {
        case "Paid":
          return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50";
        case "Partial":
          return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50";
        case "Unpaid":
          return "bg-red-50 text-red-700 border-red-200 hover:bg-red-50";
        case "Refunded":
          return "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100";
        default:
          return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-50";
      }
    };
  
    return (
      <Badge
        variant="outline"
        className={cn(
          "px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full border select-none shrink-0",
          getStyles()
        )}
      >
        {status}
      </Badge>
    );
  }
  ```

---

### Task 2: Harmonize Dashboard/Appointments Status Badges

**Files:**
- Modify: `components/admin/dashboard/StatusBadge.tsx`

- [ ] **Step 1: Locate active code in Dashboard StatusBadge**
  Review lines 13-36 of [StatusBadge.tsx](file:///home/zachary/Desktop/cre8/components/admin/dashboard/StatusBadge.tsx) to align it with standard sizes and standard static colors.

- [ ] **Step 2: Modify `components/admin/dashboard/StatusBadge.tsx`**
  Unify class specifications to match the standard text size (`text-[9px]`), extra bold weights (`font-black`), and static color indices.

  *Target Content to replace:*
  ```tsx
  export default function StatusBadge({ status }: StatusBadgeProps) {
    const getColors = () => {
      switch (status) {
        case "Pending":
          return "bg-amber-50 text-amber-700 border-amber-200";
        case "Confirmed":
          return "bg-blue-50 text-blue-700 border-blue-200";
        case "In Progress":
          return "bg-purple-50 text-purple-700 border-purple-200";
        case "Completed":
          return "bg-emerald-50 text-emerald-700 border-emerald-200";
        case "Cancelled":
          return "bg-red-50 text-red-700 border-red-200";
        default:
          return "bg-gray-50 text-gray-700 border-gray-200";
      }
    };
  
    return (
      <Badge variant="outline" className={cn("px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider shrink-0 border", getColors())}>
        {status}
      </Badge>
    );
  }
  ```

  *Replacement Content:*
  ```tsx
  export default function StatusBadge({ status }: StatusBadgeProps) {
    const getColors = () => {
      switch (status) {
        case "Pending":
          return "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-50";
        case "Confirmed":
          return "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-50";
        case "In Progress":
          return "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-50";
        case "Completed":
          return "bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-100";
        case "Cancelled":
          return "bg-red-50 text-red-700 border-red-200 hover:bg-red-50";
        default:
          return "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-50";
      }
    };
  
    return (
      <Badge
        variant="outline"
        className={cn(
          "px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full border select-none shrink-0",
          getColors()
        )}
      >
        {status}
      </Badge>
    );
  }
  ```

---

### Task 3: Strip Transitions from AppointmentTable Rows

**Files:**
- Modify: `components/admin/tables/AppointmentTable.tsx`

- [ ] **Step 1: Locate table hover layout in AppointmentTable**
  Review lines 41-47 of [AppointmentTable.tsx](file:///home/zachary/Desktop/cre8/components/admin/tables/AppointmentTable.tsx) to target row transitions.

- [ ] **Step 2: Modify `components/admin/tables/AppointmentTable.tsx`**
  Remove transition duration classes.

  *Target Content to replace:*
  ```tsx
              <tr 
                key={apt.id} 
                onClick={() => {
                  if (onAction) onAction("view", apt);
                }}
                className="hover:bg-gray-50/50 transition-colors duration-150 cursor-pointer select-none"
              >
  ```

  *Replacement Content:*
  ```tsx
              <tr 
                key={apt.id} 
                onClick={() => {
                  if (onAction) onAction("view", apt);
                }}
                className="hover:bg-gray-50/50 cursor-pointer select-none"
              >
  ```

---

### Task 4: Strip Transitions from PaymentsTable Rows

**Files:**
- Modify: `components/admin/payments/PaymentsTable.tsx`

- [ ] **Step 1: Locate table row properties in PaymentsTable**
  Review lines 97-100 of [PaymentsTable.tsx](file:///home/zachary/Desktop/cre8/components/admin/payments/PaymentsTable.tsx).

- [ ] **Step 2: Modify `components/admin/payments/PaymentsTable.tsx`**
  Remove transition-colors utility.

  *Target Content to replace:*
  ```tsx
                <tr
                  key={t.id}
                  className="hover:bg-gray-50/50 transition-colors duration-150 group"
                >
  ```

  *Replacement Content:*
  ```tsx
                <tr
                  key={t.id}
                  className="hover:bg-gray-50/50 group"
                >
  ```

---

### Task 5: Strip Transitions from ServiceTable Rows & Actions

**Files:**
- Modify: `components/admin/services/ServiceTable.tsx`

- [ ] **Step 1: Identify all transition strings in ServiceTable**
  Review [ServiceTable.tsx](file:///home/zachary/Desktop/cre8/components/admin/services/ServiceTable.tsx) to capture transition properties in table rows, text highlights, and action buttons.

- [ ] **Step 2: Modify `components/admin/services/ServiceTable.tsx`**
  Clean and replace active transition elements.

  *Target Content to replace (approx lines 50-62):*
  ```tsx
              <tr
                key={srv.id}
                onClick={() => onView(srv)}
                className="group h-13 text-xs font-bold text-gray-700 hover:text-black hover:bg-gray-50/50 transition-all cursor-pointer"
              >
                
                {/* Name & Description */}
                <td className="px-5 py-2.5 max-w-72 truncate">
                  <div className="flex flex-col text-left">
                    <span className="text-gray-900 group-hover:text-black transition-colors truncate">{srv.name}</span>
                    <span className="text-[9px] font-semibold text-gray-400 mt-0.5 truncate max-w-64">{srv.description}</span>
                  </div>
                </td>
  ```

  *Replacement Content:*
  ```tsx
              <tr
                key={srv.id}
                onClick={() => onView(srv)}
                className="group h-13 text-xs font-bold text-gray-700 hover:text-black hover:bg-gray-50/50 cursor-pointer"
              >
                
                {/* Name & Description */}
                <td className="px-5 py-2.5 max-w-72 truncate">
                  <div className="flex flex-col text-left">
                    <span className="text-gray-900 group-hover:text-black truncate">{srv.name}</span>
                    <span className="text-[9px] font-semibold text-gray-400 mt-0.5 truncate max-w-64">{srv.description}</span>
                  </div>
                </td>
  ```

  *Target Content to replace (approx lines 94-99):*
  ```tsx
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === srv.id ? null : srv.id)}
                      className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
  ```

  *Replacement Content:*
  ```tsx
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === srv.id ? null : srv.id)}
                      className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-gray-100 text-gray-500 hover:text-gray-900 cursor-pointer"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
  ```

  *Target Content to replace (approx lines 105-127):*
  ```tsx
                          <button
                            onClick={() => { onView(srv); setActiveDropdown(null); }}
                            className="w-full h-8 px-2.5 rounded-lg text-[10px] font-bold text-gray-700 hover:text-black hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-gray-400" />
                            <span>View Details</span>
                          </button>
                          
                          <button
                            onClick={() => { onEdit(srv); setActiveDropdown(null); }}
                            className="w-full h-8 px-2.5 rounded-lg text-[10px] font-bold text-gray-700 hover:text-black hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-gray-400" />
                            <span>Edit Details</span>
                          </button>
                          
                          <button
                            onClick={() => { onDelete(srv.id); setActiveDropdown(null); }}
                            className="w-full h-8 px-2.5 rounded-lg text-[10px] font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                            <span>Delete Service</span>
                          </button>
  ```

  *Replacement Content:*
  ```tsx
                          <button
                            onClick={() => { onView(srv); setActiveDropdown(null); }}
                            className="w-full h-8 px-2.5 rounded-lg text-[10px] font-bold text-gray-700 hover:text-black hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-gray-400" />
                            <span>View Details</span>
                          </button>
                          
                          <button
                            onClick={() => { onEdit(srv); setActiveDropdown(null); }}
                            className="w-full h-8 px-2.5 rounded-lg text-[10px] font-bold text-gray-700 hover:text-black hover:bg-gray-50 flex items-center gap-2 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5 text-gray-400" />
                            <span>Edit Details</span>
                          </button>
                          
                          <button
                            onClick={() => { onDelete(srv.id); setActiveDropdown(null); }}
                            className="w-full h-8 px-2.5 rounded-lg text-[10px] font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                            <span>Delete Service</span>
                          </button>
  ```

---

## Verification Plan

### Automated Compilation Check
- Run local development compilation command to confirm zero TS or bundler errors in the layout components.
- Run: `npm run build` in the terminal to verify syntax validity.
