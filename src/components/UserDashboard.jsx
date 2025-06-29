import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { grievanceService } from "../services/grievances";
import GrievanceForm from "./GrievanceForm";
import GrievanceList from "./GrievanceList";

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

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">My Grievances</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Submit New Grievance
        </button>
      </div>

      {showForm && (
        <GrievanceForm
          onClose={() => setShowForm(false)}
          onSubmit={refreshGrievances}
        />
      )}

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <GrievanceList grievances={grievances} />
      )}
    </div>
  );
};

export default UserDashboard;