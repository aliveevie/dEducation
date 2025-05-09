"use client";

import { EducationHub } from "@/components/EducationHub";
import { Button } from "@/components/ui/button";
import { useAccount, useConnect, useDisconnect } from "wagmi";

const ConnectButton = () => {
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { isConnected } = useAccount();

  const connector = connectors[0];

  const handleConnect = () => {
    if (isConnected) {
      disconnect();
    } else {
      connect({ connector });
    }
  };

  return (
    <Button className="max-w-fit" onClick={handleConnect}>
      {isConnected ? "Disconnect" : "Connect Wallet"}
    </Button>
  );
};

export default function EducationPage() {
  const { isConnected } = useAccount();
  
  return (
    <div className="h-screen w-full overflow-y-auto grid grid-rows-[auto_1fr_auto] min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <header className="flex justify-between items-center w-full">
        <h1 className="text-2xl font-bold">Decentralized Education Platform</h1>
        <ConnectButton />
      </header>
      
      <main className="w-full">
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <h2 className="text-xl font-semibold">Welcome to the Decentralized Education Platform</h2>
            <p className="text-gray-600 max-w-md">
              Connect your wallet to access our Web3 courses, blockchain tutorials, and more.
            </p>
            <ConnectButton />
          </div>
        ) : (
          <EducationHub />
        )}
      </main>
      
      <footer className="text-center text-gray-500 text-sm">
        © 2025 Decentralized Education Platform - Powered by Gaia
      </footer>
    </div>
  );
}
