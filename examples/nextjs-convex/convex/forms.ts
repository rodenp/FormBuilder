import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const saveForm = mutation({
  args: {
    formId: v.string(),
    config: v.any(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("forms")
      .withIndex("by_form_id", q => q.eq("formId", args.formId))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        config: args.config,
        updatedAt: new Date().toISOString(),
      });
      return args.formId;
    } else {
      await ctx.db.insert("forms", {
        formId: args.formId,
        config: args.config,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        published: true,
      });
      return args.formId;
    }
  },
});

export const getForm = query({
  args: { formId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("forms")
      .withIndex("by_form_id", q => q.eq("formId", args.formId))
      .first();
  },
});

export const listForms = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("forms")
      .order("desc")
      .collect();
  },
});

export const listFormsWithSubmissionCounts = query({
  handler: async (ctx) => {
    const forms = await ctx.db
      .query("forms")
      .order("desc")
      .collect();

    const formsWithCounts = await Promise.all(
      forms.map(async (form) => {
        const submissions = await ctx.db
          .query("formSubmissions")
          .withIndex("by_form", q => q.eq("formId", form.formId))
          .collect();
        
        return {
          ...form,
          submissionCount: submissions.length
        };
      })
    );

    return formsWithCounts;
  },
});

export const deleteForm = mutation({
  args: { id: v.id("forms") },
  handler: async (ctx, args) => {
    const form = await ctx.db.get(args.id);
    if (!form) return;

    // Delete all submissions for this form
    const submissions = await ctx.db
      .query("formSubmissions")
      .withIndex("by_form", q => q.eq("formId", form.formId))
      .collect();

    for (const submission of submissions) {
      // Delete webhook logs for each submission
      const logs = await ctx.db
        .query("webhookLogs")
        .withIndex("by_submission", q => q.eq("submissionId", submission._id))
        .collect();

      for (const log of logs) {
        await ctx.db.delete(log._id);
      }

      await ctx.db.delete(submission._id);
    }

    // Delete the form
    await ctx.db.delete(args.id);
  },
});