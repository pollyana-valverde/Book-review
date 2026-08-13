"use client";

import { createAuthClient } from "better-auth/react";
import { env } from "@/lib/env";

const authClient = createAuthClient({
  baseURL: `${env.NEXT_PUBLIC_APP_URL}/api/auth`,
});

const { useSession, signIn, signUp, signOut } = authClient;

export { authClient, useSession, signIn, signUp, signOut };
