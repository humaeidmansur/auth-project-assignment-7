import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const uri = process.env.DATABASE_URI;

if (!uri) {
  throw new Error("DATABASE_URI is missing from environment variables");
}

// Reuse the MongoDB client across Next.js serverless invocations.
declare global {
  var mongoClient: MongoClient | undefined;
}

const client =
  globalThis.mongoClient ?? new MongoClient(uri);

if (!globalThis.mongoClient) {
  globalThis.mongoClient = client;
}

const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),

  secret: process.env.BETTER_AUTH_SECRET,

  baseURL: process.env.BETTER_AUTH_URL,

  trustedOrigins: [
    "http://localhost:3000",
    "https://auth-project-assignment-7-bacd.vercel.app",
    "https://auth-project-assignment-7-bacd-*.vercel.app",
  ],

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },

    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
});