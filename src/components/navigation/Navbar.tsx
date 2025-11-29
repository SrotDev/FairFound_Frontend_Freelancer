import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAppContext } from "@/context/AppContext";
import { useState } from "react";
import { TrendingUp, Moon, Sun, UserRoundSearch } from "lucide-react";


const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAppContext();
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark", !darkMode);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to={user ? "/freelancer/dashboard" : "/"} className="flex items-center gap-2 transition-opacity hover:opacity-80">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent to-accent/80">
            <UserRoundSearch className="h-5 w-5 text-accent-foreground" />
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
              <Button variant="ghost" asChild>
                <Link to="/freelancer/dashboard">Dashboard</Link>
              </Button>
              <Link to="/freelancer/profile" className="flex items-center gap-2 group">
                <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center ring-2 ring-transparent group-hover:ring-accent/40 transition-colors">
                  <span className="text-sm font-medium text-accent">{user.name.charAt(0)}</span>
                </div>
                <span className="sr-only">Profile</span>
              </Link>
              <Button
                variant="outline"
                onClick={() => { logout(); navigate("/auth/login"); }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              {!isHome && (
                <Link to="/">
                  <Button variant="ghost">Home</Button>
                </Link>
              )}
                <Link to="/industry">
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
