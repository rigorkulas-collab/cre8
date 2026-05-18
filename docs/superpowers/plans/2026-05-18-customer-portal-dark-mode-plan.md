# Implementation Plan: Premium Dark Mode for Customer Portal

This plan details the steps required to enable a stunning, harmonious "Charcoal Lux" dark mode across all customer-facing layouts, inputs, pages, and modular components in the **CRE8 Salon Booking** application. It aligns with the design standard established in the admin portal (using class-based `.dark` selectors and true-neutral dark colors).

---

## 1. Objectives & Color Palette Standards

We will implement a responsive, fluid theme transition utilizing a custom local storage sync. The color palette mirrors the sleek, high-end "Charcoal Lux" aesthetic:
* **Backgrounds:** Canvas uses `dark:bg-gray-950` (outer viewport background) and `dark:bg-gray-900` (device container background).
* **Cards & Containers:** `dark:bg-gray-800` (elevated background) and `dark:bg-gray-800/60` (glassmorphism/subtle container overlay).
* **Borders:** `dark:border-gray-800` or `dark:border-gray-700/80`.
* **Texts:** Core body is `dark:text-gray-100` (crisp near-white), labels and meta text are `dark:text-gray-400` or `dark:text-gray-500`.
* **Accents:** High-contrast premium details remain amber (`text-amber-500` / `dark:text-amber-400`).

---

## 2. Phase 1: Layout & Global Theme Management

### Step 1.1: Customer Theme Controller (`CustomerLayout.tsx`)
* **File:** `components/layout/customer/CustomerLayout.tsx`
* **Changes:**
  * Add client-side state `isDark` and mount check.
  * Load preference from `localStorage.getItem("cre8_customer_dark_mode")`.
  * Pass `isDark` and `toggleDark` callback props to the `MobileHeader` component.
  * Render the `MobileHeader` natively if `headerProps` is provided.
  * Pass layout-active state to `PageContainer`.

### Step 1.2: Adaptive Header Toggle (`MobileHeader.tsx`)
* **File:** `components/layout/customer/MobileHeader.tsx`
* **Changes:**
  * Extend `MobileHeaderProps` to include `isDark?: boolean` and `onToggleDark?: () => void`.
  * Add Tailwind `dark:` classes to the header frame, border, back button, and text.
  * Render a sleek Sun/Moon theme toggle in the `rightSlot` as the default action if no custom `rightAction` is passed.

### Step 1.3: Navigation & Container Adaptation
* **Files:** 
  * `components/layout/customer/PageContainer.tsx`
  * `components/layout/customer/BottomNavigation.tsx`
* **Changes:**
  * In `PageContainer.tsx`, adapt the background styling from plain `bg-white` to `bg-white dark:bg-gray-900`.
  * In `BottomNavigation.tsx`, add dark mode classes to the glassmorphic floating bottom-bar (`dark:bg-gray-900/95`, `dark:border-gray-800/85`) and ensure active/inactive tab links, labels, and Lucide icons adapt their colors gracefully.

---

## 3. Phase 2: Auth Pages & Components

### Step 2.1: Authentication Pages
* **Files:**
  * `app/login/page.tsx`
  * `app/signup/page.tsx`
* **Changes:**
  * Set the background wrapper to `bg-white dark:bg-gray-900`.
  * Ensure the branding logo inverts smoothly in dark mode via `dark:invert`.

### Step 2.2: Auth Form Fields & Buttons
* **Files:**
  * `components/features/customer/auth/LoginForm.tsx`
  * `components/features/customer/auth/RegisterForm.tsx`
  * `components/features/customer/auth/AuthFooter.tsx`
  * `components/features/customer/auth/GuestModeCard.tsx`
* **Changes:**
  * Ensure all auth panels, cards, inputs, and form texts shift to true neutral grays and custom focus borders under `.dark`.
  * Style the "Continue as Guest" card to look like a premium option in dark mode.

---

## 4. Phase 3: Customer Page Routes

We will update all customer pages to support dark mode:

### Step 3.1: Home Dashboard (`app/dashboard/page.tsx`)
* **Changes:**
  * Style greeting sections, text hierarchies, and divider borders.
  * Style the **Styling Session Card** (`dark:bg-gray-800`, `dark:border-gray-700/60`).
  * Style **Featured Treatments** lists and active cards.
  * Style the **Loyalty Rewards Progress Card** with premium linear gradients (`from-gray-800 to-gray-900`) and a dark-neutral progress track.

### Step 3.2: Browse Catalog (`app/browse-services/page.tsx`)
* **Changes:**
  * Style category scroll pill buttons (active/inactive states under dark mode).
  * Style catalog card lists, duration indicators, descriptions, and chevron hover states.

### Step 3.3: Booking Wizard (`app/booking/page.tsx`)
* **Changes:**
  * Style step indicator progress bar track.
  * Style **Date Picker** carousel days (active/hover states with elegant white/dark-gray buttons).
  * Style **Time Slots Grid** tiles (available/disabled/selected slots in dark mode).
  * Style confirmation dialog/Radix portal modals with matching glassmorphic cards and success bounds.

### Step 3.4: Bookings History (`app/bookings/page.tsx`)
* **Changes:**
  * Style active/past tab switcher buttons (`dark:bg-gray-800`, text states).
  * Style empty state icons and descriptions.
  * Style itemized booking cards.
  * Style the extensive **Appointment Details Drawer** (Radix/Portal frame, status badges, details grid, rating stars feedback form).

### Step 3.5: User Profile (`app/profile/page.tsx`)
* **Changes:**
  * Style profile head avatar placeholder and inputs.
  * Style credit card cards (`from-gray-900 to-gray-800` premium glass border) and active toggles.
  * Style settings notifications options lists and support help grid.

---

## 5. Execution & Verification Strategy

Each step will be implemented sequentially to prevent any regression. After all pages are styled, we will execute our verification check:
1. Compile the build using `npm run build` to confirm everything is syntactically sound.
2. Confirm there are no layout flashes or broken CSS boundaries.
