import { z } from "zod";

// Player attributes schema
export const playerAttributesSchema = z.object({
  playerId: z.string().min(1, "Player ID is required"),
  level: z.number().int().min(1, "Level must be a positive integer"),
  country: z.string().min(2, "Country code is required"),
  spendTier: z.enum(["low", "medium", "high"], {
    errorMap: () => ({ message: "Spend tier must be low, medium, or high" })
  }),
  daysSinceLastPurchase: z.number().int().min(0, "Days since last purchase must be non-negative"),
  totalSpent: z.number().min(0, "Total spent must be non-negative").optional(),
  gameMode: z.string().optional()
});

// Rule condition schema
export const ruleConditionSchema = z.object({
  field: z.string(),
  operator: z.enum(["equals", "greaterThan", "lessThan", "contains"]),
  value: z.union([z.string(), z.number(), z.boolean()])
});

// Reward schema
export const rewardSchema = z.object({
  type: z.string(),
  multiplier: z.number().optional(),
  items: z.array(z.string()).optional(),
  amount: z.number().optional()
});

// Promotion rule schema
export const promotionRuleSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  priority: z.number().int(),
  conditions: z.array(ruleConditionSchema),
  reward: rewardSchema,
  validUntil: z.string().optional()
});

// Rules configuration schema
export const rulesConfigSchema = z.object({
  rules: z.array(promotionRuleSchema)
});

// Promotion response schema
export const promotionResponseSchema = z.object({
  promotion: promotionRuleSchema.nullable(),
  matchedRules: z.array(z.string()),
  evaluationTimeMs: z.number()
});

// Metrics schema
export const metricsSchema = z.object({
  totalRequests: z.number(),
  successfulMatches: z.number(),
  missedMatches: z.number(),
  hitRate: z.number(),
  averageEvaluationTimeMs: z.number(),
  uptime: z.string(),
  rulesLastReloaded: z.string(),
  activeRules: z.number()
});

// Reload response schema
export const reloadResponseSchema = z.object({
  status: z.enum(["success", "error"]),
  message: z.string(),
  rulesLoaded: z.number().optional(),
  reloadTime: z.string().optional(),
  validationErrors: z.array(z.object({
    line: z.number().optional(),
    message: z.string()
  }))
});

export type PlayerAttributes = z.infer<typeof playerAttributesSchema>;
export type RuleCondition = z.infer<typeof ruleConditionSchema>;
export type Reward = z.infer<typeof rewardSchema>;
export type PromotionRule = z.infer<typeof promotionRuleSchema>;
export type RulesConfig = z.infer<typeof rulesConfigSchema>;
export type PromotionResponse = z.infer<typeof promotionResponseSchema>;
export type Metrics = z.infer<typeof metricsSchema>;
export type ReloadResponse = z.infer<typeof reloadResponseSchema>;
