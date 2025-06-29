import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
} from "lucide-react";

const GrievanceList = ({ grievances }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case "Pending":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: <Clock className="w-4 h-4" />,
          gradient: "from-yellow-50 to-yellow-100",
        };
      case "InProgress":
        return {
          color: "bg-blue-100 text-blue-800 border-blue-200",
          icon: (
            <div className="w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
            </div>
          ),
          gradient: "from-blue-50 to-blue-100",
        };
      case "Resolved":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: <CheckCircle className="w-4 h-4" />,
          gradient: "from-green-50 to-green-100",
        };
      case "Rejected":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          icon: <XCircle className="w-4 h-4" />,
          gradient: "from-red-50 to-red-100",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: <AlertCircle className="w-4 h-4" />,
          gradient: "from-gray-50 to-gray-100",
        };
    }
  };

  if (grievances.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileText className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No grievances yet
        </h3>
        <p className="text-gray-600 mb-6">
          You haven't submitted any grievances. Click the button above to get
          started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {grievances.map((grievance) => {
        const statusConfig = getStatusConfig(grievance.status);

        return (
          <div
            key={grievance.$id}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 overflow-hidden group"
          >
            {/* Status Bar */}
            <div
              className={`h-1 bg-gradient-to-r ${statusConfig.gradient}`}
            ></div>

            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {grievance.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    ID: <span className="font-mono">{grievance.$id}</span>
                  </p>
                </div>
                <div
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl border font-medium text-sm ${statusConfig.color}`}
                >
                  {statusConfig.icon}
                  <span>{grievance.status}</span>
                </div>
              </div>

              <p className="text-gray-600 mb-6 leading-relaxed">
                {grievance.description.length > 200
                  ? `${grievance.description.substring(0, 200)}...`
                  : grievance.description}
              </p>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-6 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Submitted:{" "}
                      {new Date(grievance.submittedAt).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>
                      Updated:{" "}
                      {new Date(grievance.lastUpdated).toLocaleDateString(
                        "en-US",
                        {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>

                {grievance.fileUrls && grievance.fileUrls.length > 0 && (
                  <div className="flex items-center space-x-2 text-sm text-blue-600">
                    <FileText className="w-4 h-4" />
                    <span>
                      {grievance.fileUrls.length} attachment
                      {grievance.fileUrls.length > 1 ? "s" : ""}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default GrievanceList;
