import { useState } from "react";
import { useMutation, queryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bot, Info, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const tokenSchema = z.object({
  name: z.string().min(1, "Token name is required"),
  symbol: z.string().min(1, "Symbol is required").max(10, "Symbol too long"),
  totalSupply: z.string().min(1, "Total supply is required"),
  aiStrategy: z.string().min(1, "AI strategy is required"),
});

type TokenFormData = z.infer<typeof tokenSchema>;

interface TokenAnalysis {
  marketViability: string;
  riskScore: string;
  predictedRoi: string;
  creationFee: string;
  gasFee: string;
}

export default function AiTokenCreator() {
  const [analysis, setAnalysis] = useState<TokenAnalysis | null>(null);
  const { toast } = useToast();

  const form = useForm<TokenFormData>({
    resolver: zodResolver(tokenSchema),
    defaultValues: {
      name: "",
      symbol: "",
      totalSupply: "",
      aiStrategy: "",
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: async (data: TokenFormData) => {
      const response = await apiRequest("POST", "/api/ai/analyze-token", data);
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysis(data);
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: TokenFormData) => {
      const response = await apiRequest("POST", "/api/tokens", {
        ...data,
        marketViability: analysis?.marketViability,
        riskScore: analysis?.riskScore,
        predictedRoi: analysis?.predictedRoi,
        creationFee: analysis?.creationFee,
        gasFee: analysis?.gasFee,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Token Created Successfully",
        description: "Your AI-powered token has been created and deployed.",
      });
      form.reset();
      setAnalysis(null);
      queryClient.invalidateQueries({ queryKey: ["/api/tokens"] });
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
    },
    onError: () => {
      toast({
        title: "Creation Failed",
        description: "Failed to create token. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleAnalyze = () => {
    const data = form.getValues();
    if (data.name && data.symbol && data.totalSupply && data.aiStrategy) {
      analyzeMutation.mutate(data);
    }
  };

  const onSubmit = (data: TokenFormData) => {
    if (!analysis) {
      toast({
        title: "Analysis Required",
        description: "Please analyze the token before creating it.",
        variant: "destructive",
      });
      return;
    }
    createMutation.mutate(data);
  };

  return (
    <div className="bg-card-bg p-6 rounded-xl border border-border-gray">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center space-x-2">
          <Bot className="text-coinbase-blue w-6 h-6" />
          <span>AI Token Creator</span>
          <span className="text-xs bg-success-green/20 text-success-green px-2 py-1 rounded-full">
            Quantum ML
          </span>
        </h3>
        <Button variant="ghost" size="sm">
          <Info className="w-4 h-4" />
        </Button>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Token Name</Label>
              <Input
                id="name"
                {...form.register("name")}
                placeholder="Enter token name"
                className="bg-border-gray/30 border-border-gray"
                onChange={(e) => {
                  form.setValue("name", e.target.value);
                  setAnalysis(null);
                }}
              />
              {form.formState.errors.name && (
                <p className="text-danger-red text-sm mt-1">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="symbol">Symbol</Label>
              <Input
                id="symbol"
                {...form.register("symbol")}
                placeholder="TKN"
                className="bg-border-gray/30 border-border-gray"
                onChange={(e) => {
                  form.setValue("symbol", e.target.value.toUpperCase());
                  setAnalysis(null);
                }}
              />
              {form.formState.errors.symbol && (
                <p className="text-danger-red text-sm mt-1">
                  {form.formState.errors.symbol.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="totalSupply">Total Supply</Label>
              <Input
                id="totalSupply"
                type="number"
                {...form.register("totalSupply")}
                placeholder="1000000"
                className="bg-border-gray/30 border-border-gray"
                onChange={(e) => {
                  form.setValue("totalSupply", e.target.value);
                  setAnalysis(null);
                }}
              />
              {form.formState.errors.totalSupply && (
                <p className="text-danger-red text-sm mt-1">
                  {form.formState.errors.totalSupply.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="aiStrategy">AI Strategy</Label>
              <Select
                onValueChange={(value) => {
                  form.setValue("aiStrategy", value);
                  setAnalysis(null);
                }}
              >
                <SelectTrigger className="bg-border-gray/30 border-border-gray">
                  <SelectValue placeholder="Select AI strategy" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="quantum-yield">Quantum Yield Optimization</SelectItem>
                  <SelectItem value="ml-prediction">ML Price Prediction</SelectItem>
                  <SelectItem value="sentiment-analysis">Sentiment Analysis</SelectItem>
                  <SelectItem value="defi-liquidity">DeFi Liquidity Mining</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.aiStrategy && (
                <p className="text-danger-red text-sm mt-1">
                  {form.formState.errors.aiStrategy.message}
                </p>
              )}
            </div>

            <Button
              type="button"
              onClick={handleAnalyze}
              disabled={analyzeMutation.isPending}
              className="w-full bg-purple-500 hover:bg-purple-600"
            >
              {analyzeMutation.isPending ? "Analyzing..." : "Analyze with AI"}
            </Button>
          </div>

          <div className="space-y-4">
            <div className="bg-border-gray/20 p-4 rounded-lg">
              <h4 className="font-medium mb-3 flex items-center space-x-2">
                <Bot className="text-coinbase-blue w-4 h-4" />
                <span>AI Analysis</span>
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-text">Market Viability</span>
                  <span className="text-success-green font-medium">
                    {analysis?.marketViability ? `${analysis.marketViability}%` : "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-text">Risk Score</span>
                  <span className="text-warning-orange font-medium">
                    {analysis?.riskScore || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-text">Predicted ROI</span>
                  <span className="text-success-green font-medium">
                    {analysis?.predictedRoi ? `+${analysis.predictedRoi}%` : "—"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-border-gray/20 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Estimated Costs</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-text">Creation Fee</span>
                  <span>{analysis?.creationFee ? `${analysis.creationFee} ETH` : "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-text">Gas Fee</span>
                  <span>{analysis?.gasFee ? `${analysis.gasFee} ETH` : "—"}</span>
                </div>
                <div className="flex justify-between font-medium pt-2 border-t border-border-gray">
                  <span>Total</span>
                  <span>
                    {analysis?.creationFee && analysis?.gasFee
                      ? `${(parseFloat(analysis.creationFee) + parseFloat(analysis.gasFee)).toFixed(3)} ETH`
                      : "—"}
                  </span>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              disabled={!analysis || createMutation.isPending}
              className="w-full bg-coinbase-blue hover:bg-coinbase-dark-blue"
            >
              <Plus className="w-4 h-4 mr-2" />
              {createMutation.isPending ? "Creating..." : "Create AI Token"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
