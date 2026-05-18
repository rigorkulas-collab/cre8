# Spec: Customer Booking Portal Payment Selector Integration

This specification details the frontend additions and layout changes to support a modern payment method selection inside the booking wizard (Step 4) for the CRE8 client application.

---

## 1. Requirements

* **Selection Options**: The user must be able to choose between:
  1. **Pay at Salon** (no upfront charges).
  2. **Pay Online Now** (simulated credit card processing).
* **Tactile Design**: Rich, responsive button selection cards in Charcoal Lux color scheme.
* **Online Checkout Inputs**: Cardholder name, Card Number (auto-formatted), Expiry (MM/YY), and CVC.
* **Apple Pay Alternative**: A quick checkout button display if Pay Online is selected.
* **CTA Adaptability**: Confirm button changes from "Confirm Appointment" to "Complete Payment & Book" based on the payment method selected.
* **Validation**: Checks credit card details are completely entered before booking completion.

---

## 2. Architecture & UI Details

### Component Location: `app/booking/page.tsx`
We will introduce a state hook `paymentMethod` ("salon" | "online") defaulted to "salon".

```tsx
const [paymentMethod, setPaymentMethod] = useState<"salon" | "online">("salon");
const [cardName, setCardName] = useState("");
const [cardNumber, setCardNumber] = useState("");
const [cardExpiry, setCardExpiry] = useState("");
const [cardCvc, setCardCvc] = useState("");
const [paymentErrors, setPaymentErrors] = useState<{ [key: string]: string }>({});
```

### Visual Layout Structure
1. **Selection Buttons**:
   Grid with 2 column buttons.
2. **Dynamic Card Panel**:
   Conditional block rendering if `paymentMethod === "online"`. Includes:
   - Mock Apple Pay button.
   - Text inputs with focus rings and standard Charcoal border states.
3. **Adaptive Footer Button**:
   Calls validator function first if online check is active.

---

## 3. Data Formatting & Validation Logic

* **Card Number Format**: Formats input string by removing non-digits and inserting spaces every 4 characters.
* **Validation Schema**:
  - `cardName`: Non-empty.
  - `cardNumber`: Must have at least 15-16 characters after format stripping.
  - `cardExpiry`: Format match `MM/YY` where month is 01-12.
  - `cardCvc`: 3-4 digits.
