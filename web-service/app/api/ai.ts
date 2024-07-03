"use server";
import type { NextApiRequest, NextApiResponse } from "next";
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/files");// fixme

type ResData = {
  message: string; // FIXME check gemini doc
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResData>
) {
  const { prompt, history } = req.body.prompt;

  // todo pass to google gemini api? check if vercel makes it easy @link https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai#google-generative-ai-provider

  res.status(200).json({ message: "success" }); // todo
}
