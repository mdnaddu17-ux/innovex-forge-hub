import { query } from "./_generated/server";
import { v } from "convex/values";

export const getProjects = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("projects").order("desc").collect();
  },
});

export const getProject = query({
  args: { id: v.id("projects") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getGoals = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("goals").order("desc").collect();
  },
});

export const getUser = query({
  args: { userId: v.string(), password: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
    if (!user || user.password !== args.password) return null;
    return {
      _id: user._id,
      userId: user.userId,
      name: user.name,
      role: user.role,
    };
  },
});
