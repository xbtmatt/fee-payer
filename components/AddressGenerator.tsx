import { AptosAccount } from "aptos";

interface AddressGeneratorProps {
  address: string;
  setAddress: React.Dispatch<React.SetStateAction<string>>;
}

export const AddressGenerator: React.FC<AddressGeneratorProps> = ({
  address,
  setAddress,
}) => {
  const generateRandomAddress = () => {
    const account = new AptosAccount();
    setAddress(account.address().toString());
  };

  return (
    <div>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter or generate address"
        style={{
          display: "flex",
          width: "70ch",
          height: "4ch",
          lineHeight: "4ch",
          alignContent: "center",
          textAlign: "center",
          margin: "1.2ch auto",
          fontFamily: "Menlo",
        }}
      />
      <button
        onClick={generateRandomAddress}
        style={{
          display: "flex",
          margin: "auto",
          width: "30ch",
          marginTop: "1ch",
          marginBottom: "1ch",
          fontSize: "1rem",
          padding: "0.75ch",
          justifyContent: "center",
          alignContent: "center",
          textAlign: "center",
        }}
      >
        Generate random address
      </button>
    </div>
  );
};

export default AddressGenerator;
