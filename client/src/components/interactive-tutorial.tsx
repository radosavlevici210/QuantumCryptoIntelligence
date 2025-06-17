import { useState } from "react";
import { ChevronRight, ChevronLeft, CheckCircle, Play, Code, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TutorialStep {
  id: number;
  title: string;
  content: string;
  type: "explanation" | "interactive" | "quiz";
  interactiveElement?: any;
}

interface InteractiveTutorialProps {
  lessonId: string;
  onComplete: () => void;
}

const tutorials: Record<string, TutorialStep[]> = {
  "crypto-basics": [
    {
      id: 1,
      title: "What is Cryptocurrency?",
      content: "Cryptocurrency is a digital or virtual currency secured by cryptography. Unlike traditional currencies controlled by governments, cryptocurrencies operate on decentralized networks using blockchain technology.",
      type: "explanation"
    },
    {
      id: 2,
      title: "Understanding Blockchain",
      content: "A blockchain is like a digital ledger that records transactions across multiple computers. Each 'block' contains transaction data and is linked to the previous block, forming a 'chain'.",
      type: "explanation"
    },
    {
      id: 3,
      title: "Practice: Calculate Market Cap",
      content: "Market capitalization (market cap) = Current Price × Total Supply. Try calculating the market cap of a cryptocurrency.",
      type: "interactive",
      interactiveElement: "marketCap"
    },
    {
      id: 4,
      title: "Quiz: Crypto Fundamentals",
      content: "What makes cryptocurrency different from traditional money?",
      type: "quiz",
      interactiveElement: "cryptoQuiz"
    }
  ],
  "trading-basics": [
    {
      id: 1,
      title: "Buy vs Sell Orders",
      content: "A buy order is when you purchase cryptocurrency, believing its price will rise. A sell order is when you sell cryptocurrency, either to take profits or limit losses.",
      type: "explanation"
    },
    {
      id: 2,
      title: "Market vs Limit Orders",
      content: "Market orders execute immediately at current market price. Limit orders only execute when the price reaches your specified level.",
      type: "explanation"
    },
    {
      id: 3,
      title: "Practice: Calculate Profit/Loss",
      content: "Calculate your profit or loss from a trade. Enter your buy price, sell price, and quantity.",
      type: "interactive",
      interactiveElement: "profitLoss"
    }
  ],
  "wallet-security": [
    {
      id: 1,
      title: "Private Keys and Public Keys",
      content: "Your private key is like your password - never share it. Your public key is like your account number - safe to share for receiving funds.",
      type: "explanation"
    },
    {
      id: 2,
      title: "Seed Phrases",
      content: "A seed phrase is a list of 12-24 words that can restore your entire wallet. Store it securely offline and never share it online.",
      type: "explanation"
    },
    {
      id: 3,
      title: "Security Best Practices Quiz",
      content: "Which of these is the safest way to store your private key?",
      type: "quiz",
      interactiveElement: "securityQuiz"
    }
  ]
};

export default function InteractiveTutorial({ lessonId, onComplete }: InteractiveTutorialProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [completed, setCompleted] = useState(false);

  const steps = tutorials[lessonId] || [];
  const currentStepData = steps[currentStep];

  if (!currentStepData) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCompleted(true);
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderInteractiveElement = () => {
    switch (currentStepData.interactiveElement) {
      case "marketCap":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Current Price ($)</Label>
                <Input 
                  type="number" 
                  placeholder="50000"
                  onChange={(e) => setAnswers(prev => ({ ...prev, price: e.target.value }))}
                />
              </div>
              <div>
                <Label>Total Supply</Label>
                <Input 
                  type="number" 
                  placeholder="21000000"
                  onChange={(e) => setAnswers(prev => ({ ...prev, supply: e.target.value }))}
                />
              </div>
            </div>
            {answers.price && answers.supply && (
              <div className="p-4 bg-success-green/10 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Calculator className="w-4 h-4 text-success-green" />
                  <span className="font-medium">Market Cap: ${(parseFloat(answers.price) * parseFloat(answers.supply)).toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        );

      case "profitLoss":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Buy Price ($)</Label>
                <Input 
                  type="number" 
                  placeholder="100"
                  onChange={(e) => setAnswers(prev => ({ ...prev, buyPrice: e.target.value }))}
                />
              </div>
              <div>
                <Label>Sell Price ($)</Label>
                <Input 
                  type="number" 
                  placeholder="120"
                  onChange={(e) => setAnswers(prev => ({ ...prev, sellPrice: e.target.value }))}
                />
              </div>
              <div>
                <Label>Quantity</Label>
                <Input 
                  type="number" 
                  placeholder="10"
                  onChange={(e) => setAnswers(prev => ({ ...prev, quantity: e.target.value }))}
                />
              </div>
            </div>
            {answers.buyPrice && answers.sellPrice && answers.quantity && (
              <div className="p-4 bg-success-green/10 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Calculator className="w-4 h-4 text-success-green" />
                  <span className="font-medium">
                    Profit/Loss: ${((parseFloat(answers.sellPrice) - parseFloat(answers.buyPrice)) * parseFloat(answers.quantity)).toFixed(2)}
                  </span>
                </div>
              </div>
            )}
          </div>
        );

      case "cryptoQuiz":
        return (
          <div className="space-y-3">
            {["It's completely anonymous", "It's decentralized and not controlled by governments", "It's always more valuable than regular money", "It can only be used online"].map((option, index) => (
              <button
                key={index}
                onClick={() => setAnswers(prev => ({ ...prev, cryptoAnswer: index }))}
                className={`w-full p-3 text-left rounded-lg border transition-colors ${
                  answers.cryptoAnswer === index 
                    ? (index === 1 ? "bg-success-green/10 border-success-green" : "bg-red-500/10 border-red-500")
                    : "bg-border-gray/30 border-border-gray hover:border-success-green/50"
                }`}
              >
                {option}
              </button>
            ))}
            {answers.cryptoAnswer !== undefined && (
              <div className={`p-3 rounded-lg ${answers.cryptoAnswer === 1 ? "bg-success-green/10" : "bg-red-500/10"}`}>
                <p className="text-sm">
                  {answers.cryptoAnswer === 1 
                    ? "Correct! Cryptocurrency's main advantage is its decentralized nature."
                    : "Incorrect. The correct answer is that cryptocurrency is decentralized and not controlled by governments."
                  }
                </p>
              </div>
            )}
          </div>
        );

      case "securityQuiz":
        return (
          <div className="space-y-3">
            {["Save it in a text file on your computer", "Write it down on paper and store it safely", "Email it to yourself", "Post it in a private Discord channel"].map((option, index) => (
              <button
                key={index}
                onClick={() => setAnswers(prev => ({ ...prev, securityAnswer: index }))}
                className={`w-full p-3 text-left rounded-lg border transition-colors ${
                  answers.securityAnswer === index 
                    ? (index === 1 ? "bg-success-green/10 border-success-green" : "bg-red-500/10 border-red-500")
                    : "bg-border-gray/30 border-border-gray hover:border-success-green/50"
                }`}
              >
                {option}
              </button>
            ))}
            {answers.securityAnswer !== undefined && (
              <div className={`p-3 rounded-lg ${answers.securityAnswer === 1 ? "bg-success-green/10" : "bg-red-500/10"}`}>
                <p className="text-sm">
                  {answers.securityAnswer === 1 
                    ? "Correct! Writing down your private key on paper and storing it safely offline is the most secure method."
                    : "Incorrect. Writing it down on paper and storing it safely offline is the most secure method."
                  }
                </p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (completed) {
    return (
      <Card className="p-8 bg-card-bg border-border-gray text-center">
        <CheckCircle className="w-16 h-16 text-success-green mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-2">Lesson Complete!</h3>
        <p className="text-muted-text mb-6">
          You've successfully completed this lesson. Great job!
        </p>
        <Badge variant="outline" className="bg-success-green/10 text-success-green border-success-green">
          <CheckCircle className="w-3 h-3 mr-1" />
          Lesson Completed
        </Badge>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <Badge variant="outline">Step {currentStep + 1} of {steps.length}</Badge>
          <Badge 
            variant="outline" 
            className={`${
              currentStepData.type === "explanation" ? "bg-blue-500/10 text-blue-500 border-blue-500" :
              currentStepData.type === "interactive" ? "bg-purple-500/10 text-purple-500 border-purple-500" :
              "bg-orange-500/10 text-orange-500 border-orange-500"
            }`}
          >
            {currentStepData.type === "explanation" && <Play className="w-3 h-3 mr-1" />}
            {currentStepData.type === "interactive" && <Code className="w-3 h-3 mr-1" />}
            {currentStepData.type === "quiz" && <CheckCircle className="w-3 h-3 mr-1" />}
            {currentStepData.type.charAt(0).toUpperCase() + currentStepData.type.slice(1)}
          </Badge>
        </div>
        <div className="text-sm text-muted-text">
          Progress: {Math.round(((currentStep + 1) / steps.length) * 100)}%
        </div>
      </div>

      <Card className="p-8 bg-card-bg border-border-gray">
        <h2 className="text-2xl font-bold mb-4">{currentStepData.title}</h2>
        <p className="text-muted-text mb-6 leading-relaxed">{currentStepData.content}</p>
        
        {currentStepData.type === "interactive" || currentStepData.type === "quiz" ? (
          <div className="mb-6">
            {renderInteractiveElement()}
          </div>
        ) : null}

        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          
          <Button
            onClick={handleNext}
            className="bg-success-green hover:bg-success-green/80"
          >
            {currentStep === steps.length - 1 ? "Complete Lesson" : "Next"}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  );
}