document.addEventListener('DOMContentLoaded', () => {
    const apiKeyInput = document.getElementById('apiKey');
    const saveApiKeyButton = document.getElementById('saveApiKey');
  
    // Load the saved API key from Chrome storage and display it in the input field
    chrome.storage.sync.get('geminiApiKey', (data) => {
      if (data.geminiApiKey) {
        apiKeyInput.value = data.geminiApiKey;
      }
    });
  
    // Save the API key when the button is clicked
    saveApiKeyButton.addEventListener('click', () => {
      const apiKey = apiKeyInput.value.trim();
      if (apiKey) {
        chrome.storage.sync.set({ geminiApiKey: apiKey }, () => {
          alert('API key saved!');
        });
      } else {
        alert('Please enter a valid API key.');
      }
    });
  });
  