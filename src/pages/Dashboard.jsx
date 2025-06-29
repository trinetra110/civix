import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { userService } from "../services/users";
import Navbar from "../components/Navbar";
import UserDashboard from "../components/UserDashboard";
import AdminDashboard from "../components/AdminDashboard";
import { User, Shield } from "lucide-react";

const Dashboard = ({ navigate }) => {
  const { user } = useAuth();
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserRole();
  }, [user]);

  const fetchUserRole = async () => {
    try {
      const role = await userService.getUserRole(user.$id);
      setUserRole(role);
    } catch (error) {
      console.error("Error fetching user role:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
        <Navbar navigate={navigate} />
        <div className="flex items-center justify-center pt-32">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar navigate={navigate} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
          <div className="flex items-center space-x-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
              userRole === "admin" 
                ? "bg-gradient-to-r from-purple-600 to-pink-600" 
                : "bg-gradient-to-r from-blue-600 to-cyan-600"
            }`}>
              {userRole === "admin" ? (
                <Shield className="w-8 h-8 text-white" />
              ) : (
                <User className="w-8 h-8 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome back, {user.name}!
              </h1>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  userRole === "admin" 
                    ? "bg-purple-100 text-purple-800" 
                    : "bg-blue-100 text-blue-800"
                }`}>
                  {userRole === "admin" ? "Administrator" : "User"}
                </span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-600 text-sm">
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-8">
            {userRole === "admin" ? <AdminDashboard /> : <UserDashboard />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;