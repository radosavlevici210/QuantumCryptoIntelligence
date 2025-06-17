import { useQuery } from "@tanstack/react-query";
import { User } from "lucide-react";

export default function Header() {
  const { data: portfolio } = useQuery({
    queryKey: ["/api/portfolio"],
  });

  return (
    <header className="bg-card-bg border-b border-border-gray p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">AI-Powered Crypto Wallet</h2>
          <p className="text-muted-text">Quantum ML enhanced trading and token creation</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-sm text-muted-text">Total Portfolio Value</div>
            <div className="text-2xl font-bold text-success-green">
              ${portfolio?.totalValue || "0.00"}
            </div>
          </div>
          <div className="w-10 h-10 bg-coinbase-blue rounded-full flex items-center justify-center">
            <User className="text-white w-5 h-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
