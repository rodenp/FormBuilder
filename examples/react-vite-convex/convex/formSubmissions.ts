import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";

export const submitForm = mutation({
  args: {
    formId: v.string(),
    formTitle: v.string(),
    data: v.any(),
    actions: v.optional(v.array(v.any())),
  },
  handler: async (ctx, args) => {
    // Store submission
    const submissionId = await ctx.db.insert("formSubmissions", {
      formId: args.formId,
      formTitle: args.formTitle,
      data: args.data,
      submittedAt: new Date().toISOString(),
      processed: false,
    });

    // Schedule action processing if there are actions
    if (args.actions && args.actions.length > 0) {
      await ctx.scheduler.runAfter(0, internal.formActions.processActions, {
        submissionId,
        actions: args.actions,
        formData: args.data,
        formTitle: args.formTitle,
      });
    } else {
      // Mark as processed if no actions
      await ctx.db.patch(submissionId, { processed: true });
    }

    return { submissionId, success: true };
  },
});

export const getSubmissions = query({
  args: { formId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("formSubmissions")
      .withIndex("by_form", (q) => q.eq("formId", args.formId))
      .order("desc")
      .collect();
  },
});

export const getSubmissionDetails = query({
  args: { submissionId: v.id("formSubmissions") },
  handler: async (ctx, args) => {
    const submission = await ctx.db.get(args.submissionId);
    if (!submission) return null;

    const webhookLogs = await ctx.db
      .query("webhookLogs")
      .withIndex("by_submission", (q) => q.eq("submissionId", args.submissionId))
      .collect();

    return {
      ...submission,
      webhookLogs,
    };
  },
});

export const deleteSubmission = mutation({
  args: { submissionId: v.id("formSubmissions") },
  handler: async (ctx, args) => {
    // Delete webhook logs first
    const logs = await ctx.db
      .query("webhookLogs")
      .withIndex("by_submission", (q) => q.eq("submissionId", args.submissionId))
      .collect();

    for (const log of logs) {
      await ctx.db.delete(log._id);
    }

    // Delete submission
    await ctx.db.delete(args.submissionId);
  },
});