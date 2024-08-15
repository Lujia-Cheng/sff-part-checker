// Inject the upload and submit button into the page
window.onload = function () {
  const metricsSection = document.querySelector(
    "[class^='partlist__metrics-']"
  );

  const notesSection = document.getElementById("compatibility_notes");

  if (!metricsSection || !notesSection) {
    return;
  }
  // Inject the new compatibility note before the first div in metrics section
  if (isSffCase()) {
    // Trigger condition, set to true for now
    const sffNote = document.createElement("div");
    sffNote.className = "partlist__compatibility";
    sffNote.style.gridColumn = "1 / -1";
    sffNote.style.background = "#da682c";
    sffNote.innerHTML = `
        <p class="partlist__compatibility--sff">
        <svg class="icon shape-warning"><use xlink:href="#shape-warning"></use></svg>
    <span>SFF Detected:</span> Compatibility may vary! See <a href="#aiSuggestions">SFF Checker</a> below.
        </p>
      `;
    metricsSection.insertBefore(sffNote, metricsSection.firstChild);
  }

  // Inject the AI Compatibility Suggestions section at the bottom
  const aiSection = document.createElement("section");
  aiSection.className = "module-subTitle";
  aiSection.id = "aiSuggestions";
  aiSection.innerHTML = `
        <br/>
        <div class="subTitle">
          <div class="subTitle__header">
            <h2>SFF Checker</h2>
          </div>
        </div>
        <ul class="allocations__notes list-unstyled" id="aiCompatibilityNotes">
          <li id="note__ai">
            <div class="note__tag note__tag--info">Bot</div>
            <p class="note__text note__text--info">
              Upload the case manual and click "Submit" to view bot suggestions.
            </p>
          </li>
        </ul>
        <input type="file" id="manualUpload" />
        <button class="button button--icon button--small" id="submitManual">Submit</button>
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
            sendToGemini(apiKey, manualContent)
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
};

// Send the manual content to the AI model
async function sendToGemini(apiKey, manualContent) {
  const response = await fetch(
    "https://generativelanguage.googleapis.com/v1beta2/models/..."
  );
  // Handle the response
}

async function isSffCase() {
  return true;
  // Check if the case is SFF
}
