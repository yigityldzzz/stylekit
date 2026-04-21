/**
 * StyleKit Background Service Worker
 *
 * Handles extension lifecycle events and acts as a message relay
 * between the popup and content scripts when needed.
 */

// Log when the service worker is installed / activated
chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === chrome.runtime.OnInstalledReason.INSTALL) {
    console.log("[StyleKit] Extension installed.");
  } else if (reason === chrome.runtime.OnInstalledReason.UPDATE) {
    console.log("[StyleKit] Extension updated.");
  }
});

/**
 * Relay messages from the popup to the active tab's content script.
 * The popup sends { action: "extractTokens" }; we forward it to the
 * content script and return the response back to the popup.
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "extractFromActiveTab") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (!tab) {
        sendResponse({ success: false, error: "No active tab found." });
        return;
      }

      // First inject the content script programmatically (in case the user
      // opened the popup on a tab loaded before the extension was installed).
      chrome.scripting.executeScript(
        {
          target: { tabId: tab.id },
          files: ["content-script.js"],
        },
        () => {
          // Ignore "already exists" errors – the script may already be present.
          const lastError = chrome.runtime.lastError;
          if (lastError && !lastError.message.includes("already")) {
            sendResponse({ success: false, error: lastError.message });
            return;
          }

          // Now send the extraction message to the content script.
          chrome.tabs.sendMessage(
            tab.id,
            { action: "extractTokens" },
            (response) => {
              if (chrome.runtime.lastError) {
                sendResponse({ success: false, error: chrome.runtime.lastError.message });
              } else {
                sendResponse(response);
              }
            }
          );
        }
      );
    });

    // Return true so the message channel stays open for the async response.
    return true;
  }
});
