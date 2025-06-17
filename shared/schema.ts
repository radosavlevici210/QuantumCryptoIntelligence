import { pgTable, text, serial, integer, boolean, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  walletAddress: text("wallet_address"),
  privateKey: text("private_key"),
  publicKey: text("public_key"),
});

export const tokens = pgTable("tokens", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  symbol: text("symbol").notNull(),
  totalSupply: decimal("total_supply", { precision: 20, scale: 8 }).notNull(),
  contractAddress: text("contract_address"),
  creatorId: integer("creator_id").references(() => users.id),
  aiStrategy: text("ai_strategy"),
  marketViability: decimal("market_viability", { precision: 5, scale: 2 }),
  riskScore: text("risk_score"),
  predictedRoi: decimal("predicted_roi", { precision: 5, scale: 2 }),
  creationFee: decimal("creation_fee", { precision: 20, scale: 8 }),
  gasFee: decimal("gas_fee", { precision: 20, scale: 8 }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const holdings = pgTable("holdings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  tokenSymbol: text("token_symbol").notNull(),
  tokenName: text("token_name").notNull(),
  balance: decimal("balance", { precision: 20, scale: 8 }).notNull(),
  value: decimal("value", { precision: 20, scale: 2 }).notNull(),
  icon: text("icon"),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  type: text("type").notNull(), // received, sent, swapped, created
  tokenSymbol: text("token_symbol").notNull(),
  amount: decimal("amount", { precision: 20, scale: 8 }).notNull(),
  value: decimal("value", { precision: 20, scale: 2 }),
  hash: text("hash"),
  fromToken: text("from_token"),
  toToken: text("to_token"),
  toAddress: text("to_address"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const aiAnalytics = pgTable("ai_analytics", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  marketSentiment: text("market_sentiment"),
  sentimentConfidence: decimal("sentiment_confidence", { precision: 5, scale: 2 }),
  pricePrediction: decimal("price_prediction", { precision: 5, scale: 2 }),
  riskScore: text("risk_score"),
  riskValue: decimal("risk_value", { precision: 3, scale: 1 }),
  optimizationStatus: text("optimization_status"),
  activeStrategies: integer("active_strategies"),
  recommendation: text("recommendation"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const exchangeRates = pgTable("exchange_rates", {
  id: serial("id").primaryKey(),
  fromToken: text("from_token").notNull(),
  toToken: text("to_token").notNull(),
  rate: decimal("rate", { precision: 20, scale: 8 }).notNull(),
  networkFee: decimal("network_fee", { precision: 20, scale: 2 }),
  platformFee: decimal("platform_fee", { precision: 5, scale: 3 }),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
});

export const insertTokenSchema = createInsertSchema(tokens).omit({
  id: true,
  createdAt: true,
});

export const insertHoldingSchema = createInsertSchema(holdings).omit({
  id: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertAiAnalyticsSchema = createInsertSchema(aiAnalytics).omit({
  id: true,
  updatedAt: true,
});

export const insertExchangeRateSchema = createInsertSchema(exchangeRates).omit({
  id: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Token = typeof tokens.$inferSelect;
export type InsertToken = z.infer<typeof insertTokenSchema>;

export type Holding = typeof holdings.$inferSelect;
export type InsertHolding = z.infer<typeof insertHoldingSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type AiAnalytics = typeof aiAnalytics.$inferSelect;
export type InsertAiAnalytics = z.infer<typeof insertAiAnalyticsSchema>;

export type ExchangeRate = typeof exchangeRates.$inferSelect;
export type InsertExchangeRate = z.infer<typeof insertExchangeRateSchema>;
