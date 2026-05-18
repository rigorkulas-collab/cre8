# Service Browsing Page (`/services`) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a high-fidelity, mobile-first Service Browsing Page (`/services`) allowing users to search, filter by category, explore featured services, and navigate to booking.

**Architecture:** Decompose UI into modular client components (`SectionHeader`, `SearchBar`, `CategoryFilter`, `FeaturedServiceCard`, `ServiceCard`, `EmptyState`) loaded in `app/services/page.tsx` alongside the reused `BottomNavbar`.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui primitives.

---

### Task 1: Component Primitives & UI Architecture
**Files:**
- Create: `components/services/SectionHeader.tsx`
- Create: `components/services/SearchBar.tsx`
- Create: `components/services/CategoryFilter.tsx`
- Create: `components/services/EmptyState.tsx`

- [ ] **Step 1.1: Implement SectionHeader**
  - Props: `title: string`, `subtitle?: string`, `className?: string`.
  - Styling: `#111827` heading (`text-xl font-bold`), `#6B7280` subtitle (`text-xs`).

- [ ] **Step 1.2: Implement SearchBar**
  - Props: `value: string`, `onChange: (val: string) => void`, `placeholder?: string`.
  - Feature: Search input with search icon, optional clear button when non-empty.

- [ ] **Step 1.3: Implement CategoryFilter**
  - Props: `categories: string[]`, `activeCategory: string`, `onSelect: (cat: string) => void`.
  - Styling: Horizontal overflow container with pill buttons. Active pill uses dark background (`bg-gray-900 text-white`), inactive uses outline/gray (`bg-gray-100 text-gray-600 hover:bg-gray-200`).

- [ ] **Step 1.4: Implement EmptyState**
  - Props: `searchQuery?: string`, `onReset?: () => void`.
  - Display: Search icon, "No services found" message, reset button.

### Task 2: Service Cards (Featured & Standard)
**Files:**
- Create: `components/services/FeaturedServiceCard.tsx`
- Create: `components/services/ServiceCard.tsx`

- [ ] **Step 2.1: Implement FeaturedServiceCard**
  - Props: `title: string`, `price: string`, `duration: string`, `category: string`, `onBook: () => void`.
  - Styling: Horizontal scroll card with champagne accent badge (`bg-[#D1BFA7]/20 text-[#D1BFA7]`), premium border, and "Book Now" CTA.

- [ ] **Step 2.2: Implement Standard ServiceCard**
  - Props: `title: string`, `price: string`, `duration: string`, `category: string`, `description: string`, `onBook: () => void`.
  - Styling: Universal card border (`border-border`), image placeholder, badge, price, description, and "Book Now" Button.

### Task 3: Main Page Assembly (`app/services/page.tsx`)
**Files:**
- Create: `app/services/page.tsx`

- [ ] **Step 3.1: Define Mock Data Catalog**
  - 7 Philippine localized services with categories (`All`, `Hair`, `Nails`, `Facial`, `Massage`, `Packages`).

- [ ] **Step 3.2: Assemble Page & Client Filtering State**
  - `searchQuery`, `selectedCategory`, `isLoading` (initial 600ms timer for simulated skeleton loading).
  - Render Sticky SearchBar, CategoryFilter, Featured Services (horizontal scroll), All Services Grid, EmptyState if zero matches, and floating `BottomNavbar` (with active tab `"services"`).

### Task 4: Verification
- [ ] **Step 4.1: Verify Next.js Compilation**
  - Verify zero TypeScript or PostCSS errors and successful `200 OK` load on `/services`.
