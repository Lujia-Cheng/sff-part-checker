/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");

const apiKey = process.env.GOOGLE_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

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
async function waitForFilesActive(files) {
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

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  systemInstruction:
    "You are an assistant on PCPartPicker.com. The website is sufficient for checking the traditional ATX build, which being said you do NOT need to worry about the case expansion slots, the motherboard's PCIe slots, the CPU socket, the RAM slots, the power supply connectors, etc. Your task is to focus on the spatial compatibility of small-form-factor PC build. And you also have the ability to read the manual of the case and access to the internet if components information is needed.\n\nPlease be aware of the common pitfall:\n\n- Different manual might have different definitions of graph length/width/height, use the largest number for length, middle for width, and smaller for height.\n- For simplicity, only ITX motherboard is considered.\n- Use the min height of the CPU cooler if it has multiple configuration.\n- The GPU length is the most important factor, followed by the width and thickness.\n- If it's a \"sandwich\" style case, the sum of the GPU thickness and the CPU cooler height shall not exceed the case's clearance.\n- If it's a traditional case with power supply moved to the top, the CPU cooler height might be more limited if a ATX power supply is used.\n\nComponent information will be provided in the JSON format. And you shall answer following below outline:\n\n[state compatibility (compatible/incompatible/more information needed)]\n\n**Explanation:**\n\n[your reasoning]\n\n**Recommendations:**\n\n[generic suggestions first and then ask the user if specific components are preferred]\n\n**Any additional information:**\n[optional]",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function run() {
  // TODO Make these files available on the local file system
  // You may need to update the file paths
  const files = [
    await uploadToGemini("Terra-manual-V1.2.pdf", "application/pdf"),
  ];

  // Some files have a processing delay. Wait for them to be ready.
  await waitForFilesActive(files);

  const chatSession = model.startChat({
    generationConfig,
    // safetySettings: Adjust safety settings
    // See https://ai.google.dev/gemini-api/docs/safety-settings
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

  const result = await chatSession.sendMessage(
    '{\n  "case": "https://www.fractal-design.com/app/uploads/2023/05/Terra-manual-V1.2.pdf",\n  "cpu_cooler": { "name": "Noctua NH-L9x65 33.84 CFM", "height": 65 },\n  "graphics_card": {\n    "name": "GeForce RTX 4080",\n    "length": 304,\n    "width": 137,\n    "thickness": 61\n  },\n  "motherboard": "ITX",\n  "power_supply": "SFX"\n}'
  );
  console.log(result.response.text());
}

run();
