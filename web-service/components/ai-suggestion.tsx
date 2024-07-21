"use client";
import { FormEvent, useEffect, useState } from "react";
import { Spacer, Button } from "@nextui-org/react";
import { PcConfig } from "@/types";
import { upload } from "../app/actions";

export default function AiSuggestion({
  parts,
}: {
  parts: PcConfig | undefined;
}) {
  const [aiResponse, setAiResponse] = useState<any>();
  const [loading, setLoading] = useState(false);
  const [readyToSubmit, setReadyToSubmit] = useState(false);
  // const [manualUrl, setManualUrl] = useState<URL>();
  const [files, changeFiles] = useState<File[]>();

  useEffect(() => {
    setReadyToSubmit(Boolean(parts && parts.case && parts.cooler));
  }, [parts]);

  async function onChange(e: FormEvent<HTMLInputElement>) {
    const uploadedFiles = e.currentTarget.files;
    if (uploadedFiles) {
      changeFiles(Array.from(uploadedFiles));
    }
  }
  async function submit() {
    if (!files) {
      console.error("No file selected");
      return;
    }
    if (!parts) {
      console.error("No parts selected");
      return;
    }

    const formData = new FormData();
    if (files) {
      files.forEach((file) => {
        formData.append("files", file);
      });
    }
    const simplifiedParts = simplifyParts(parts);
    formData.append("parts", JSON.stringify(simplifiedParts));
    const response = upload(formData);
    setAiResponse(response);
  }
  
  function simplifyParts({
    case: { name: caseName, type, external_volume },
    cooler: { name: coolerName, size, height: coolerHeight },
    gpu: { name: gpuName, chipset, length, width, height: gpuHeight },
    motherboard: { name: motherboardName, form_factor },
    psu: { name: psuName, type: psuType },
  }: PcConfig) {
    return {
      case: { caseName, type, external_volume },
      cooler: { name: coolerName, size, coolerHeight },
      gpu: { name: gpuName, chipset, length, width, gpuHeight },
      motherboard: { name: motherboardName, form_factor },
      psu: { name: psuName, type: psuType },
    };
  }

  return (
    <>
      {/* {manualUrl ? (
        <a href={manualUrl.href} target="_blank" rel="noopener noreferrer">
          Case manual found. Click here to download.
        </a>
      ) : (
        "Case manual not found."
      )} */}
      {/* upload file ui */}

      <label htmlFor="fileInput">Upload File:</label>
      <input id="fileInput" type="file" multiple onChange={onChange} />

      <Button onClick={submit} aria-label="Upload" isDisabled={!readyToSubmit}>
        Upload
      </Button>
      <Spacer y={1} />
      {aiResponse ? (
        <>
          {JSON.stringify(aiResponse)}
          {/* <h2>AI Suggestion</h2>
          <p>
            {aiResponse.compatible
              ? "This build is compatible."
              : "This build is not compatible."}
          </p>

          <Spacer y={1} />
          <h3>Conflicting Parts</h3>
          <ul>
            {aiResponse.conflictingParts.map((part) => (
              <li key={part}>{part}</li>
            ))}
          </ul>
          <p>{aiResponse.reasoning}</p> */}
        </>
      ) : (
        "Awaiting AI Suggestion..."
      )}
    </>
  );
}
