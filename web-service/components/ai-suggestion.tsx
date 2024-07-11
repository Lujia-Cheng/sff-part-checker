import { useEffect, useState } from "react";
import { Spacer } from "@nextui-org/react";
import { PcConfig, AiResponseJSON } from "@/types";
import { CognitiveServicesCredentials } from "ms-rest-azure";
import WebSearchAPIClient from "azure-cognitiveservices-websearch";
import {
  GenerateContentResponse,
  GenerateContentResult,
  GoogleGenerativeAI,
} from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { SFF_SYSTEM_PROMPT } from "@/constants";

export default function AiSuggestion(pcBuilder: PcConfig) {
  const [aiResponse, setAiResponse] = useState<AiResponseJSON | null>(null);
  const apiKey = process.env.GEMINI_API_KEY || "";
  const genAI = new GoogleGenerativeAI(apiKey);
  const fileManager = new GoogleAIFileManager(apiKey);
  // Instantiate the client
  let credentials = new CognitiveServicesCredentials(
    process.env.AZURE_COGNITIVE_SERVICES_KEY || ""
  );
  let webSearchApiClient = new WebSearchAPIClient(credentials);

  /**
   * Fetches the AI response for the given PC Builder configuration.
   * todo - check api leak and move to server if necessary
   *
   * @param pcBuilder
   * @returns
   */
  async function fetchAiResponse(pcBuilder: PcConfig): Promise<AiResponseJSON> {
    const caseName = pcBuilder.case?.name;
    if (!caseName) {
      throw new Error("Case name is required to fetch AI response.");
    }
    const manualUrl = await searchBingForManualUrl(caseName);
    if (!manualUrl) {
      throw new Error("Manual URL not found.");
    }

    const result = await submitToGemini(pcBuilder, manualUrl);

    return result;
  }

  /**
   * @link https://learn.microsoft.com/en-us/bing/search-apis/bing-web-search/quickstarts/sdk/web-search-client-library-javascript
   * @param caseName
   * @returns
   */
  async function searchBingForManualUrl(caseName: string): Promise<URL | null> {
    webSearchApiClient.web
      .search(`${caseName} manual filetype:pdf`)
      .then((result) => {
        // assume the first result is the manual
        return result.webPages?.value[0].url || "";
      })
      .catch((err) => {
        throw err;
      });
    return null;
  }

  async function submitToGemini(
    pcBuilder: PcConfig,
    manualUrl: URL
  ): Promise<GenerateContentResult> {
    // Fetch the PDF as a Blob
    const response = await fetch(manualUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch the file: ${response.statusText}`);
    }
    const pdfBlob = await response.blob;
    // download the PDF to local storage

    // todo - upload the PDF to the server @link https://ai.google.dev/gemini-api/docs/prompting_with_media?lang=node#supported_file_formats

    const files = [await uploadToGemini(pdfBlob, "application/pdf")];

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro",
      systemInstruction: SFF_SYSTEM_PROMPT,
    });
    const chatSession = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              fileData: {
                mimeType: files[0].mimeType,
                fileUri: files[0].uri,
              },
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage("");

    console.log("Upload successful:", result);
    return result;
  }
  /**
   * Uploads the given file to Gemini.
   *
   * See https://ai.google.dev/gemini-api/docs/prompting_with_media
   */
  async function uploadToGemini(path, mimeType) {
    const uploadResult = await fileManager.uploadFile(path, {
      mimeType,
      displayName: path,
    });
    const file = uploadResult.file;
    console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
    return file;
  }

  // Fetch AI response when the PC Builder configuration changes
  useEffect(() => {
    if (
      !pcBuilder.case ||
      !pcBuilder.cooler ||
      !pcBuilder.gpu ||
      !pcBuilder.motherboard ||
      !pcBuilder.psu
    ) {
      return;
    }
    fetchAiResponse(pcBuilder).then((response) =>{
      console.log("response in useEffect:", response);
      setAiResponse(response)});
  }, [pcBuilder]);

  return (
    <>
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
        "insufficient parts to generate AI suggestion. You need to provide at least a case, cooler, gpu, motherboard, and psu."
      )}
    </>
  );
}
