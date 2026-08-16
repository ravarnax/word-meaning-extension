let currentPopup = null;

document.addEventListener("dblclick", async () => {
  const selection = window.getSelection();
  const word = selection.toString().trim();

  if (!word || !/^[a-zA-Z'-]+$/.test(word)) {
    return;
  }

  removePopup();

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  const popup = document.createElement("div");
  popup.id = "word-meaning-popup";

  popup.innerHTML = `
    <div class="word-loading">
      Looking up <strong>${escapeHtml(word)}</strong>...
    </div>
  `;

  document.body.appendChild(popup);
  currentPopup = popup;

  positionPopup(popup, rect);

  chrome.runtime.sendMessage(
    {
      type: "LOOKUP_WORD",
      word
    },
    result => {
      if (chrome.runtime.lastError) {
        showError(popup, word);
        return;
      }

      if (!result || !result.success) {
        showError(popup, word);
        return;
      }

      renderDefinition(
        popup,
        word,
        result.data,
        result.searchCount,
        result.saved,
        result.cached
      );
    }
  );
});

function renderDefinition(
  popup,
  word,
  data,
  searchCount,
  saved,
  cached
) {
  const entry = data[0];

  const phonetic =
    entry.phonetic ||
    entry.phonetics?.find(item => item.text)?.text ||
    "";

  let meaningsHTML = "";

  entry.meanings.slice(0, 3).forEach(meaning => {
    meaning.definitions.slice(0, 2).forEach(definition => {
      meaningsHTML += `
        <div class="definition">
          <div class="part-of-speech">
            ${escapeHtml(meaning.partOfSpeech)}
          </div>

          <div class="meaning">
            ${escapeHtml(definition.definition)}
          </div>

          ${
            definition.example
              ? `
                <div class="example">
                  "${escapeHtml(definition.example)}"
                </div>
              `
              : ""
          }
        </div>
      `;
    });
  });

  const synonyms = [];

  entry.meanings.forEach(meaning => {
    if (meaning.synonyms) {
      synonyms.push(...meaning.synonyms);
    }

    meaning.definitions.forEach(def => {
      if (def.synonyms) {
        synonyms.push(...def.synonyms);
      }
    });
  });

  const uniqueSynonyms = [...new Set(synonyms)].slice(0, 8);

  popup.innerHTML = `
    <div class="popup-header">
      <div>
        <div class="word-title">
          ${escapeHtml(entry.word)}
        </div>

        ${
          phonetic
            ? `<div class="phonetic">${escapeHtml(phonetic)}</div>`
            : ""
        }
      </div>

      <button class="close-btn" id="close-popup">×</button>
    </div>

    <div class="search-info">
      🔎 Searched ${searchCount} time${searchCount === 1 ? "" : "s"}
      ${cached ? " · Cached" : ""}
    </div>

    ${meaningsHTML}

    ${
      uniqueSynonyms.length
        ? `
          <div class="synonyms">
            <strong>Synonyms:</strong>
            ${uniqueSynonyms
              .map(s => `<span>${escapeHtml(s)}</span>`)
              .join("")}
          </div>
        `
        : ""
    }

    <div class="popup-actions">
      <button id="save-word" class="${saved ? "saved" : ""}">
        ${saved ? "★ Saved" : "☆ Save word"}
      </button>

      <button id="open-vocabulary">
        📚 Vocabulary
      </button>
    </div>
  `;

  document
    .getElementById("close-popup")
    .addEventListener("click", removePopup);

  document
    .getElementById("save-word")
    .addEventListener("click", () => {
      toggleSaved(word);
    });

  document
    .getElementById("open-vocabulary")
    .addEventListener("click", () => {
      chrome.runtime.sendMessage({
        type: "OPEN_VOCABULARY"
      });
    });
}

async function toggleSaved(word) {
  const normalizedWord = word.toLowerCase();

  const stored = await chrome.storage.local.get("words");
  const words = stored.words || {};

  if (!words[normalizedWord]) {
    return;
  }

  words[normalizedWord].saved =
    !words[normalizedWord].saved;

  await chrome.storage.local.set({ words });

  if (currentPopup) {
    const button = document.getElementById("save-word");

    if (button) {
      const saved = words[normalizedWord].saved;

      button.className = saved ? "saved" : "";
      button.textContent = saved
        ? "★ Saved"
        : "☆ Save word";
    }
  }
}

function showError(popup, word) {
  popup.innerHTML = `
    <div class="popup-header">
      <div class="word-title">
        ${escapeHtml(word)}
      </div>

      <button class="close-btn" id="close-popup">×</button>
    </div>

    <div class="error">
      Couldn't find a definition for this word.
    </div>
  `;

  document
    .getElementById("close-popup")
    .addEventListener("click", removePopup);
}

function positionPopup(popup, rect) {
  const left = Math.min(
    window.scrollX + rect.left,
    window.scrollX + window.innerWidth - 360
  );

  popup.style.left = `${Math.max(10, left)}px`;
  popup.style.top =
    `${window.scrollY + rect.bottom + 10}px`;
}

function removePopup() {
  if (currentPopup) {
    currentPopup.remove();
    currentPopup = null;
  }

  const popup =
    document.getElementById("word-meaning-popup");

  if (popup) {
    popup.remove();
  }
}

function escapeHtml(value) {
  const div = document.createElement("div");
  div.textContent = value;
  return div.innerHTML;
}