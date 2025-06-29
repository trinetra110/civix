import { databases, storage, DATABASE_ID, GRIEVANCES_COLLECTION_ID, BUCKET_ID } from "./appwrite";
import { ID, Query } from "appwrite";

export const grievanceService = {
  async createGrievance(userId, title, description, files = []) {
    try {
      const fileUrls = [];
      for (const file of files) {
        const uploadedFile = await storage.createFile(
          BUCKET_ID,
          ID.unique(),
          file
        );
        const fileUrl = storage.getFileView(BUCKET_ID, uploadedFile.$id);
        fileUrls.push(fileUrl.href);
      }

      const grievance = await databases.createDocument(
        DATABASE_ID,
        GRIEVANCES_COLLECTION_ID,
        ID.unique(),
        {
          id: ID.unique(),
          userId,
          title,
          description,
          status: "Pending",
          fileUrls,
          submittedAt: new Date().toISOString(),
          lastUpdated: new Date().toISOString(),
        }
      );

      return grievance;
    } catch (error) {
      throw error;
    }
  },

  async getUserGrievances(userId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        GRIEVANCES_COLLECTION_ID,
        [Query.equal('userId', userId)]
      );
      return response.documents;
    } catch (error) {
      throw error;
    }
  },

  async getAllGrievances() {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        GRIEVANCES_COLLECTION_ID
      );
      return response.documents;
    } catch (error) {
      throw error;
    }
  },

  async updateGrievanceStatus(grievanceId, newStatus) {
    try {
      await databases.updateDocument(
        DATABASE_ID,
        GRIEVANCES_COLLECTION_ID,
        grievanceId,
        {
          status: newStatus,
          lastUpdated: new Date().toISOString(),
        }
      );
    } catch (error) {
      throw error;
    }
  }
};