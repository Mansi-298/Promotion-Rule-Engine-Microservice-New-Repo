import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Cog, Play, RefreshCw, Activity, FileCode, BarChart3 } from "lucide-react";
import ApiEndpoint from "@/components/api-endpoint";
import MetricsDashboard from "@/components/metrics-dashboard";
import RulesConfig from "@/components/rules-config";

export default function ApiDocumentation() {
  const [activeSection, setActiveSection] = useState("promotion-endpoint");

  const navigationItems = [
    {
      id: "promotion-endpoint",
      label: "/promotion",
      method: "POST",
      color: "bg-green-500",
      icon: <span className="w-2 h-2 bg-green-500 rounded-full"></span>
    },
    {
      id: "metrics-endpoint",
      label: "/metrics",
      method: "GET",
      color: "bg-blue-500",
      icon: <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
    },
    {
      id: "reload-endpoint",
      label: "/reload",
      method: "POST",
      color: "bg-orange-500",
      icon: <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
    }
  ];

  const configItems = [
    {
      id: "rules-config",
      label: "Rules Configuration",
      icon: <FileCode className="w-4 h-4" />
    },
    {
      id: "metrics-dashboard",
      label: "Metrics Dashboard",
      icon: <BarChart3 className="w-4 h-4" />
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-api-blue rounded-lg flex items-center justify-center">
                <Cog className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900">Promotion Rule Engine</h1>
                <p className="text-sm text-api-slate">REST API Documentation & Testing</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Badge variant="outline" className="bg-api-success/10 text-api-success border-api-success/20">
                <div className="w-2 h-2 bg-api-success rounded-full mr-2"></div>
                API Online
              </Badge>
              <Button className="bg-api-blue hover:bg-blue-700">
                <Play className="w-4 h-4 mr-2" />
                Test API
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar Navigation */}
        <nav className="w-64 bg-white border-r border-slate-200 min-h-screen">
          <div className="p-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">
                  API Endpoints
                </h3>
                <ul className="space-y-2">
                  {navigationItems.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center p-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg group ${
                          activeSection === item.id ? "bg-slate-100" : ""
                        }`}
                      >
                        {item.icon}
                        <span className="font-medium ml-3">{item.method}</span>
                        <span className="ml-2">{item.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wide mb-3">
                  Configuration
                </h3>
                <ul className="space-y-2">
                  {configItems.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => setActiveSection(item.id)}
                        className={`w-full flex items-center p-2 text-sm text-slate-700 hover:bg-slate-100 rounded-lg ${
                          activeSection === item.id ? "bg-slate-100" : ""
                        }`}
                      >
                        <div className="w-4 h-4 text-api-slate mr-3">
                          {item.icon}
                        </div>
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* API Overview */}
          <section className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">API Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-6">
                  A REST microservice that selects the most appropriate in-game promotion for players based on configurable business rules.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-semibold text-slate-900 mb-2">Base URL</h4>
                    <code className="text-sm text-api-blue bg-white px-2 py-1 rounded">
                      {window.location.origin}
                    </code>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-semibold text-slate-900 mb-2">Content Type</h4>
                    <code className="text-sm text-api-blue bg-white px-2 py-1 rounded">
                      application/json
                    </code>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <h4 className="font-semibold text-slate-900 mb-2">Version</h4>
                    <code className="text-sm text-api-blue bg-white px-2 py-1 rounded">
                      v1.0.0
                    </code>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Dynamic Content Based on Active Section */}
          {activeSection === "promotion-endpoint" && (
            <ApiEndpoint
              method="POST"
              endpoint="/promotion"
              title="Get Best Matching Promotion"
              description="Get the best matching promotion for a player based on their attributes."
              methodColor="green"
            />
          )}

          {activeSection === "metrics-endpoint" && (
            <ApiEndpoint
              method="GET"
              endpoint="/metrics"
              title="Get API Usage Statistics"
              description="Get API usage statistics and performance metrics."
              methodColor="blue"
            />
          )}

          {activeSection === "reload-endpoint" && (
            <ApiEndpoint
              method="POST"
              endpoint="/reload"
              title="Hot-reload YAML Rules"
              description="Hot-reload YAML rules configuration without restarting the server."
              methodColor="orange"
            />
          )}

          {activeSection === "rules-config" && <RulesConfig />}
          
          {activeSection === "metrics-dashboard" && <MetricsDashboard />}
        </main>
      </div>
    </div>
  );
}
