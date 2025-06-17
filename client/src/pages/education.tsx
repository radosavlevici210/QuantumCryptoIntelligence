import { useState } from "react";
import { Book, Play, Award, TrendingUp, Shield, Zap, Brain, Target, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import InteractiveTutorial from "@/components/interactive-tutorial";

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  completed: boolean;
  icon: any;
}

const lessons: Lesson[] = [
  {
    id: "crypto-basics",
    title: "Cryptocurrency Fundamentals",
    description: "Learn what cryptocurrency is, how blockchain works, and why it matters",
    duration: "15 min",
    difficulty: "Beginner",
    completed: false,
    icon: Book
  },
  {
    id: "trading-basics",
    title: "Trading Basics",
    description: "Understand buying, selling, market orders, and trading strategies",
    duration: "20 min",
    difficulty: "Beginner",
    completed: false,
    icon: TrendingUp
  },
  {
    id: "wallet-security",
    title: "Wallet Security",
    description: "Best practices for securing your crypto assets and private keys",
    duration: "12 min",
    difficulty: "Beginner",
    completed: false,
    icon: Shield
  },
  {
    id: "defi-intro",
    title: "DeFi Introduction",
    description: "Decentralized Finance: lending, borrowing, and yield farming",
    duration: "25 min",
    difficulty: "Intermediate",
    completed: false,
    icon: Zap
  },
  {
    id: "token-creation",
    title: "Token Creation & AI Analysis",
    description: "How to create tokens and use AI for market analysis",
    duration: "30 min",
    difficulty: "Intermediate",
    completed: false,
    icon: Brain
  },
  {
    id: "advanced-trading",
    title: "Advanced Trading Strategies",
    description: "Technical analysis, risk management, and portfolio optimization",
    duration: "45 min",
    difficulty: "Advanced",
    completed: false,
    icon: Target
  }
];

const quizzes = [
  {
    id: "basic-crypto",
    title: "Cryptocurrency Basics Quiz",
    questions: 10,
    difficulty: "Beginner",
    completed: false
  },
  {
    id: "trading-quiz",
    title: "Trading Knowledge Test",
    questions: 15,
    difficulty: "Intermediate",
    completed: false
  },
  {
    id: "security-quiz",
    title: "Security Best Practices",
    questions: 12,
    difficulty: "Beginner",
    completed: false
  }
];

export default function Education() {
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());

  const completedCount = completedLessons.size;
  const progressPercentage = (completedCount / lessons.length) * 100;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-500";
      case "Intermediate": return "bg-yellow-500";
      case "Advanced": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const completeLesson = (lessonId: string) => {
    setCompletedLessons(prev => {
      const newSet = new Set(prev);
      newSet.add(lessonId);
      return newSet;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Crypto Education Hub</h1>
          <p className="text-muted-text mt-2">
            Master cryptocurrency trading, blockchain technology, and DeFi fundamentals
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-success-green">{completedCount}/{lessons.length}</div>
          <div className="text-sm text-muted-text">Lessons Completed</div>
        </div>
      </div>

      {/* Progress Overview */}
      <Card className="p-6 bg-card-bg border-border-gray">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Learning Progress</h3>
          <Badge variant="outline" className="bg-success-green/10 text-success-green border-success-green">
            {progressPercentage.toFixed(0)}% Complete
          </Badge>
        </div>
        <Progress value={progressPercentage} className="mb-2" />
        <p className="text-sm text-muted-text">
          Keep learning to unlock advanced trading strategies and earn certificates
        </p>
      </Card>

      <Tabs defaultValue="lessons" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="lessons">Lessons</TabsTrigger>
          <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
          <TabsTrigger value="glossary">Glossary</TabsTrigger>
        </TabsList>

        <TabsContent value="lessons" className="mt-6">
          <div className="grid gap-4">
            {lessons.map((lesson) => {
              const Icon = lesson.icon;
              const isCompleted = completedLessons.has(lesson.id);
              
              return (
                <Card key={lesson.id} className="p-6 bg-card-bg border-border-gray hover:border-success-green/50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-lg ${isCompleted ? 'bg-success-green' : 'bg-border-gray/30'}`}>
                        <Icon className={`w-6 h-6 ${isCompleted ? 'text-white' : 'text-muted-text'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold">{lesson.title}</h3>
                          <Badge 
                            variant="outline" 
                            className={`${getDifficultyColor(lesson.difficulty)} text-white border-none`}
                          >
                            {lesson.difficulty}
                          </Badge>
                          {isCompleted && (
                            <Badge variant="outline" className="bg-success-green/10 text-success-green border-success-green">
                              <Award className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-text mb-3">{lesson.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-text">
                          <span>Duration: {lesson.duration}</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      onClick={() => {
                        setSelectedLesson(lesson.id);
                        if (!isCompleted) {
                          completeLesson(lesson.id);
                        }
                      }}
                      className={isCompleted ? "bg-success-green/20 text-success-green hover:bg-success-green/30" : "bg-success-green hover:bg-success-green/80"}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {isCompleted ? "Review" : "Start"}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="quizzes" className="mt-6">
          <div className="grid gap-4">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="p-6 bg-card-bg border-border-gray hover:border-success-green/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold">{quiz.title}</h3>
                      <Badge 
                        variant="outline" 
                        className={`${getDifficultyColor(quiz.difficulty)} text-white border-none`}
                      >
                        {quiz.difficulty}
                      </Badge>
                    </div>
                    <p className="text-muted-text">{quiz.questions} questions</p>
                  </div>
                  <Button className="bg-success-green hover:bg-success-green/80">
                    <Play className="w-4 h-4 mr-2" />
                    Take Quiz
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="glossary" className="mt-6">
          <div className="grid gap-4">
            <Card className="p-6 bg-card-bg border-border-gray">
              <h3 className="text-lg font-semibold mb-4">Cryptocurrency Glossary</h3>
              <div className="space-y-4">
                <div className="border-b border-border-gray pb-4">
                  <h4 className="font-medium mb-1">Blockchain</h4>
                  <p className="text-muted-text text-sm">A distributed ledger technology that maintains a continuously growing list of records, called blocks, linked and secured using cryptography.</p>
                </div>
                <div className="border-b border-border-gray pb-4">
                  <h4 className="font-medium mb-1">DeFi (Decentralized Finance)</h4>
                  <p className="text-muted-text text-sm">Financial services built on blockchain technology that operate without traditional intermediaries like banks.</p>
                </div>
                <div className="border-b border-border-gray pb-4">
                  <h4 className="font-medium mb-1">Smart Contract</h4>
                  <p className="text-muted-text text-sm">Self-executing contracts with terms directly written into code, automatically enforcing agreements without intermediaries.</p>
                </div>
                <div className="border-b border-border-gray pb-4">
                  <h4 className="font-medium mb-1">Liquidity</h4>
                  <p className="text-muted-text text-sm">The ease with which an asset can be converted into cash or other assets without significantly affecting its price.</p>
                </div>
                <div className="border-b border-border-gray pb-4">
                  <h4 className="font-medium mb-1">Market Cap</h4>
                  <p className="text-muted-text text-sm">The total value of a cryptocurrency, calculated by multiplying the current price by the total supply of coins.</p>
                </div>
                <div className="pb-4">
                  <h4 className="font-medium mb-1">Yield Farming</h4>
                  <p className="text-muted-text text-sm">The practice of lending or staking cryptocurrency to generate returns in the form of additional cryptocurrency.</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}