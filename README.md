<<<<<<< HEAD
# Sentinel Bundle Builder

A React prototype of a multi-step security system bundle builder with a live review panel. Built as a frontend take-home exercise.

## Run instructions

```bash
cd bundle-builder
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

### Production build

```bash
npm run build
npm run preview
```

## Features

- **4-step accordion builder:** cameras, plan, sensors, and extra protection
- **Data-driven catalog:** products, pricing, and steps are loaded from JSON
- **Variant-aware quantities:** each color variant tracks its own count; the card stepper edits the active variant only
- **Synced quantity steppers:** builder cards and review panel stay in sync
- **Live review panel:** grouped summary with shipping, guarantee, financing, totals, and savings
- **Persistence:** "Save my system for later" stores the full configuration in `localStorage`
- **Responsive layout:** two-column desktop layout with a stacked mobile experience

## Project structure

```
src/
  data/
    catalog.json        # Product catalog and review metadata
    initialState.json   # Default selections shown on first load
  context/              # Bundle state + actions
  components/           # UI building blocks
  utils/                # Pricing, selection helpers, storage
```

## Design decisions

- **Vite + React + TypeScript** for a fast, maintainable setup without extra UI dependencies.
- **Context + useReducer** keeps state predictable while avoiding over-engineering for a prototype.
- **CSS custom properties** instead of a CSS framework for precise control over spacing, color, and component states.
- **Selection keys** use `productId::variantId` so variants are independent line items in the review panel.
- **Plan exclusivity:** choosing one monitoring plan clears the other, since only one plan can be active.
- **Initial state** seeds the review panel with a camera, monitoring plan, sensors, and yard sign so the first paint matches a configured system.

## Tradeoffs / notes

- Figma access was unavailable during development, so visual details (exact spacing, typography, and product copy) are approximated from the written spec. Product names, prices, and images are representative placeholders.
- Variant chip "selected" styling is intentionally minimal per the brief; behavior and review-panel sync are the focus.
- Checkout is a placeholder confirmation message.
- No test suite is included in this pass.

## Persistence

Saved configurations are stored under the key `sentinel-bundle-config` in `localStorage`.

To verify:

1. Change quantities or variants.
2. Click **Save my system for later**.
3. Reload the page — your configuration should restore.

To reset, clear site data for the app origin or run in the browser console:

```js
localStorage.removeItem('sentinel-bundle-config')
```
=======
# Interview-Tarsk
>>>>>>> f3c1de7fdc73153c2fc3f2ec8d24dd6b8dfef5f6
