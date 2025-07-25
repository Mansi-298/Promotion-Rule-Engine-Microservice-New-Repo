import type { PlayerAttributes, PromotionRule, Metrics } from "@shared/schema";

export interface IStorage {
  // Rule management
  getRules(): Promise<PromotionRule[]>;
  setRules(rules: PromotionRule[]): Promise<void>;
  
  // Metrics management
  incrementTotalRequests(): Promise<void>;
  incrementSuccessfulMatches(): Promise<void>;
  incrementMissedMatches(): Promise<void>;
  addEvaluationTime(timeMs: number): Promise<void>;
  getMetrics(): Promise<Metrics>;
  resetMetrics(): Promise<void>;
  setRulesLastReloaded(timestamp: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private rules: PromotionRule[] = [];
  private totalRequests = 0;
  private successfulMatches = 0;
  private missedMatches = 0;
  private evaluationTimes: number[] = [];
  private startTime = new Date();
  private rulesLastReloaded = new Date().toISOString();

  async getRules(): Promise<PromotionRule[]> {
    return [...this.rules];
  }

  async setRules(rules: PromotionRule[]): Promise<void> {
    this.rules = [...rules];
  }

  async incrementTotalRequests(): Promise<void> {
    this.totalRequests++;
  }

  async incrementSuccessfulMatches(): Promise<void> {
    this.successfulMatches++;
  }

  async incrementMissedMatches(): Promise<void> {
    this.missedMatches++;
  }

  async addEvaluationTime(timeMs: number): Promise<void> {
    this.evaluationTimes.push(timeMs);
    // Keep only last 1000 evaluation times for memory efficiency
    if (this.evaluationTimes.length > 1000) {
      this.evaluationTimes = this.evaluationTimes.slice(-1000);
    }
  }

  async getMetrics(): Promise<Metrics> {
    const now = new Date();
    const uptimeMs = now.getTime() - this.startTime.getTime();
    
    const days = Math.floor(uptimeMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((uptimeMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((uptimeMs % (1000 * 60 * 60)) / (1000 * 60));
    const uptime = `${days}d ${hours}h ${minutes}m`;

    const averageEvaluationTimeMs = this.evaluationTimes.length > 0
      ? this.evaluationTimes.reduce((sum, time) => sum + time, 0) / this.evaluationTimes.length
      : 0;

    const hitRate = this.totalRequests > 0 
      ? this.successfulMatches / this.totalRequests 
      : 0;

    return {
      totalRequests: this.totalRequests,
      successfulMatches: this.successfulMatches,
      missedMatches: this.missedMatches,
      hitRate: parseFloat(hitRate.toFixed(3)),
      averageEvaluationTimeMs: parseFloat(averageEvaluationTimeMs.toFixed(1)),
      uptime,
      rulesLastReloaded: this.rulesLastReloaded,
      activeRules: this.rules.length
    };
  }

  async resetMetrics(): Promise<void> {
    this.totalRequests = 0;
    this.successfulMatches = 0;
    this.missedMatches = 0;
    this.evaluationTimes = [];
    this.startTime = new Date();
  }

  async setRulesLastReloaded(timestamp: string): Promise<void> {
    this.rulesLastReloaded = timestamp;
  }
}

export const storage = new MemStorage();
