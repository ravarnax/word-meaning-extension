const API_URL =
  "https://api.dictionaryapi.dev/api/v2/entries/en/";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type !== "LOOKUP_WORD") {
    return;
  }

  lookupWord(message.word)
    .then(sendResponse)
    .catch(error => {
      sendResponse({
        success: false,
        error: error.message
      });
    });

  return true;
});

async function lookupWord(word) {
  const normalizedWord = word.toLowerCase().trim();

  const stored = await chrome.storage.local.get("words");
  const words = stored.words || {};

  // Use cache if available
  if (words[normalizedWord]?.data) {
    words[normalizedWord].searchCount += 1;
    words[normalizedWord].lastSearched = Date.now();

    await chrome.storage.local.set({ words });

    return {
      success: true,
      data: words[normalizedWord].data,
      cached: true,
      searchCount: words[normalizedWord].searchCount,
      saved: words[normalizedWord].saved
    };
  }

  // Fetch from dictionary API
  const response = await fetch(
    API_URL + encodeURIComponent(normalizedWord)
  );

  if (!response.ok) {
    throw new Error("Word not found");
  }

  const data = await response.json();

  const existing = words[normalizedWord];

  words[normalizedWord] = {
    data,
    searchCount: existing?.searchCount
      ? existing.searchCount + 1
      : 1,
    saved: existing?.saved || false,
    firstSearched: existing?.firstSearched || Date.now(),
    lastSearched: Date.now()
  };

  await chrome.storage.local.set({ words });

  return {
    success: true,
    data,
    cached: false,
    searchCount: words[normalizedWord].searchCount,
    saved: words[normalizedWord].saved
  };
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === "OPEN_VOCABULARY") {
    chrome.tabs.create({
      url: chrome.runtime.getURL("vocabulary.html")
    });
  }
});