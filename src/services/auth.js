import { account, databases, DATABASE_ID, USERS_COLLECTION_ID } from "./appwrite";
import { ID } from "appwrite";

export const authService = {
  async getCurrentUser() {
    try {
      const currentUser = await account.get();
      return currentUser;
    } catch (error) {
      throw error;
    }
  },

  async login(email, password) {
    try {
      await account.createEmailPasswordSession(email, password);
      const currentUser = await account.get();
      return { success: true, user: currentUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async signup(email, password, name, role) {
    try {
      await account.create(ID.unique(), email, password, name);
      await account.createEmailPasswordSession(email, password);
      const currentUser = await account.get();

      await databases.createDocument(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        ID.unique(),
        {
          userId: currentUser.$id,
          name,
          email,
          role,
        }
      );

      return { success: true, user: currentUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async logout() {
    try {
      await account.deleteSession("current");
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  }
};