# 🏨 Hotelier Frontend - Enterprise Hotel Management System

[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

A modern, production-ready **hotel management dashboard** built with **Next.js 16**, **React 19**, and **TypeScript**. This frontend application provides a comprehensive, intuitive interface for managing all aspects of hotel operations with real-time data visualization and seamless user experience.

🌐 **Live Application:** [https://hotelier-suite.vercel.app](https://hotelier-suite.vercel.app)  
⚙️ **Backend Repository:** [https://github.com/Nick220505/hotelier-backend](https://github.com/Nick220505/hotelier-backend)  
🚀 **Deployment:** Hosted on [Vercel](https://vercel.com)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Key Components](#-key-components)
- [State Management](#-state-management)
- [Form Validation](#-form-validation)
- [Deployment](#-deployment)

---

## ✨ Features

### Dashboard & Analytics
- **Real-Time KPIs** - Live tracking of total reservations, available rooms, occupancy rates, and monthly revenue
- **Interactive Charts** - Occupancy visualization with pie charts, revenue comparison with bar charts using Recharts
- **Recent Activities Feed** - Real-time updates on system activities and operations
- **Upcoming Events** - Calendar view of scheduled events and important dates
- **Performance Metrics** - Monthly comparisons, profit tracking, and trend analysis

### Core Operations Management
- **Reservations System** - Comprehensive booking management with real-time availability
- **Room Management** - Visual room status board, inventory tracking, and pricing
- **Guest Management** - Detailed guest profiles, preferences, history, and service requests
- **Employee Administration** - Staff management, shift scheduling, attendance tracking
- **Housekeeping Dashboard** - Task assignment, room status, and cleaning workflows
- **Maintenance Tracking** - Work order management with priority levels
- **Restaurant Services** - Menu management, orders, table reservations
- **Event Management** - Venue bookings, event planning, catering coordination
- **Recreational Facilities** - Spa, gym, pool bookings and activity management
- **Parking Management** - Vehicle tracking and space allocation

### Financial Operations
- **Billing & Invoicing** - Comprehensive billing system with invoice generation
- **Payment Processing** - Payment tracking and financial reporting
- **Revenue Analysis** - Detailed financial reports with data visualization
- **Audit Logging** - Complete activity tracking for compliance

### User Experience
- **Role-Based UI** - Dynamic interface based on user permissions
- **Responsive Design** - Fully optimized for desktop, tablet, and mobile
- **Dark/Light Mode** - Theme switching with next-themes
- **Intuitive Navigation** - Clean, organized sidebar navigation
- **Form Validation** - Real-time validation with helpful error messages
- **Loading States** - Smooth loading indicators and skeleton screens
- **Error Handling** - User-friendly error messages and fallbacks
- **Accessibility** - WCAG compliant components from shadcn/ui

---

## 🛠️ Tech Stack

### Core Framework
- **Next.js 16** - React framework with server components, app router, and optimized performance
- **React 19** - Latest React with concurrent features and improved performance
- **TypeScript 5** - Full type safety across the entire application

### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS framework with modern design
- **shadcn/ui** - High-quality, accessible component library built on Radix UI
- **Radix UI** - Unstyled, accessible UI components (40+ components)
- **Lucide React** - Beautiful, consistent icon library
- **next-themes** - Dark/light mode implementation

### Forms & Validation
- **React Hook Form** - Performant form management with minimal re-renders
- **Zod** - TypeScript-first schema validation
- **@hookform/resolvers** - Zod integration with React Hook Form

### Data Visualization
- **Recharts** - Composable charting library for React
- **date-fns** - Modern date utility library

### Additional Libraries
- **embla-carousel-react** - Lightweight carousel/slider
- **cmdk** - Command menu component (⌘K)
- **sonner** - Toast notifications
- **vaul** - Drawer component
- **class-variance-authority** - CSS class variants management
- **tailwind-merge** - Merge Tailwind classes without conflicts

### DevOps & Tools
- **ESLint** - Code linting with Next.js config
- **PostCSS** - CSS processing
- **Docker** - Containerization for consistent environments
- **Vercel** - Production deployment platform

---

## 📸 Screenshots

### Login Page
Professional authentication interface with secure authentication and role-based access.

![Login Page](docs/images/login.png)

### Main Dashboard
Comprehensive overview with KPI cards, occupancy charts, revenue comparisons, and activity feeds.

![Main Dashboard](docs/images/dashboard.png)

### Reservations Module
Full booking management system with detailed reservation tracking and real-time availability.

![Reservations Module](docs/images/reservations.png)

### Room Management
Visual room status board showing availability, housekeeping status, and room assignments.

![Room Management](docs/images/rooms.png)

### Analytics & Reports
Advanced data visualization with interactive charts, financial summaries, and export capabilities.

![Analytics & Reports](docs/images/reports.png)

### Mobile Responsive
Fully responsive design optimized for mobile devices and tablets with dark mode support.

![Mobile Responsive](docs/images/responsive.png)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Backend API** running (see [backend repository](https://github.com/Nick220505/hotelier-backend))

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Nick220505/hotelier-frontend.git
cd hotelier-frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Configuration**

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Optional: Enable debug mode
NEXT_PUBLIC_DEBUG=false
```

### Running the Application

```bash
# Development mode with hot-reload
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint

# Fix linting issues automatically
npm run lint:fix
```

The application will be available at `http://localhost:3001`

### Using Docker (Standalone)

```bash
# Build the image
docker build -t hotelier-frontend .

# Run the container (uses default env baked into the image or .env* files)
docker run -p 3001:3000 hotelier-frontend
```

### Using Hotelier Infra (Docker Compose)

For running the **full Hotelier platform** (database, backend, frontend, and
future microservices) with Docker, use the dedicated infra repository:

- [`hotelier-infra`](https://github.com/hotelier-suite/hotelier-infra)

That repository contains the canonical Docker Compose configuration and the
step-by-step onboarding guide for spinning up the complete stack.

---

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication pages
│   │   └── login/                # Login page
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── page.tsx              # Main dashboard
│   │   ├── reservations/         # Reservations module
│   │   ├── rooms/                # Room management
│   │   ├── guests/               # Guest management
│   │   ├── employees/            # Employee administration
│   │   ├── housekeeping/         # Housekeeping dashboard
│   │   ├── maintenance/          # Maintenance tracking
│   │   ├── restaurant/           # Restaurant services
│   │   ├── events/               # Event management
│   │   ├── recreational/         # Recreational facilities
│   │   ├── parking/              # Parking management
│   │   ├── billing/              # Billing & invoicing
│   │   ├── reports/              # Reports & analytics
│   │   └── settings/             # System settings
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
│
├── components/                   # Reusable components
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── table.tsx
│   │   └── ... (40+ components)
│   ├── dashboard/                # Dashboard-specific components
│   │   ├── kpi-card.tsx          # KPI display cards
│   │   ├── recent-activities.tsx # Activity feed
│   │   ├── occupancy-chart.tsx   # Occupancy visualization
│   │   └── revenue-chart.tsx     # Revenue comparison
│   ├── layout/                   # Layout components
│   │   ├── navbar.tsx            # Top navigation bar
│   │   ├── sidebar.tsx           # Side navigation
│   │   └── footer.tsx            # Footer component
│   └── forms/                    # Form components
│       ├── reservation-form.tsx
│       ├── guest-form.tsx
│       └── employee-form.tsx
│
├── lib/                          # Utility functions
│   ├── api.ts                    # API client configuration
│   ├── utils.ts                  # General utilities
│   ├── validators.ts             # Zod schemas
│   └── constants.ts              # App constants
│
├── types/                        # TypeScript type definitions
│   ├── api.ts                    # API response types
│   ├── models.ts                 # Data model types
│   └── components.ts             # Component prop types
│
└── hooks/                        # Custom React hooks
    ├── use-auth.ts               # Authentication hook
    ├── use-api.ts                # API data fetching
    └── use-toast.ts              # Toast notifications
```

---

## 🧩 Key Components

### Dashboard Components

#### KPI Cards
Real-time metrics display with loading states and error handling.
- Total Reservations
- Available Rooms
- Occupancy Rate
- Monthly Revenue

#### Charts & Visualization
- **Occupancy Chart** - Pie chart showing room status distribution (Recharts)
- **Revenue Chart** - Bar chart for monthly revenue comparison
- **Trend Lines** - Historical data visualization

#### Activity Feed
Real-time updates on system activities with timestamp and user information.

### Form Components

All forms use **React Hook Form** with **Zod validation**:
- Optimistic UI updates
- Real-time validation
- Error messages
- Loading states
- Submit confirmation

### UI Components (shadcn/ui)

40+ pre-built, accessible components including:
- **Forms** - Input, Select, Checkbox, Radio, Switch, Slider
- **Data Display** - Table, Card, Avatar, Badge, Separator
- **Feedback** - Alert, Toast, Dialog, Drawer, Progress
- **Navigation** - Tabs, Accordion, Menubar, Dropdown
- **Overlays** - Dialog, Sheet, Popover, Tooltip, Context Menu

---

## 📊 State Management

### API Data Fetching
- RESTful API integration with fetch
- Session management
- Request/response interceptors
- Error handling and retry logic

### Form State
- React Hook Form for form state management
- Zod for validation schemas
- Optimistic updates for better UX

### UI State
- React Context for global UI state
- next-themes for theme management
- Local storage for user preferences

---

## ✅ Form Validation

All forms implement comprehensive validation using **Zod schemas**:

```typescript
// Example: Reservation Form Validation
const reservationSchema = z.object({
  guestId: z.string().min(1, "Guest is required"),
  roomId: z.string().min(1, "Room is required"),
  checkInDate: z.date(),
  checkOutDate: z.date(),
  numberOfGuests: z.number().min(1).max(10),
  specialRequests: z.string().optional(),
});
```

### Validation Features:
- Real-time field validation
- Custom error messages
- Type-safe schemas
- Backend validation sync
- Required field indicators
- Input constraints

---

## 🚀 Deployment

### Production Deployment (Vercel)

This application is deployed on **Vercel** with automatic deployments from the main branch.

#### Deployment Steps:

1. **Connect to Vercel**
   - Import the repository
   - Configure build settings
   - Set environment variables

2. **Environment Variables (Production)**
```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com/api
NEXT_PUBLIC_APP_URL=https://hotelier-suite.vercel.app
```

3. **Build Configuration**
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Deploy**
   - Push to main branch for automatic deployment
   - Or deploy manually via Vercel CLI

### Performance Optimizations

- **Server Components** - Leverage Next.js server components for reduced client bundle
- **Code Splitting** - Automatic code splitting per route
- **Image Optimization** - Next.js Image component for optimized images
- **Font Optimization** - Next.js font optimization
- **Caching** - Aggressive caching strategies
- **Lazy Loading** - Dynamic imports for heavy components

### Docker Deployment

```bash
# Build production image
docker build -f Dockerfile.prod -t hotelier-frontend:prod .

# Run container
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_API_URL=https://your-api.com/api \
  hotelier-frontend:prod
```

---

## 🎨 Design System

### Colors
- **Primary** - Blue (#3b82f6)
- **Secondary** - Slate (#64748b)
- **Success** - Green (#22c55e)
- **Warning** - Yellow (#eab308)
- **Error** - Red (#ef4444)

### Typography
- **Font Family** - Inter (via next/font)
- **Headings** - Bold, clear hierarchy
- **Body** - 16px base size, 1.5 line height

### Spacing
- **Consistent spacing** - 4px base unit (Tailwind spacing scale)
- **Layout grid** - Flexbox and Grid layouts
- **Responsive breakpoints** - sm, md, lg, xl, 2xl

---

## 🔒 Security

- ✅ **Secure Authentication** - Session-based authentication with backend
- ✅ **HTTPS Only** - Enforced in production
- ✅ **CORS Configuration** - Restricted to backend API
- ✅ **Input Sanitization** - All user inputs validated and sanitized
- ✅ **XSS Prevention** - React's built-in XSS protection
- ✅ **CSRF Protection** - Form validation and secure requests
- ✅ **Environment Variables** - Sensitive data in env vars only

---

## ♿ Accessibility

- ✅ **WCAG 2.1 Compliant** - Follows accessibility guidelines
- ✅ **Keyboard Navigation** - Full keyboard support
- ✅ **Screen Reader Support** - ARIA labels and semantic HTML
- ✅ **Focus Management** - Proper focus indicators
- ✅ **Color Contrast** - WCAG AA compliant contrast ratios
- ✅ **Responsive Text** - Scalable font sizes

---

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop** - 1920px and above
- **Laptop** - 1366px - 1920px
- **Tablet** - 768px - 1366px
- **Mobile** - 375px - 768px

---

## 🤝 Contributing

This is a portfolio project showcasing modern frontend development with Next.js, React, and TypeScript.

---

## 📄 License

This project is private and for portfolio demonstration purposes.

---

## 👨‍💻 Developer

**Juan Nicolas Pardo Torres**

- LinkedIn: [nicolas-pardo-6156a1222](https://linkedin.com/in/nicolas-pardo-6156a1222)
- GitHub: [@Nick220505](https://github.com/Nick220505)
- Email: juannicolaspardo@gmail.com

---

## 🔗 Related Repositories

- **Backend API:** [hotelier-backend](https://github.com/Nick220505/hotelier-backend)
- **Live Demo:** [https://hotelier-suite.vercel.app](https://hotelier-suite.vercel.app)

---

## 🙏 Acknowledgments

- **shadcn/ui** - Beautiful, accessible component library
- **Radix UI** - Unstyled, accessible UI primitives
- **Vercel** - Deployment and hosting platform
- **Next.js Team** - Amazing React framework

---

**Built with ❤️ using Next.js 16, React 19, TypeScript, and Tailwind CSS**
