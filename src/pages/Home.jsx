import Navbar from "../components/Navbar";
import { ArrowRight, Shield, Zap, Users, CheckCircle } from "lucide-react";

const Home = ({ navigate }) => {
  const features = [
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Secure & Private",
      description: "Your grievances are handled with complete confidentiality and security."
    },
    {
      icon: <Zap className="w-8 h-8 text-green-600" />,
      title: "AI-Powered",
      description: "Smart formatting and processing to ensure your concerns are clearly communicated."
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Role-Based Access",
      description: "Separate interfaces for users and administrators for streamlined workflow."
    },
    {
      icon: <CheckCircle className="w-8 h-8 text-emerald-600" />,
      title: "Real-time Tracking",
      description: "Monitor the status of your grievances from submission to resolution."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <Navbar navigate={navigate} />
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Welcome to{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Civix
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Your comprehensive grievance management system designed to streamline 
            communication and ensure every voice is heard.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate("/signup")}
              className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-2 font-semibold text-lg"
            >
              <span>Get Started</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button
              onClick={() => navigate("/login")}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all duration-300 font-semibold text-lg"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Civix?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Built with modern technology and user experience in mind, Civix provides 
            a seamless platform for managing grievances efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200 group"
            >
              <div className="mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust Civix for their grievance management needs.
          </p>
          <button
            onClick={() => navigate("/signup")}
            className="bg-white text-blue-600 px-8 py-4 rounded-xl hover:bg-blue-50 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
          >
            Create Your Account
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold">Civix</span>
          </div>
          <p className="text-gray-400">
            © 2025 Civix. All rights reserved. Built with care for better communication.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;