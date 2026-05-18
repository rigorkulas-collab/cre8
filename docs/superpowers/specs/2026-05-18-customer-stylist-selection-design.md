# Customer Stylist Selection Design Spec

**Date**: May 18, 2026  
**Status**: Staged / Design Spec Approved  
**Author**: Antigravity  

---

## Goal Description
To expand the customer booking wizard from 4 to 5 steps, introducing a dedicated step where customers can choose their preferred stylist or opt for "Any Stylist (No Preference)". This will replace the hardcoded stylist selection with a fully interactive, premium UI component that aligns with the salon's *Charcoal Lux* branding.

---

## User Review Required
No major breaking changes or risks. The design leverages pre-existing mock data structures (`mockStylists` from `lib/mock-data/mockStaff`) and gracefully updates the existing state variables.

---

## Technical Specifications & UI Flow

The wizard steps will be updated as follows:

```
[Step 1: Service Review] 
       └──> [Step 2: Choose Stylist (NEW)]
                 └──> [Step 3: Choose Date]
                           └──> [Step 4: Pick Time Slot]
                                     └──> [Step 5: Review & Checkout]
```

### Step 2 Component: Stylist List
* **Header Title**: Dynamically updates to `STEP 2 OF 5`.
* **State Management**:
  * Binds to the existing state variable: `selectedStylist` (`Staff | null`).
  * Defaults to `mockStylists[3]` (which represents the "Any Stylist" option).
* **Stylist Card UI**:
  * Rendered as a full-width vertical stack of premium cards.
  * **Avatar Placeholder**: Left-aligned, displaying circular initials (e.g., `AR`, `JJ`, `MC`, `AS`).
    * Background colors styled with Charcoal/Gold HSL tones for a premium aesthetic.
  * **Text Stack**: Bold Stylist Name next to the avatar, with a smaller elegant caption for their Role/Title underneath (e.g., *Senior Stylist*).
  * **Rating Badge**: Displaying `★ X.X` using warm amber typography on a soft, semi-transparent gold/amber pill.
  * **Active State**: Selected stylist card scales slightly (`scale-[1.01]`), shows a thin solid charcoal border, and renders a gold Lucide `Check` icon on the far right.

---

## Proposed Changes

We will modify three primary areas of the customer codebase:

### 1. [MODIFY] [page.tsx](file:///home/zachary/Desktop/cre8/app/booking/page.tsx)
* Update step bounds from `4` to `5` in headers, progress bars, navigation handlers (`handleNext`, `handleBack`), and checkout button label bindings.
* Insert Step 2 `animate-fade-in-quick` container rendering the vertical list of stylist cards mapped from `mockStylists`.
* Update subsequent steps (Date is now Step 3, Time Slot is Step 4, Checkout is Step 5).
* Add a row displaying the selected stylist's name in Step 5 (Review Card) and within the Radix Dialog success modal.

---

## Verification Plan

### Manual Verification
1. Run local development server: `npm run dev`.
2. Navigate to `http://localhost:3000/cre8/booking`.
3. Verify Step Header shows `STEP 1 OF 5` and progress bar is at 20%.
4. Click "Continue Selection" to reach Step 2 (`STEP 2 OF 5`).
5. Confirm all 4 stylist options display correctly (Alex River, Jo Jordan, Maria Cruz, Any Stylist) with ratings and role subtitles.
6. Click different stylist cards to verify tactile active styling transitions, scaling, and checkmark display.
7. Proceed through remaining steps (Date, Time Slot) to Step 5 (Review & Checkout).
8. Verify the correct selected stylist name is shown on the final checkout review panel.
9. Click "Confirm Booking" and verify the stylist's name is dynamically rendered in the success Radix Dialog popup.
