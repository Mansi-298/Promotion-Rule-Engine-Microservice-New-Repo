import { storage } from "../storage";
import type { Metrics } from "@shared/schema";

export class MetricsService {
  private static instance: MetricsService;
  
  static getInstance(): MetricsService {
    if (!MetricsService.instance) {
      MetricsService.instance = new MetricsService();
    }
    return MetricsService.instance;
  }

  async getMetrics(): Promise<Metrics> {
    return await storage.getMetrics();
  }

  async resetMetrics(): Promise<void> {
    await storage.resetMetrics();
  }
}
