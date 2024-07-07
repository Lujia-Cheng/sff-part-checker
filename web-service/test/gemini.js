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

const apiKey = process.env.GEMINI_API_KEY;
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
      process.stdout.write(".")
      await new Promise((resolve) => setTimeout(resolve, 10_000));
      file = await fileManager.getFile(name)
    }
    if (file.state !== "ACTIVE") {
      throw Error(`File ${file.name} failed to process`);
    }
  }
  console.log("...all files ready\n");
}

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
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
          {text: "You are an assistant on PCPartPicker.com. The website is sufficient for checking the traditional ATX build, which being said you do NOT need to worry about the case expansion slots, the motherboard's PCIe slots, the CPU socket, the RAM slots, the power supply connectors, etc. Your task is to focus on the spatial compatibility of small-form-factor PC build. And you also have the ability to read the manual of the case and access to the internet if components information is needed.\n\nPlease be aware of the common pitfall:\n- Different manual might have different definitions of graph length/width/height, use the largest number for length, middle for width, and smaller for height. \n- For simplicity, only ITX motherboard is considered\n- Use the min height of the CPU cooler if it has multiple configuration\n- The GPU length is the most important factor, followed by the width and thickness\n- If it's a \"sandwich\" style case, the sum of the GPU thickness and the CPU cooler height shall not exceed the case's clearance\n- If it's a traditional case with power supply moved to the top, the CPU cooler height might be more limited if a ATX power supply is used\n\nComponents list:\n- Case: [PDF provided]\n- CPU Cooler: 65mm height\n- Graphics Card: GeForce RTX 4080 (304mm * 137mm * 61mm)\n- Motherboard: ITX\n- Power Supply: SFX\n\n"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "## Compatibility Analysis for Terra Case \n\nBased on the provided information and the Terra manual, let's analyze the component compatibility:\n\n**1. GPU Compatibility:**\n\n* **Length:** The RTX 4080's length is 304mm, well within the Terra's maximum GPU clearance of 322mm. **PASS**\n* **Width:**  The RTX 4080's width is 137mm (using the middle value as per instructions).  The Terra manual lists GPU width limits depending on the spine position and GPU height.  Since the 4080's height is 137mm, we'll use the \"GPU Height <145mm\" values. To accommodate the 137mm width, the spine needs to be in position **6 or 7**. \n* **Thickness:** At 61mm, the RTX 4080 is a triple-slot card. The Terra manual doesn't explicitly mention a thickness limit, but the \"Triple Slot GPU Focused Configuration\" on page 8 shows a maximum GPU width of 58mm with a 10mm PSU spacer. This suggests the maximum practical thickness is around 68mm.  **PASS, but tight**.\n\n**2. CPU Cooler Compatibility:**\n\n* **Height:**  With a height of 65mm, the chosen cooler fits within the Terra's maximum CPU cooler height limit of 77mm (Spine position 1). However, since we need the spine in position 6 or 7 for the GPU, the maximum allowed CPU cooler height becomes 53mm or 48mm respectively.  **FAIL**.\n\n**3. Motherboard and PSU Compatibility:**\n\n* The Terra supports ITX motherboards and SFX/SFX-L power supplies, so these components are compatible. **PASS**\n\n**4.  Case Clearance:**\n\n* The Terra is not a sandwich-style case, so the combined thickness of the GPU and CPU cooler is not a limiting factor. \n\n**Conclusion:**\n\nThe chosen components are **NOT fully compatible** with the Terra case. The limiting factor is the CPU cooler height. In Spine position 6 or 7 (required for the GPU), the maximum CPU cooler height is 53mm or 48mm,  which is less than the chosen cooler's 65mm height.\n\n**Recommendations:**\n\n* **Choose a lower-profile CPU cooler:**  Look for a CPU cooler with a maximum height of 48mm or less to ensure compatibility with the Terra and the chosen GPU.  \n* **Consider a different case:**  If you want to keep the current CPU cooler, explore other ITX cases that offer more clearance for taller CPU coolers, especially with triple-slot GPUs.  \n\nRemember to double-check all clearances and compatibility information in the chosen component manuals before finalizing your build. \n"},
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage("INSERT_INPUT_HERE");
  console.log(result.response.text());
}

run();