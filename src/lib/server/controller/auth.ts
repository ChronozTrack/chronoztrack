import { db } from "$lib/server/db";
import { env } from "$env/dynamic/private";
import { tblUsers } from "$lib/server/db/schema";
import { eq } from "drizzle-orm";

type SvelteFetch = {
  (input: URL | RequestInfo, init?: RequestInit | undefined): Promise<Response>;
  (input: string | Request | URL, init?: RequestInit | undefined): Promise<Response>;
}

export async function validateUser(fetch: SvelteFetch, userId: number, password: string): Promise<number | null> {
  const user = await db.select({
    id: tblUsers.id,
    active: tblUsers.active,
    password_hash: tblUsers.passwordHash
  }).from(tblUsers)
    .where(eq(tblUsers.id, userId))
    .get()

  if (!user || !user.active) {
    return null;
  }
  console.log(user)
  const isPassword = await verifyPassword(fetch, {
    password,
    password_hash: user.password_hash as string
  })

  if (isPassword.error || !isPassword.data) {
    return null;
  }

  return userId
}

export async function hashPassword(
  fetch: SvelteFetch, password: string
): Promise<{ data: string, error?: never } | { data: null, error: { message: string } }> {
  const url = env.HASH_URL
  const token = env.API_TOKEN

  if (!url || !token) {
    throw new Error("Invalid hash configuration")
  }

  const response = await fetch(url + "/auth/hash", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ password })
  });

  if (response.status !== 200) {
    return { data: null, error: { message: "Failed to hash password" } };
  }

  const json = await response.json()

  if (json.success !== "ok") {
    return { data: null, error: { message: "Failed to hash password" } }
  }

  return {
    data: json.data
  }
}

export async function verifyPassword(
  fetch: SvelteFetch, data: { password: string, password_hash: string }
): Promise<{ data: boolean, error?: never } | { data: null, error: { message: string } }> {
  const url = env.HASH_URL
  const token = env.API_TOKEN

  if (!url || !token) {
    throw new Error("Invalid hash configuration")
  }
  
  const response = await fetch(url + "/auth/verify", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  if (response.status !== 200) {
    return { data: null, error: { message: "Invalid Password" } };
  }

  const json = await response.json()

  if (json.success !== "ok") {
    return { data: null, error: { message: " Invalid Password" } };
  }

  return { data: json.data };
}