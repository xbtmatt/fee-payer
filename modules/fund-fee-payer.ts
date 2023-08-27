
import { Network, Provider, FungibleAssetClient, HexString, APTOS_COIN, FaucetClient, MaybeHexString } from "aptos";
import { getNetworkName } from "./utils";
import { NetworkName } from "@aptos-labs/wallet-adapter-react";


// Checks if the fee payer wallet is funded. If not, funds it.
export const fundFeePayer = async (network: Network, feePayerAddress: HexString) => {
    if (network == 'mainnet') {
        return;
    }
    const provider = new Provider(network);

    let isFunded = false;
    try {
        const accountResource = (await provider.getAccountResource(feePayerAddress, `0x1::coin::CoinStore<${APTOS_COIN}>`));
        const balance = Number((accountResource.data as any).coin.value);
        isFunded = balance >= 100_000_000;
    } catch (e) {
        const errorJSON = JSON.stringify(e) as any;
        if (errorJSON.errorCode == 'resource_not_found') {
            isFunded = false;
        }
    }

    if (!isFunded) {
        const faucetClient = new FaucetClient(network == 'local' ? 'http://0.0.0.0:8080' : `https://fullnode.${network}.aptoslabs.com`, network == 'local' ? 'http://0.0.0.0:8080' : `https://faucet.${network}.aptoslabs.com`);
        await faucetClient.fundAccount(feePayerAddress, 100_000_000);
    }
}

export default fundFeePayer;