import { useEffect } from "react";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";
import QuickStats from "@/components/quick-stats";
import AiTokenCreator from "@/components/ai-token-creator";
import QuickExchange from "@/components/quick-exchange";
import Portfolio from "@/components/portfolio";
import RecentTransactions from "@/components/recent-transactions";
import AiAnalytics from "@/components/ai-analytics";

export default function Dashboard() {
  useEffect(() => {
    document.title = "CoinbaseSDK Wallet - AI-Powered Crypto Trading";
  }, []);

  return (
    <div className="flex h-screen bg-dark-bg text-light-text">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Header />
        <div className="p-6 space-y-6">
          <QuickStats />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AiTokenCreator />
            </div>
            <div>
              <QuickExchange />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Portfolio />
            <RecentTransactions />
          </div>

          <AiAnalytics />
        </div>
      </main>
    </div>
  );
}
