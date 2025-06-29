import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import Dashboard from "../pages/Dashboard";

const Router = () => {
  const { user, loading, handleOAuthCallback } = useAuth();
  const [currentRoute, setCurrentRoute] = useState(window.location.pathname);
  const [oauthProcessing, setOauthProcessing] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentRoute(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    // Handle OAuth callback when user lands on dashboard after OAuth
    const handleOAuthRedirect = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const isOAuthSuccess = urlParams.get('success') === 'true' || 
                            (currentRoute === '/dashboard' && !user && !loading);
      
      if (isOAuthSuccess && !oauthProcessing) {
        setOauthProcessing(true);
        try {
          const result = await handleOAuthCallback();
          if (result.success) {
            console.log("OAuth callback successful");
            // Clean up URL parameters
            window.history.replaceState({}, document.title, '/dashboard');
          } else {
            console.error("OAuth callback failed:", result.error);
            navigate('/login');
          }
        } catch (error) {
          console.error("OAuth processing error:", error);
          navigate('/login');
        } finally {
          setOauthProcessing(false);
        }
      }
    };

    if (!loading) {
      handleOAuthRedirect();
    }
  }, [currentRoute, user, loading, handleOAuthCallback, oauthProcessing]);

  const navigate = (path) => {
    window.history.pushState({}, "", path);
    setCurrentRoute(path);
  };

  if (loading || oauthProcessing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">
            {oauthProcessing ? "Processing authentication..." : "Loading..."}
          </p>
        </div>
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