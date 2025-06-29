import { Client, Account, Databases, Storage } from "appwrite";
import conf from "../conf/conf";

const client = new Client()
  .setEndpoint(conf.appwriteUrl)
  .setProject(conf.appwriteProjectId);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const DATABASE_ID = conf.appwriteDatabaseId;
export const USERS_COLLECTION_ID = conf.appwriteUsersCollectionId;
export const GRIEVANCES_COLLECTION_ID = conf.appwriteGrievancesCollectionId;
export const BUCKET_ID = conf.appwriteBucketId;

export { client };