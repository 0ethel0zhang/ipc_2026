// // 1. Listen for the extension icon click
// chrome.action.onClicked.addListener((tab) => {
//   if (tab.url.startsWith("http")) {
//     // Inject and execute the content script
//     chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       files: ["content.js"]
//     });
//   }
// });
// // 2. Listen for messages from content.js to download files
// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//   if (request.action === "download_image") {
//     chrome.downloads.download({
//       url: request.url,
//       // CHANGE "my_images_folder" TO YOUR DESIRED FOLDER NAME
//       filename: `my_images_folder/${request.filename}`,
//       conflictAction: "uniquify"
//     });
//   }
// });
// Listen for messages from content.js to download files
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "download_image") {

    // Retrieve the user's preferred folder name from storage
    chrome.storage.local.get("folder_name", "dom_class", (data) => {
      // Use the saved name, or fallback to 'my_images_folder' if empty
      const folder = data.folder_name || "my_images_folder";
      const dom_class = data.dom_class || "img-fluid lazy";

      chrome.downloads.download({
        url: request.url,
        filename: `${folder}/${request.filename}`,
        conflictAction: "uniquify"
      });
    });
  }
});