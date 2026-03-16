import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { betterAuth } from "better-auth/minimal";
import authConfig from "./auth.config";

const siteUrl = process.env.SITE_URL;
if (!siteUrl) throw new Error("Missing required env var: SITE_URL");

const googleClientId = process.env.GOOGLE_CLIENT_ID;
if (!googleClientId) throw new Error("Missing required env var: GOOGLE_CLIENT_ID");

const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
if (!googleClientSecret) throw new Error("Missing required env var: GOOGLE_CLIENT_SECRET");

export const authComponent = createClient<DataModel>(components.betterAuth, {
  authFunctions: {},
  triggers: {},
});

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    baseURL: siteUrl,
    trustedOrigins: [siteUrl],
    database: authComponent.adapter(ctx),
    socialProviders: {
      google: {
        clientId: googleClientId,
        clientSecret: googleClientSecret,
      },
    },
    plugins: [convex({ authConfig })],
  });
};

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx);
  },
});
