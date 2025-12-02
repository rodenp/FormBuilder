import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  formSubmissions: defineTable({
    formId: v.string(),
    formTitle: v.string(),
    data: v.any(),
    submittedAt: v.string(),
    processed: v.boolean(),
  }).index("by_form", ["formId"]),
  
  formConfigs: defineTable({
    formId: v.string(),
    config: v.any(),
    createdAt: v.string(),
    updatedAt: v.string(),
  }).index("by_form_id", ["formId"]),

  webhookLogs: defineTable({
    submissionId: v.id("formSubmissions"),
    url: v.string(),
    method: v.string(),
    status: v.optional(v.number()),
    success: v.boolean(),
    error: v.optional(v.string()),
    attemptedAt: v.string(),
  }).index("by_submission", ["submissionId"]),
});