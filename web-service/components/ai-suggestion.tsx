import { FormEvent, useEffect, useState } from "react";
import { Spacer } from "@nextui-org/react";
import { PcConfig, AiResponseJSON } from "@/types";
import { upload, lookupManualUrl } from "../app/actions";
import type { GenerateContentResult } from "@google/generative-ai";

export default function AiSuggestion({ parts }: { parts: PcConfig }) {
  const [aiResponse, setAiResponse] = useState<AiResponseJSON>();
  const [manualUrl, setManualUrl] = useState<URL>();

  useEffect(() => {
    if (!parts.case || !parts.case.name) {
      return;
    }
    lookupManualUrl(parts.case.name).then((url) => {
      setManualUrl(url);
    });
  }, [parts.case]);

  return (
    <>
      {manualUrl ? (
        <a href={manualUrl.href} target="_blank" rel="noopener noreferrer">
          Case manual found. Click here to download.
        </a>
      ) : (
        "Case manual not found."
      )}

      <form action={upload}>
        <input type="file" name="file" />
        <input type="submit" value="Upload" />
      </form>

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
        "Awaiting AI Suggestion. "
      )}
    </>
  );
}
