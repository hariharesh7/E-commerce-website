# Apex Workstations

Apex Workstations is a modern mini e-commerce demo built with React and Vite. It showcases a complete shopping experience with product browsing, filtering, cart management, coupon handling, guest/login flows, and a checkout flow UI.

## live demo link - https://darling-licorice-cc2c33.netlify.app/

## ✨ Features

- Browse a curated catalog of products
- Search by name, category, tags, or description
- Filter by category, price range, and stock availability
- Sort products by rating, price, or name
- Add, update, and remove items from the cart
- View product details and quick previews
- Use coupon codes and review checkout totals
- Switch between light and dark themes
- Persist cart/session/theme preferences using browser storage

## 🛠️ Tech Stack

- React 19
- Vite 6
- JavaScript / JSX
- Tailwind CSS
- Lucide Icons
- Motion

## 📁 Project Structure

- `src/App.jsx` — app logic, state management, filters, cart handling, and layout
- `src/productsData.js` — product catalog data
- `src/components/` — reusable UI components for cards, modals, filters, login, and cart drawer
- `index.html` — application entry file
- `vite.config.ts` — Vite configuration

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm run dev
```

The app will typically be available at:

- `http://localhost:3000`

If port `3000` is already in use, Vite may automatically choose another available port.

## 🏗️ Build for Production

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## 🧩 Notes

- This project uses sample/mock product data.
- Checkout behavior is UI-based and does not connect to a real backend.
- Product images are loaded from external URLs.

## 📄 License

This project is intended for learning, demo, and portfolio use.
