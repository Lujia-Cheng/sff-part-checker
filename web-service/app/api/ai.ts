"use server";
import type { NextApiRequest, NextApiResponse } from "next";
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
import { mkdir, writeFile } from "fs/promises";
import { join } from "path";
import { createCanvas } from "canvas";
import pdfjsLib from "pdfjs-dist";
import {
  existsSync,
  mkdirSync,
  readFileSync,
  unlinkSync,
  write,
  writeFileSync,
} from "fs";
import { RenderParameters } from "pdfjs-dist/types/src/display/api";

type ResData = {
  message: string; // FIXME check gemini doc
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResData>
) {
  const { file, parts }: { file: File; parts: string } = req.body;
  if (!file || !parts) {
    res.status(400).json({ message: "file and parts are required" });
    return;
  }



  // todo pass to google gemini api? check if vercel makes it easy @link https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai#google-generative-ai-provider

  res.status(200).json({ message: "success" }); // todo
}
