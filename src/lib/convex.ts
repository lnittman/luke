"use client";
import { ConvexReactClient } from "convex/react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  throw new Error(
    "Missing NEXT_PUBLIC_CONVEX_URL environment variable. " +
    "Set it in .env.local to your Convex deployment URL."
  );
}

export const convex = new ConvexReactClient(convexUrl);

