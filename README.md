# fee-payer
A dapp example of using a sponsored transaction on the Aptos blockchain.

## Explanation

This dapp example demonstrates how to facilitate a sponsored transaction in a client/server environment, where the server has a "server-side" (referred to as server-side here although technically this is a serverless endpoint) wallet that pays the gas fees for a simple transaction (APT coin transfer to a random address).

The wallet private key is stored in an environment variable, either in `.env.local` as `WALLET_PK` in a local environment, or in staging or production, you can store it in Vercel's hidden environment variables.

Since Vercel's serverless APIs do not expose their internal code, we can directly sign off on paying the fees with the server-side wallet.

This is not meant to be a particularly secure example- you will likely want to configure additional security measures to ensure a user cannot abuse the system. It is merely meant to demonstrate the client/server interaction with the sponsored transaction model.

## The process

1. The user signs off on the transaction. Currently only Petra wallet is supported because it is the only wallet with the ability to sign a multi agent transaction.
2. The data is serialized into a BCS-serialized hex string and sent to the API endpoint
3. The serverless API (in `pages/api/pay-fee.ts`) does the following:

    - Receives the hex string

    - Deserializes it into the raw fee payer transaction and the sender account authenticator, which is its public key and the signed transaction

    - Uses the server-side wallet to sign the raw fee payer transaction to create the fee payer account authenticator

    - Combines the two account authenticators and the raw transaction and submits it to the network

    - Waits for the response and prints it out as JSON data

You can view an example deployment [here](https://fee-payer.vercel.app/)