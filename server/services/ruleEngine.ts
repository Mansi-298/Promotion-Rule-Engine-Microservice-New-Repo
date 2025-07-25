import { readFileSync } from "fs";
import { parse } from "yaml";
import type { PlayerAttributes, PromotionRule, RulesConfig, RuleCondition } from "@shared/schema";
import { rulesConfigSchema } from "@shared/schema";
import { storage } from "../storage";

export class RuleEngine {
  private static instance: RuleEngine;
  
  static getInstance(): RuleEngine {
    if (!RuleEngine.instance) {
      RuleEngine.instance = new RuleEngine();
    }
    return RuleEngine.instance;
  }

  async loadRules(): Promise<{ success: boolean; errors: Array<{ line?: number; message: string }> }> {
    try {
      const yamlContent = readFileSync("rules.yaml", "utf8");
      const parsed = parse(yamlContent);
      
      // Validate the parsed YAML against our schema
      const validation = rulesConfigSchema.safeParse(parsed);
      
      if (!validation.success) {
        return {
          success: false,
          errors: validation.error.errors.map(err => ({
            message: `${err.path.join('.')}: ${err.message}`
          }))
        };
      }

      const rulesConfig: RulesConfig = validation.data;
      await storage.setRules(rulesConfig.rules);
      await storage.setRulesLastReloaded(new Date().toISOString());
      
      return { success: true, errors: [] };
    } catch (error) {
      return {
        success: false,
        errors: [{ message: error instanceof Error ? error.message : "Unknown error occurred" }]
      };
    }
  }

  async evaluatePlayer(playerAttributes: PlayerAttributes): Promise<{
    promotion: PromotionRule | null;
    matchedRules: string[];
    evaluationTimeMs: number;
  }> {
    const startTime = performance.now();
    
    try {
      const rules = await storage.getRules();
      
      // Sort rules by priority (higher priority first)
      const sortedRules = rules.sort((a, b) => b.priority - a.priority);
      
      const matchedRules: string[] = [];
      
      for (const rule of sortedRules) {
        if (this.evaluateRule(rule, playerAttributes)) {
          matchedRules.push(rule.id);
          
          // Check if rule is still valid
          if (rule.validUntil) {
            const validUntil = new Date(rule.validUntil);
            if (validUntil < new Date()) {
              continue; // Skip expired rules
            }
          }
          
          const evaluationTimeMs = performance.now() - startTime;
          await storage.addEvaluationTime(evaluationTimeMs);
          await storage.incrementTotalRequests();
          await storage.incrementSuccessfulMatches();
          
          return {
            promotion: rule,
            matchedRules,
            evaluationTimeMs: parseFloat(evaluationTimeMs.toFixed(1))
          };
        }
      }
      
      // No matching rule found
      const evaluationTimeMs = performance.now() - startTime;
      await storage.addEvaluationTime(evaluationTimeMs);
      await storage.incrementTotalRequests();
      await storage.incrementMissedMatches();
      
      return {
        promotion: null,
        matchedRules,
        evaluationTimeMs: parseFloat(evaluationTimeMs.toFixed(1))
      };
      
    } catch (error) {
      const evaluationTimeMs = performance.now() - startTime;
      await storage.addEvaluationTime(evaluationTimeMs);
      await storage.incrementTotalRequests();
      await storage.incrementMissedMatches();
      
      throw error;
    }
  }

  private evaluateRule(rule: PromotionRule, playerAttributes: PlayerAttributes): boolean {
    return rule.conditions.every(condition => 
      this.evaluateCondition(condition, playerAttributes)
    );
  }

  private evaluateCondition(condition: RuleCondition, playerAttributes: PlayerAttributes): boolean {
    const fieldValue = (playerAttributes as any)[condition.field];
    
    if (fieldValue === undefined || fieldValue === null) {
      return false;
    }

    switch (condition.operator) {
      case "equals":
        return fieldValue === condition.value;
      
      case "greaterThan":
        return typeof fieldValue === "number" && 
               typeof condition.value === "number" && 
               fieldValue > condition.value;
      
      case "lessThan":
        return typeof fieldValue === "number" && 
               typeof condition.value === "number" && 
               fieldValue < condition.value;
      
      case "contains":
        return typeof fieldValue === "string" && 
               typeof condition.value === "string" && 
               fieldValue.toLowerCase().includes(condition.value.toLowerCase());
      
      default:
        return false;
    }
  }
}
