import { Client, Account, Databases, ID, Query } from 'appwrite'

export const client = new Client()

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://appwrite.muxiistudio.com/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || '6a04c55e001a1b467905')

export const account = new Account(client)
export const databases = new Databases(client)
export { ID }
export { Query }
