import { account, databases, DATABASE_ID, USERS_COLLECTION_ID } from "./appwrite";
import { ID, Query } from "appwrite";

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

  async loginWithGoogle() {
    try {
      // Create OAuth2 session with Google
      account.createOAuth2Session(
        'google',
        `${window.location.origin}/dashboard`, // Success URL
        `${window.location.origin}/login` // Failure URL
      );
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  async handleOAuthCallback() {
    try {
      const currentUser = await account.get();
      
      // Check if user document exists in our database
      const response = await databases.listDocuments(
        DATABASE_ID,
        USERS_COLLECTION_ID,
        [Query.equal('userId', currentUser.$id)]
      );

      // If user doesn't exist in our database, create a user document
      if (response.documents.length === 0) {
        // Get the role from localStorage (set during OAuth initiation)
        const selectedRole = localStorage.getItem("civix-oauth-role") || "user";
        
        console.log("Creating new user document for OAuth user:", {
          userId: currentUser.$id,
          name: currentUser.name,
          email: currentUser.email,
          role: selectedRole
        });

        await databases.createDocument(
          DATABASE_ID,
          USERS_COLLECTION_ID,
          ID.unique(),
          {
            userId: currentUser.$id,
            name: currentUser.name,
            email: currentUser.email,
            role: selectedRole,
          }
        );

        console.log("User document created successfully");
        
        // Clean up the stored role
        localStorage.removeItem("civix-oauth-role");
      } else {
        console.log("User document already exists:", response.documents[0]);
        // Clean up the stored role even if user exists
        localStorage.removeItem("civix-oauth-role");
      }

      return { success: true, user: currentUser };
    } catch (error) {
      console.error("OAuth callback error:", error);
      // Clean up the stored role on error
      localStorage.removeItem("civix-oauth-role");
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