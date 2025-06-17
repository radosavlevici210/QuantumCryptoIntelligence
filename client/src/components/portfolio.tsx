import { useQuery } from "@tanstack/react-query";
import { PieChart } from "lucide-react";

const tokenIcons: Record<string, string> = {
  ETH: "🔷",
  BTC: "₿",
  USDC: "$",
  QTML: "🤖",
};

export default function Portfolio() {
  const { data: portfolio } = useQuery({
    queryKey: ["/api/portfolio"],
  });

  return (
    <div className="bg-card-bg p-6 rounded-xl border border-border-gray">
      <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
        <PieChart className="text-warning-orange w-6 h-6" />
        <span>Portfolio Holdings</span>
      </h3>

      <div className="space-y-4">
        {portfolio?.holdings?.map((holding: any, index: number) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-border-gray/20 rounded-lg hover:bg-border-gray/30 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-coinbase-blue rounded-full flex items-center justify-center text-lg">
                {tokenIcons[holding.tokenSymbol] || "💎"}
              </div>
              <div>
                <div className="font-medium">{holding.tokenSymbol}</div>
                <div className="text-sm text-muted-text">{holding.tokenName}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium">
                {parseFloat(holding.balance).toFixed(
                  holding.tokenSymbol === "USDC" ? 2 : 5
                )} {holding.tokenSymbol}
              </div>
              <div className="text-sm text-success-green">
                ${parseFloat(holding.value).toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
