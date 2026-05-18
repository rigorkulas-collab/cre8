# Customer Portal "Golden Highlight" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Elevate the customer portal's aesthetic by implementing sophisticated, high-end amber-gold micro-accents and sparkles in bottom navigation active states, featured cards, carousel scrollbars, and the booking step-progress bar.

**Architecture:** We will update style classes in our core Next.js TSX files to add golden border trims, amber pulsing dot tags, custom drop shadows, and timeline gradients without impacting functional logic.

**Tech Stack:** Next.js (React 19), Tailwind CSS v4, Lucide Icons

---

### Task 1: Bottom Navigation Simplification & White Background

**Files:**
*   Modify: `components/layout/customer/BottomNavigation.tsx`

- [ ] **Step 1: Implement the enlarged white background and vertical column tab items**
  
  In `components/layout/customer/BottomNavigation.tsx`, update the nav container classes, layout direction, text casing/sizes, active/inactive styles, and active icon/text color logic.
  
  Replace the main `<nav>` element:
  ```diff
  - <nav className="absolute bottom-4 left-4 right-4 z-40 flex h-14 max-w-[340px] mx-auto items-center justify-between rounded-2xl bg-gradient-to-r from-gray-950 via-gray-900 to-gray-950 px-3 shadow-xl border border-white/5 backdrop-blur-xs select-none">
  + <nav className="absolute bottom-6 left-4 right-4 z-40 flex h-18 max-w-[360px] mx-auto items-center justify-between rounded-2xl bg-white/95 border border-gray-100/80 px-6 shadow-[0_12px_40px_rgba(0,0,0,0.08)] backdrop-blur-md select-none">
  ```
  
  Replace the link structure inside the map loop:
  ```diff
  -          <Link
  -            key={`${item.name}-${index}`}
  -            href={item.href}
  -            className={cn(
  -              "flex items-center justify-center transition-all duration-300 ease-out select-none cursor-pointer h-10 rounded-xl outline-none active:scale-95",
  -              isActive 
  -                ? "bg-white text-gray-950 px-4 shadow-[0_2px_10px_rgba(245,158,11,0.15)] animate-expand-container" 
  -                : "text-gray-400 hover:text-white px-3"
  -            )}
  -          >
  -             <Icon
  -              className={cn(
  -                "h-5 w-5 transition-colors duration-200 shrink-0",
  -                isActive ? "text-gray-950" : "text-gray-400"
  -              )}
  -            />
  -            {isActive && (
  -              <span className="text-[10.5px] font-extrabold text-gray-950 leading-none shrink-0 animate-expand-pill overflow-hidden">
  -                {item.name}
  -              </span>
  -            )}
  -          </Link>
  +          <Link
  +            key={`${item.name}-${index}`}
  +            href={item.href}
  +            className={cn(
  +              "flex flex-col items-center justify-center transition-all duration-200 select-none cursor-pointer w-18 h-14 rounded-xl outline-none active:scale-95 gap-2.5",
  +              isActive ? "text-gray-950" : "text-gray-400 hover:text-gray-600"
  +            )}
  +          >
  +             <Icon
  +              className={cn(
  +                "h-6 w-6 transition-colors duration-200 shrink-0",
  +                isActive ? "text-gray-950" : "text-gray-400"
  +              )}
  +            />
  +            {isActive ? (
  +              <span className="text-[8px] font-extrabold leading-none text-gray-950">
  +                {item.name}
  +              </span>
  +            ) : (
  +              <span className="text-[8px] font-semibold leading-none text-gray-400">
  +                {item.name}
  +              </span>
  +            )}
  +          </Link>
  ```

- [ ] **Step 2: Run linter to verify syntax correctness**
  
  Run: `npm run lint`
  Expected: Command succeeds with no ESLint errors in the target file.

- [ ] **Step 3: Commit changes**
  
  ```bash
  git add components/layout/customer/BottomNavigation.tsx
  git commit -m "style(customer): add active gold shadow and pulsing dot accent to bottom nav"
  ```

---

### Task 2: Featured Banners, Slider Track & Badges

**Files:**
*   Modify: `app/browse-services/page.tsx`

- [ ] **Step 1: Upgrade featured card layout to show a gold-amber border and subtle glow**
  
  In `app/browse-services/page.tsx`, search for `featuredServices.map` and modify the card container's border and shadow classes:
  ```diff
  - className="flex-shrink-0 w-[240px] bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-800/80 hover:border-gray-700 rounded-xl p-4 flex flex-col gap-3 cursor-pointer select-none active:scale-[0.98] transition-all duration-150 shadow-md"
  + className="flex-shrink-0 w-[240px] bg-gradient-to-br from-gray-900 to-gray-800 border border-amber-500/20 hover:border-amber-500/40 hover:shadow-[0_4px_20px_rgba(245,158,11,0.08)] rounded-xl p-4 flex flex-col gap-3 cursor-pointer select-none active:scale-[0.98] transition-all duration-150 shadow-md"
  ```

- [ ] **Step 2: Upgrade the "Featured" tag to amber/gold theme**
  
  In the same card layout, replace the white/10 featured tag span:
  ```diff
  - <span className="text-[9px] font-extrabold px-2 py-1 bg-white/10 text-white rounded-md leading-none select-none uppercase tracking-wider">
  -   Featured
  - </span>
  + <span 
  +   className="text-[9px] font-extrabold px-2 py-1 bg-amber-500/10 text-amber-400 rounded-md leading-none select-none uppercase tracking-wider"
  +   style={{ border: '1px solid rgba(255, 255, 255, 0.12)' }}
  + >
  +   Featured
  + </span>
  ```

- [ ] **Step 3: Color scroll indicator handle gold**
  
  Further down in `app/browse-services/page.tsx` inside the slider track indicator, change the background color of the slider handle from `bg-gray-950` to `bg-amber-500`:
  ```diff
  - <div 
  -   className="absolute top-0 h-full bg-gray-950 rounded-full transition-all duration-75 ease-out"
  -   style={{ 
  -     left: `${(scrollProgress / 100) * (100 - 37.5)}%`, 
  -     width: '37.5%' 
  -   }}
  - />
  + <div 
  +   className="absolute top-0 h-full bg-amber-500 rounded-full transition-all duration-75 ease-out"
  +   style={{ 
  -     left: `${(scrollProgress / 100) * (100 - 37.5)}%`, 
  -     width: '37.5%' 
  -   }}
  - />
  ```

- [ ] **Step 4: Run linter to verify correctness**
  
  Run: `npm run lint`
  Expected: Command succeeds with no ESLint errors.

- [ ] **Step 5: Commit changes**
  
  ```bash
  git add app/browse-services/page.tsx
  git commit -m "style(customer): add gold border, amber tag, and gold indicator to featured treatments carousel"
  ```

---

### Task 3: Booking Progress Stepper

**Files:**
*   Modify: `app/booking/page.tsx`

- [ ] **Step 1: Implement the shimmering champagne-gold gradient stepper**
  
  In `app/booking/page.tsx`, find the progress bar's inner step indicator bar and change it to a warm golden-amber gradient with a subtle shadow glow:
  ```diff
  - <div 
  -   className="bg-gray-900 h-full transition-all duration-300 ease-in-out" 
  -   style={{ width: `${(currentStep / 4) * 100}%` }}
  - />
  + <div 
  +   className="bg-gradient-to-r from-amber-400 to-amber-600 shadow-[0_1px_6px_rgba(245,158,11,0.25)] h-full transition-all duration-300 ease-in-out" 
  +   style={{ width: `${(currentStep / 4) * 100}%` }}
  + />
  ```

- [ ] **Step 2: Run linter to verify correctness**
  
  Run: `npm run lint`
  Expected: Command succeeds with no ESLint errors.

- [ ] **Step 3: Commit changes**
  
  ```bash
  git add app/booking/page.tsx
  git commit -m "style(customer): update booking stepper to use sparkling champagne-gold gradient"
  ```
