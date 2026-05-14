import { Client, Account, Databases, ID, Query } from "appwrite";

export const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || "https://localhost/v1")
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || "1");

export const account = new Account(client);
export const databases = new Databases(client);
export { ID };
export { Query };
