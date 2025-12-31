# Crown Space 💇🏽‍♀️📱

Crown Space is a cross-platform mobile application built with **React Native** that helps users discover, book, and manage Afro-textured haircare services. The app connects customers with specialist stylists and salons through location-based discovery, secure bookings, and modern mobile UX patterns.

This project was built as a full-stack prototype, focusing on real-world mobile architecture, scalable backend services, and production-ready tooling.

---

## ✨ Features

### Customer Features
- Discover Afro haircare businesses near you using **map-based search**
- Filter services by style, price, rating, and location
- View detailed business and service profiles
- Book appointments with integrated payments
- Persistent user sessions across app restarts

### Business Features
- Create and manage service listings
- Define availability and appointment schedules
- Manage bookings and cancellations
- View customer feedback and ratings

---

## 🧱 Tech Stack

This project uses a **modern mobile stack** commonly used in production apps:

### Frontend
- **React Native** – cross-platform mobile development
- **Expo** – streamlined development, testing, and deployment
- **TypeScript** – type safety and maintainability
- **Tailwind (NativeWind / Tamagui)** – utility-first, consistent styling
- **expo-router** – file-based navigation built on React Navigation

### State Management
- **Zustand** – lightweight global state management
- Persistent state for user sessions and bookings

### Backend & Services
- **Supabase** – serverless backend (PostgreSQL, Auth, Storage)
- **Supabase Edge Functions** – serverless business logic
- **Stripe (test mode)** – secure, PCI-compliant payment handling

### Maps & Native Integrations
- **Apple Maps** (iOS) and **Google Maps** (Android)
- Location-based discovery using latitude / longitude
- Native device permissions handled via Expo APIs

---

## 🗺️ Maps & Location Integration

Crown Space integrates native mapping services to enable location-based discovery:

- **Apple Maps** on iOS
- **Google Maps** on Android

Businesses store geo-coordinates in the backend, allowing users to:
- Browse nearby salons
- View business locations directly on the map
- Filter results by distance

All map functionality works in both **development builds** and production builds.

---

## 🧪 Local Development & Testing

### Prerequisites
- Node.js
- Expo CLI  
  ```bash
  npm install -g expo-cli
