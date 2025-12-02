import { v } from "convex/values";
import { internalAction, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

export const processActions = internalAction({
  args: {
    submissionId: v.id("formSubmissions"),
    actions: v.array(v.any()),
    formData: v.any(),
    formTitle: v.string(),
  },
  handler: async (ctx, args) => {
    const results = [];

    for (const action of args.actions) {
      if (!action.enabled) continue;

      try {
        switch (action.type) {
          case "webhook":
            if (action.webhook) {
              let lastError = null;
              let success = false;
              let status = 0;

              // Retry logic for webhooks
              for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
                try {
                  const response = await fetch(action.webhook.url, {
                    method: action.webhook.method || "POST",
                    headers: {
                      "Content-Type": "application/json",
                      "User-Agent": "FormBuilder/1.0",
                      ...(action.webhook.headers || {}),
                    },
                    body: JSON.stringify({
                      formData: args.formData,
                      metadata: {
                        formTitle: args.formTitle,
                        submissionId: args.submissionId,
                        timestamp: new Date().toISOString(),
                        attempt: attempt + 1,
                      },
                    }),
                  });

                  status = response.status;
                  success = response.ok;

                  // Log webhook attempt
                  await ctx.runMutation(internal.formActions.logWebhook, {
                    submissionId: args.submissionId,
                    url: action.webhook.url,
                    method: action.webhook.method || "POST",
                    status,
                    success,
                    attemptedAt: new Date().toISOString(),
                  });

                  if (success) {
                    break; // Success, no need to retry
                  }

                  lastError = `HTTP ${status}: ${response.statusText}`;
                } catch (error) {
                  lastError = error instanceof Error ? error.message : String(error);
                  
                  // Log failed attempt
                  await ctx.runMutation(internal.formActions.logWebhook, {
                    submissionId: args.submissionId,
                    url: action.webhook.url,
                    method: action.webhook.method || "POST",
                    success: false,
                    error: lastError,
                    attemptedAt: new Date().toISOString(),
                  });

                  // Wait before retry (exponential backoff)
                  if (attempt < MAX_RETRIES - 1) {
                    await new Promise(resolve => 
                      setTimeout(resolve, RETRY_DELAY * Math.pow(2, attempt))
                    );
                  }
                }
              }

              results.push({
                type: "webhook",
                url: action.webhook.url,
                success,
                status,
                error: success ? undefined : lastError,
              });
            }
            break;

          // You can add more action types here (email, SMS, etc.)
          default:
            console.log("Unknown action type:", action.type);
        }
      } catch (error) {
        console.error("Action failed:", error);
        results.push({
          type: action.type,
          success: false,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }

    // Mark submission as processed
    await ctx.runMutation(internal.formActions.markSubmissionProcessed, {
      submissionId: args.submissionId
    });

    return results;
  },
});

// Helper mutations for actions to use
export const logWebhook = internalMutation({
  args: {
    submissionId: v.id("formSubmissions"),
    url: v.string(),
    method: v.string(),
    status: v.optional(v.number()),
    success: v.boolean(),
    error: v.optional(v.string()),
    attemptedAt: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("webhookLogs", {
      submissionId: args.submissionId,
      url: args.url,
      method: args.method,
      status: args.status,
      success: args.success,
      error: args.error,
      attemptedAt: args.attemptedAt,
    });
  },
});

export const markSubmissionProcessed = internalMutation({
  args: {
    submissionId: v.id("formSubmissions"),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.submissionId, { processed: true });
  },
});

// Optional: Clean up old webhook logs
export const cleanupOldLogs = internalMutation({
  args: {},
  handler: async (ctx) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const oldLogs = await ctx.db
      .query("webhookLogs")
      .filter((q) => 
        q.lt(q.field("attemptedAt"), thirtyDaysAgo.toISOString())
      )
      .collect();

    for (const log of oldLogs) {
      await ctx.db.delete(log._id);
    }

    return { deleted: oldLogs.length };
  },
});