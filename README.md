# GridConnect

GridConnect is a comprehensive platform designed to bridge the gap between racing drivers and teams. It provides role-based dashboards, real-time communication, and discovery tools for the racing community.

## 🚀 Key Features

### 🏎️ For Drivers
- **Dashboard**: Track your racing stats and recent activity at a glance.
- **Search Teams**: Discover racing teams and filter by discipline or location.
- **Opportunities**: Browse and apply for open racing seats.
- **Profile**: Showcase your racing history, licenses, and achievements.
- **Subscriptions**: Manage your account tiers and active plans.

### 🏁 For Racing Teams
- **Dashboard**: View top-matching drivers and manage team activities.
- **Search Drivers**: Find talented drivers using advanced filtering (capability, discipline, licensing).
- **Manage Drives**: Post and manage racing opportunities for applicants.
- **Real-time Interaction**: Direct messaging with potential driver candidates.

### 💬 Unified Messaging
- **Real-time Chat**: Instant communication powered by Laravel Echo and Reverb.
- **Smart Notifications**: Stay updated on applications and new messages.
- **Active Chat History**: Easily access and manage ongoing conversations.

## 🛠️ Technical Stack

- **Framework**: [Vite](https://vitejs.dev/) + [React 19](https://react.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & [Redux Persist](https://github.com/rt2zz/redux-persist)
- **API Fetching**: [RTK Query](https://redux-toolkit.js.org/rtk-query/overview)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Real-time**: [Laravel Echo](https://laravel.com/docs/11.x/broadcasting) & [Pusher-js](https://github.com/pusher/pusher-js)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) (Shadcn UI)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## ⚙️ Environment Configuration

Create a `.env` or `.env.local` file in the root directory and configure the following variables:

```env
# API Configuration
VITE_BASE_API_URL=https://your-api-endpoint.com/api

# Real-time Broadcasting (Reverb)
VITE_REVERB_APP_KEY=your_app_key
VITE_REVERB_HOST=your_reverb_host
VITE_REVERB_PORT=443
VITE_REVERB_SCHEME=https
```

## 📦 Getting Started

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/gridconnect-frontend.git
   cd gridconnect-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 📂 Project Structure

- `src/components`: Reusable UI elements, layouts, and shared components.
- `src/pages`: Feature-specific dashboards and views for Teams and Drivers.
- `src/redux`: Global state management, API slices (RTK Query), and persistent storage.
- `src/lib`: Utility functions and third-party library initializations (e.g., Echo).
- `src/types`: TypeScript interfaces and type definitions.

---
© 2026 GridConnect. All rights reserved.
