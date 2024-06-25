const express = require("express");
const cors = require("cors");
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

const app = express();
app.use(cors());
const port = 3000;

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Simple pass-through API
app.get("/api/gemini", (req, res) => {
  // TODO - Find a way to
  // https://ai.google.dev/gemini-api/docs/get-started/tutorial?lang=node#multi-turn-conversations-chat
  const chatSession = model.startChat(req);
  const result = chatSession.sendMessage("INSERT_INPUT_HERE");
  res.send(result);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
