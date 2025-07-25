import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { RefreshCw, Copy, FileCode } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function RulesConfig() {
  const [isReloading, setIsReloading] = useState(false);
  const { toast } = useToast();

  const exampleYaml = `rules:
  - id: vip_weekend_bonus
    name: "VIP Weekend Bonus"
    description: "50% bonus for high-spending weekend players"
    priority: 10
    conditions:
      - field: spendTier
        operator: equals
        value: "high"
      - field: daysSinceLastPurchase
        operator: lessThan
        value: 7
      - field: level
        operator: greaterThan
        value: 20
    reward:
      type: "coins"
      multiplier: 1.5
    validUntil: "2024-01-31T23:59:59Z"

  - id: new_player_welcome
    name: "New Player Welcome"
    description: "Welcome bonus for new players"
    priority: 5
    conditions:
      - field: level
        operator: lessThan
        value: 10
      - field: daysSinceLastPurchase
        operator: greaterThan
        value: 30
    reward:
      type: "items"
      items: ["sword", "shield", "potion"]
    validUntil: "2024-12-31T23:59:59Z"`;

  const handleReload = async () => {
    setIsReloading(true);
    try {
      const response = await apiRequest("POST", "/api/reload");
      const result = await response.json();
      
      if (result.status === "success") {
        toast({
          title: "Success",
          description: `Rules reloaded successfully. ${result.rulesLoaded} rules loaded.`,
        });
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to reload rules",
        variant: "destructive",
      });
    } finally {
      setIsReloading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "YAML content copied to clipboard",
    });
  };

  const operators = ["equals", "greaterThan", "lessThan", "contains"];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl flex items-center">
                <FileCode className="w-5 h-5 mr-2" />
                Rules Configuration (rules.yaml)
              </CardTitle>
              <p className="text-slate-600 mt-2">YAML-based rule definition system for promotion matching logic.</p>
            </div>
            <Button 
              onClick={handleReload}
              disabled={isReloading}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isReloading ? "animate-spin" : ""}`} />
              {isReloading ? "Reloading..." : "Reload Rules"}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* YAML Example */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-slate-900">Example Configuration</h4>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(exampleYaml)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
              <div className="bg-slate-900 rounded-lg p-4 text-sm overflow-x-auto">
                <pre className="text-yellow-300 whitespace-pre-wrap">
                  {exampleYaml}
                </pre>
              </div>
            </div>

            {/* Configuration Schema */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-4">Configuration Schema</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-slate-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Required Fields</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <code className="font-medium">id</code>
                      <span className="text-api-slate">string (unique)</span>
                    </div>
                    <div className="flex justify-between">
                      <code className="font-medium">name</code>
                      <span className="text-api-slate">string</span>
                    </div>
                    <div className="flex justify-between">
                      <code className="font-medium">description</code>
                      <span className="text-api-slate">string</span>
                    </div>
                    <div className="flex justify-between">
                      <code className="font-medium">priority</code>
                      <span className="text-api-slate">number (higher = first)</span>
                    </div>
                    <div className="flex justify-between">
                      <code className="font-medium">conditions</code>
                      <span className="text-api-slate">array</span>
                    </div>
                    <div className="flex justify-between">
                      <code className="font-medium">reward</code>
                      <span className="text-api-slate">object</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-slate-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Optional Fields</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <code className="font-medium">validUntil</code>
                      <span className="text-api-slate">ISO date string</span>
                    </div>
                    <div className="text-xs text-api-slate mt-4">
                      <strong>Condition operators:</strong>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {operators.map(op => (
                          <Badge key={op} variant="outline" className="text-xs">
                            {op}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Supported Operators */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Supported Operators</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {operators.map(operator => (
                  <div key={operator} className="p-3 bg-slate-50 rounded-lg text-center">
                    <code className="text-sm font-medium">{operator}</code>
                  </div>
                ))}
              </div>
            </div>

            {/* Player Attributes */}
            <div>
              <h4 className="font-semibold text-slate-900 mb-3">Available Player Attributes</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  { field: "playerId", type: "string" },
                  { field: "level", type: "number" },
                  { field: "country", type: "string" },
                  { field: "spendTier", type: "string" },
                  { field: "daysSinceLastPurchase", type: "number" },
                  { field: "totalSpent", type: "number" },
                  { field: "gameMode", type: "string" }
                ].map(attr => (
                  <div key={attr.field} className="p-3 bg-slate-50 rounded-lg">
                    <code className="text-sm font-medium block">{attr.field}</code>
                    <span className="text-xs text-api-slate">{attr.type}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
