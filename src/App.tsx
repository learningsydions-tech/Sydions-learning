import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import ChallengesPage from "./pages/Challenges";
import ExplorePage from "./pages/Explore";
import FriendsPage from "./pages/Friends";
import GuildsPage from "./pages/Guilds";
import InventoryPage from "./pages/Inventory";
import LeaderboardPage from "./pages/Leaderboard";
import MessagesPage from "./pages/Messages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
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
              <Layout>
                <MessagesPage />
              </Layout>
            }
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;