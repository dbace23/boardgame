# BoardHaven - Board Game Community Platform

A modern web application for board game enthusiasts to discover games, join communities, attend events, find local gaming cafes, and participate in board game auctions.

## 🎲 Features

### Core Features
- **Games**: Browse, rate, review, and manage your board game collection
- **Communities**: Join and create board gaming communities
- **Events**: Organize and participate in gaming events
- **Cafes**: Discover local board game cafes and shops
- **Marketplace**: Buy and sell board games through auctions

### Key Functionality
- User authentication with email and password
- Real-time auction system with countdown timers
- Community moderation tools
- Event management and registration
- Image uploads and management
- Rating and review system
- Advanced filtering and search
- Responsive design for all devices

## 🚀 Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: 
  - React Query for server state
  - Zustand for global state
  - React Hook Form for form state
- **Routing**: React Router v6
- **Form Validation**: Zod
- **UI Components**: 
  - Radix UI primitives
  - Custom components
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **File Upload**: UploadThing

### Backend
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **API**: Supabase Edge Functions

## 📁 Project Structure and Functionality

src/
├── components/           # Reusable UI components
│   ├── cards/           # Entity card components
│   │   ├── AuctionCard.tsx   # Displays auction information with countdown and bid details
│   │   │   - useCountdown: Manages the countdown timer for the auction end time.
│   │   ├── BaseCard.tsx      # Base component for card layouts with link functionality.
│   │   ├── CafeCard.tsx      # Displays cafe information with follow toggle.
│   │   ├── CommunityCard.tsx # Displays community information.
│   │   ├── EventCard.tsx     # Displays event information with registration.
│   │   ├── GameCard.tsx      # Displays game information with interactive buttons.
│   │   └── ImageHeader.tsx   # Displays image at the top of the card.
│   ├── common/          # Shared components
│   │   ├── BulletinModal.tsx # Displays bulletin posts with comments.
│   │   ├── CardGrid.tsx      # Displays items in a grid layout.
│   │   ├── ContentList.tsx   # Displays a list of content items with filtering and sorting.
│   │   ├── ErrorBoundary.tsx # Handles errors and provides a fallback UI.
│   │   ├── FilterButtons.tsx # Displays filter buttons for trending, ranking, and more filters.
│   │   ├── FilterPanel.tsx   # Displays filter options in a panel.
│   │   ├── ImageUpload.tsx   # Handles image uploads.
│   │   ├── InteractionButtons.tsx # Displays interactive buttons for likes, comments, etc.
│   │   ├── LazyImage.tsx     # Displays images with lazy loading.
│   │   ├── LoadingSpinner.tsx# Displays a loading spinner.
│   │   ├── LoginModal.tsx    # Displays a login modal.
│   │   ├── Rating.tsx        # Displays a rating component.
│   │   ├── ReportButton.tsx  # Displays a report button.
│   │   ├── SearchBar.tsx     # Displays a search bar with suggestions.
│   │   ├── ShareButtons.tsx  # Displays share buttons for social media.
│   │   └── Tabs.tsx          # Displays tab navigation.
│   ├── layout/          # Layout components
│   │   ├── AuthHeader.tsx    # Header for authentication pages.
│   │   ├── Banner.tsx        # Displays a banner with a title, subtitle, and image.
│   │   ├── BottomNav.tsx     # Displays bottom navigation on mobile devices.
│   │   ├── Footer.tsx        # Displays the footer.
│   │   └── Navbar.tsx        # Displays the navigation bar.
│   ├── modals/          # Modal components
│   │   └── CreateEventModal.tsx # Modal for creating new events.
│   └── providers/       # Context providers
│   │   ├── AuthProvider.tsx  # Provides authentication context.
│   │   └── QueryProvider.tsx # Provides React Query context.
├── hooks/               # Custom React hooks
│   ├── api/           # API hooks
│   │   └── useGames.ts     # Fetches games from the API.
│   ├── useCountdown.ts   # Manages a countdown timer.
│   ├── useDebounce.ts     # Debounces input values.
│   ├── useEntityPermissions.ts # Manages entity permissions.
│   ├── useFilterParams.ts  # Manages filter parameters in the URL.
│   ├── useFilters.ts       # Manages filtering logic.
│   ├── useForm.ts          # Integrates React Hook Form with Zod.
│   ├── useInfiniteCache.ts # Manages infinite scroll caching.
│   └── useSearch.ts        # Manages search functionality.
├── pages/               # Page components
│   ├── CafeDetailPage.tsx  # Displays details for a specific cafe.
│   ├── CafesPage.tsx       # Displays a list of cafes.
│   ├── CommunityDetailPage.tsx # Displays details for a specific community.
│   ├── CommunityPage.tsx   # Displays a list of communities.
│   ├── DeveloperPage.tsx   # Displays developer settings.
│   ├── EventDetailPage.tsx   # Displays details for a specific event.
│   ├── EventsPage.tsx      # Displays a list of events.
│   ├── ForgotPasswordPage.tsx # Page for resetting password.
│   ├── GameDetailPage.tsx   # Displays details for a specific game.
│   ├── GamesPage.tsx       # Displays a list of games.
│   ├── HomePage.tsx        # Displays the home page.
│   ├── LoginPage.tsx       # Displays the login page.
│   ├── marketplace/        # Marketplace related pages
│   │   ├── AuctionDetail.tsx # Displays details for a specific auction.
│   │   └── NewAuction.tsx  # Page for creating new auctions.
│   ├── NewCafePage.tsx     # Page for creating new cafes.
│   ├── NewCommunityPage.tsx# Page for creating new communities.
│   ├── NewEventPage.tsx     # Page for creating new events.
│   ├── NewGamePage.tsx      # Page for creating new games.
│   ├── ProfilePage.tsx     # Displays the user profile page.
│   ├── RankingPage.tsx     # Displays community rankings.
│   └── RegisterPage.tsx    # Displays the registration page.
├── server/              # Server-side code
│   ├── api/           # API routes
│   │   └── games.ts     # API routes for games.
│   ├── push.ts           # Code for push notifications.
│   └── uploadthing.ts    # Code for handling file uploads with UploadThing.
├── stores/              # Global state stores
│   └── authStore.ts      # Zustand store for authentication state.
├── types/               # TypeScript types
│   └── index.ts          # Defines TypeScript types for the application.
└── utils/               # Utility functions
│   ├── cn.ts             # Utility function for Tailwind CSS class merging.
│   ├── format.ts         # Utility function for formatting currency.
│   ├── notifications.ts  # Utility functions for handling push notifications.
│   ├── uploadthing.ts    # Utility functions for UploadThing.
│   └── validation.ts     # Zod schemas for form validation.