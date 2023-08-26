import { NextApiRequest, NextApiResponse } from "next";
import {
  AptosAccount,
  BCS,
  HexString,
  Network,
  Provider,
  TxnBuilderTypes,
  Types,
} from "aptos";

const feePayerAccount = new AptosAccount(
  HexString.ensure(process.env.WALLET_PK!).toUint8Array(),
);

interface RequestBody {
  serializedData: string;
  network: string;
}

export const payFee = async (req: NextApiRequest, res: NextApiResponse) => {
  const { serializedData, network } = req.body as RequestBody;
  const provider = new Provider(network as Network);
  const { feePayerTxn, senderAuth } = deserializeData(serializedData);
  const response = await payForTx(
    provider,
    feePayerAccount,
    feePayerTxn,
    senderAuth,
  );

  res.status(200).send(response);
};

type TransactionInfo = {
  feePayerTxn: TxnBuilderTypes.FeePayerRawTransaction;
  senderAuth: TxnBuilderTypes.AccountAuthenticatorEd25519;
};

const deserializeData = (data: string): TransactionInfo => {
  const bytes = HexString.ensure(data).toUint8Array();
  const deserializer = new BCS.Deserializer(bytes);
  const feePayerTxn =
    TxnBuilderTypes.FeePayerRawTransaction.deserialize(deserializer);
  const senderAuth =
    TxnBuilderTypes.AccountAuthenticatorEd25519.deserialize(deserializer);

  return {
    feePayerTxn: feePayerTxn as TxnBuilderTypes.FeePayerRawTransaction,
    senderAuth: senderAuth as TxnBuilderTypes.AccountAuthenticatorEd25519,
  };
};

const payForTx = async (
  provider: Provider,
  feePayerAccount: AptosAccount,
  feePayerTxn: TxnBuilderTypes.FeePayerRawTransaction,
  senderAuth: TxnBuilderTypes.AccountAuthenticatorEd25519,
): Promise<Types.UserTransaction> => {
  const feePayerAuth = await provider.signMultiTransaction(
    feePayerAccount,
    feePayerTxn,
  );
  const response = await provider.submitFeePayerTransaction(
    feePayerTxn,
    senderAuth,
    feePayerAuth,
  );
  return response as Types.UserTransaction;
};

export default payFee;
