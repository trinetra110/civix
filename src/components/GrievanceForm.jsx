import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { grievanceService } from "../services/grievances";
import { aiService } from "../services/ai";
import { X, Upload, Sparkles, Send, ArrowLeft, FileText, AlertCircle } from "lucide-react";

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

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-2xl font-bold mb-1">Submit New Grievance</h3>
              <p className="text-blue-100">Share your concerns with us</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-blue-500/20 rounded-xl transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {!showAiSuggestion ? (
            <div className="space-y-6">
              {/* Title Input */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-3">
                  Grievance Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Brief summary of your grievance"
                  required
                />
              </div>

              {/* Description Input */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-3">
                  Detailed Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  rows="6"
                  placeholder="Provide detailed information about your grievance..."
                  required
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-3">
                  Supporting Documents (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-colors">
                  <input
                    type="file"
                    multiple
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  />
                  <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center space-y-3"
                  >
                    <Upload className="w-8 h-8 text-gray-400" />
                    <div className="text-center">
                      <p className="text-gray-600 font-medium">Click to upload files</p>
                      <p className="text-sm text-gray-500">PDF, DOC, DOCX, JPG, PNG (Max 5 files)</p>
                    </div>
                  </label>
                </div>

                {/* File List */}
                {files.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-gray-500" />
                          <span className="text-sm text-gray-700 truncate">{file.name}</span>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="text-red-500 hover:text-red-700 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                <button
                  onClick={generateAiSuggestion}
                  disabled={loading || !formData.title || !formData.description}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition-all duration-200 font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Generating...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Enhance with AI</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => submitGrievance(false)}
                  disabled={submitting || !formData.title || !formData.description}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 transition-all duration-200 font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Submit Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* AI Enhancement Notice */}
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Sparkles className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-green-800">AI-Enhanced Version</h4>
                </div>
                <p className="text-green-700 text-sm">
                  Your grievance has been formatted for better clarity and professionalism.
                </p>
              </div>

              {/* AI Suggestion Display */}
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-3">
                  Enhanced Grievance
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                    {aiSuggestion}
                  </pre>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                <button
                  onClick={() => setShowAiSuggestion(false)}
                  className="flex items-center justify-center space-x-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-semibold"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back to Edit</span>
                </button>
                
                <button
                  onClick={() => submitGrievance(false)}
                  disabled={submitting}
                  className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-xl hover:bg-gray-700 disabled:opacity-50 transition-colors font-semibold flex items-center justify-center space-x-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>Use Original</span>
                    </>
                  )}
                </button>
                
                <button
                  onClick={() => submitGrievance(true)}
                  disabled={submitting}
                  className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 transition-all duration-200 font-semibold flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                >
                  {submitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Submit Enhanced</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GrievanceForm;