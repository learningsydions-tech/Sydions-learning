import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSession } from "@/contexts/SessionContext";
import { LogIn, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const Header: React.FC = () => {
  const { session, loading } = useSession();

  return (
    <header className="fixed top-0 left-0 right-0 z-20 bg-background/90 backdrop-blur-sm border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo/Title */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/Sydions_logo.jpg" alt="Sydions Logo" className="h-8 w-8 rounded-full" />
          <span className="text-xl font-bold text-primary transition-colors hover:text-accent">
            Sydions
          </span>
        </Link>

        {/* Navigation/Action */}
        <nav className="flex items-center space-x-4">
          <Link to="/explore" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:inline-block">
            Explore Challenges
          </Link>
          <Link to="/leaderboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors hidden sm:inline-block">
            Leaderboard
          </Link>
          
          {loading ? (
            <div className="w-24 h-10 bg-muted rounded-md animate-pulse" />
          ) : session ? (
            <Button asChild size="sm">
              <Link to="/dashboard">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Go to Dashboard
              </Link>
            </Button>
          ) : (
            <Button asChild size="sm">
              <Link to="/login">
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;