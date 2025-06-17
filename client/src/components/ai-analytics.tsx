import { useQuery } from "@tanstack/react-query";
import { Brain, TrendingUp, Target, Shield, Settings, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AiAnalytics() {
  const { data: analytics } = useQuery({
    queryKey: ["/api/ai/analytics"],
  });

  const analyticsCards = [
    {
      title: "Market Sentiment",
      value: analytics?.marketSentiment || "—",
      subtitle: `Confidence: ${analytics?.sentimentConfidence || "—"}%`,
      icon: TrendingUp,
      color: "text-success-green",
    },
    {
      title: "Price Prediction",
      value: analytics?.pricePrediction ? `+${analytics.pricePrediction}%` : "—",
      subtitle: "Next 24h",
      icon: Target,
      color: "text-coinbase-blue",
    },
    {
      title: "Risk Score",
      value: analytics?.riskScore || "—",
      subtitle: `Score: ${analytics?.riskValue || "—"}/10`,
      icon: Shield,
      color: "text-warning-orange",
    },
    {
      title: "Optimization",
      value: analytics?.optimizationStatus || "—",
      subtitle: `${analytics?.activeStrategies || "—"} strategies`,
      icon: Settings,
      color: "text-purple-400",
    },
  ];

  return (
    <div className="bg-card-bg p-6 rounded-xl border border-border-gray">
      <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
        <Brain className="text-purple-400 w-6 h-6" />
        <span>Quantum ML Analytics</span>
        <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
          Beta
        </span>
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {analyticsCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-border-gray/20 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">{card.title}</h4>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div className={`text-2xl font-bold mb-1 ${card.color}`}>
                {card.value}
              </div>
              <div className="text-sm text-muted-text">{card.subtitle}</div>
            </div>
          );
        })}
      </div>

      {analytics?.recommendation && (
        <div className="p-4 bg-gradient-to-r from-purple-500/10 to-coinbase-blue/10 rounded-lg border border-purple-500/20">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
              <Lightbulb className="text-purple-400 w-4 h-4" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium mb-2">AI Recommendation</h4>
              <p className="text-sm text-muted-text mb-3">
                {analytics.recommendation}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="text-purple-400 hover:text-purple-300 p-0 h-auto"
              >
                Apply Recommendation →
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
