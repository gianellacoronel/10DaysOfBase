"use client";
import { ReactNode } from "react";
import { base } from "wagmi/chains";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "./wagmi.config";
import "@coinbase/onchainkit/styles.css";

const queryClient = new QueryClient();

export function RootProvider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider
      config={wagmiConfig}
      // apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      // chain={base}
      // config={{
      //   appearance: {
      //     mode: "auto",
      //   },
      //   wallet: {
      //     display: "modal",
      //     preference: "all",
      //   },
      // }}
    >
      <QueryClientProvider client={queryClient}></QueryClientProvider>
      <OnchainKitProvider
        apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
        chain={base}
        config={{
          appearance: {
            mode: "auto",
          },
          wallet: {
            display: "modal",
            preference: "all",
          },
        }}
      >
        {children}
      </OnchainKitProvider>
    </WagmiProvider>
  );
}
