import { useEffect, useState } from "react";
import AdminDashboard from "./components/AdminDashboard.jsx";
import PublicPortfolio from "./components/PublicPortfolio.jsx";
import { usePortfolioData } from "./hooks/usePortfolioData.js";

const themeStorageKey = "portfolio-theme";

function currentView(adminPath) {
  const path = window.location.pathname;
  const hash = window.location.hash;
  return path === adminPath || hash === "#admin" ? "admin" : "portfolio";
}

function preferredTheme() {
  const stored = window.localStorage.getItem(themeStorageKey);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  const portfolioState = usePortfolioData();
  const [view, setView] = useState(() => currentView(portfolioState.portfolio.site.adminPath));
  const [theme, setTheme] = useState(preferredTheme);

  useEffect(() => {
    const handleLocation = () => setView(currentView(portfolioState.portfolio.site.adminPath));
    window.addEventListener("popstate", handleLocation);
    window.addEventListener("hashchange", handleLocation);
    return () => {
      window.removeEventListener("popstate", handleLocation);
      window.removeEventListener("hashchange", handleLocation);
    };
  }, [portfolioState.portfolio.site.adminPath]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));

  if (view === "admin") {
    return <AdminDashboard {...portfolioState} theme={theme} onToggleTheme={toggleTheme} />;
  }

  return <PublicPortfolio data={portfolioState.portfolio} theme={theme} onToggleTheme={toggleTheme} />;
}
