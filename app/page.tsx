"use client";

import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAccount } from "wagmi";
import Link from "next/link";
import { BookOpen, Brain, GraduationCap, ArrowRight } from "lucide-react";

export default function Home() {
  const { isConnected } = useAccount();

  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
      title: "Web3 Education",
      description: "Learn blockchain, cryptocurrency, and decentralized technologies through structured courses."
    },
    {
      icon: <Brain className="h-8 w-8 text-purple-500" />,
      title: "AI-Powered Learning",
      description: "Get personalized assistance and explanations from our Gaia-powered AI assistant."
    },
    {
      icon: <GraduationCap className="h-8 w-8 text-green-500" />,
      title: "Decentralized Credentials",
      description: "Earn verifiable credentials stored on-chain as you complete courses and assessments."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 px-4 md:px-6 bg-gradient-to-b from-background to-gray-50 dark:from-background dark:to-gray-900/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Learn Web3 & Blockchain <span className="text-blue-600 dark:text-blue-400">Skills</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Master the technologies of the decentralized future through our interactive courses and AI-powered learning platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/education">
                  <Button size="lg" className="gap-2">
                    Explore Courses <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/chat">
                  <Button variant="outline" size="lg" className="gap-2">
                    Try AI Assistant <Brain className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-md aspect-square">
                <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="relative bg-white dark:bg-gray-800 border rounded-lg shadow-lg p-6 h-full flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Brain className="h-16 w-16 mx-auto text-blue-500" />
                    <h3 className="text-xl font-medium">Decentralized Education</h3>
                    <p className="text-gray-500 dark:text-gray-400">Powered by Gaia & Web3</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 md:px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Platform Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-md">
                <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
                  <div className="p-3 rounded-full bg-gray-100 dark:bg-gray-800">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-medium">{feature.title}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-6 bg-blue-50 dark:bg-blue-950/30">
        <div className="container mx-auto max-w-4xl text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Start Learning?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Connect your wallet and gain access to our comprehensive library of Web3 courses and resources.
          </p>
          <div className="flex justify-center mt-6">
            <Link href="/education">
              <Button size="lg" className="gap-2">
                Browse Courses <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 md:px-6 border-t">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              <span className="font-semibold">Decentralized Education</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2025 Decentralized Education Platform - Powered by Gaia
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
