"use server";

import { SYSTEM_PROMPT } from "@/constants";

import {
  FunctionDeclarationSchemaType,
  GenerationConfig,
  GoogleGenerativeAI,
} from "@google/generative-ai";
import {
  FileMetadataResponse,
  GoogleAIFileManager,
} from "@google/generative-ai/server";

import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join } from "path";
import { URL } from "url";
import { rm } from "fs/promises";

const apiKey = process.env.GOOGLE_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  systemInstruction: SYSTEM_PROMPT,
});

const generationConfig: GenerationConfig = {
  responseMimeType: "application/json",
  responseSchema: {
    type: FunctionDeclarationSchemaType.OBJECT,
    properties: {
      compatibility: {
        type: FunctionDeclarationSchemaType.BOOLEAN,
        properties: {},
      },
      rationale: {
        type: FunctionDeclarationSchemaType.STRING,
        properties: {},
      },
    },
  },
};

export async function upload(data: FormData) {
  "use server";
  const files = data.getAll("files") as File[];
  const parts = data.get("parts") as string;
  if (!files.length || !parts) {
    throw new Error("files and part list are required");
  }

  const tmpDir = "tmp";
  if (!existsSync(tmpDir)) {
    mkdirSync(tmpDir, { recursive: true });
  }

  let geminiUploadResponses: FileMetadataResponse[] = [];
  // Process each file
  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes); // todo - this will work for now, temporary solution to write file to disk

    const filePath = join(tmpDir, file.name);
    writeFileSync(filePath, buffer);
    const fileRes = await uploadToGemini(filePath, file.type);
    geminiUploadResponses.push(fileRes);
  }

  // Some files have a processing delay. Wait for them to be ready.
  await waitForFilesActive(geminiUploadResponses);

  // delete the file after uploading
  await rm(tmpDir, { recursive: true });

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: geminiUploadResponses.map((fileRes) => ({
          fileData: {
            mimeType: fileRes.mimeType,
            fileUri: fileRes.uri,
          },
        })), // populate the history with the uploaded files
      },
    ],
  });

  const result = await chatSession.sendMessage(parts);

  console.log("AI response:", result.response.text());
  return result.response.text();
}

/**
 * Uploads the given file to Gemini.
 *
 * See https://ai.google.dev/gemini-api/docs/prompting_with_media
 */
async function uploadToGemini(
  path: string,
  mimeType: string
): Promise<FileMetadataResponse> {
  const uploadResult = await fileManager.uploadFile(path, {
    mimeType,
    displayName: path,
  });
  const file = uploadResult.file;
  console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
  return file;
}

/**
 * Waits for the given files to be active.
 *
 * Some files uploaded to the Gemini API need to be processed before they can
 * be used as prompt inputs. The status can be seen by querying the file's
 * "state" field.
 *
 * This implementation uses a simple blocking polling loop. Production code
 * should probably employ a more sophisticated approach.
 */
async function waitForFilesActive(files: FileMetadataResponse[]) {
  console.log("Waiting for file processing...");
  for (const name of files.map((file) => file.name)) {
    let file = await fileManager.getFile(name);
    while (file.state === "PROCESSING") {
      process.stdout.write(".");
      await new Promise((resolve) => setTimeout(resolve, 10_000));
      file = await fileManager.getFile(name);
    }
    if (file.state !== "ACTIVE") {
      throw Error(`File ${file.name} failed to process`);
    }
  }
  console.log("...all files ready\n");
}

/**
 * Assumes the manual is a PDF file and is the first search result from Google Custom Search.
 *
 * @link https://developers.google.com/custom-search/docs/overview
 * @param caseName
 * @returns
 */
export async function lookupManualUrl(caseName: string): Promise<string> {
  const query = `${caseName} manual filetype:pdf`;

  const response = await fetch(
    `https://www.googleapis.com/customsearch/v1?q=${query}&key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_CSE_ID}`
  ); // fixme - postman return result 0
  //  todo - check response JSON @link https://developers.google.com/custom-search/v1/reference/rest/v1/Search
  if (!response.ok) {
    throw new Error(`Failed to fetch search results: ${response.statusText}`);
  }
  const data = await response.json();
  if (!data.items || data.items.length === 0) {
    throw new Error("No search results found.");
  }
  return data.items[0].link;
}
