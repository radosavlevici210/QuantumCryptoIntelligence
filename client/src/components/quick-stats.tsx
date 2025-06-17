import { useQuery } from "@tanstack/react-query";
import { Wallet, Coins, ArrowLeftRight, Fuel } from "lucide-react";

export default function QuickStats() {
  const { data: portfolio } = useQuery({
    queryKey: ["/api/portfolio"],
  });

  const { data: networkStatus } = useQuery({
    queryKey: ["/api/network/status"],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const stats = [
    {
      title: "Wallet Balance",
      value: `$${portfolio?.totalValue || "0.00"}`,
      change: "+12.5%",
      icon: Wallet,
      bgColor: "bg-coinbase-blue/20",
      iconColor: "text-coinbase-blue",
      changeColor: "text-success-green"
    },
    {
      title: "AI Tokens Created",
      value: "127",
      change: "+8.2%",
      icon: Coins,
      bgColor: "bg-success-green/20",
      iconColor: "text-success-green",
      changeColor: "text-success-green"
    },
    {
      title: "24h Trading Volume",
      value: "$6,163.59",
      change: "+15.7%",
      icon: ArrowLeftRight,
      bgColor: "bg-warning-orange/20",
      iconColor: "text-warning-orange",
      changeColor: "text-success-green"
    },
    {
      title: "Current Gas Fee",
      value: `${networkStatus?.gasPrice || 12} Gwei`,
      change: "Low",
      icon: Fuel,
      bgColor: "bg-danger-red/20",
      iconColor: "text-danger-red",
      changeColor: "text-muted-text"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={index} className="bg-card-bg p-6 rounded-xl border border-border-gray">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <Icon className={`${stat.iconColor} w-6 h-6`} />
              </div>
              <span className={`text-sm font-medium ${stat.changeColor}`}>
                {stat.change}
              </span>
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-muted-text text-sm">{stat.title}</div>
          </div>
        );
      })}
    </div>
  );
}
