import { mutation } from "./_generated/server";
import { v } from "convex/values";
import type { MutationCtx } from "./_generated/server";

async function verifyRole(
  ctx: MutationCtx,
  userId: string,
  allowedRoles: string[]
) {
  const user = await ctx.db
    .query("users")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .unique();
  if (!user) throw new Error("User not found");
  if (!allowedRoles.includes(user.role))
    throw new Error("Unauthorized: insufficient permissions");
  return user;
}

export const createProject = mutation({
  args: {
    userId: v.string(),
    title: v.string(),
    description: v.string(),
    components: v.optional(v.string()),
    imageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    sourceCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await verifyRole(ctx, args.userId, ["admin", "member"]);
    return await ctx.db.insert("projects", {
      title: args.title,
      description: args.description,
      components: args.components,
      imageId: args.imageId,
      imageUrl: args.imageUrl,
      videoUrl: args.videoUrl || undefined,
      sourceCode: args.sourceCode,
      createdBy: args.userId,
      createdAt: Date.now(),
    });
  },
});

export const deleteProject = mutation({
  args: { userId: v.string(), projectId: v.id("projects") },
  handler: async (ctx, args) => {
    await verifyRole(ctx, args.userId, ["admin"]);
    const project = await ctx.db.get(args.projectId);
    if (project?.imageId) {
      await ctx.storage.delete(project.imageId);
    }
    await ctx.db.delete(args.projectId);
  },
});

export const createGoal = mutation({
  args: {
    userId: v.string(),
    goalText: v.string(),
    imageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await verifyRole(ctx, args.userId, ["admin", "member"]);
    return await ctx.db.insert("goals", {
      goalText: args.goalText,
      imageId: args.imageId,
      imageUrl: args.imageUrl,
      createdAt: Date.now(),
    });
  },
});

export const deleteGoal = mutation({
  args: { userId: v.string(), goalId: v.id("goals") },
  handler: async (ctx, args) => {
    await verifyRole(ctx, args.userId, ["admin"]);
    const goal = await ctx.db.get(args.goalId);
    if (goal?.imageId) {
      await ctx.storage.delete(goal.imageId);
    }
    await ctx.db.delete(args.goalId);
  },
});

export const createUser = mutation({
  args: {
    callerUserId: v.string(),
    userId: v.string(),
    password: v.string(),
    name: v.string(),
    college: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("member")),
  },
  handler: async (ctx, args) => {
    await verifyRole(ctx, args.callerUserId, ["admin"]);

    // Check if userId already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_userId", (q) => q.eq("userId", args.userId))
      .unique();
    if (existing) throw new Error("User ID already exists");

    return await ctx.db.insert("users", {
      userId: args.userId,
      password: args.password,
      name: args.name,
      college: args.college,
      role: args.role,
      createdAt: Date.now(),
    });
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getStorageUrl = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
