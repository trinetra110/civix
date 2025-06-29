import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { grievanceService } from "../services/grievances";
import GrievanceForm from "./GrievanceForm";
import GrievanceList from "./GrievanceList";
import { Plus, FileText, Clock, CheckCircle, XCircle } from "lucide-react";

const UserDashboard = () => {
  const { user } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserGrievances();
  }, []);

  const fetchUserGrievances = async () => {
    try {
      const userGrievances = await grievanceService.getUserGrievances(user.$id);
      setGrievances(userGrievances);
    } catch (error) {
      console.error("Error fetching grievances:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshGrievances = () => {
    setLoading(true);
    fetchUserGrievances();
  };

  const getStats = () => {
    const total = grievances.length;
    const pending = grievances.filter(g => g.status === "Pending").length;
    const inProgress = grievances.filter(g => g.status === "InProgress").length;
    const resolved = grievances.filter(g => g.status === "Resolved").length;
    const rejected = grievances.filter(g => g.status === "Rejected").length;

    return { total, pending, inProgress, resolved, rejected };
  };

  const stats = getStats();

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">My Grievances</h2>
          <p className="text-gray-600">Track and manage your submitted grievances</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2 font-semibold"
        >
          <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
          <span>Submit New Grievance</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-blue-600" />
            <div>
              <p className="text-2xl font-bold text-blue-900">{stats.total}</p>
              <p className="text-blue-700 text-sm font-medium">Total</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
          <div className="flex items-center space-x-3">
            <Clock className="w-8 h-8 text-yellow-600" />
            <div>
              <p className="text-2xl font-bold text-yellow-900">{stats.pending}</p>
              <p className="text-yellow-700 text-sm font-medium">Pending</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-100 p-6 rounded-xl border border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-900">{stats.inProgress}</p>
              <p className="text-blue-700 text-sm font-medium">In Progress</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div>
              <p className="text-2xl font-bold text-green-900">{stats.resolved}</p>
              <p className="text-green-700 text-sm font-medium">Resolved</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-xl border border-red-200">
          <div className="flex items-center space-x-3">
            <XCircle className="w-8 h-8 text-red-600" />
            <div>
              <p className="text-2xl font-bold text-red-900">{stats.rejected}</p>
              <p className="text-red-700 text-sm font-medium">Rejected</p>
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      {showForm && (
        <GrievanceForm
          onClose={() => setShowForm(false)}
          onSubmit={refreshGrievances}
        />
      )}

      {/* Grievances List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading your grievances...</p>
          </div>
        </div>
      ) : (
        <GrievanceList grievances={grievances} />
      )}
    </div>
  );
};

export default UserDashboard;