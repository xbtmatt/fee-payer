import React from "react";
import dynamic from "next/dynamic";

// Dynamically import react-json-view with SSR turned off
const ReactJson = dynamic(() => import("react-json-view"), { ssr: false });

interface JsonViewerProps {
  data: any;
}

const JsonViewer: React.FC<JsonViewerProps> = ({ data }) => {
  return (
    <ReactJson
      displayObjectSize={false}
      displayDataTypes={false}
      name={null}
      theme={"isotope"}
      src={data}
    />
  );
};

export default JsonViewer;
