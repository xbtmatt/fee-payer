import { HexString, Types } from "aptos";

export const createTransferCoinsPayload = (
  to: HexString,
  amount: number,
): Types.EntryFunctionPayload => {
  const payload: Types.TransactionPayload_EntryFunctionPayload = {
    type: "entry_function_payload",
    type_arguments: ["0x1::aptos_coin::AptosCoin"],
    function: `0x1::aptos_account::transfer_coins`,
    arguments: [to.toString(), amount],
  };
  return payload;
};
