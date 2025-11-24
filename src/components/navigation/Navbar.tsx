import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useState } from "react";
import { Moon, Sun } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const { user } = useAppContext();
  const isHome = location.pathname === "/";
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent/80">
            <TrendingUp className="h-5 w-5 text-accent-foreground" />
          </div>
          <span className="text-xl font-bold">FairFound</span>
        </Link>

        <div className="flex items-center gap-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-5 w-5 text-yellow-500" /> : <Moon className="h-5 w-5 text-gray-500" />}
          </button>

          {user ? (
            <>
              <Link to="/dashboard/industry">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center">
                  <span className="text-sm font-medium text-accent">{user.name.charAt(0)}</span>
                </div>
              </div>
            </>
          ) : (
            <>
              {!isHome && (
                <Link to="/">
                  <Button variant="ghost">Home</Button>
                </Link>
              )}
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
