import { useState, useEffect } from "react";
import { useMutation, useQuery, queryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowUpDown, ArrowLeftRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const swapSchema = z.object({
  fromToken: z.string().min(1, "Select from token"),
  toToken: z.string().min(1, "Select to token"),
  amount: z.string().min(1, "Enter amount"),
});

type SwapFormData = z.infer<typeof swapSchema>;

export default function QuickExchange() {
  const [expectedOutput, setExpectedOutput] = useState<string>("0.00");
  const { toast } = useToast();

  const form = useForm<SwapFormData>({
    resolver: zodResolver(swapSchema),
    defaultValues: {
      fromToken: "ETH",
      toToken: "USDC",
      amount: "",
    },
  });

  const { data: portfolio } = useQuery({
    queryKey: ["/api/portfolio"],
  });

  const { data: exchangeRate } = useQuery({
    queryKey: ["/api/exchange/rate", form.watch("fromToken"), form.watch("toToken")],
    enabled: Boolean(form.watch("fromToken") && form.watch("toToken")),
  });

  const swapMutation = useMutation({
    mutationFn: async (data: SwapFormData & { expectedOutput: string }) => {
      const response = await apiRequest("POST", "/api/exchange/swap", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Swap Executed",
        description: "Your token swap has been completed successfully.",
      });
      form.reset();
      setExpectedOutput("0.00");
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
    },
    onError: () => {
      toast({
        title: "Swap Failed",
        description: "Failed to execute swap. Please try again.",
        variant: "destructive",
      });
    },
  });

  const tokens = [
    { symbol: "ETH", name: "Ethereum" },
    { symbol: "BTC", name: "Bitcoin" },
    { symbol: "USDC", name: "USD Coin" },
    { symbol: "QTML", name: "Quantum ML Token" },
  ];

  const getBalance = (tokenSymbol: string) => {
    const holding = portfolio?.holdings?.find((h: any) => h.tokenSymbol === tokenSymbol);
    return holding?.balance || "0.00";
  };

  useEffect(() => {
    const amount = form.watch("amount");
    if (amount && exchangeRate?.rate) {
      const output = (parseFloat(amount) * parseFloat(exchangeRate.rate)).toFixed(2);
      setExpectedOutput(output);
    } else {
      setExpectedOutput("0.00");
    }
  }, [form.watch("amount"), exchangeRate]);

  const handleSwapTokens = () => {
    const fromToken = form.getValues("fromToken");
    const toToken = form.getValues("toToken");
    form.setValue("fromToken", toToken);
    form.setValue("toToken", fromToken);
    setExpectedOutput("0.00");
  };

  const onSubmit = (data: SwapFormData) => {
    swapMutation.mutate({ ...data, expectedOutput });
  };

  return (
    <div className="bg-card-bg p-6 rounded-xl border border-border-gray">
      <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
        <ArrowLeftRight className="text-success-green w-6 h-6" />
        <span>Quick Exchange</span>
      </h3>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label>From</Label>
          <div className="bg-border-gray/30 border border-border-gray rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Select
                onValueChange={(value) => form.setValue("fromToken", value)}
                defaultValue="ETH"
              >
                <SelectTrigger className="bg-transparent border-none p-0 w-auto h-auto">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tokens.map((token) => (
                    <SelectItem key={token.symbol} value={token.symbol}>
                      {token.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-muted-text text-sm">
                Balance: {getBalance(form.watch("fromToken"))}
              </span>
            </div>
            <Input
              {...form.register("amount")}
              type="number"
              step="any"
              placeholder="0.00"
              className="bg-transparent border-none text-2xl font-bold p-0 h-auto"
            />
          </div>
          {form.formState.errors.amount && (
            <p className="text-danger-red text-sm mt-1">
              {form.formState.errors.amount.message}
            </p>
          )}
        </div>

        <div className="flex justify-center">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSwapTokens}
            className="w-10 h-10 bg-border-gray hover:bg-muted-text/20 rounded-full p-0"
          >
            <ArrowUpDown className="text-muted-text w-4 h-4" />
          </Button>
        </div>

        <div>
          <Label>To</Label>
          <div className="bg-border-gray/30 border border-border-gray rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <Select
                onValueChange={(value) => form.setValue("toToken", value)}
                defaultValue="USDC"
              >
                <SelectTrigger className="bg-transparent border-none p-0 w-auto h-auto">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tokens.map((token) => (
                    <SelectItem key={token.symbol} value={token.symbol}>
                      {token.symbol}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="text-muted-text text-sm">
                Balance: {getBalance(form.watch("toToken"))}
              </span>
            </div>
            <div className="text-2xl font-bold">{expectedOutput}</div>
          </div>
        </div>

        <div className="bg-border-gray/20 p-3 rounded-lg text-sm">
          <div className="flex justify-between mb-1">
            <span className="text-muted-text">Exchange Rate</span>
            <span>
              1 {form.watch("fromToken")} = {exchangeRate?.rate || "—"} {form.watch("toToken")}
            </span>
          </div>
          <div className="flex justify-between mb-1">
            <span className="text-muted-text">Network Fee</span>
            <span>${exchangeRate?.networkFee || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-text">Platform Fee</span>
            <span>{exchangeRate?.platformFee || "—"}%</span>
          </div>
        </div>

        <Button
          type="submit"
          disabled={swapMutation.isPending || !expectedOutput || expectedOutput === "0.00"}
          className="w-full bg-success-green hover:bg-success-green/80 text-white"
        >
          <Zap className="w-4 h-4 mr-2" />
          {swapMutation.isPending ? "Swapping..." : "Instant Swap"}
        </Button>
      </form>
    </div>
  );
}
