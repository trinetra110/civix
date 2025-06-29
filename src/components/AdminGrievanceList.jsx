import { useState } from "react";
import { userService } from "../services/users";
import { 
  ChevronDown, 
  ChevronUp, 
  User, 
  Mail, 
  Calendar, 
  Clock, 
  FileText, 
  ExternalLink,
  CheckCircle,
  XCircle,
  Play,
  AlertCircle
} from "lucide-react";

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

  const getStatusConfig = (status) => {
    switch (status) {
      case "Pending":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: <Clock className="w-4 h-4" />,
          gradient: "from-yellow-50 to-yellow-100"
        };
      case "InProgress":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: <Play className="w-4 h-4" />,
          gradient: "from-blue-50 to-blue-100"
        };
      case "Resolved":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: <CheckCircle className="w-4 h-4" />,
          gradient: "from-green-50 to-green-100"
        };
      case "Rejected":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          icon: <XCircle className="w-4 h-4" />,
          gradient: "from-red-50 to-red-100"
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: <AlertCircle className="w-4 h-4" />,
          gradient: "from-gray-50 to-gray-100"
        };
    }
  };

  const getValidTransitions = (currentStatus) => {
    switch (currentStatus) {
      case "Pending":
        return [
          { status: "InProgress", label: "Start Processing", color: "bg-blue-600 hover:bg-blue-700" },
          { status: "Rejected", label: "Reject", color: "bg-red-600 hover:bg-red-700" }
        ];
      case "InProgress":
        return [
          { status: "Resolved", label: "Mark Resolved", color: "bg-green-600 hover:bg-green-700" }
        ];
      default:
        return [];
    }
  };

  if (grievances.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FileText className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-600 font-medium">No grievances found</p>
        <p className="text-gray-500 text-sm mt-1">
          {isEditable ? "All caught up! No active grievances to review." : "No completed grievances yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {grievances.map((grievance) => {
        const statusConfig = getStatusConfig(grievance.status);
        const isExpanded = expandedGrievance === grievance.$id;
        
        return (
          <div
            key={grievance.$id}
            className="bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            {/* Status Bar */}
            <div className={`h-1 bg-gradient-to-r ${statusConfig.gradient}`}></div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {grievance.title}
                  </h3>
                  <p className="text-sm text-gray-500 font-mono">
                    ID: {grievance.$id}
                  </p>
                </div>
                <div className={`flex items-center space-x-2 px-3 py-2 rounded-xl border font-medium text-sm ${statusConfig.color}`}>
                  {statusConfig.icon}
                  <span>{grievance.status}</span>
                </div>
              </div>

              <p className="text-gray-600 mb-4 leading-relaxed">
                {grievance.description.substring(0, 150)}
                {grievance.description.length > 150 && "..."}
              </p>

              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(grievance.submittedAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      {new Date(grievance.lastUpdated).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleExpanded(grievance.$id, grievance.userId)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <span>{isExpanded ? "Show Less" : "View Details"}</span>
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
              </div>

              {isExpanded && (
                <div className="mt-6 pt-6 border-t border-gray-100 space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* User Details */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                        <User className="w-5 h-5 text-gray-600" />
                        <span>User Information</span>
                      </h4>
                      {userDetails[grievance.userId] ? (
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">Name:</span>
                            <span>{userDetails[grievance.userId].name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-gray-500" />
                            <span className="font-medium">Email:</span>
                            <span>{userDetails[grievance.userId].email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="w-4 h-4 text-gray-500 font-mono text-xs">#</span>
                            <span className="font-medium">User ID:</span>
                            <span className="font-mono text-xs">{grievance.userId}</span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                          <span>Loading user details...</span>
                        </div>
                      )}
                    </div>

                    {/* Grievance Metadata */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-gray-600" />
                        <span>Grievance Details</span>
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${statusConfig.color.split(' ')[0]}`}></div>
                          <span className="font-medium">Status:</span>
                          <span>{grievance.status}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">Submitted:</span>
                          <span>{new Date(grievance.submittedAt).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">Last Updated:</span>
                          <span>{new Date(grievance.lastUpdated).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Full Description */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Full Description</h4>
                    <div className="bg-gray-50 rounded-xl p-4">
                      <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                        {grievance.description}
                      </pre>
                    </div>
                  </div>

                  {/* Attachments */}
                  {grievance.fileUrls && grievance.fileUrls.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                        <FileText className="w-5 h-5 text-gray-600" />
                        <span>Attachments ({grievance.fileUrls.length})</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {grievance.fileUrls.map((url, index) => (
                          <a
                            key={index}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
                          >
                            <FileText className="w-5 h-5 text-blue-600" />
                            <span className="text-blue-700 font-medium flex-1">
                              Attachment {index + 1}
                            </span>
                            <ExternalLink className="w-4 h-4 text-blue-500 group-hover:text-blue-700" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Status Update Actions */}
                  {isEditable && getValidTransitions(grievance.status).length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Update Status</h4>
                      <div className="flex flex-wrap gap-3">
                        {getValidTransitions(grievance.status).map((transition) => (
                          <button
                            key={transition.status}
                            onClick={() => onStatusUpdate(grievance.$id, transition.status)}
                            className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${transition.color} shadow-md hover:shadow-lg`}
                          >
                            {transition.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminGrievanceList;