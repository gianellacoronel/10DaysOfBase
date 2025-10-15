"use client";
import { useState, useEffect } from "react";
import styles from "./page.module.css";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { useAccount, useBalance, useSignMessage } from "wagmi";

import { useGreeter } from "@/src/hooks/useGreeter";

export default function Home() {
  const { address, isConnected, chain } = useAccount();
  const { data: balance } = useBalance({ address });
  const {
    signMessage,
    data: signature,
    isPending: isSignPending,
  } = useSignMessage();

  const {
    confirmError,
    greeting,
    isConfirmed,
    isConfirming,
    isWritePending,
    readError,
    refetchGreeting,
    setGreeting,
    writeError,
    hash,
  } = useGreeter();

  const [message, setMessage] = useState("");
  const [newGreeting, setNewGreeting] = useState("");
  const isCorrectNetwork = chain?.id === 84532;

  useEffect(() => {
    if (isConfirmed) {
      refetchGreeting();
      setNewGreeting("");
    }
  }, [isConfirmed, refetchGreeting]);

  const handleSetGreeting = () => {
    if (newGreeting.trim()) {
      setGreeting(newGreeting);
    }
  };

  const handleSignMessage = () => {
    signMessage({ message });
  };

  return (
    <div className={styles.container}>
      <header className={styles.headerWrapper}>
        <Wallet />
      </header>

      <div className={styles.content}>
        <h1 className={styles.title}> Base Frontend Day 2</h1>

        {isConnected && address && (
          <div className={styles.section}>
            {!isCorrectNetwork && (
              <div className={styles.errorMessage}>
                <p>
                  Wrong Network! Please switch to Base Sepolia in your wallet.
                </p>
                <p className={styles.networkInfo}>
                  Current: {chain?.name || "Unknown"} | Required: Base Sepolia
                  (Chain 84532)
                </p>
              </div>
            )}
            {/* Balance Display */}
            <div className={styles.card}>
              <p className={styles.label}>Connected Address:</p>
              <p className={styles.address}>{address}</p>

              {balance && (
                <div className={styles.balanceSection}>
                  <p className={styles.label}>ETH Balance:</p>
                  <p className={styles.balance}>
                    {parseFloat(balance.formatted).toFixed(4)} {balance.symbol}
                  </p>
                </div>
              )}
            </div>
            {/* Message Signing */}
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Sign a Message (Gasless)</h2>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className={styles.input}
                placeholder="Hello from Base Sepolia!"
              />
              <button
                onClick={handleSignMessage}
                disabled={!message || isSignPending}
                className={`${styles.signButton} ${
                  !message || isSignPending ? styles.buttonDisabled : ""
                }`}
              >
                {isSignPending ? "Signing..." : "Sign Message"}
              </button>

              {signature && (
                <div className={styles.signatureSection}>
                  <p className={styles.label}>Signature:</p>
                  <p className={styles.signature}>{signature}</p>
                </div>
              )}

              <div className={styles.card}>
                <div className={styles.greetinDisplay}>
                  <h2 className={styles.cardTitle}>Greeter Contract</h2>
                  <p className={styles.label}>Current Greeting:</p>
                  <p className={styles.currentGreeting}>
                    {greeting || "Loading..."}
                  </p>
                </div>

                <div className={styles.updateSection}>
                  <p className={styles.label}>Update Greeting:</p>
                  <input
                    type="text"
                    value={newGreeting}
                    onChange={(e) => setNewGreeting(e.target.value)}
                    className={styles.input}
                    placeholder="Enter new greeting"
                  />
                  <button
                    onClick={handleSetGreeting}
                    disabled={
                      isWritePending || isConfirming || !newGreeting.trim()
                    }
                    className={styles.signButton}
                  >
                    {isWritePending
                      ? "Sending Transaction..."
                      : isConfirming
                      ? "Confirming..."
                      : "Update Greeting"}
                  </button>
                </div>

                {hash && (
                  <div className={styles.transactionSection}>
                    <p className={styles.label}>Transaction Hash:</p>
                    <a
                      href={`https://sepolia.basescan.org/tx/${hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.txLink}
                    >
                      {hash}
                    </a>
                  </div>
                )}
                {isConfirmed && (
                  <div className={styles.successMessage}>
                    <p>✅ Greeting updated successfully!</p>
                  </div>
                )}

                {(writeError || confirmError) && (
                  <div className={styles.errorMessage}>
                    <p>
                      ❌ Error: {writeError?.message || confirmError?.message}
                    </p>
                  </div>
                )}

                {readError && (
                  <div className={styles.errorMessage}>
                    <p>
                      ❌ Failed to read contract. Chech contract address and try
                      again
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {!isConnected && (
          <p className={styles.connectPrompt}>
            👆🏼 Connect your wallet to get started!
          </p>
        )}
      </div>
    </div>
  );
}
