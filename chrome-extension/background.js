chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.get('geminiApiKey', (data) => {
    if (!data.geminiApiKey) {
      const userApiKey = prompt("Welcome to the SFF PC Compatibility Checker! Please enter your Google API Key to continue:");
      if (userApiKey) {
        chrome.storage.sync.set({ geminiApiKey: userApiKey }, () => {
          alert("API key saved successfully!");
        });
      } else {
        alert("No API key entered. Please provide an API key in the extension settings.");
      }
    }
  });
});
