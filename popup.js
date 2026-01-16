document.addEventListener('DOMContentLoaded', () => {
    const folderInput = document.getElementById('folder');
    const startBtn = document.getElementById('startBtn');

    // 1. Load saved folder name if it exists
    chrome.storage.local.get('folder_name', (data) => {
        if (data.folder_name) {
            folderInput.value = data.folder_name;
        }
    });

    // 2. On Click: Save folder name and Inject Script
    startBtn.addEventListener('click', async () => {
        const folderName = folderInput.value.trim() || "default_images";

        // Save the name to storage so background.js can access it
        await chrome.storage.local.set({ folder_name: folderName });

        // Get the current active tab
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

        if (tab.url.startsWith("http")) {
            // Execute the content script
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                files: ["content.js"]
            });

            // Optional: Close popup after clicking
            window.close();
        } else {
            alert("Cannot run on this page.");
        }
    });
});