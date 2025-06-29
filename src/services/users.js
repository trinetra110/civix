import { databases, DATABASE_ID, USERS_COLLECTION_ID } from "./appwrite";
import { Query } from "appwrite";

export const userService = {
  async getUserRole(userId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal('userId', userId)]
      );
      
      if (response.documents.length > 0) {
        return response.documents[0].role;
      }
      return null;
    } catch (error) {
      throw error;
    }
  },

  async getUserDetails(userId) {
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal('userId', userId)]
      );
      
      if (response.documents.length > 0) {
        return response.documents[0];
      }
      return null;
    } catch (error) {
      throw error;
    }
  }
};