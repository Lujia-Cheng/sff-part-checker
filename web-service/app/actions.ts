"use server";

import { SFF_SYSTEM_PROMPT } from "@/constants";
import { PcConfig, AiResponseJSON } from "@/types";
import {
  GenerateContentResult,
  GoogleGenerativeAI,
} from "@google/generative-ai";
import {
  FileMetadataResponse,
  GoogleAIFileManager,
} from "@google/generative-ai/server";
import { URL } from "url";
import { writeFile } from "fs/promises";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

const apiKey = process.env.GOOGLE_API_KEY || "";
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  systemInstruction: SFF_SYSTEM_PROMPT,
});

const generationConfig = {
  responseMimeType: "application/json",
};

/**
 * Fetches the AI response for the given PC Builder configuration.
 * @param formData
 * @param pcBuilder
 * @returns
 */

// export async function fetchAiResponse(
//   formData: FormData,
//   pcBuilder: PcConfig
// ): Promise<AiResponseJSON> {
//   const manual = formData.get("file") as File;
//   console.log("manual received:", manual);

//   if (!manual) {
//     throw new Error("No file uploaded.");
//   }
//   // todo - store file to local then use local path to for AiFileManager
//   const localPath = await storeFileLocally(manual);

//   // localPath only take string which point to the file on local machine
//   const files = [await uploadToGemini(localPath, "application/pdf")];

//   // Some files have a processing delay. Wait for them to be ready.
//   await waitForFilesActive(files);

//   const chatSession = model.startChat({
//     generationConfig,
//     history: [
//       {
//         role: "user",
//         parts: [
//           {
//             fileData: {
//               mimeType: files[0].mimeType,
//               fileUri: files[0].uri,
//             },
//           },
//         ],
//       },
//     ],
//   });
//   const result = await chatSession.sendMessage(JSON.stringify(pcBuilder));

//   // const result = await model.generateContent([JSON.stringify(pcBuilder), pdf]);

//   return JSON.parse(await result.response.text()) as AiResponseJSON;
// }

export async function upload(data: FormData) {
  "use server";
  const file = data.get("file") as File;
  if (!file) {
    return;
  }
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const localPath = join(file.name);
  await writeFile(localPath, buffer);
  const fileResponse = await uploadToGemini(localPath, file.type);// todo - updated api key's permission, check if it works
  removeFile(localPath);
}

/**
 * Stores the given file locally.
 * @param file
 * @returns
 */

/**
 * Converts a File object to a GoogleGenerativeAI.Part object.
 * @link https://ai.google.dev/gemini-api/docs/get-started/tutorial?lang=web#generate-text-from-text-and-image-input
 */
// async function fileToGenerativePart(file) {
//   const base64EncodedDataPromise = new Promise((resolve) => {
//     const reader = new FileReader();
//     reader.onloadend = () => resolve(reader.result.split(",")[1]);
//     reader.readAsDataURL(file);
//   });
//   return {
//     inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
//   };
// }
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
export async function lookupManualUrl(caseName: string): Promise<URL> {
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
  return new URL(data.items[0].link);
}
function removeFile(localPath: string) {
  throw new Error("Function not implemented.");
}
