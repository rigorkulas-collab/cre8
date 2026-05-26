# Admin Panel Multi-Service Selection Design Specification

## Overview & Goal

Currently, the CRE8 admin panel only allows selecting a single service when creating a new appointment from the "New Booking Request" drawer. This is inconsistent with the customer portal, which allows customers to select and book multiple services in a single checkout session (stored as comma-separated service IDs and combined service names).

This specification describes the changes required to upgrade the admin panel's appointment drawer to support selecting multiple services, dynamically calculating the total price and duration, and saving the combined record to match the customer-facing booking format.

---

## Approved Design Details

### 1. State Management & Data Retrieval
*   **Dynamic Service Loading:** Retrieve all registered services from `localStorage.getItem("cre8_services")` or fallback to `mockServices` from `@/lib/mock-data/mockServices`.
*   **Multi-Select State:** Replace the single `newService` string state with a state representing selected service IDs:
    ```typescript
    const [selectedServices, setSelectedServices] = useState<string[]>([]);
    ```
*   **Auto-Selection Default:** Default to the first available service ID when the drawer opens:
    ```typescript
    setSelectedServices([services[0]?.id]);
    ```

### 2. UI Layout: Elegant Checkbox List
*   **Checklist Component:** Replace the single `<select>` element with a vertically scrollable checkbox list of services.
*   **Compact Styling:** Each row in the checklist will present:
    *   A custom checkbox with premium styling.
    *   Service name and category.
    *   Duration and Price.
*   **Visual States:** Checked service cards will receive a clean dark/light mode border (`border-gray-900` / `dark:border-gray-500`) and a subtle background tint (`bg-gray-50` / `dark:bg-gray-700/50`) to visually confirm selection.
*   **Dynamic Summary:** Display an in-drawer summary showing the count of selected services and the calculated total price and duration.

### 3. Submission Integration
*   When the admin submits the "Create Appointment" form, the fields will be mapped as follows:
    *   `serviceName`: Combined names of all selected services joined by `" + "` (e.g., `"Premium Cut + Beard Sculpt"`).
    *   `price`: Formatted sum of prices of all selected services (e.g., `"₱850"`).
    *   `duration`: Combined sum of durations of all selected services (e.g., `"75 Min"`).
    *   `serviceId` (stored in `customerApt`): Comma-separated list of selected service IDs (e.g., `"SRV-001,SRV-003"`).

---

## Target Files for Modification

1.  `app/admin/appointments/page.tsx` - Admin appointments creation form, layout, calculations, and local storage mappings.

---

## Verification & Quality Checklist
- [ ] Checklist displays all registered services loaded dynamically.
- [ ] Checking and unchecking services toggles their inclusion in the selection state.
- [ ] Total Price and Total Duration are calculated and displayed dynamically as selections change.
- [ ] Form submission creates a single appointment record containing the combined names, total pricing, and combined durations.
- [ ] Created appointment record is successfully stored in `cre8_appointments` in `localStorage`.
