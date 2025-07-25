import type { Express } from "express";
import { createServer, type Server } from "http";
import { RuleEngine } from "./services/ruleEngine";
import { MetricsService } from "./services/metricsService";
import { 
  playerAttributesSchema, 
  type PlayerAttributes,
  type PromotionResponse,
  type ReloadResponse 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const ruleEngine = RuleEngine.getInstance();
  const metricsService = MetricsService.getInstance();

  // Initialize rules on startup
  await ruleEngine.loadRules();

  // POST /api/promotion - Get best matching promotion for a player
  app.post("/api/promotion", async (req, res) => {
    try {
      // Validate request body
      const validation = playerAttributesSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: "Invalid request body",
          details: validation.error.errors
        });
      }

      const playerAttributes: PlayerAttributes = validation.data;
      
      // Evaluate player against rules
      const result = await ruleEngine.evaluatePlayer(playerAttributes);
      
      const response: PromotionResponse = {
        promotion: result.promotion,
        matchedRules: result.matchedRules,
        evaluationTimeMs: result.evaluationTimeMs
      };

      if (result.promotion) {
        res.json(response);
      } else {
        res.status(204).send();
      }
    } catch (error) {
      console.error("Error in /api/promotion:", error);
      res.status(500).json({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // GET /api/metrics - Get API usage statistics
  app.get("/api/metrics", async (req, res) => {
    try {
      const metrics = await metricsService.getMetrics();
      res.json(metrics);
    } catch (error) {
      console.error("Error in /api/metrics:", error);
      res.status(500).json({
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // POST /api/reload - Hot-reload YAML rules
  app.post("/api/reload", async (req, res) => {
    try {
      const result = await ruleEngine.loadRules();
      
      if (result.success) {
        const metrics = await metricsService.getMetrics();
        const response: ReloadResponse = {
          status: "success",
          message: "Rules reloaded successfully",
          rulesLoaded: metrics.activeRules,
          reloadTime: new Date().toISOString(),
          validationErrors: []
        };
        res.json(response);
      } else {
        const response: ReloadResponse = {
          status: "error",
          message: "YAML validation failed",
          validationErrors: result.errors
        };
        res.status(400).json(response);
      }
    } catch (error) {
      console.error("Error in /api/reload:", error);
      const response: ReloadResponse = {
        status: "error",
        message: error instanceof Error ? error.message : "Unknown error",
        validationErrors: [{ message: "Failed to reload rules" }]
      };
      res.status(500).json(response);
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
