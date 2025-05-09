"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { BookOpen, Home, Wallet, Brain, Menu, X } from "lucide-react";

const ConnectButton = () => {
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected, address } = useAccount();

  const connector = connectors[0];

  const handleConnect = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect({ connector });
    }
  };

  return (
    <Button 
      className="max-w-fit" 
      onClick={handleConnect}
      variant="outline"
    >
      <Wallet className="mr-2 h-4 w-4" />
      {isConnected 
        ? `${address?.substring(0, 6)}...${address?.substring(address.length - 4)}`
        : "Connect Wallet"
      }
    </Button>
  );
};

export function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/", icon: <Home className="h-4 w-4 mr-2" /> },
    { name: "Education", href: "/education", icon: <BookOpen className="h-4 w-4 mr-2" /> },
    { name: "AI Chat", href: "/chat", icon: <Brain className="h-4 w-4 mr-2" /> },
  ];

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <Brain className="h-5 w-5" />
          <span>Decentralized Education</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:gap-5">
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button 
                  variant={isActive(item.href) ? "default" : "ghost"} 
                  className="flex items-center"
                >
                  {item.icon}
                  {item.name}
                </Button>
              </Link>
            ))}
          </div>
          <ConnectButton />
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t p-4 space-y-3">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button 
                variant={isActive(item.href) ? "default" : "ghost"} 
                className="w-full justify-start"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                {item.name}
              </Button>
            </Link>
          ))}
          <div className="pt-2 border-t">
            <ConnectButton />
          </div>
        </div>
      )}
    </nav>
  );
}
