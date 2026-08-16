let words = {};

async function loadWords() {
  const stored =
    await chrome.storage.local.get("words");

  words = stored.words || {};

  render();
}

function render() {
  const search =
    document
      .getElementById("search")
      .value
      .toLowerCase();

  const filter =
    document.getElementById("filter").value;

  let list = Object.entries(words);

  // Search
  list = list.filter(([word]) =>
    word.toLowerCase().includes(search)
  );

  // Filter
  if (filter === "saved") {
    list = list.filter(
      ([, data]) => data.saved
    );
  }

  if (filter === "frequent") {
    list.sort(
      ([, a], [, b]) =>
        b.searchCount - a.searchCount
    );
  }

  if (filter === "recent") {
    list.sort(
      ([, a], [, b]) =>
        b.lastSearched - a.lastSearched
    );
  }

  const container =
    document.getElementById("word-list");

  if (!list.length) {
    container.innerHTML = `
      <div class="empty">
        <div>📖</div>
        <h2>No words found</h2>
        <p>
          Double-click an English word on any webpage
          to start building your vocabulary.
        </p>
      </div>
    `;

    updateStats();
    return;
  }

  container.innerHTML = list
    .map(([word, data]) => {
      const entry = data.data?.[0];

      const meaning =
        entry?.meanings?.[0]?.definitions?.[0]
          ?.definition ||
        "No definition available.";

      const partOfSpeech =
        entry?.meanings?.[0]?.partOfSpeech ||
        "";

      return `
        <div class="word-card">

          <div class="word-card-main">

            <div class="word-top">
              <h2>${escapeHtml(word)}</h2>

              <button
                class="save-button ${data.saved ? "saved" : ""}"
                data-word="${escapeHtml(word)}"
              >
                ${data.saved ? "★" : "☆"}
              </button>
            </div>

            <div class="part-of-speech">
              ${escapeHtml(partOfSpeech)}
            </div>

            <p class="meaning">
              ${escapeHtml(meaning)}
            </p>

            <div class="word-meta">
              <span>
                🔎 ${data.searchCount}
                search${data.searchCount === 1 ? "" : "es"}
              </span>

              <span>
                Last searched:
                ${formatDate(data.lastSearched)}
              </span>
            </div>

          </div>

          <button
            class="delete-button"
            data-delete="${escapeHtml(word)}"
          >
            🗑
          </button>

        </div>
      `;
    })
    .join("");

  document
    .querySelectorAll(".save-button")
    .forEach(button => {
      button.addEventListener(
        "click",
        () => toggleSaved(button.dataset.word)
      );
    });

  document
    .querySelectorAll(".delete-button")
    .forEach(button => {
      button.addEventListener(
        "click",
        () => deleteWord(button.dataset.delete)
      );
    });

  updateStats();
}

async function toggleSaved(word) {
  if (!words[word]) return;

  words[word].saved =
    !words[word].saved;

  await save();
}

async function deleteWord(word) {
  delete words[word];

  await save();
}

async function save() {
  await chrome.storage.local.set({
    words
  });

  render();
}

async function updateStats() {
  const list = Object.values(words);

  const total =
    list.length;

  const saved =
    list.filter(w => w.saved).length;

  const searches =
    list.reduce(
      (sum, word) =>
        sum + word.searchCount,
      0
    );

  document.getElementById("stats").innerHTML = `
    <div class="stat">
      <strong>${total}</strong>
      <span>Total Words</span>
    </div>

    <div class="stat">
      <strong>${saved}</strong>
      <span>Saved Words</span>
    </div>

    <div class="stat">
      <strong>${searches}</strong>
      <span>Total Searches</span>
    </div>
  `;
}

function formatDate(timestamp) {
  if (!timestamp) return "";

  return new Date(timestamp)
    .toLocaleDateString();
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}

document
  .getElementById("search")
  .addEventListener("input", render);

document
  .getElementById("filter")
  .addEventListener("change", render);

document
  .getElementById("clear-history")
  .addEventListener("click", async () => {

    const confirmed =
      confirm(
        "Delete your complete word history?"
      );

    if (!confirmed) return;

    words = {};

    await chrome.storage.local.set({
      words: {}
    });

    render();
  });

loadWords();