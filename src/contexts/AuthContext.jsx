import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/auth";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      localStorage.setItem("civix-user", JSON.stringify(currentUser));
    } catch (error) {
      const savedUser = localStorage.getItem("civix-user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const result = await authService.login(email, password);
    if (result.success) {
      setUser(result.user);
      localStorage.setItem("civix-user", JSON.stringify(result.user));
    }
    return result;
  };

  const loginWithGoogle = async () => {
    return await authService.loginWithGoogle();
  };

  const handleOAuthCallback = async () => {
    const result = await authService.handleOAuthCallback();
    if (result.success) {
      setUser(result.user);
      localStorage.setItem("civix-user", JSON.stringify(result.user));
    }
    return result;
  };

  const signup = async (email, password, name, role) => {
    const result = await authService.signup(email, password, name, role);
    if (result.success) {
      setUser(result.user);
      localStorage.setItem("civix-user", JSON.stringify(result.user));
    }
    return result;
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      localStorage.removeItem("civix-user");
      localStorage.removeItem("civix-oauth-role"); // Clean up OAuth role if exists
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const value = {
    user,
    login,
    loginWithGoogle,
    handleOAuthCallback,
    signup,
    logout,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};