import { NetworkName } from "@aptos-labs/wallet-adapter-core";
import { HexString, Network } from "aptos";

export function getNetworkName(network?: NetworkName): Network {
  switch (network?.toLowerCase()) {
    case NetworkName.Mainnet:
      return Network.MAINNET;
    case NetworkName.Testnet:
      return Network.TESTNET;
    case NetworkName.Devnet:
      return Network.DEVNET;
    default:
      return Network.TESTNET;
  }
}

export const truncateAddress = (address: HexString) => {
  var s;
  try {
    s = address.toString();
  } catch (e) {
    console.error(e);
  }
  return `${
    s!.substring(0, 6) + " ... " + s!.substring(s!.length - 4, s!.length)
  }`;
};
