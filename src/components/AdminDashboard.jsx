import { useState, useEffect } from "react";
import { grievanceService } from "../services/grievances";
import AdminGrievanceList from "./AdminGrievanceList";
import { Activity, Clock, CheckCircle, XCircle, FileText, TrendingUp } from "lucide-react";

const AdminDashboard = () => {
  const [activeGrievances, setActiveGrievances] = useState([]);
  const [pastGrievances, setPastGrievances] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGrievances();
  }, []);

  const fetchGrievances = async () => {
    try {
      const allGrievances = await grievanceService.getAllGrievances();

      const active = allGrievances.filter(
        (g) => g.status === "Pending" || g.status === "InProgress"
      );
      const past = allGrievances.filter(
        (g) => g.status === "Resolved" || g.status === "Rejected"
      );

      setActiveGrievances(active);
      setPastGrievances(past);
    } catch (error) {
      console.error("Error fetching grievances:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateGrievanceStatus = async (grievanceId, newStatus) => {
    if (!confirm(`Are you sure you want to change status to ${newStatus}?`)) {
      return;
    }

    try {
      await grievanceService.updateGrievanceStatus(grievanceId, newStatus);
      fetchGrievances();
    } catch (error) {
      console.error("Error updating grievance:", error);
      alert("Error updating grievance status");
    }
  };

  const getOverallStats = () => {
    const allGrievances = [...activeGrievances, ...pastGrievances];
    const total = allGrievances.length;
    const pending = allGrievances.filter(g => g.status === "Pending").length;
    const inProgress = allGrievances.filter(g => g.status === "InProgress").length;
    const resolved = allGrievances.filter(g => g.status === "Resolved").length;
    const rejected = allGrievances.filter(g => g.status === "Rejected").length;

    return { total, pending, inProgress, resolved, rejected };
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const stats = getOverallStats();

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
        <p className="text-gray-600">Manage and track all grievances across the system</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-purple-600" />
            <div>
              <p className="text-2xl font-bold text-purple-900">{stats.total}</p>
              <p className="text-purple-700 text-sm font-medium">Total</p>
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
            <Activity className="w-8 h-8 text-blue-600" />
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

      {/* Grievances Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Active Grievances */}
        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-200">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Active Grievances</h3>
              <p className="text-gray-600 text-sm">Requires immediate attention</p>
            </div>
            <div className="ml-auto">
              <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {activeGrievances.length}
              </span>
            </div>
          </div>
          <AdminGrievanceList
            grievances={activeGrievances}
            onStatusUpdate={updateGrievanceStatus}
            isEditable={true}
          />
        </div>

        {/* Past Grievances */}
        <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gray-600 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">Completed Grievances</h3>
              <p className="text-gray-600 text-sm">Resolved or rejected cases</p>
            </div>
            <div className="ml-auto">
              <span className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                {pastGrievances.length}
              </span>
            </div>
          </div>
          <AdminGrievanceList
            grievances={pastGrievances}
            onStatusUpdate={updateGrievanceStatus}
            isEditable={false}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;