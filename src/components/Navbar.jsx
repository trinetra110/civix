import { useAuth } from "../contexts/AuthContext";
import { User, LogOut, Home, LayoutDashboard } from "lucide-react";

const Navbar = ({ navigate }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
          >
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-600 font-bold text-lg">C</span>
            </div>
            <h1 className="text-xl font-bold">Civix</h1>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-blue-500/20 transition-colors"
            >
              <Home size={18} />
              <span className="hidden sm:inline">Home</span>
            </button>
            
            {user ? (
              <>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-blue-500/20 transition-colors"
                >
                  <LayoutDashboard size={18} />
                  <span className="hidden sm:inline">Dashboard</span>
                </button>
                
                <div className="flex items-center space-x-2 px-3 py-2 bg-blue-500/20 rounded-lg">
                  <User size={18} />
                  <span className="hidden sm:inline text-sm">{user.name}</span>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-red-500/20 transition-colors text-red-100 hover:text-red-50"
                >
                  <LogOut size={18} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 rounded-lg hover:bg-blue-500/20 transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate("/signup")}
                  className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;