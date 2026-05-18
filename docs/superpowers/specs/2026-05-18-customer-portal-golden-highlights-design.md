# Customer Portal "Golden Highlight" Design Specification

## Overview & Goal

The current CRE8 customer-facing web application pages are clean, desktop-framed mobile viewports that present a premium look. However, the styling is predominantly monochrome (pure blacks, whites, and cool grays), which can feel sterile or "bland." 

To add visual warmth and elevated high-end charm without cluttering the screen or making it too colorful, this specification introduces the **"Golden Highlight" Theme**—a series of precise, micro-accents, amber sparkles, and shimmering timelines in key interactive zones.

---

## Approved Design Details

### 1. Bottom Navigation Simplification & White Background
To create a clean, ultra-spacious, and high-fidelity navigation layout:
*   **Enlarged White Container:** The bottom nav container bar is enlarged to a highly comfortable height (`h-18`), floating gracefully at `bottom-6`, with a semi-transparent white background, a soft light-gray border, and deep ambient shadow:
    ```css
    bg-white/95 border border-gray-100/80 shadow-[0_12px_40px_rgba(0,0,0,0.08)] px-6 max-w-[360px] h-18
    ```
*   **Enlarged Icons & Crisp Micro-labels:** Lucide icons are enlarged to a prominent `h-6 w-6` size, while their Title Case text labels directly underneath remain at a microscopic, crisp, and high-end `text-[8px]` size to create a luxury brand scale contrast.
*   **Spacious Vertical Layout:** All tab items are organized vertically (`flex-col`) with a generous spacious distance (`gap-2.5`) between the icon and the text label.
*   **Pure Monochrome Contrast:** Navigation tabs are kept purely monochrome. The active tab's icon and label are highlighted in sharp luxury gray-950 contrast (`text-gray-950`), while inactive tabs remain a clean muted gray (`text-gray-400`). There are no background circle highlights or active gold elements.


### 2. Featured Treatment Cards & Tracks
To make our Signature Treatments stand out inside the catalog browser (`app/browse-services/page.tsx`):
*   **Golden Borders & Shadows:** The featured cards in the carousel will receive a sophisticated gold-amber border and hover glow:
    ```css
    border border-amber-500/20 hover:border-amber-500/40 hover:shadow-[0_4px_20px_rgba(245,158,11,0.08)]
    ```
*   **Luxury Tag:** Upgrade the simple "Featured" text pill from standard low-opacity white to a gold-amber tint with a subtle, 12% opacity semi-transparent white border:
    ```css
    bg-amber-500/10 text-amber-400 font-extrabold uppercase [style: border: 1px solid rgba(255, 255, 255, 0.12)]
    ```
*   **Gold Slider Track:** The carousel scroll indicator slider handle will be updated from black (`bg-gray-950`) to golden amber (`bg-amber-500`) to highlight visual navigation progress.

### 3. Booking Progress Stepper
To guide the user through the booking workflow (`app/booking/page.tsx`):
*   **Golden Timeline:** The horizontal step-by-step progress line will be updated from stark black (`bg-gray-900`) to a warm golden-amber gradient:
    ```css
    bg-gradient-to-r from-amber-400 to-amber-600 shadow-[0_1px_6px_rgba(245,158,11,0.25)]
    ```
*   This makes completing each step feel visually rewarding, like a glowing journey indicator.

---

## Out of Scope (Explicitly Excluded)
*   **Selectable Date/Time Cards:** The selected states for calendar dates and time slots will **not** be modified. They will preserve their pristine solid-black/solid-white backgrounds as currently styled.
*   **Base Pages & Headers:** All parent backgrounds (`bg-white` / `bg-gray-50`) and general layouts remain clean and neutral to prevent visual clutter.

---

## Target Files for Modification

1.  `components/layout/customer/BottomNavigation.tsx` - Active tab layout, shadow, and micro-dot sparkle.
2.  `app/browse-services/page.tsx` - Featured card styles, "Featured" badge color, and horizontal slider indicator bar.
3.  `app/booking/page.tsx` - Step-progress bar container and gradient styling.

---

## Verification & Quality Checklist
- [ ] Active bottom-navigation tab features a pulsing amber dot without causing layout shift.
- [ ] Active bottom-navigation pill exhibits a subtle gold drop-shadow.
- [ ] Featured Treatment Carousel cards show a clean `amber-500/20` border and soft glow on hover.
- [ ] Featured Treatment badge matches the luxury `amber-500/10` background and amber text styling.
- [ ] Featured Carousel scrollbar handle is colored gold (`bg-amber-500`).
- [ ] Booking progress bar transitions smoothly with a gold-to-amber gradient on step changes.
