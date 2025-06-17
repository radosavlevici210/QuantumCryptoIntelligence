import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowUpDown, ArrowLeftRight, Zap, Send, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const swapSchema = z.object({
  fromToken: z.string().min(1, "Select from token"),
  toToken: z.string().min(1, "Select to token"),
  amount: z.string().min(1, "Enter amount"),
});

const sendSchema = z.object({
  token: z.string().min(1, "Select token"),
  amount: z.string().min(1, "Enter amount"),
  walletAddress: z.string().min(1, "Enter wallet address"),
});

type SwapFormData = z.infer<typeof swapSchema>;
type SendFormData = z.infer<typeof sendSchema>;

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

  const sendForm = useForm<SendFormData>({
    resolver: zodResolver(sendSchema),
    defaultValues: {
      token: "ETH",
      amount: "",
      walletAddress: "",
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

  const sendMutation = useMutation({
    mutationFn: async (data: SendFormData) => {
      const response = await apiRequest("POST", "/api/wallet/send", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Transfer Sent",
        description: "Your tokens have been sent successfully.",
      });
      sendForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/portfolio"] });
      queryClient.invalidateQueries({ queryKey: ["/api/transactions"] });
    },
    onError: () => {
      toast({
        title: "Transfer Failed",
        description: "Failed to send tokens. Please check the wallet address and try again.",
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
    const holding = (portfolio as any)?.holdings?.find((h: any) => h.tokenSymbol === tokenSymbol);
    return holding?.balance || "0.00";
  };

  useEffect(() => {
    const amount = form.watch("amount");
    if (amount && (exchangeRate as any)?.rate) {
      const output = (parseFloat(amount) * parseFloat((exchangeRate as any).rate)).toFixed(2);
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

  const onSendSubmit = (data: SendFormData) => {
    sendMutation.mutate(data);
  };

  const sendAllETH = () => {
    const ethBalance = getBalance("ETH");
    sendForm.setValue("amount", ethBalance);
    sendForm.setValue("token", "ETH");
  };

  const sendAllToPortfolio = () => {
    const ethBalance = getBalance("ETH");
    sendForm.setValue("amount", ethBalance);
    sendForm.setValue("token", "ETH");
    sendForm.setValue("walletAddress", "0x742d35Cc6634C0532925a3b8D4ea2F79C3Fc88df");
  };

  return (
    <div className="bg-card-bg p-6 rounded-xl border border-border-gray">
      <Tabs defaultValue="swap" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="swap" className="flex items-center space-x-2">
            <ArrowLeftRight className="w-4 h-4" />
            <span>Exchange</span>
          </TabsTrigger>
          <TabsTrigger value="send" className="flex items-center space-x-2">
            <Send className="w-4 h-4" />
            <span>Send to Wallet</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="swap" className="mt-6">
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
                  1 {form.watch("fromToken")} = {(exchangeRate as any)?.rate || "—"} {form.watch("toToken")}
                </span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="text-muted-text">Network Fee</span>
                <span>${(exchangeRate as any)?.networkFee || "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-text">Platform Fee</span>
                <span>{(exchangeRate as any)?.platformFee || "—"}%</span>
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
        </TabsContent>

        <TabsContent value="send" className="mt-6">
          <form onSubmit={sendForm.handleSubmit(onSendSubmit)} className="space-y-4">
            <div>
              <Label>Token to Send</Label>
              <div className="bg-border-gray/30 border border-border-gray rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Select
                    onValueChange={(value) => sendForm.setValue("token", value)}
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
                    Balance: {getBalance(sendForm.watch("token"))}
                  </span>
                </div>
                <Input
                  {...sendForm.register("amount")}
                  type="number"
                  step="any"
                  placeholder="0.00"
                  className="bg-transparent border-none text-2xl font-bold p-0 h-auto"
                />
              </div>
              {sendForm.formState.errors.amount && (
                <p className="text-danger-red text-sm mt-1">
                  {sendForm.formState.errors.amount.message}
                </p>
              )}
            </div>

            <div>
              <Label>Wallet Address</Label>
              <Input
                {...sendForm.register("walletAddress")}
                placeholder="0x... or any address"
                className="bg-border-gray/30 border border-border-gray"
              />
              {sendForm.formState.errors.walletAddress && (
                <p className="text-danger-red text-sm mt-1">
                  {sendForm.formState.errors.walletAddress.message}
                </p>
              )}
            </div>

            <div className="flex space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={sendAllETH}
                className="flex-1"
              >
                <Wallet className="w-4 h-4 mr-2" />
                Send All ETH
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={sendAllToPortfolio}
                className="flex-1"
              >
                <Send className="w-4 h-4 mr-2" />
                Send to Portfolio
              </Button>
            </div>

            <div className="bg-border-gray/20 p-3 rounded-lg text-sm">
              <div className="flex justify-between mb-1">
                <span className="text-muted-text">Network Fee</span>
                <span>~$2.50 ETH</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-text">Estimated Time</span>
                <span>~2-5 minutes</span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={sendMutation.isPending}
              className="w-full bg-success-green hover:bg-success-green/80 text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              {sendMutation.isPending ? "Sending..." : "Send Tokens"}
            </Button>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}