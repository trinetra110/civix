import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { grievanceService } from "../services/grievances";
import { aiService } from "../services/ai";

const GrievanceForm = ({ onClose, onSubmit }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [files, setFiles] = useState([]);
  const [aiSuggestion, setAiSuggestion] = useState("");
  const [showAiSuggestion, setShowAiSuggestion] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).slice(0, 5);
    setFiles(selectedFiles);
  };

  const generateAiSuggestion = async () => {
    if (!formData.description.trim()) {
      alert("Please enter a description first");
      return;
    }

    setLoading(true);
    try {
      const formatted = await aiService.formatGrievance(formData.description);
      setAiSuggestion(formatted);
      setShowAiSuggestion(true);
    } catch (error) {
      console.error("AI API Error:", error);
      
      setAiSuggestion(`FORMAL COMPLAINT

Subject: ${formData.title}

Description: ${formData.description}

I hereby formally submit this complaint for your consideration and request appropriate action to resolve this matter.`);
      setShowAiSuggestion(true);
    } finally {
      setLoading(false);
    }
  };

  const submitGrievance = async (useAiFormat = false) => {
    setSubmitting(true);
    try {
      const description = useAiFormat ? aiSuggestion : formData.description;
      await grievanceService.createGrievance(
        user.$id,
        formData.title,
        description,
        files
      );

      onSubmit();
      onClose();
    } catch (error) {
      console.error("Error submitting grievance:", error);
      alert("Error submitting grievance. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Submit New Grievance</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {!showAiSuggestion ? (
          <div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                rows="5"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Upload Files (Max 5)
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              {files.length > 0 && (
                <p className="text-sm text-gray-600 mt-1">
                  {files.length} file(s) selected
                </p>
              )}
            </div>

            <div className="flex space-x-4">
              <button
                onClick={generateAiSuggestion}
                disabled={loading || !formData.title || !formData.description}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Generating..." : "Next (AI Format)"}
              </button>
              <button
                onClick={() => submitGrievance(false)}
                disabled={
                  submitting || !formData.title || !formData.description
                }
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Skip & Submit"}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h4 className="text-lg font-semibold mb-4">
              AI-Generated Formal Version
            </h4>
            <div className="bg-gray-100 p-4 rounded-lg mb-4">
              <pre className="whitespace-pre-wrap text-sm">{aiSuggestion}</pre>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => submitGrievance(true)}
                disabled={submitting}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Accept AI Format & Submit"}
              </button>
              <button
                onClick={() => submitGrievance(false)}
                disabled={submitting}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Use Original & Submit"}
              </button>
              <button
                onClick={() => setShowAiSuggestion(false)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700"
              >
                Back to Edit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GrievanceForm;