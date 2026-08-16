async function loadStats() {
  const stored = await chrome.storage.local.get("words");
  const words = stored.words || {};

  const list = Object.values(words);

  const totalWords = list.length;

  const savedWords =
    list.filter(word => word.saved).length;

  const totalSearches =
    list.reduce(
      (total, word) => total + word.searchCount,
      0
    );

  document.getElementById("stats").innerHTML = `
    <div class="stat">
      <strong>${totalWords}</strong>
      <span>Words</span>
    </div>

    <div class="stat">
      <strong>${savedWords}</strong>
      <span>Saved</span>
    </div>

    <div class="stat">
      <strong>${totalSearches}</strong>
      <span>Searches</span>
    </div>
  `;
}

document
  .getElementById("open-vocabulary")
  .addEventListener("click", () => {
    chrome.tabs.create({
      url: chrome.runtime.getURL(
        "vocabulary.html"
      )
    });
  });

loadStats();