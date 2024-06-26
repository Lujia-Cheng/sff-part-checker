import type { NextApiRequest, NextApiResponse } from "next";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
const google = createGoogleGenerativeAI();

type ResData = {
  message: string; // FIXME check gemini doc
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResData>
) {
  const model = google("models/gemini-1.5-pro-latest");
  const { prompt, history } = req.body.prompt;

  // todo pass to google gemini api? check if vercel makes it easy @link https://sdk.vercel.ai/providers/ai-sdk-providers/google-generative-ai#google-generative-ai-provider

  res.status(200).json({ message: "success" }); // todo
}
