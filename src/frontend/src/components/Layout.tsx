import { Button } from "@/components/ui/button";
import { Link, useLocation } from "@tanstack/react-router";
import { useAuth } from "../hooks/useAuth";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated, isLoggingIn, login, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-subtle sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link
            to="/"
            data-ocid="nav.logo_link"
            className="flex items-center gap-2 shrink-0 transition-smooth hover:opacity-80"
          >
            <span className="text-lg font-display font-bold text-foreground tracking-tight">
              Q<span className="text-primary">Track</span>
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden sm:flex items-center gap-1 flex-1 justify-center">
            <Link
              to="/"
              data-ocid="nav.dashboard_link"
              className={`px-3 py-1.5 rounded text-sm font-body transition-smooth ${
                isActive("/")
                  ? "text-foreground bg-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/template/new"
              data-ocid="nav.new_template_link"
              className={`px-3 py-1.5 rounded text-sm font-body transition-smooth ${
                isActive("/template/new")
                  ? "text-foreground bg-secondary"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              }`}
            >
              New Template
            </Link>
          </nav>

          {/* Auth */}
          <div className="shrink-0">
            {isAuthenticated ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                data-ocid="nav.logout_button"
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                Sign out
              </Button>
            ) : (
              <Button
                size="sm"
                onClick={login}
                disabled={isLoggingIn}
                data-ocid="nav.login_button"
                className="text-sm"
              >
                {isLoggingIn ? "Connecting…" : "Sign in"}
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 bg-background">{children}</main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-4">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-muted-foreground font-body">
          © {new Date().getFullYear()}. Built with love using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== "undefined" ? window.location.hostname : "",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </div>
      </footer>
    </div>
  );
}
