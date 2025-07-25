import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Play, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface ApiEndpointProps {
  method: string;
  endpoint: string;
  title: string;
  description: string;
  methodColor: "green" | "blue" | "orange";
}

export default function ApiEndpoint({ method, endpoint, title, description, methodColor }: ApiEndpointProps) {
  const [requestBody, setRequestBody] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const methodColorClasses = {
    green: "bg-green-100 text-green-700",
    blue: "bg-blue-100 text-blue-700", 
    orange: "bg-orange-100 text-orange-700"
  };

  const buttonColorClasses = {
    green: "bg-green-600 hover:bg-green-700",
    blue: "bg-blue-600 hover:bg-blue-700",
    orange: "bg-orange-600 hover:bg-orange-700"
  };

  const exampleRequests = {
    "/promotion": `{
  "playerId": "player_12345",
  "level": 25,
  "country": "US",
  "spendTier": "high",
  "daysSinceLastPurchase": 7,
  "totalSpent": 150.00,
  "gameMode": "multiplayer"
}`,
    "/metrics": "",
    "/reload": ""
  };

  const handleTryOut = async () => {
    setIsLoading(true);
    setResponse("");

    try {
      let result;
      if (method === "GET") {
        const res = await fetch(`/api${endpoint}`);
        result = await res.json();
      } else {
        const body = requestBody ? JSON.parse(requestBody) : undefined;
        const res = await apiRequest(method, `/api${endpoint}`, body);
        
        if (res.status === 204) {
          result = null;
        } else {
          result = await res.json();
        }
      }

      setResponse(JSON.stringify(result, null, 2));
      toast({
        title: "Success",
        description: `${method} ${endpoint} completed successfully`,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      setResponse(JSON.stringify({ error: errorMessage }, null, 2));
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "Content copied to clipboard",
    });
  };

  const loadExample = () => {
    const example = exampleRequests[endpoint as keyof typeof exampleRequests];
    setRequestBody(example);
  };

  return (
    <Card className="mb-8">
      <CardHeader className="border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Badge className={methodColorClasses[methodColor]}>{method}</Badge>
            <CardTitle className="text-xl">{endpoint}</CardTitle>
          </div>
          <Button 
            onClick={handleTryOut}
            disabled={isLoading}
            className={buttonColorClasses[methodColor]}
          >
            <Play className="w-4 h-4 mr-2" />
            {isLoading ? "Loading..." : "Try it out"}
          </Button>
        </div>
        <p className="text-slate-600 mt-2">{title}</p>
        <p className="text-sm text-slate-500">{description}</p>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Request Section */}
          <div>
            {method !== "GET" && (
              <>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-slate-900">Request Body</h4>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={loadExample}
                  >
                    Load Example
                  </Button>
                </div>
                <Textarea
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  placeholder="Enter JSON request body..."
                  className="font-mono text-sm min-h-[200px]"
                />
              </>
            )}

            {endpoint === "/promotion" && (
              <div className="mt-4">
                <h5 className="font-medium text-slate-900 mb-2">Parameters</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">playerId</span>
                    <span className="text-api-slate">string (required)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">level</span>
                    <span className="text-api-slate">number (required)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">country</span>
                    <span className="text-api-slate">string (required)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">spendTier</span>
                    <span className="text-api-slate">string (required)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">daysSinceLastPurchase</span>
                    <span className="text-api-slate">number (required)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Response Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-slate-900">Response</h4>
              {response && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => copyToClipboard(response)}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              )}
            </div>
            <div className="bg-slate-900 rounded-lg p-4 text-sm min-h-[200px]">
              <pre className="text-green-400 whitespace-pre-wrap">
                {response || "Response will appear here..."}
              </pre>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
