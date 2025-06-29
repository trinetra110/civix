import { useState, useEffect } from "react";
import { grievanceService } from "../services/grievances";
import AdminGrievanceList from "./AdminGrievanceList";

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

  if (loading) {
    return (
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">Admin Dashboard</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Active Grievances</h3>
          <AdminGrievanceList
            grievances={activeGrievances}
            onStatusUpdate={updateGrievanceStatus}
            isEditable={true}
          />
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Past Grievances</h3>
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