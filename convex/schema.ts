import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    userId: v.string(),
    password: v.string(),
    name: v.string(),
    college: v.optional(v.string()),
    role: v.union(v.literal("admin"), v.literal("member")),
    createdAt: v.number(),
  }).index("by_userId", ["userId"]),

  projects: defineTable({
    title: v.string(),
    description: v.string(),
    components: v.optional(v.string()),
    imageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    videoUrl: v.optional(v.string()),
    sourceCode: v.optional(v.string()),
    createdBy: v.string(),
    createdAt: v.number(),
  }),

  goals: defineTable({
    goalText: v.string(),
    imageId: v.optional(v.id("_storage")),
    imageUrl: v.optional(v.string()),
    createdAt: v.number(),
  }),
});
