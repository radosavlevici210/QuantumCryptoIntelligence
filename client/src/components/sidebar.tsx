import { Link, useLocation } from "wouter";
import { Wallet, TrendingUp, Coins, Bot, ArrowLeftRight, History, Brain } from "lucide-react";

export default function Sidebar() {
  const [location] = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: TrendingUp, current: location === "/" },
    { name: "Portfolio", href: "/portfolio", icon: Coins, current: location === "/portfolio" },
    { name: "AI Token Creator", href: "/create", icon: Bot, current: location === "/create" },
    { name: "Exchange", href: "/exchange", icon: ArrowLeftRight, current: location === "/exchange" },
    { name: "Transactions", href: "/transactions", icon: History, current: location === "/transactions" },
    { name: "Quantum ML", href: "/quantum", icon: Brain, current: location === "/quantum" },
  ];

  return (
    <aside className="w-64 bg-card-bg border-r border-border-gray flex-shrink-0">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-8 h-8 bg-coinbase-blue rounded-lg flex items-center justify-center">
            <Wallet className="text-white w-4 h-4" />
          </div>
          <h1 className="text-xl font-bold">CoinbaseSDK</h1>
        </div>

        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  item.current
                    ? "bg-coinbase-blue/10 text-coinbase-blue"
                    : "text-muted-text hover:text-light-text hover:bg-border-gray/50"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 p-4 bg-border-gray/30 rounded-lg">
          <div className="text-sm text-muted-text mb-2">Network Status</div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-success-green rounded-full animate-pulse"></div>
            <span className="text-sm">Mainnet Connected</span>
          </div>
          <div className="text-xs text-muted-text mt-1">Block: 18,543,291</div>
        </div>
      </div>
    </aside>
  );
}
