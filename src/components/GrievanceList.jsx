const GrievanceList = ({ grievances }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "InProgress":
        return "bg-blue-100 text-blue-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-4">
      {grievances.length === 0 ? (
        <p className="text-gray-600 text-center py-8">
          No grievances submitted yet.
        </p>
      ) : (
        grievances.map((grievance) => (
          <div
            key={grievance.$id}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{grievance.title}</h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  grievance.status
                )}`}
              >
                {grievance.status}
              </span>
            </div>
            <p className="text-gray-600 mb-2">
              {grievance.description.substring(0, 200)}...
            </p>
            <div className="text-sm text-gray-500">
              <p>
                Submitted:{" "}
                {new Date(grievance.submittedAt).toLocaleDateString()}
              </p>
              <p>
                Last Updated:{" "}
                {new Date(grievance.lastUpdated).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default GrievanceList;