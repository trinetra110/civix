import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";

const Router = () => {
  const { user, loading } = useAuth();
  const [currentRoute, setCurrentRoute] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (path) => {
    window.history.pushState({}, "", path);
    setCurrentRoute(path);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const isAuthRoute = currentRoute === "/login" || currentRoute === "/signup";
  const isDashboardRoute = currentRoute === "/dashboard";

  if (!user && isDashboardRoute) {
    return <Login navigate={navigate} />;
  }

  if (user && isAuthRoute) {
    return <Dashboard navigate={navigate} />;
  }

  switch (currentRoute) {
    case "/":
      return <Home navigate={navigate} />;
    case "/login":
      return <Login navigate={navigate} />;
    case "/signup":
      return <Signup navigate={navigate} />;
    case "/dashboard":
      return <Dashboard navigate={navigate} />;
    default:
      return <Home navigate={navigate} />;
  }
};

export default Router;