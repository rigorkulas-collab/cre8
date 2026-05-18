# Customer Stylist Selection Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate a "Choose Stylist" step as Step 2 of the customer booking flow, expanding the wizard from 4 to 5 steps, with a premium list card UI and an "Any Stylist" option.

**Architecture:** Modify the wizard step transitions, state progression rules, and summary views in `app/booking/page.tsx` to handle 5 steps. We will implement Step 2 by rendering a vertical list of stylist cards mapped from the imported `mockStylists` array.

**Tech Stack:** React (useState, useMemo), Next.js App Router (Client Components), Tailwind CSS, Lucide React icons.

---

### Task 1: Update Booking Wizard Steps Configuration & Nav Logic

**Files:**
* Modify: [page.tsx](file:///home/zachary/Desktop/cre8/app/booking/page.tsx:100-185)

- [ ] **Step 1: Update step boundaries, headers, progress bar, and CTA button text in `app/booking/page.tsx`**

Modify the bounds, title template, progress calculation, and CTAs inside the main component to change the wizard total steps from `4` to `5`:

```diff
<<<<
  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };
====
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
>>>>
```

And update the progress bar width calculation and bottom navigation actions:

```diff
<<<<
      headerProps={{
        title: `STEP ${currentStep} OF 4`,
        showBackButton: currentStep > 1,
        onBackClick: handleBack,
      }}
    >
      <div className="flex flex-col h-full bg-white dark:bg-gray-900 select-none relative animate-page-in transition-colors duration-200">
        
        {/* Step indicator progress bar */}
        <div className="w-full bg-gray-100 dark:bg-gray-800 h-1 shrink-0 relative overflow-hidden">
          <div 
            className="bg-gradient-to-r from-amber-400 to-amber-600 shadow-[0_1px_6px_rgba(245,158,11,0.25)] h-full transition-all duration-300 ease-in-out" 
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
====
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
>>>>
```

Also update the sticky bottom CTA panel and page confirm handler trigger:

```diff
<<<<
          <Button
            variant="primary"
            disabled={!canProceed()}
            onClick={currentStep === 4 ? handleConfirm : handleNext}
            size="default"
            className="flex-1 rounded-2xl py-4 text-sm font-bold"
          >
            {currentStep === 4 
              ? paymentMethod === "online"
                ? `Complete Payment & Book` 
                : `Confirm Booking • Pay at Checkout` 
              : "Continue Selection"}
          </Button>
====
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
>>>>
```

- [ ] **Step 2: Update step state transition validation logic in `canProceed()`**

Update `canProceed()` to enforce selecting a stylist for Step 2:

```diff
<<<<
  const canProceed = () => {
    if (currentStep === 1) return true;
    if (currentStep === 2) return selectedDay !== null;
    if (currentStep === 3) return selectedTimeSlot !== null;
    return true;
  };
====
  const canProceed = () => {
    if (currentStep === 1) return true;
    if (currentStep === 2) return selectedStylist !== null;
    if (currentStep === 3) return selectedDay !== null;
    if (currentStep === 4) return selectedTimeSlot !== null;
    return true;
  };
>>>>
```

- [ ] **Step 3: Run local build checks to verify syntax validation**

Run: `npm run build`
Expected: Passes compile checks.

- [ ] **Step 4: Commit changes**

```bash
git add app/booking/page.tsx
git commit -m "chore: update booking wizard navigation step bounds to 5"
```

---

### Task 2: Implement Step 2 UI (Choose Stylist) and Shift Other Steps

**Files:**
* Modify: [page.tsx](file:///home/zachary/Desktop/cre8/app/booking/page.tsx:230-570)

- [ ] **Step 1: Insert new Step 2 (Choose Stylist) rendering list cards and shift existing Step 2, 3, and 4 indexes**

Add a step display check for `currentStep === 2` rendering the stylist selection lists, and shift the existing conditional steps (Date, Time, and Checkout) indexes up by `1`:

```diff
<<<<
          {/* STEP 2: DATE SELECTION */}
          {currentStep === 2 && (
            <div className="flex flex-col gap-6 animate-fade-in-quick">
====
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
>>>>
```

And continue to shift the other steps:

```diff
<<<<
          {/* STEP 3: TIME SLOT SELECTION */}
          {currentStep === 3 && (
            <div className="flex flex-col gap-6 animate-fade-in-quick">
====
          {/* STEP 4: TIME SLOT SELECTION */}
          {currentStep === 4 && (
            <div className="flex flex-col gap-6 animate-fade-in-quick">
>>>>
```

```diff
<<<<
          {/* STEP 4: REVIEW SUMMARY & NOTES */}
          {currentStep === 4 && (
            <div className="flex flex-col gap-6 animate-fade-in-quick">
====
          {/* STEP 5: REVIEW SUMMARY & NOTES */}
          {currentStep === 5 && (
            <div className="flex flex-col gap-6 animate-fade-in-quick">
>>>>
```

- [ ] **Step 2: Verify compiling check**

Run: `npm run build`
Expected: Compile finishes successfully without warning errors.

- [ ] **Step 3: Commit changes**

```bash
git add app/booking/page.tsx
git commit -m "feat: implement Step 2 Choose Stylist list UI and shift subsequent steps"
```

---

### Task 3: Integrate Stylist Data inside Checkout Summary & Dialog Modals

**Files:**
* Modify: [page.tsx](file:///home/zachary/Desktop/cre8/app/booking/page.tsx:350-660)

- [ ] **Step 1: Render selected stylist details inside the checkout review specifications card (Step 5)**

In the Step 5 review container, add the selected stylist information row:

```diff
<<<<
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
====
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

                {/* Selected Stylist */}
                <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800 pb-3 transition-colors duration-200">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[9px] font-extrabold text-gray-600 dark:text-gray-400 uppercase tracking-widest">
                      Stylist Professional
                    </span>
                    <span className="text-xs font-extrabold text-gray-900 dark:text-gray-100 mt-0.5">
                      {selectedStylist ? selectedStylist.name : "Any Stylist"}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-amber-600 dark:text-amber-400">
                    {selectedStylist ? selectedStylist.role : "First Available"}
                  </span>
                </div>

                {/* Schedule */}
                <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800 pb-3 transition-colors duration-200">
>>>>
```

- [ ] **Step 2: Add dynamic stylist row into the confirmed booking Radix Dialog Modal**

Add a row displaying the stylist's name in the confirmation modal before closing:

```diff
<<<<
            <div className="flex justify-between items-center text-xs border-t border-gray-200/50 dark:border-gray-800 pt-2.5 transition-colors duration-200">
              <span className="font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-[9px]">
                Schedule Slot
              </span>
              <span className="font-bold text-gray-900 dark:text-gray-100">
                {selectedDay?.dateStr} • {selectedTimeSlot}
              </span>
            </div>
====
            <div className="flex justify-between items-center text-xs border-t border-gray-200/50 dark:border-gray-800 pt-2.5 transition-colors duration-200">
              <span className="font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-widest text-[9px]">
                Stylist Assigned
              </span>
              <span className="font-bold text-gray-900 dark:text-gray-100">
                {selectedStylist ? selectedStylist.name : "Any Stylist (No Preference)"}
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
>>>>
```

- [ ] **Step 3: Run project validation build checks**

Run: `npm run build`
Expected: 100% SUCCESS.

- [ ] **Step 4: Commit and finalize branch integration**

```bash
git add app/booking/page.tsx
git commit -m "feat: show selected stylist in Step 5 checkout panel and dialog confirmations"
```
