// FeePayer.tsx

import { createTransferCoinsPayload } from "@/modules/payloads";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import {
  AptosAccount,
  BCS,
  HexString,
  Network,
  Provider,
  TxnBuilderTypes,
  Types,
} from "aptos";
import React, { useState } from "react";
import AddressGenerator from "./AddressGenerator";
import AmountInput from "./AmountInput";
import { getNetworkName, truncateAddress } from "@/modules/utils";
import JsonViewer from "./JsonViewer";

interface FeePayerProps extends React.HTMLProps<HTMLDivElement> { }

const FeePayer: React.FC<FeePayerProps> = ({ ...divProps }) => {
  const { network } = useWallet();

  const [response, setResponse] = useState<Types.UserTransaction>();
  const [toAddress, setToAddress] = useState<string>(
    new AptosAccount().address().toString(),
  );
  const [coinAmount, setCoinAmount] = useState<number>(1_000_000); // 0.01 APT
  const { wallets, wallet, account } = useWallet();
  const provider = new Provider(getNetworkName(network?.name));

  const handleClick = async (to: HexString, amount: number) => {
    if (
      !wallet ||
      wallet.name.toLowerCase() != "petra" ||
      account === null ||
      account?.address === null
    ) {
      return;
    }

    const payload = createTransferCoinsPayload(to, amount);
    const feePayerTransaction = await provider.generateFeePayerTransaction(
      account?.address,
      payload,
      process.env.NEXT_PUBLIC_WALLET_ADDRESS!,
    );

    const petra = (window as any).petra;
    const publicKey = HexString.ensure(account.publicKey as string);
    const signedTransaction =
      await petra.signMultiAgentTransaction(feePayerTransaction);
    const signedTransactionHexString = HexString.ensure(signedTransaction);
    const senderAuth = new TxnBuilderTypes.AccountAuthenticatorEd25519(
      new TxnBuilderTypes.Ed25519PublicKey(publicKey.toUint8Array()),
      new TxnBuilderTypes.Ed25519Signature(
        signedTransactionHexString.toUint8Array(),
      ),
    );

    const serializer = new BCS.Serializer();
    feePayerTransaction.serialize(serializer);
    senderAuth.serialize(serializer);
    const serializedBytes = serializer.getBytes();
    const hexData = HexString.fromUint8Array(serializedBytes).toString();

    try {
      const response = await fetch("/api/pay-fee", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ serializedData: hexData, network: getNetworkName(network?.name) as string }),
      });

      const data = await response.json();
      setResponse(data as Types.UserTransaction);
    } catch (error) {
      setResponse(undefined);
    }
  };

  return (
    <div {...divProps}>
      <h3
        style={{
          textAlign: "center",
          margin: "1.5ch auto",
        }}
      >
        {`Network: ${getNetworkName(network?.name).toUpperCase()}`}
      </h3>
      <AddressGenerator address={toAddress} setAddress={setToAddress} />
      <AmountInput amount={coinAmount} setAmount={setCoinAmount} />
      <button
        onClick={() => handleClick(HexString.ensure(toAddress), coinAmount)}
        style={{
          display: "flex",
          margin: "auto",
          fontSize: "1rem",
          width: "30ch",
          padding: "0.75ch",
          marginTop: "1ch",
          textAlign: "center",
          justifyContent: "center",
        }}
      >
        {`Send ${coinAmount / Math.pow(10, 8)} APT to`}&nbsp;
        <span
          style={{
            color: "lightgreen",
          }}
        >
          {truncateAddress(HexString.ensure(toAddress))}
        </span>
      </button>
      {response ? (
        <>
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            margin: "1ch auto",
            padding: "3ch",
          }}>
            <JsonViewer data={response} />
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://explorer.aptoslabs.com/txn/${response.hash
                }?network=${getNetworkName(network?.name)}`}
              style={{ color: "royalblue", textDecoration: "underline" }}
            >
              View in Explorer
            </a>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default FeePayer;
