"use client";
import { useState } from "react";
import styles from "./page.module.css";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";
import { WalletConnector } from "@aptos-labs/wallet-adapter-mui-design";
import FeePayer from "@/components/FeePayer";
import { Types } from "aptos";
import { PetraWallet } from "petra-plugin-wallet-adapter";

export default function Home() {
  const wallets = [new PetraWallet()];

  return (
    <AptosWalletAdapterProvider
      plugins={wallets}
      autoConnect={true}
      onError={(error) => {
        console.log("error", error);
      }}
    >
      <h1
        className={styles.title}
        style={{
          textAlign: "center",
          margin: "1ch auto",
          width: "100%",
        }}
      >
        Fee Payer Example
      </h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignContent: "center",
          textAlign: "center",
          margin: "2ch",
        }}
      >
        <WalletConnector />
      </div>
      <FeePayer />
    </AptosWalletAdapterProvider>
  );
}
