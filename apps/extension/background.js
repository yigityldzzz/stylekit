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
    const tabId = message.tabId;
    if (!tabId) {
      sendResponse({ success: false, error: "No tab ID provided." });
      return true;
    }

    chrome.scripting.executeScript(
      { target: { tabId }, files: ["content-script.js"] },
      () => {
        const lastError = chrome.runtime.lastError;
        if (lastError && !lastError.message.includes("already")) {
          sendResponse({ success: false, error: lastError.message });
          return;
        }

        chrome.tabs.sendMessage(tabId, { action: "extractTokens" }, (response) => {
          if (chrome.runtime.lastError) {
            sendResponse({ success: false, error: chrome.runtime.lastError.message });
          } else {
            sendResponse(response);
          }
        });
      }
    );

    return true;
  }
});
