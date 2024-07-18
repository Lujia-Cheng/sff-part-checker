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

  useEffect(() => {
    setReadyToSubmit(Boolean(parts && parts.case && parts.cooler));
  }, [parts]);

  // const [manualUrl, setManualUrl] = useState<URL>();
  const [file, changeFile] = useState<File>();

  async function onChange(e: FormEvent<HTMLInputElement>) {
    const files = e.currentTarget.files;
    if (files) {
      changeFile(files[0]);
    }
  }
  async function submit() {
    if (!file) {
      console.error("No file selected");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("parts", JSON.stringify(parts));
    const response = upload(formData);
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
      <input id="fileInput" type="file" onChange={onChange} />
      
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
