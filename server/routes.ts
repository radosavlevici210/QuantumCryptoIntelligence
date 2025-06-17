import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertTokenSchema, insertTransactionSchema, insertAiAnalyticsSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  const DEFAULT_USER_ID = 1; // For demo purposes

  // Portfolio routes
  app.get("/api/portfolio", async (req, res) => {
    try {
      const holdings = await storage.getHoldings(DEFAULT_USER_ID);
      const totalValue = await storage.getPortfolioValue(DEFAULT_USER_ID);
      
      res.json({
        holdings,
        totalValue: totalValue.toFixed(2)
      });
    } catch (error) {
      console.error("Error fetching portfolio:", error);
      res.status(500).json({ message: "Failed to fetch portfolio" });
    }
  });

  // Transactions routes
  app.get("/api/transactions", async (req, res) => {
    try {
      const transactions = await storage.getTransactions(DEFAULT_USER_ID);
      res.json(transactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Failed to fetch transactions" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse({
        ...req.body,
        userId: DEFAULT_USER_ID
      });
      
      const transaction = await storage.createTransaction(validatedData);
      res.json(transaction);
    } catch (error) {
      console.error("Error creating transaction:", error);
      res.status(400).json({ message: "Failed to create transaction" });
    }
  });

  // Token routes
  app.get("/api/tokens", async (req, res) => {
    try {
      const tokens = await storage.getTokens();
      res.json(tokens);
    } catch (error) {
      console.error("Error fetching tokens:", error);
      res.status(500).json({ message: "Failed to fetch tokens" });
    }
  });

  app.post("/api/tokens", async (req, res) => {
    try {
      const validatedData = insertTokenSchema.parse({
        ...req.body,
        creatorId: DEFAULT_USER_ID
      });
      
      const token = await storage.createToken(validatedData);
      
      // Create transaction for token creation
      await storage.createTransaction({
        userId: DEFAULT_USER_ID,
        type: "created",
        tokenSymbol: token.symbol,
        amount: token.totalSupply,
        value: "0", // Initial value
        fromToken: null,
        toToken: null
      });

      res.json(token);
    } catch (error) {
      console.error("Error creating token:", error);
      res.status(400).json({ message: "Failed to create token" });
    }
  });

  // Exchange routes
  app.get("/api/exchange/rate/:from/:to", async (req, res) => {
    try {
      const { from, to } = req.params;
      const rate = await storage.getExchangeRate(from, to);
      
      if (!rate) {
        return res.status(404).json({ message: "Exchange rate not found" });
      }
      
      res.json(rate);
    } catch (error) {
      console.error("Error fetching exchange rate:", error);
      res.status(500).json({ message: "Failed to fetch exchange rate" });
    }
  });

  const swapSchema = z.object({
    fromToken: z.string(),
    toToken: z.string(),
    amount: z.string(),
    expectedOutput: z.string()
  });

  app.post("/api/exchange/swap", async (req, res) => {
    try {
      const { fromToken, toToken, amount, expectedOutput } = swapSchema.parse(req.body);
      
      // Get exchange rate
      const rate = await storage.getExchangeRate(fromToken, toToken);
      if (!rate) {
        return res.status(400).json({ message: "Exchange rate not available" });
      }

      // Update holdings (simplified)
      const fromHolding = await storage.getHolding(DEFAULT_USER_ID, fromToken);
      const toHolding = await storage.getHolding(DEFAULT_USER_ID, toToken);

      if (!fromHolding || parseFloat(fromHolding.balance) < parseFloat(amount)) {
        return res.status(400).json({ message: "Insufficient balance" });
      }

      // Create swap transaction
      const transaction = await storage.createTransaction({
        userId: DEFAULT_USER_ID,
        type: "swapped",
        tokenSymbol: fromToken,
        amount: `-${amount}`,
        value: expectedOutput,
        fromToken,
        toToken
      });

      res.json({ transaction, success: true });
    } catch (error) {
      console.error("Error executing swap:", error);
      res.status(400).json({ message: "Failed to execute swap" });
    }
  });

  // AI Analytics routes
  app.get("/api/ai/analytics", async (req, res) => {
    try {
      const analytics = await storage.getAiAnalytics(DEFAULT_USER_ID);
      res.json(analytics);
    } catch (error) {
      console.error("Error fetching AI analytics:", error);
      res.status(500).json({ message: "Failed to fetch AI analytics" });
    }
  });

  app.post("/api/ai/analytics", async (req, res) => {
    try {
      const validatedData = insertAiAnalyticsSchema.parse(req.body);
      const analytics = await storage.updateAiAnalytics(DEFAULT_USER_ID, validatedData);
      res.json(analytics);
    } catch (error) {
      console.error("Error updating AI analytics:", error);
      res.status(400).json({ message: "Failed to update AI analytics" });
    }
  });

  // AI Token Analysis
  app.post("/api/ai/analyze-token", async (req, res) => {
    try {
      const { name, symbol, totalSupply, aiStrategy } = req.body;
      
      // Simulate AI analysis
      const analysis = {
        marketViability: (Math.random() * 30 + 70).toFixed(1), // 70-100%
        riskScore: ["Low", "Medium", "High"][Math.floor(Math.random() * 3)],
        predictedRoi: (Math.random() * 400 + 100).toFixed(0), // 100-500%
        creationFee: "0.05",
        gasFee: (Math.random() * 0.02 + 0.01).toFixed(3) // 0.01-0.03 ETH
      };
      
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing token:", error);
      res.status(500).json({ message: "Failed to analyze token" });
    }
  });

  // Network status
  app.get("/api/network/status", async (req, res) => {
    try {
      res.json({
        status: "connected",
        network: "mainnet",
        blockNumber: Math.floor(18543291 + Math.random() * 100),
        gasPrice: Math.floor(Math.random() * 20 + 10) // 10-30 Gwei
      });
    } catch (error) {
      console.error("Error fetching network status:", error);
      res.status(500).json({ message: "Failed to fetch network status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
