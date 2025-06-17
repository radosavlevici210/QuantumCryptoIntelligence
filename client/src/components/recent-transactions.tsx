import { useQuery } from "@tanstack/react-query";
import { History, ArrowDown, ArrowUp, ArrowLeftRight, Plus } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";

const getTransactionIcon = (type: string) => {
  switch (type) {
    case "received":
      return <ArrowDown className="text-success-green w-4 h-4" />;
    case "sent":
      return <ArrowUp className="text-danger-red w-4 h-4" />;
    case "swapped":
      return <ArrowLeftRight className="text-warning-orange w-4 h-4" />;
    case "created":
      return <Plus className="text-purple-400 w-4 h-4" />;
    default:
      return <ArrowDown className="text-success-green w-4 h-4" />;
  }
};

const getTransactionColor = (type: string) => {
  switch (type) {
    case "received":
      return "bg-success-green/20";
    case "sent":
      return "bg-danger-red/20";
    case "swapped":
      return "bg-warning-orange/20";
    case "created":
      return "bg-purple-500/20";
    default:
      return "bg-success-green/20";
  }
};

const formatTransactionType = (type: string, fromToken?: string, toToken?: string) => {
  switch (type) {
    case "received":
      return "Received";
    case "sent":
      return "Sent";
    case "swapped":
      return `Swapped ${fromToken} → ${toToken}`;
    case "created":
      return "Created Token";
    default:
      return type;
  }
};

const formatAmount = (amount: string, type: string, tokenSymbol: string) => {
  const value = parseFloat(amount);
  const sign = type === "sent" ? "-" : type === "received" ? "+" : "";
  const color = type === "sent" ? "text-danger-red" : type === "received" ? "text-success-green" : "";
  
  return (
    <div className={`font-medium ${color}`}>
      {sign}{Math.abs(value).toFixed(value > 1 ? 2 : 8)} {tokenSymbol}
    </div>
  );
};

export default function RecentTransactions() {
  const { data: transactions } = useQuery({
    queryKey: ["/api/transactions"],
  });

  return (
    <div className="bg-card-bg p-6 rounded-xl border border-border-gray">
      <h3 className="text-xl font-bold mb-6 flex items-center space-x-2">
        <History className="text-coinbase-blue w-6 h-6" />
        <span>Recent Transactions</span>
      </h3>

      <div className="space-y-4">
        {transactions?.slice(0, 4).map((transaction: any) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between p-4 bg-border-gray/20 rounded-lg"
          >
            <div className="flex items-center space-x-3">
              <div className={`w-10 h-10 ${getTransactionColor(transaction.type)} rounded-full flex items-center justify-center`}>
                {getTransactionIcon(transaction.type)}
              </div>
              <div>
                <div className="font-medium">
                  {formatTransactionType(transaction.type, transaction.fromToken, transaction.toToken)} {transaction.tokenSymbol}
                </div>
                <div className="text-sm text-muted-text">
                  {transaction.createdAt ? format(new Date(transaction.createdAt), "MMM d, h:mm a") : "—"}
                </div>
              </div>
            </div>
            <div className="text-right">
              {formatAmount(transaction.amount, transaction.type, transaction.tokenSymbol)}
              <div className="text-sm text-muted-text">
                {transaction.hash ? `${transaction.hash.slice(0, 10)}...` : "—"}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Button variant="ghost" className="w-full mt-4 text-coinbase-blue hover:text-coinbase-dark-blue">
        View All Transactions
      </Button>
    </div>
  );
}
