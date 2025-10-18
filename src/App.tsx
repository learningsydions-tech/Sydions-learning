import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Auth
import LoginPage from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

// Main Layout
import Layout from "./components/Layout";
import ExplorePage from "./pages/Explore";
import FriendsPage from "./pages/Friends";
import GuildsPage from "./pages/Guilds";
import GuildPage from "./pages/Guild";
import InventoryPage from "./pages/Inventory";
import LeaderboardPage from "./pages/Leaderboard";
import MessagesPage from "./pages/Messages";
import OnboardingPage from "./pages/Onboarding";
import ProfilePage from "./pages/Profile";
import SettingsPage from "./pages/Settings";
import ShopPage from "./pages/Shop";
import ChallengesPage from "./pages/Challenges";
import ChallengeDetailPage from "./pages/ChallengeDetail";

// Admin Layout
import AdminLayout from "./components/admin/AdminLayout";
import AdminPage from "./pages/Admin";
import AdminUsersPage from "./pages/admin/Users";
import AdminChallengesPage from "./pages/admin/Challenges";
import AdminSettingsPage from "./pages/admin/Settings";
import ManageShopPage from "./pages/admin/ManageShop";
import ManageLevelsPage from "./pages/admin/ManageLevels";
import ManageGuildLevelsPage from "./pages/admin/ManageGuildLevels";
import ReportsPage from "./pages/admin/Reports";
import CreateChallengePage from "./pages/admin/CreateChallenge";
import EditChallengePage from "./pages/admin/EditChallenge"; // <-- New Import
import CreateShopItemPage from "./pages/admin/CreateShopItem";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/onboarding" element={<OnboardingPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              {/* User-facing routes */}
              <Route
                path="/"
                element={
                  <Layout>
                    <Index />
                  </Layout>
                }
              />
              <Route
                path="/challenges"
                element={
                  <Layout>
                    <ChallengesPage />
                  </Layout>
                }
              />
              <Route
                path="/challenges/:challengeId"
                element={
                  <Layout>
                    <ChallengeDetailPage />
                  </Layout>
                }
              />
              <Route
                path="/explore"
                element={
                  <Layout>
                    <ExplorePage />
                  </Layout>
                }
              />
              <Route
                path="/friends"
                element={
                  <Layout>
                    <FriendsPage />
                  </Layout>
                }
              />
              <Route
                path="/guilds"
                element={
                  <Layout>
                    <GuildsPage />
                  </Layout>
                }
              />
              <Route
                path="/guilds/:guildId"
                element={
                  <Layout>
                    <GuildPage />
                  </Layout>
                }
              />
              <Route
                path="/inventory"
                element={
                  <Layout>
                    <InventoryPage />
                  </Layout>
                }
              />
              <Route
                path="/leaderboard"
                element={
                  <Layout>
                    <LeaderboardPage />
                  </Layout>
                }
              />
              <Route
                path="/messages"
                element={
                  <Layout noPadding>
                    <MessagesPage />
                  </Layout>
                }
              />
              <Route
                path="/profile"
                element={
                  <Layout>
                    <ProfilePage />
                  </Layout>
                }
              />
              <Route
                path="/settings"
                element={
                  <Layout>
                    <SettingsPage />
                  </Layout>
                }
              />
              <Route
                path="/shop"
                element={
                  <Layout>
                    <ShopPage />
                  </Layout>
                }
              />

              {/* Admin routes */}
              <Route
                path="/admin"
                element={
                  <AdminLayout>
                    <AdminPage />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <AdminLayout>
                    <AdminUsersPage />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/challenges"
                element={
                  <AdminLayout>
                    <AdminChallengesPage />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/challenges/new"
                element={
                  <AdminLayout>
                    <CreateChallengePage />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/challenges/edit/:challengeId" // <-- New Route
                element={
                  <AdminLayout>
                    <EditChallengePage />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <AdminLayout>
                    <AdminSettingsPage />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/shop"
                element={
                  <AdminLayout>
                    <ManageShopPage />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/shop/new"
                element={
                  <AdminLayout>
                    <CreateShopItemPage />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/levels"
                element={
                  <AdminLayout>
                    <ManageLevelsPage />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/guild-levels"
                element={
                  <AdminLayout>
                    <ManageGuildLevelsPage />
                  </AdminLayout>
                }
              />
              <Route
                path="/admin/reports"
                element={
                  <AdminLayout>
                    <ReportsPage />
                  </AdminLayout>
                }
              />
            </Route>

            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;