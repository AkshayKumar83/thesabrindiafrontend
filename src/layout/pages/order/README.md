# THE SABR INDIA — Checkout UI

A modular, premium checkout flow built with **React + CoreUI React + lucide-react**.

## Files

```
CheckoutPage.jsx           Orchestrator: step state, layout, wiring
checkout.css               All design tokens & styling (scoped to .sabr-checkout)
components/
  StepIndicator.jsx        Progress rail (Address → Review → Payment)
  AddressSection.jsx       Saved address cards + add/edit form
  OrderReview.jsx          Item list + price summary (full & `compact` modes)
  PaymentSection.jsx       Razorpay / COD selection + Pay button
  OrderSuccess.jsx         Confirmation screen
```

## Install dependencies

```bash
npm install @coreui/react @coreui/coreui lucide-react
```

Make sure CoreUI's base CSS is imported once in your app entry point (this is
separate from the custom `checkout.css` used here):

```js
import '@coreui/coreui/dist/css/coreui.min.css';
```

## Wiring to your real Cart & data

`CheckoutPage.jsx` was intentionally kept decoupled from your existing
`CartContext` — it uses local sample data (`SAMPLE_ITEMS`, `SAMPLE_ADDRESSES`)
so it drops in without touching your cart code. To connect it:

1. Replace the `SAMPLE_ITEMS` block with your cart items, e.g.:
   ```jsx
   const { cartItems, subtotal, shipping, discount, total } = useCart();
   ```
   and pass those values into `<OrderReview />` / the summary sidebar instead
   of the locally-computed `subtotal`/`total`.

2. Replace `SAMPLE_ADDRESSES` with addresses from your user/account API, and
   swap `handleSaveAddress` for a call to your address-create/update endpoint.

3. Replace the `setTimeout` inside `handlePayNow` in `CheckoutPage.jsx` with:
   - **Razorpay**: create an order server-side, open `Razorpay` checkout via
     their JS SDK, and set `order` from the verified payment response.
   - **COD**: call your order-creation endpoint directly and set `order` from
     its response.

4. Wire `onTrackOrder` in `OrderSuccess` to your order-tracking route/page.

## Notes

- All custom styles are scoped under the `.sabr-checkout` class so they won't
  leak into or conflict with the rest of your app (including your existing
  Cart UI).
- `OrderReview` is reused in two modes: the full item-by-item breakdown on the
  "Review" step, and a `compact` condensed version in the sticky sidebar on
  desktop.
- Layout is mobile-first: single column below `lg` breakpoint, two-column
  (content + sticky summary) at `lg` and above. No horizontal scroll at any
  width.
- Fonts (Cormorant Garamond + Manrope) are pulled from Google Fonts inside
  `checkout.css`. Self-host them if your app needs to avoid external font
  requests.
