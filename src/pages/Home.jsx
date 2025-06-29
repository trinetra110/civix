import Navbar from "../components/Navbar";

const Home = ({ navigate }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar navigate={navigate} />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Civix
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Your comprehensive grievance management system
          </p>
          <div className="space-x-4">
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;