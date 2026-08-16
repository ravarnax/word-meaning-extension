# 📚 Word Meaning Chrome Extension

A lightweight Google Chrome extension that lets you **double-click any English word on a webpage to instantly see its meaning, pronunciation, examples, synonyms, and more**.

The extension also helps you build your vocabulary by automatically keeping track of searched words, search frequency, cached definitions, and saved words.

## ✨ Features

* 🖱️ **Double-click to define** — Double-click any English word on a webpage.
* 📖 **Instant definitions** — Get meanings without leaving the current webpage.
* 💾 **Smart caching** — Previously searched words are stored locally to reduce unnecessary API requests.
* 🔢 **Search count** — Track how many times you've searched for each word.
* ⭐ **Save difficult words** — Save words you want to learn or review later.
* 📚 **Vocabulary list** — View all the words you've discovered.
* 🔍 **Vocabulary search** — Quickly find a previously searched word.
* 📊 **Search statistics** — See total words, saved words, and total searches.
* 🕒 **Search history** — See when words were last searched.
* 🔥 **Most searched words** — Find the words you look up most frequently.
* 🗑️ **Delete words** — Remove individual words from your vocabulary.
* 🧹 **Clear history** — Delete your complete search history.
* 🌐 **Works across websites** — The extension can run on most webpages.

## 🖼️ How It Works

```text
Double-click an English word
            ↓
     Extension detects word
            ↓
      Check local cache
       ↙           ↘
    Cached        Not cached
      ↓               ↓
  Use saved       Dictionary API
    result             ↓
       ↘          Save result
          ↘          ↓
            Show definition
                  ↓
          Update search count
                  ↓
          Add to vocabulary
```

## 🛠️ Technologies

This project is built using:

* **JavaScript**
* **HTML5**
* **CSS3**
* **Chrome Extensions Manifest V3**
* **Chrome Storage API**
* **Dictionary API**

No frontend framework is required.

## 📁 Project Structure

```text
word-meaning-extension/
│
├── manifest.json        # Chrome extension configuration
│
├── background.js        # Background service worker and API/cache logic
│
├── content.js           # Detects double-clicks and displays definitions
├── popup.css             # Styling for the word definition popup
│
├── popup.html            # Extension toolbar popup
├── popup.js              # Toolbar popup logic
│
├── vocabulary.html       # Vocabulary dashboard
├── vocabulary.js         # Vocabulary management logic
└── vocabulary.css        # Vocabulary dashboard styling
```

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/word-meaning-extension.git
```

Then enter the project directory:

```bash
cd word-meaning-extension
```

### 2. Open Chrome Extensions

Open:

```text
chrome://extensions/
```

### 3. Enable Developer Mode

Turn on **Developer mode** in the top-right corner.

### 4. Load the extension

Click:

**Load unpacked**

and select the project folder:

```text
word-meaning-extension/
```

### 5. Start using it

Open any webpage and double-click an English word.

The definition popup should appear near the selected word.

## 📚 Vocabulary Dashboard

Click the extension icon and open **My Vocabulary**.

The dashboard provides:

* Total words
* Saved words
* Total searches
* Search history
* Most searched words
* Recently searched words
* Saved-word filtering
* Vocabulary search
* Individual word deletion
* Complete history deletion

Example:

```text
┌──────────────────────────────────────┐
│ 📚 My Vocabulary                     │
│                                      │
│ Total Words     Saved      Searches  │
│     42            15          137    │
│                                      │
│ Search: [____________________]       │
│ Filter: [Most searched ▼]            │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │ magnificent                  ⭐  │ │
│ │ adjective                       │ │
│ │ Very impressive or beautiful.   │ │
│ │ 🔎 12 searches                  │ │
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

## 💾 Caching

The extension stores dictionary results using Chrome's local storage.

When you search for a word for the first time:

```text
Word
 ↓
Dictionary API
 ↓
Definition
 ↓
Chrome Storage
```

When you search for the same word again:

```text
Word
 ↓
Chrome Storage
 ↓
Cached Definition
```

This means the extension doesn't need to request the same dictionary data repeatedly.

## 🔢 Search Frequency

Every time a word is searched, its search count is increased.

For example:

```text
"beautiful" → 1 search
"beautiful" → 2 searches
"beautiful" → 3 searches
...
"beautiful" → 10 searches
```

This makes it possible to identify words you repeatedly struggle with.

## ⭐ Saved Words

When you find a difficult or useful word, click:

```text
☆ Save word
```

It changes to:

```text
★ Saved
```

Saved words can then be filtered in the vocabulary dashboard.

## 🔐 Privacy

The extension is designed to keep your vocabulary data locally on your device.

Vocabulary information is stored using:

```text
chrome.storage.local
```

The extension does not require a user account or database for its basic functionality.

Dictionary lookups are sent to the configured dictionary API when a word isn't already cached.

## 🌐 Dictionary API

This project currently uses the **Free Dictionary API** for English word definitions.

API endpoint:

```text
https://api.dictionaryapi.dev/
```

The API provides information such as:

* Definitions
* Parts of speech
* Phonetics
* Examples
* Synonyms

## ⚠️ Limitations

The current version is intentionally simple.

Some websites may prevent content scripts from running, including certain Chrome internal pages and highly restricted webpages.

The current version also focuses primarily on English words.

## 🔮 Future Improvements

Planned or possible improvements include:

* 🇮🇳 English → Hindi translations
* 🔊 Pronunciation audio
* 🌙 Dark mode
* 🧠 AI-powered simple explanations
* 📝 Personal notes for words
* 📅 Daily vocabulary review
* 🧩 Flashcards
* 📈 Vocabulary learning statistics
* 📤 Export vocabulary to CSV
* 📥 Import vocabulary
* ☁️ Chrome account synchronization
* 🎯 Difficulty levels
* 🔥 Frequently forgotten words
* 📚 Word-of-the-day
* ⌨️ Keyboard shortcuts
* 🎨 Custom popup themes
* 📱 Improved responsive vocabulary dashboard

## 🤝 Contributing

Contributions are welcome!

### Fork the repository

```bash
git fork https://github.com/YOUR-USERNAME/word-meaning-extension
```

Create a new branch:

```bash
git checkout -b feature/my-new-feature
```

Make your changes and commit them:

```bash
git add .
git commit -m "Add my new feature"
```

Push the branch:

```bash
git push origin feature/my-new-feature
```

Then open a Pull Request.

## 📄 License

This project is open source.

You can add your preferred license here, such as the **MIT License**.

## ⭐ Support

If you find this extension useful, consider giving the repository a ⭐ on GitHub.

---

**Built with JavaScript, Chrome Extensions API, and a love for learning new words. 📚**
