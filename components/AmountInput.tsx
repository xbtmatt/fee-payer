import React from "react";

interface AmountInputProps {
  amount: number;
  setAmount: React.Dispatch<React.SetStateAction<number>>;
}

const AmountInput: React.FC<AmountInputProps> = ({ amount, setAmount }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Convert the displayed value back to the real value for storage
    const realValue = parseFloat(e.target.value) * Math.pow(10, 8);
    setAmount(realValue);
  };

  // Calculate displayed value
  const displayedValue = (amount / Math.pow(10, 8)).toString();

  return (
    <div style={{ width: "100%" }}>
      <input
        type="number"
        value={displayedValue}
        onChange={handleInputChange}
        step=".1"
        style={{
          display: "flex",
          width: "7ch",
          marginTop: "4ch",
          fontSize: "1rem",
          margin: "auto",
          textAlign: "center",
          alignContent: "center",
          justifyContent: "center",
        }}
      />
    </div>
  );
};

export default AmountInput;
