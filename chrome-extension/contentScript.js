// Inject the upload and submit button into the page
window.onload = function () {
  const notesSection = document.getElementById("compatibility_notes");

  if (notesSection) {
    const aiSection = document.createElement("section");
    aiSection.className = "module-subTitle";
    aiSection.innerHTML = `
        <div class="subTitle">
          <div class="subTitle__header">
            <h2>AI Compatibility Suggestions</h2>
          </div>
        </div>
        <input type="file" id="manualUpload" />
        <button id="submitManual">Submit Manual</button>
        <ul class="allocations__notes list-unstyled" id="aiCompatibilityNotes">
          <li id="note__ai">
            <div class="note__tag note__tag--info">AI</div>
            <p class="note__text note__text--info">
              Upload the case manual and click "Submit" to see AI suggestions.
            </p>
          </li>
        </ul>
      `;
    notesSection.appendChild(aiSection);

    // Handle manual upload and AI request
    document.getElementById("submitManual").addEventListener("click", () => {
      const manualFile = document.getElementById("manualUpload").files[0];
      if (manualFile) {
        const reader = new FileReader();
        reader.onload = function (event) {
          const manualContent = event.target.result;
          chrome.storage.sync.get("geminiApiKey", (data) => {
            const apiKey = data.geminiApiKey;
            if (apiKey) {
              sendToAI(apiKey, manualContent)
                .then((response) => {
                  const aiNote = document.getElementById("note__ai");
                  aiNote.querySelector(".note__text").innerText = response;
                })
                .catch((error) => {
                  console.error("AI request failed", error);
                });
            } else {
              alert("Please set your API key in the extension settings.");
            }
          });
        };
        reader.readAsText(manualFile);
      }
    });
  }
};

// Send the manual content to the AI model
async function sendToAI(apiKey, manualContent) {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt: manualContent,
        model: "gemini-1.5-pro",
        parameters: {
          temperature: 0.7,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error("AI request failed");
  }

  const data = await response.json();
  return data.choices[0].message.text;
}
