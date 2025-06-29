import { useState } from "react";
import { userService } from "../services/users";

const AdminGrievanceList = ({ grievances, onStatusUpdate, isEditable }) => {
  const [expandedGrievance, setExpandedGrievance] = useState(null);
  const [userDetails, setUserDetails] = useState({});

  const fetchUserDetails = async (userId) => {
    if (userDetails[userId]) return userDetails[userId];

    try {
      const user = await userService.getUserDetails(userId);
      if (user) {
        setUserDetails((prev) => ({
          ...prev,
          [userId]: user,
        }));
        return user;
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
    return null;
  };

  const toggleExpanded = async (grievanceId, userId) => {
    if (expandedGrievance === grievanceId) {
      setExpandedGrievance(null);
    } else {
      setExpandedGrievance(grievanceId);
      await fetchUserDetails(userId);
    }
  };

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

  const getValidTransitions = (currentStatus) => {
    switch (currentStatus) {
      case "Pending":
        return ["InProgress", "Rejected"];
      case "InProgress":
        return ["Resolved"];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-4">
      {grievances.length === 0 ? (
        <p className="text-gray-600 text-center py-8">No grievances found.</p>
      ) : (
        grievances.map((grievance) => (
          <div
            key={grievance.$id}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold">{grievance.title}</h3>
                <p className="text-sm text-gray-600">ID: {grievance.$id}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  grievance.status
                )}`}
              >
                {grievance.status}
              </span>
            </div>

            <p className="text-gray-600 mb-4">
              {grievance.description.substring(0, 150)}...
            </p>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                <p>
                  Submitted:{" "}
                  {new Date(grievance.submittedAt).toLocaleDateString()}
                </p>
                <p>
                  Updated:{" "}
                  {new Date(grievance.lastUpdated).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={() => toggleExpanded(grievance.$id, grievance.userId)}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                {expandedGrievance === grievance.$id
                  ? "Show Less"
                  : "View Details"}
              </button>
            </div>

            {expandedGrievance === grievance.$id && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">
                      User Details
                    </h4>
                    {userDetails[grievance.userId] ? (
                      <div className="text-sm">
                        <p>
                          <strong>Name:</strong>{" "}
                          {userDetails[grievance.userId].name}
                        </p>
                        <p>
                          <strong>Email:</strong>{" "}
                          {userDetails[grievance.userId].email}
                        </p>
                        <p>
                          <strong>User ID:</strong> {grievance.userId}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Loading user details...
                      </p>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Grievance Details
                    </h4>
                    <div className="text-sm">
                      <p>
                        <strong>Status:</strong> {grievance.status}
                      </p>
                      <p>
                        <strong>Submitted:</strong>{" "}
                        {new Date(grievance.submittedAt).toLocaleString()}
                      </p>
                      <p>
                        <strong>Last Updated:</strong>{" "}
                        {new Date(grievance.lastUpdated).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-700 mb-2">
                    Full Description
                  </h4>
                  <div className="bg-gray-50 p-3 rounded text-sm">
                    <pre className="whitespace-pre-wrap">
                      {grievance.description}
                    </pre>
                  </div>
                </div>

                {grievance.fileUrls && grievance.fileUrls.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Attachments
                    </h4>
                    <div className="space-y-2">
                      {grievance.fileUrls.map((url, index) => (
                        <a
                          key={index}
                          href={url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-blue-600 hover:text-blue-800 text-sm"
                        >
                          Attachment {index + 1}
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {isEditable && (
                  <div>
                    <h4 className="font-semibold text-gray-700 mb-2">
                      Update Status
                    </h4>
                    <div className="flex space-x-2">
                      {getValidTransitions(grievance.status).map((status) => (
                        <button
                          key={status}
                          onClick={() => onStatusUpdate(grievance.$id, status)}
                          className={`px-3 py-1 rounded text-sm font-medium ${
                            status === "Resolved"
                              ? "bg-green-600 text-white hover:bg-green-700"
                              : status === "Rejected"
                              ? "bg-red-600 text-white hover:bg-red-700"
                              : "bg-blue-600 text-white hover:bg-blue-700"
                          }`}
                        >
                          Mark as {status}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default AdminGrievanceList;