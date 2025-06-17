import {
  users, tokens, holdings, transactions, aiAnalytics, exchangeRates,
  type User, type InsertUser,
  type Token, type InsertToken,
  type Holding, type InsertHolding,
  type Transaction, type InsertTransaction,
  type AiAnalytics, type InsertAiAnalytics,
  type ExchangeRate, type InsertExchangeRate
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Token operations
  getTokens(userId?: number): Promise<Token[]>;
  getToken(id: number): Promise<Token | undefined>;
  createToken(token: InsertToken): Promise<Token>;
  
  // Holdings operations
  getHoldings(userId: number): Promise<Holding[]>;
  getHolding(userId: number, tokenSymbol: string): Promise<Holding | undefined>;
  createHolding(holding: InsertHolding): Promise<Holding>;
  updateHolding(id: number, updates: Partial<Holding>): Promise<Holding>;
  
  // Transaction operations
  getTransactions(userId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // AI Analytics operations
  getAiAnalytics(userId: number): Promise<AiAnalytics | undefined>;
  updateAiAnalytics(userId: number, analytics: InsertAiAnalytics): Promise<AiAnalytics>;
  
  // Exchange rate operations
  getExchangeRate(fromToken: string, toToken: string): Promise<ExchangeRate | undefined>;
  updateExchangeRate(rate: InsertExchangeRate): Promise<ExchangeRate>;
  
  // Portfolio operations
  getPortfolioValue(userId: number): Promise<number>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private tokens: Map<number, Token> = new Map();
  private holdings: Map<number, Holding> = new Map();
  private transactions: Map<number, Transaction> = new Map();
  private aiAnalytics: Map<number, AiAnalytics> = new Map();
  private exchangeRates: Map<string, ExchangeRate> = new Map();
  
  private currentUserId = 1;
  private currentTokenId = 1;
  private currentHoldingId = 1;
  private currentTransactionId = 1;
  private currentAnalyticsId = 1;
  private currentRateId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Create default user
    const defaultUser: User = {
      id: 1,
      username: "cryptouser",
      password: "password",
      walletAddress: "0x1234567890abcdef1234567890abcdef12345678",
      privateKey: "5AGBVWW-XB34K4A-PM3W2DY-4ATYZ02",
      publicKey: "976fa851-b338-40a1-86b9-2c40eb5588b1"
    };
    this.users.set(1, defaultUser);
    this.currentUserId = 2;

    // Initialize holdings
    const initialHoldings: Holding[] = [
      {
        id: 1,
        userId: 1,
        tokenSymbol: "ETH",
        tokenName: "Ethereum",
        balance: "2.45000000",
        value: "4523.64",
        icon: "ethereum"
      },
      {
        id: 2,
        userId: 1,
        tokenSymbol: "BTC",
        tokenName: "Bitcoin",
        balance: "0.15800000",
        value: "6847.33",
        icon: "bitcoin"
      },
      {
        id: 3,
        userId: 1,
        tokenSymbol: "USDC",
        tokenName: "USD Coin",
        balance: "7049.95000000",
        value: "7049.95",
        icon: "usdc"
      },
      {
        id: 4,
        userId: 1,
        tokenSymbol: "QTML",
        tokenName: "Quantum ML Token",
        balance: "15000.00000000",
        value: "4500.00",
        icon: "robot"
      }
    ];

    initialHoldings.forEach(holding => {
      this.holdings.set(holding.id, holding);
    });
    this.currentHoldingId = 5;

    // Initialize transactions
    const initialTransactions: Transaction[] = [
      {
        id: 1,
        userId: 1,
        type: "received",
        tokenSymbol: "ETH",
        amount: "0.50000000",
        value: "923.50",
        hash: "0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
        fromToken: null,
        toToken: null,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        id: 2,
        userId: 1,
        type: "swapped",
        tokenSymbol: "USDC",
        amount: "1000.00000000",
        value: "1000.00",
        hash: "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d",
        fromToken: "USDC",
        toToken: "ETH",
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000) // 5 hours ago
      },
      {
        id: 3,
        userId: 1,
        type: "created",
        tokenSymbol: "QTML",
        amount: "15000.00000000",
        value: "4500.00",
        hash: "0x5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f",
        fromToken: null,
        toToken: null,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        id: 4,
        userId: 1,
        type: "sent",
        tokenSymbol: "BTC",
        amount: "-0.05000000",
        value: "2169.50",
        hash: "0x7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b",
        fromToken: null,
        toToken: null,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      }
    ];

    initialTransactions.forEach(transaction => {
      this.transactions.set(transaction.id, transaction);
    });
    this.currentTransactionId = 5;

    // Initialize AI analytics
    const initialAnalytics: AiAnalytics = {
      id: 1,
      userId: 1,
      marketSentiment: "Bullish",
      sentimentConfidence: "78.00",
      pricePrediction: "15.30",
      riskScore: "Medium",
      riskValue: "6.2",
      optimizationStatus: "Active",
      activeStrategies: 3,
      recommendation: "Based on quantum ML analysis, consider rebalancing your portfolio. The model suggests increasing ETH exposure by 12% and reducing BTC holdings by 8% for optimal risk-adjusted returns.",
      updatedAt: new Date()
    };
    this.aiAnalytics.set(1, initialAnalytics);

    // Initialize exchange rates
    const initialRates: ExchangeRate[] = [
      {
        id: 1,
        fromToken: "ETH",
        toToken: "USDC",
        rate: "1847.25000000",
        networkFee: "12.50",
        platformFee: "0.500",
        updatedAt: new Date()
      },
      {
        id: 2,
        fromToken: "BTC",
        toToken: "USDC",
        rate: "43390.00000000",
        networkFee: "15.00",
        platformFee: "0.500",
        updatedAt: new Date()
      }
    ];

    initialRates.forEach(rate => {
      this.exchangeRates.set(`${rate.fromToken}-${rate.toToken}`, rate);
    });
    this.currentRateId = 3;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getTokens(userId?: number): Promise<Token[]> {
    const tokens = Array.from(this.tokens.values());
    return userId ? tokens.filter(token => token.creatorId === userId) : tokens;
  }

  async getToken(id: number): Promise<Token | undefined> {
    return this.tokens.get(id);
  }

  async createToken(insertToken: InsertToken): Promise<Token> {
    const id = this.currentTokenId++;
    const token: Token = { 
      ...insertToken, 
      id, 
      contractAddress: `0x${Math.random().toString(16).substr(2, 40)}`,
      createdAt: new Date() 
    };
    this.tokens.set(id, token);
    return token;
  }

  async getHoldings(userId: number): Promise<Holding[]> {
    return Array.from(this.holdings.values()).filter(holding => holding.userId === userId);
  }

  async getHolding(userId: number, tokenSymbol: string): Promise<Holding | undefined> {
    return Array.from(this.holdings.values()).find(
      holding => holding.userId === userId && holding.tokenSymbol === tokenSymbol
    );
  }

  async createHolding(insertHolding: InsertHolding): Promise<Holding> {
    const id = this.currentHoldingId++;
    const holding: Holding = { ...insertHolding, id };
    this.holdings.set(id, holding);
    return holding;
  }

  async updateHolding(id: number, updates: Partial<Holding>): Promise<Holding> {
    const existing = this.holdings.get(id);
    if (!existing) throw new Error("Holding not found");
    
    const updated = { ...existing, ...updates };
    this.holdings.set(id, updated);
    return updated;
  }

  async getTransactions(userId: number): Promise<Transaction[]> {
    return Array.from(this.transactions.values())
      .filter(transaction => transaction.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = this.currentTransactionId++;
    const transaction: Transaction = { 
      ...insertTransaction, 
      id, 
      hash: `0x${Math.random().toString(16).substr(2, 64)}`,
      createdAt: new Date() 
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async getAiAnalytics(userId: number): Promise<AiAnalytics | undefined> {
    return Array.from(this.aiAnalytics.values()).find(analytics => analytics.userId === userId);
  }

  async updateAiAnalytics(userId: number, insertAnalytics: InsertAiAnalytics): Promise<AiAnalytics> {
    const existing = Array.from(this.aiAnalytics.values()).find(analytics => analytics.userId === userId);
    
    if (existing) {
      const updated = { ...existing, ...insertAnalytics, updatedAt: new Date() };
      this.aiAnalytics.set(existing.id, updated);
      return updated;
    } else {
      const id = this.currentAnalyticsId++;
      const analytics: AiAnalytics = { 
        ...insertAnalytics, 
        id, 
        userId,
        updatedAt: new Date() 
      };
      this.aiAnalytics.set(id, analytics);
      return analytics;
    }
  }

  async getExchangeRate(fromToken: string, toToken: string): Promise<ExchangeRate | undefined> {
    return this.exchangeRates.get(`${fromToken}-${toToken}`);
  }

  async updateExchangeRate(insertRate: InsertExchangeRate): Promise<ExchangeRate> {
    const key = `${insertRate.fromToken}-${insertRate.toToken}`;
    const existing = this.exchangeRates.get(key);
    
    if (existing) {
      const updated = { ...existing, ...insertRate, updatedAt: new Date() };
      this.exchangeRates.set(key, updated);
      return updated;
    } else {
      const id = this.currentRateId++;
      const rate: ExchangeRate = { 
        ...insertRate, 
        id, 
        updatedAt: new Date() 
      };
      this.exchangeRates.set(key, rate);
      return rate;
    }
  }

  async getPortfolioValue(userId: number): Promise<number> {
    const holdings = await this.getHoldings(userId);
    return holdings.reduce((total, holding) => total + parseFloat(holding.value), 0);
  }
}

export const storage = new MemStorage();
