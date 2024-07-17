import { FormEvent, useEffect, useState } from "react";
import { Spacer } from "@nextui-org/react";
import { PcConfig, AiResponseJSON } from "@/types";
import { fetchAiResponse, lookupManualUrl } from "../app/actions";
import type { GenerateContentResult } from "@google/generative-ai";

export default function AiSuggestion(pcBuilder: PcConfig) {
  const [aiResponse, setAiResponse] = useState<AiResponseJSON>();
  const [manualUrl, setManualUrl] = useState<URL>();

  useEffect(() => {
    if (!pcBuilder.case) {
      return;
    }
    lookupManualUrl(pcBuilder.case.name).then((url) => {
      setManualUrl(url);
    });
  }, [pcBuilder.case]);
  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const response = await fetchAiResponse(formData, pcBuilder);
    console.log("handleSubmit:", response);
    setAiResponse(response);
  }
  return (
    <>
      {manualUrl ? (
        <a href={manualUrl.href} target="_blank" rel="noopener noreferrer">
          Case manual found. Click here to download.
        </a>
      ) : (
        "Case manual not found."
      )}

      <form onSubmit={handleSubmit}>
        <label htmlFor="file">Upload File:</label>
        <input type="file" id="file" name="file" />
        <button type="submit">Generate AI Suggestion</button>
      </form>

      {aiResponse ? (
        <div>
          <h2>AI Suggestion</h2>
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
          <p>{aiResponse.reasoning}</p>
        </div>
      ) : (
        "Awaiting AI Suggestion. "
      )}
    </>
  );
}
