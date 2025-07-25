import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Activity, Clock, Target, Zap } from "lucide-react";
import type { Metrics } from "@shared/schema";

export default function MetricsDashboard() {
  const { data: metrics, isLoading } = useQuery<Metrics>({
    queryKey: ["/api/metrics"],
    refetchInterval: 5000, // Refresh every 5 seconds
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">Loading metrics...</div>
        </CardContent>
      </Card>
    );
  }

  if (!metrics) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">Failed to load metrics</div>
        </CardContent>
      </Card>
    );
  }

  const hitRatePercentage = (metrics.hitRate * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Live Metrics Dashboard</CardTitle>
          <p className="text-slate-600">Real-time performance and usage statistics.</p>
        </CardHeader>
        <CardContent>
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <div className="text-2xl font-bold text-api-blue">{metrics.totalRequests.toLocaleString()}</div>
              <div className="text-sm text-api-slate">Total Requests</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <div className="text-2xl font-bold text-api-success">{metrics.successfulMatches.toLocaleString()}</div>
              <div className="text-sm text-api-slate">Successful Matches</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
              <div className="text-2xl font-bold text-api-warning">{metrics.averageEvaluationTimeMs}ms</div>
              <div className="text-sm text-api-slate">Avg Response Time</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">{hitRatePercentage}%</div>
              <div className="text-sm text-api-slate">Hit Rate</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Request Distribution */}
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                <Target className="w-4 h-4 mr-2" />
                Request Distribution
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Successful Matches</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={metrics.hitRate * 100} className="w-20" />
                    <span className="text-sm font-medium">{hitRatePercentage}%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Missed Matches</span>
                  <div className="flex items-center space-x-2">
                    <Progress value={(1 - metrics.hitRate) * 100} className="w-20" />
                    <span className="text-sm font-medium">{(100 - parseFloat(hitRatePercentage)).toFixed(1)}%</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-slate-200">
                  <div className="flex justify-between text-sm">
                    <span>Total Requests:</span>
                    <span className="font-medium">{metrics.totalRequests}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-3 flex items-center">
                <Activity className="w-4 h-4 mr-2" />
                System Status
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Server Status</span>
                  <Badge variant="outline" className="bg-api-success/10 text-api-success border-api-success/20">
                    <div className="w-2 h-2 bg-api-success rounded-full mr-1"></div>
                    Online
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Rules File</span>
                  <Badge variant="outline" className="bg-api-success/10 text-api-success border-api-success/20">
                    <div className="w-2 h-2 bg-api-success rounded-full mr-1"></div>
                    Valid
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Active Rules</span>
                  <span className="text-sm font-medium">{metrics.activeRules}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Uptime</span>
                  <span className="text-sm font-medium">{metrics.uptime}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Last Reload</span>
                  <span className="text-xs text-api-slate">
                    {new Date(metrics.rulesLastReloaded).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Performance Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3 bg-slate-50 rounded-lg text-center">
              <div className="text-lg font-semibold text-slate-900">{metrics.averageEvaluationTimeMs}ms</div>
              <div className="text-xs text-api-slate">Avg Evaluation Time</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg text-center">
              <div className="text-lg font-semibold text-slate-900">{metrics.successfulMatches}</div>
              <div className="text-xs text-api-slate">Successful Matches</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg text-center">
              <div className="text-lg font-semibold text-slate-900">{metrics.missedMatches}</div>
              <div className="text-xs text-api-slate">Missed Matches</div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg text-center">
              <div className="text-lg font-semibold text-slate-900">{hitRatePercentage}%</div>
              <div className="text-xs text-api-slate">Hit Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
