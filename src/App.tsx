import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './components/providers/AuthProvider';
import { QueryProvider } from './components/providers/QueryProvider';
import ErrorBoundary from './components/common/ErrorBoundary';
import Toast from './components/common/Toast';
import Navbar from './components/layout/Navbar';
import BottomNav from './components/layout/BottomNav';
import HomePage from './pages/HomePage';
import GamesPage from './pages/GamesPage';
import EventsPage from './pages/EventsPage';
import CommunityPage from './pages/CommunityPage';
import CafesPage from './pages/CafesPage';
import RankingPage from './pages/RankingPage';
import MarketplacePage from './pages/MarketplacePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import GameDetailPage from './pages/GameDetailPage';
import EventDetailPage from './pages/EventDetailPage';
import CommunityDetailPage from './pages/CommunityDetailPage';
import CafeDetailPage from './pages/CafeDetailPage';
import ProfilePage from './pages/ProfilePage';
import DeveloperPage from './pages/DeveloperPage';
import NewGamePage from './pages/NewGamePage';
import NewEventPage from './pages/NewEventPage';
import NewCommunityPage from './pages/NewCommunityPage';
import NewCafePage from './pages/NewCafePage';
import NewAuctionPage from './pages/marketplace/NewAuction';
import AuctionDetailPage from './pages/marketplace/AuctionDetail';
import Footer from './components/layout/Footer';
import CheckEmailPage from './pages/CheckEmailPage';
import OnboardingPage from './pages/profile/OnboardingPage';

function App() {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <Router>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <div className="flex-grow pb-16 md:pb-0">
                <Routes>
                  {/* Auth Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Main Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/games" element={<GamesPage />} />
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/community" element={<CommunityPage />} />
                  <Route path="/cafes" element={<CafesPage />} />
                  <Route path="/ranking" element={<RankingPage />} />
                  <Route path="/marketplace" element={<MarketplacePage />} />
                  <Route path="/marketplace/new" element={<NewAuctionPage />} />
                  <Route path="/marketplace/:id" element={<AuctionDetailPage />} />
                  <Route path="/game/:id" element={<GameDetailPage />} />
                  <Route path="/event/:id" element={<EventDetailPage />} />
                  <Route path="/community/:id" element={<CommunityDetailPage />} />
                  <Route path="/cafe/:id" element={<CafeDetailPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/profile/onboarding" element={<OnboardingPage />} />
                  <Route path="/developer" element={<DeveloperPage />} />
                  <Route path="/new-game" element={<NewGamePage />} />
                  <Route path="/new-event" element={<NewEventPage />} />
                  <Route path="/new-community" element={<NewCommunityPage />} />
                  <Route path="/new-cafe" element={<NewCafePage />} />
                  <Route path="/check-email" element={<CheckEmailPage />} />
                </Routes>
              </div>
              <BottomNav />
              <Footer />
            </div>
            <Toast />
          </AuthProvider>
        </Router>
      </QueryProvider>
    </ErrorBoundary>
  );
}

export default App;