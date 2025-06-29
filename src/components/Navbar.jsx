import { useAuth } from "../contexts/AuthContext";

const Navbar = ({ navigate }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1
          className="text-xl font-bold cursor-pointer"
          onClick={() => navigate("/")}
        >
          Civix
        </h1>
        <div className="space-x-4">
          <button onClick={() => navigate("/")} className="hover:text-blue-200">
            Home
          </button>
          {user ? (
            <>
              <button
                onClick={() => navigate("/dashboard")}
                className="hover:text-blue-200"
              >
                Dashboard
              </button>
              <button onClick={handleLogout} className="hover:text-blue-200">
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/login")}
                className="hover:text-blue-200"
              >
                Login
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="hover:text-blue-200"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;