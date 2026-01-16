// Function to extract image links
async function getLink() {
    let imageUrls = new Set();
    // Your specific selector from the repo
    var gallery = document.getElementsByClassName(dom_class);

    for (let i = 0; i < gallery.length; i++) {
        // Ensure we get a valid URL (checking dataset.src or src)
        let src = gallery[i].dataset.src || gallery[i].src;
        if (src) imageUrls.add(src);
    }
    return Array.from(imageUrls);
}

// Function to trigger the download via Background script
function downloadImage(imageSrc) {
    // Extract a filename or create one
    let fileName = imageSrc.split("/").slice(-1)[0];

    // Send message to background.js to handle the actual file write
    chrome.runtime.sendMessage({
        action: "download_image",
        url: imageSrc,
        filename: fileName
    });
}

// Main execution function
async function downloadLink() {
    try {
        console.log("Starting extraction...");
        let finalKeyList = await getLink();

        if (finalKeyList.length === 0) {
            alert("No images found with class 'img-fluid lazy'.");
            return;
        }

        console.log(`Found ${finalKeyList.length} images.`);

        // Loop through and download each
        for (let i = 0; i < finalKeyList.length; i++) {
            downloadImage(finalKeyList[i]);
        }

    } catch (error) {
        console.error("Error in download sequence:", error);
    }
}

// Execute immediately when injected by the background script
downloadLink();