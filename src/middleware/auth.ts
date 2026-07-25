import type { Context, Next } from "hono";
import type { Env, Vars } from "../types.ts";

export async function authMiddleware(
  c: Context<{ Bindings: Env; Variables: Vars }>,
  next: Next,
): Promise<Response | void> {
  return requireBearer(c, next, c.env.API_KEY);
}

export async function mcpAuthMiddleware(
  c: Context<{ Bindings: Env; Variables: Vars }>,
  next: Next,
): Promise<Response | void> {
  return requireBearer(c, next, c.env.MCP_API_KEY?.trim() || c.env.API_KEY);
}

async function requireBearer(
  c: Context<{ Bindings: Env; Variables: Vars }>,
  next: Next,
  expectedKey: string,
): Promise<Response | void> {
  const auth = c.req.header("Authorization");
  if (!expectedKey || !auth || auth !== `Bearer ${expectedKey}`) {
    return c.json({ error: "Unauthorized" }, 401);
  }
  await next();
}
