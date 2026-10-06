/* ============================================================
   MaoThink - Wordle Icebreaker Game Logic (API-Driven Engine)
   - Fetches mystery words directly from online linguistic APIs
   - Validates user guesses against real English dictionaries
   - Conditional Skip button visibility (hidden on first visit)
   - Web Speech API audio narration for Word, Meaning & Sentence
   ============================================================ */

(function () {
    "use strict";

    // ── Emergency Offline Fallback (Only used if user has 0 internet on first load) ──
    const EMERGENCY_WORD = {
        word: "SPARK",
        phonetic: "/spɑːrk/",
        partOfSpeech: "noun / verb",
        meaning: "A small fiery particle, or a vital quality that ignites enthusiasm, passion, or creative action.",
        sentence: "Her uplifting speech ignited a creative spark in all of the students."
    };

    // ── Wordle Constants & State ─────────────────────────────────
    const MAX_ROWS = 6;
    const WORD_LENGTH = 5;

    let currentTargetWordObj = null;
    let currentTargetWord = "";
    let guesses = []; // array of 5-letter strings
    let evaluations = []; // array of status arrays ('correct', 'present', 'absent')
    let currentRow = 0;
    let currentTileIndex = 0;
    let isGameOver = false;
    let isWon = false;
    let isRevealing = false;
    let isValidating = false;
    let isFetchingWord = false;
    let onProceedCallback = null;
    let onBackCallback = null;
    let activePlayerName = "Teacher Ash";
    let activePlayerImage = "ashhead.png";

    // In-memory caches for fast lookup
    const validWordCache = new Map();
    const wordDetailsCache = new Map();

    // DOM Elements
    let screenWordleEl = null;
    let wordleGridEl = null;
    let wordleKeyboardEl = null;
    let wordleToastEl = null;
    let wordleModalOverlayEl = null;
    let wordleModalTitleEl = null;
    let wordleModalSubtitleEl = null;
    let wordleRevealedWordEl = null;
    let wordleWordPhoneticEl = null;
    let wordleWordTagEl = null;
    let wordleRevealedMeaningEl = null;
    let wordleRevealedSentenceEl = null;
    let btnWordleProceedEl = null;
    let btnAudioWordEl = null;
    let btnAudioMeaningEl = null;
    let btnAudioSentenceEl = null;
    let btnWordleRandomWordEl = null;
    let btnWordleBackEl = null;
    let btnWordleSkipEl = null;
    let wordleDatePillEl = null;

    // Track on-screen keyboard key statuses ('correct', 'present', 'absent')
    const keyStatuses = {};

    // ── Date Formatting & Daily Key ──────────────────────────────
    function getTodayDateKey(date = new Date()) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    }

    function formatDateFriendly(date = new Date()) {
        try {
            return date.toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric"
            });
        } catch (e) {
            return getTodayDateKey(date);
        }
    }

    // ── First-Time Visitor Check for Skip Button ──────────────────
    function updateSkipButtonVisibility() {
        if (!btnWordleSkipEl) return;
        const hasVisited = localStorage.getItem("mao_wordle_visited");
        if (!hasVisited) {
            // First time visiting: strictly hide the Skip to Quiz button
            btnWordleSkipEl.style.display = "none";
            btnWordleSkipEl.classList.add("hidden");
        } else {
            // Returning player: show Skip button
            btnWordleSkipEl.style.display = "";
            btnWordleSkipEl.classList.remove("hidden");
        }
    }

    function markVisitorCompleted() {
        try {
            localStorage.setItem("mao_wordle_visited", "true");
        } catch (e) {}
        updateSkipButtonVisibility();
    }

    // ── Online API Definition Enrichment ─────────────────────────
    async function enrichWordDetails(rawWord) {
        const word = rawWord.toLowerCase().trim();
        if (wordDetailsCache.has(word)) {
            return wordDetailsCache.get(word);
        }

        let phonetic = `/${word}/`;
        let partOfSpeech = "word";
        let meaning = "";
        let sentence = "";

        // 1. Try Wiktionary API
        try {
            const res = await fetch(`https://en.wiktionary.org/api/rest_v1/page/definition/${word}`, {
                headers: { "User-Agent": "MaoThink-Game/1.0" },
                signal: AbortSignal.timeout(2400)
            });
            if (res.ok) {
                const data = await res.json();
                if (data.en && data.en.length > 0) {
                    partOfSpeech = data.en[0].partOfSpeech || "noun";
                    for (const sec of data.en) {
                        for (const item of sec.definitions) {
                            const clean = (item.definition || "").replace(/<[^>]+>/g, "").trim();
                            if (clean && !clean.startsWith("(") && clean.length > 8) {
                                meaning = clean;
                                break;
                            }
                        }
                        if (meaning) break;
                    }
                }
            }
        } catch (e) {}

        // 2. Try Datamuse md=d if definition still empty
        if (!meaning) {
            try {
                const res = await fetch(`https://api.datamuse.com/words?sp=${word}&md=d&max=1`, {
                    signal: AbortSignal.timeout(2000)
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.length > 0 && Array.isArray(data[0].defs) && data[0].defs.length > 0) {
                        const raw = data[0].defs[0];
                        const parts = raw.split("\t");
                        if (parts.length > 1) {
                            partOfSpeech = parts[0] === "n" ? "noun" : parts[0] === "v" ? "verb" : parts[0] === "adj" ? "adjective" : parts[0];
                            meaning = parts[1].trim();
                        } else {
                            meaning = raw.trim();
                        }
                    }
                }
            } catch (e) {}
        }

        // 3. Try Free Dictionary API
        if (!meaning) {
            try {
                const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`, {
                    signal: AbortSignal.timeout(2000)
                });
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data[0]) {
                        if (data[0].phonetic) phonetic = data[0].phonetic;
                        if (data[0].meanings && data[0].meanings[0]) {
                            partOfSpeech = data[0].meanings[0].partOfSpeech || partOfSpeech;
                            const defObj = data[0].meanings[0].definitions[0];
                            if (defObj) {
                                meaning = defObj.definition || "";
                                if (defObj.example) sentence = defObj.example;
                            }
                        }
                    }
                }
            } catch (e) {}
        }

        // Clean punctuation and supply natural sentence if missing
        if (!meaning) {
            meaning = `A recognized 5-letter English word expressing or referring to "${word}".`;
        }
        meaning = meaning.trim();
        if (!meaning.endsWith(".")) meaning += ".";

        if (!sentence) {
            sentence = `The word "${word}" is frequently used in everyday English speech, reading, and literature.`;
        }
        sentence = sentence.trim();
        if (!sentence.endsWith(".")) sentence += ".";

        const detailsObj = {
            word: word.toUpperCase(),
            phonetic,
            partOfSpeech: partOfSpeech.toLowerCase(),
            meaning,
            sentence
        };

        wordDetailsCache.set(word, detailsObj);
        validWordCache.set(word, true);
        return detailsObj;
    }

    // ── Fetch Mystery Word Directly from API ─────────────────────
    async function fetchFreshWordFromAPI() {
        let pickedWord = "";

        // 1. Try Random Word API
        try {
            const res = await fetch("https://random-word-api.herokuapp.com/word?length=5", {
                signal: AbortSignal.timeout(2800)
            });
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data) && data[0] && data[0].length === 5) {
                    pickedWord = data[0].toLowerCase().trim();
                }
            }
        } catch (e) {}

        // 2. Fallback to Datamuse API (100 random 5-letter words pool)
        if (!pickedWord) {
            try {
                const letters = "abcdefghijklmnopqrstuvwxyz";
                const randomLetter = letters[Math.floor(Math.random() * letters.length)];
                const res = await fetch(`https://api.datamuse.com/words?sp=${randomLetter}????&max=100`, {
                    signal: AbortSignal.timeout(2400)
                });
                if (res.ok) {
                    const list = await res.json();
                    const filtered = list.filter((item) => item.word && item.word.length === 5 && /^[a-z]+$/i.test(item.word));
                    if (filtered.length > 0) {
                        pickedWord = filtered[Math.floor(Math.random() * filtered.length)].word.toLowerCase().trim();
                    }
                }
            } catch (e) {}
        }

        // Emergency offline fallback if no network response
        if (!pickedWord) {
            pickedWord = EMERGENCY_WORD.word.toLowerCase();
        }

        // Enrich with definition and sample sentence from API
        return await enrichWordDetails(pickedWord);
    }

    // ── Daily Mystery Word (Changes Daily, Cached Per Date) ───────
    async function getDailyMysteryWord() {
        const todayKey = getTodayDateKey();
        const storageKey = `mao_wordle_daily_${todayKey}`;

        // Check if today's word was already fetched and stored
        try {
            const stored = localStorage.getItem(storageKey);
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed && parsed.word && parsed.word.length === 5) {
                    return parsed;
                }
            }
        } catch (e) {}

        // Fetch fresh word directly from API
        const newDailyWord = await fetchFreshWordFromAPI();
        try {
            localStorage.setItem(storageKey, JSON.stringify(newDailyWord));
        } catch (e) {}
        return newDailyWord;
    }

    // ── Word Validity Checker (API-Backed) ────────────────────────
    async function isValidEnglishWord(rawGuess) {
        const guess = rawGuess.toLowerCase().trim();
        if (guess.length !== WORD_LENGTH) return false;

        // If it matches the mystery word, it is guaranteed valid
        if (currentTargetWord && guess === currentTargetWord.toLowerCase()) {
            return true;
        }

        // Check local cache
        if (validWordCache.has(guess)) {
            return validWordCache.get(guess);
        }

        // 1. Check Datamuse dictionary API (with defs)
        try {
            const res = await fetch(`https://api.datamuse.com/words?sp=${guess}&md=d&max=1`, {
                signal: AbortSignal.timeout(1800)
            });
            if (res.ok) {
                const data = await res.json();
                if (data.length > 0 && data[0].word.toLowerCase() === guess && Array.isArray(data[0].defs) && data[0].defs.length > 0) {
                    validWordCache.set(guess, true);
                    return true;
                }
            }
        } catch (e) {}

        // 2. Check Wiktionary API status
        try {
            const res = await fetch(`https://en.wiktionary.org/api/rest_v1/page/definition/${guess}`, {
                headers: { "User-Agent": "MaoThink-Game/1.0" },
                signal: AbortSignal.timeout(1800)
            });
            if (res.status === 200) {
                validWordCache.set(guess, true);
                return true;
            }
            if (res.status === 404) {
                validWordCache.set(guess, false);
                return false;
            }
        } catch (e) {}

        // 3. Check Free Dictionary API status
        try {
            const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${guess}`, {
                signal: AbortSignal.timeout(1800)
            });
            if (res.status === 200) {
                validWordCache.set(guess, true);
                return true;
            }
            if (res.status === 404) {
                validWordCache.set(guess, false);
                return false;
            }
        } catch (e) {}

        // If APIs cannot confirm word exists, reject
        validWordCache.set(guess, false);
        return false;
    }

    // ── Wordle Guess Evaluation Logic (Exact NYT Wordle Rules) ───
    function evaluateGuess(guess, target) {
        const statuses = new Array(WORD_LENGTH).fill("absent");
        const targetArr = target.split("");
        const guessArr = guess.split("");
        const letterCounts = {};

        // 1st pass: identify exact matches (Green / correct)
        for (let i = 0; i < WORD_LENGTH; i++) {
            if (guessArr[i] === targetArr[i]) {
                statuses[i] = "correct";
            } else {
                const char = targetArr[i];
                letterCounts[char] = (letterCounts[char] || 0) + 1;
            }
        }

        // 2nd pass: identify misplaced letters (Yellow / present)
        for (let i = 0; i < WORD_LENGTH; i++) {
            if (statuses[i] !== "correct") {
                const char = guessArr[i];
                if (letterCounts[char] && letterCounts[char] > 0) {
                    statuses[i] = "present";
                    letterCounts[char]--;
                } else {
                    statuses[i] = "absent";
                }
            }
        }

        return statuses;
    }

    // ── Speech Synthesis Utterance Helper ─────────────────────────
    function speak(text, buttonElement) {
        if (!window.speechSynthesis) {
            console.warn("SpeechSynthesis is not supported in this browser environment.");
            return;
        }

        if (buttonElement && buttonElement.classList.contains("speaking")) {
            window.speechSynthesis.cancel();
            buttonElement.classList.remove("speaking");
            return;
        }

        window.speechSynthesis.cancel();
        document.querySelectorAll(".wordle-audio-btn.speaking").forEach((btn) => {
            btn.classList.remove("speaking");
        });

        const clean = text.replace(/["“”]/g, "").trim();
        const utterance = new SpeechSynthesisUtterance(clean);
        utterance.lang = "en-US";
        utterance.rate = 0.95;
        utterance.pitch = 1.0;

        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find((v) => v.lang.startsWith("en") && !v.name.includes("Whisper"));
        if (englishVoice) {
            utterance.voice = englishVoice;
        }

        if (buttonElement) {
            buttonElement.classList.add("speaking");
            utterance.onend = () => buttonElement.classList.remove("speaking");
            utterance.onerror = () => buttonElement.classList.remove("speaking");
        }

        window.speechSynthesis.speak(utterance);
    }

    // ── DOM Construction & References ────────────────────────────
    function initDOMReferences() {
        screenWordleEl = document.getElementById("screenWordle");
        wordleGridEl = document.getElementById("wordleGrid");
        wordleKeyboardEl = document.getElementById("wordleKeyboard");
        wordleToastEl = document.getElementById("wordleToast");
        wordleModalOverlayEl = document.getElementById("wordleModalOverlay");
        wordleModalTitleEl = document.getElementById("wordleModalTitle");
        wordleModalSubtitleEl = document.getElementById("wordleModalSubtitle");
        wordleRevealedWordEl = document.getElementById("wordleRevealedWord");
        wordleWordPhoneticEl = document.getElementById("wordleWordPhonetic");
        wordleWordTagEl = document.getElementById("wordleWordTag");
        wordleRevealedMeaningEl = document.getElementById("wordleRevealedMeaning");
        wordleRevealedSentenceEl = document.getElementById("wordleRevealedSentence");
        btnWordleProceedEl = document.getElementById("btnWordleProceed");
        btnAudioWordEl = document.getElementById("btnAudioWord");
        btnAudioMeaningEl = document.getElementById("btnAudioMeaning");
        btnAudioSentenceEl = document.getElementById("btnAudioSentence");
        btnWordleRandomWordEl = document.getElementById("btnWordleRandomWord");
        btnWordleBackEl = document.getElementById("btnWordleBack");
        btnWordleSkipEl = document.getElementById("btnWordleSkip");
        wordleDatePillEl = document.getElementById("wordleDatePill");

        updateSkipButtonVisibility();
    }

    function renderGrid() {
        if (!wordleGridEl) return;
        wordleGridEl.innerHTML = "";

        for (let r = 0; r < MAX_ROWS; r++) {
            const rowEl = document.createElement("div");
            rowEl.className = "wordle-row";
            rowEl.dataset.row = r;

            for (let c = 0; c < WORD_LENGTH; c++) {
                const tileEl = document.createElement("div");
                tileEl.className = "wordle-tile";
                tileEl.dataset.row = r;
                tileEl.dataset.col = c;

                if (guesses[r] && guesses[r][c]) {
                    const letter = guesses[r][c];
                    tileEl.textContent = letter;
                    if (evaluations[r] && evaluations[r][c]) {
                        tileEl.classList.add(`tile-${evaluations[r][c]}`);
                    }
                }

                rowEl.appendChild(tileEl);
            }
            wordleGridEl.appendChild(rowEl);
        }
    }

    function renderKeyboard() {
        if (!wordleKeyboardEl) return;
        wordleKeyboardEl.innerHTML = "";

        const KEYBOARD_LAYOUT = [
            ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
            ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
            ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"]
        ];

        KEYBOARD_LAYOUT.forEach((rowKeys) => {
            const rowEl = document.createElement("div");
            rowEl.className = "keyboard-row";

            rowKeys.forEach((key) => {
                const keyBtn = document.createElement("button");
                keyBtn.type = "button";
                keyBtn.className = "key-btn";
                keyBtn.dataset.key = key;

                if (key === "ENTER") {
                    keyBtn.classList.add("key-wide", "key-enter");
                    keyBtn.innerHTML = `<span>ENTER</span>`;
                    keyBtn.setAttribute("aria-label", "Submit guess");
                } else if (key === "BACKSPACE") {
                    keyBtn.classList.add("key-wide", "key-backspace");
                    keyBtn.innerHTML = `<span aria-hidden="true">&#9003;</span>`;
                    keyBtn.setAttribute("aria-label", "Delete letter");
                } else {
                    keyBtn.textContent = key;
                }

                if (keyStatuses[key]) {
                    keyBtn.classList.add(`key-${keyStatuses[key]}`);
                }

                keyBtn.addEventListener("click", () => handleKeyInput(key));
                rowEl.appendChild(keyBtn);
            });

            wordleKeyboardEl.appendChild(rowEl);
        });
    }

    function showToast(message, duration = 2200) {
        if (!wordleToastEl) return;
        wordleToastEl.textContent = message;
        wordleToastEl.classList.remove("hidden");
        wordleToastEl.classList.add("toast-visible");

        setTimeout(() => {
            wordleToastEl.classList.remove("toast-visible");
            setTimeout(() => wordleToastEl.classList.add("hidden"), 300);
        }, duration);
    }

    function shakeCurrentRow() {
        const rowEl = wordleGridEl.querySelector(`.wordle-row[data-row="${currentRow}"]`);
        if (!rowEl) return;
        rowEl.classList.remove("row-shake");
        void rowEl.offsetWidth; // re-flow
        rowEl.classList.add("row-shake");
        setTimeout(() => rowEl.classList.remove("row-shake"), 500);
    }

    // ── Input Handling & Guess Submission ────────────────────────
    function handleKeyInput(key) {
        if (isGameOver || isRevealing || isValidating) return;

        if (key === "ENTER") {
            submitGuess();
        } else if (key === "BACKSPACE") {
            deleteLetter();
        } else if (/^[A-Z]$/.test(key)) {
            addLetter(key);
        }
    }

    function addLetter(letter) {
        if (currentTileIndex >= WORD_LENGTH || currentRow >= MAX_ROWS) return;

        const rowEl = wordleGridEl.querySelector(`.wordle-row[data-row="${currentRow}"]`);
        if (!rowEl) return;

        const tileEl = rowEl.querySelector(`.wordle-tile[data-col="${currentTileIndex}"]`);
        if (!tileEl) return;

        tileEl.textContent = letter;
        tileEl.classList.add("tile-pop", "tile-filled");
        setTimeout(() => tileEl.classList.remove("tile-pop"), 180);

        currentTileIndex++;
    }

    function deleteLetter() {
        if (currentTileIndex <= 0 || currentRow >= MAX_ROWS) return;

        currentTileIndex--;
        const rowEl = wordleGridEl.querySelector(`.wordle-row[data-row="${currentRow}"]`);
        if (!rowEl) return;

        const tileEl = rowEl.querySelector(`.wordle-tile[data-col="${currentTileIndex}"]`);
        if (tileEl) {
            tileEl.textContent = "";
            tileEl.classList.remove("tile-filled");
        }
    }

    async function submitGuess() {
        // 1. Must have 5 letters
        if (currentTileIndex < WORD_LENGTH) {
            shakeCurrentRow();
            showToast("Please enter 5 letters", 1600);
            return;
        }

        const rowEl = wordleGridEl.querySelector(`.wordle-row[data-row="${currentRow}"]`);
        if (!rowEl) return;

        let guess = "";
        for (let c = 0; c < WORD_LENGTH; c++) {
            const tileEl = rowEl.querySelector(`.wordle-tile[data-col="${c}"]`);
            guess += (tileEl ? tileEl.textContent : "");
        }
        guess = guess.toUpperCase();

        // 2. Validate word against API
        isValidating = true;
        const isValid = await isValidEnglishWord(guess);
        isValidating = false;

        if (!isValid) {
            shakeCurrentRow();
            showToast("This is not a valid word, try another word in mind.", 2500);
            // Crucial: do NOT advance row, do NOT consume try, let player edit letters!
            return;
        }

        // 3. Word is valid -> evaluate against mystery word
        const statuses = evaluateGuess(guess, currentTargetWord);
        guesses.push(guess);
        evaluations.push(statuses);

        isRevealing = true;
        revealRowAnimation(rowEl, statuses, guess, () => {
            isRevealing = false;
            const allCorrect = statuses.every((s) => s === "correct");

            if (allCorrect) {
                isGameOver = true;
                isWon = true;
                markVisitorCompleted();
                triggerWinCelebration(rowEl);
            } else {
                currentRow++;
                currentTileIndex = 0;

                if (currentRow >= MAX_ROWS) {
                    isGameOver = true;
                    isWon = false;
                    markVisitorCompleted();
                    triggerLossReveal();
                }
            }
        });
    }

    function revealRowAnimation(rowEl, statuses, guess, onComplete) {
        const tiles = Array.from(rowEl.querySelectorAll(".wordle-tile"));
        const staggerDelay = 260; // ms per tile flip

        tiles.forEach((tile, index) => {
            setTimeout(() => {
                tile.classList.add("tile-flip");

                setTimeout(() => {
                    tile.classList.add(`tile-${statuses[index]}`);
                    updateKeyStatus(guess[index], statuses[index]);
                }, 220);

                setTimeout(() => {
                    tile.classList.remove("tile-flip");
                }, 500);
            }, index * staggerDelay);
        });

        const totalTime = (WORD_LENGTH * staggerDelay) + 300;
        setTimeout(() => {
            if (onComplete) onComplete();
        }, totalTime);
    }

    function updateKeyStatus(letter, newStatus) {
        const current = keyStatuses[letter];
        if (current === "correct") return;
        if (current === "present" && newStatus === "absent") return;

        keyStatuses[letter] = newStatus;

        if (!wordleKeyboardEl) return;
        const keyBtn = wordleKeyboardEl.querySelector(`.key-btn[data-key="${letter}"]`);
        if (keyBtn) {
            keyBtn.classList.remove("key-correct", "key-present", "key-absent");
            keyBtn.classList.add(`key-${newStatus}`);
        }
    }

    // ── Win / Game Over Celebrations & Modals ─────────────────────
    function triggerWinCelebration(rowEl) {
        const tiles = Array.from(rowEl.querySelectorAll(".wordle-tile"));
        tiles.forEach((tile, i) => {
            setTimeout(() => tile.classList.add("tile-win-dance"), i * 100);
        });

        if (window.confettiCanvas) {
            launchWordleConfetti();
        }

        setTimeout(() => {
            showWordleSuccessModal(true);
        }, 1100);
    }

    function triggerLossReveal() {
        setTimeout(() => {
            showWordleSuccessModal(false);
        }, 800);
    }

    function showWordleSuccessModal(isWinResult) {
        if (!wordleModalOverlayEl) return;

        if (isWinResult) {
            wordleModalTitleEl.textContent = "Congratulations!";
            wordleModalSubtitleEl.textContent = "You got the right word";
            btnWordleProceedEl.textContent = "Proceed to Quiz →";
        } else {
            wordleModalTitleEl.textContent = "So Close!";
            wordleModalSubtitleEl.textContent = "Here is today's mystery word";
            btnWordleProceedEl.textContent = "Proceed to Quiz →";
        }

        wordleRevealedWordEl.textContent = currentTargetWordObj.word;
        wordleWordPhoneticEl.textContent = currentTargetWordObj.phonetic || "";
        wordleWordTagEl.textContent = currentTargetWordObj.partOfSpeech || "word";
        wordleRevealedMeaningEl.textContent = currentTargetWordObj.meaning;
        wordleRevealedSentenceEl.textContent = `"${currentTargetWordObj.sentence}"`;

        wordleModalOverlayEl.classList.remove("hidden");
        wordleModalOverlayEl.classList.add("modal-open");
    }

    function hideWordleModal() {
        if (!wordleModalOverlayEl) return;
        wordleModalOverlayEl.classList.remove("modal-open");
        wordleModalOverlayEl.classList.add("hidden");
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    }

    function launchWordleConfetti() {
        const canvas = document.getElementById("confettiCanvas");
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        canvas.style.display = "block";
        const ctx = canvas.getContext("2d");
        const colors = ["#22c55e", "#eab308", "#38bdf8", "#f97316", "#ffffff", "#a855f7"];
        const pieces = [];

        for (let i = 0; i < 140; i++) {
            pieces.push({
                x: Math.random() * canvas.width,
                y: -20,
                w: 6 + Math.random() * 10,
                h: 6 + Math.random() * 10,
                color: colors[Math.floor(Math.random() * colors.length)],
                rot: Math.random() * 360,
                drot: (Math.random() - 0.5) * 8,
                dx: (Math.random() - 0.5) * 4,
                dy: 3 + Math.random() * 5,
                alpha: 1
            });
        }

        let frame;
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let alive = false;
            pieces.forEach((p) => {
                if (p.y < canvas.height + 30) {
                    alive = true;
                    ctx.save();
                    ctx.translate(p.x, p.y);
                    ctx.rotate((p.rot * Math.PI) / 180);
                    ctx.globalAlpha = p.alpha;
                    ctx.fillStyle = p.color;
                    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
                    ctx.restore();
                    p.x += p.dx;
                    p.y += p.dy;
                    p.rot += p.drot;
                    p.alpha = Math.max(0, p.alpha - 0.009);
                }
            });
            if (alive) {
                frame = requestAnimationFrame(draw);
            } else {
                canvas.style.display = "none";
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }

        if (frame) cancelAnimationFrame(frame);
        draw();
    }

    // ── Setup & Reset ────────────────────────────────────────────
    function resetBoard(newWordObj) {
        if (newWordObj) {
            currentTargetWordObj = newWordObj;
            currentTargetWord = newWordObj.word.toUpperCase();
        }
        guesses = [];
        evaluations = [];
        currentRow = 0;
        currentTileIndex = 0;
        isGameOver = false;
        isWon = false;
        isRevealing = false;
        isValidating = false;

        // Reset keyboard statuses
        Object.keys(keyStatuses).forEach((k) => delete keyStatuses[k]);

        hideWordleModal();
        renderGrid();
        renderKeyboard();
        updateSkipButtonVisibility();

        if (wordleDatePillEl) {
            wordleDatePillEl.textContent = `Today: ${formatDateFriendly()} • 5 Letters`;
        }
    }

    function attachGlobalListeners() {
        window.addEventListener("keydown", (e) => {
            if (!screenWordleEl || !screenWordleEl.classList.contains("active")) return;
            if (wordleModalOverlayEl && !wordleModalOverlayEl.classList.contains("hidden")) {
                if (e.key === "Enter") {
                    e.preventDefault();
                    handleProceed();
                }
                return;
            }

            if (e.key === "Enter") {
                e.preventDefault();
                handleKeyInput("ENTER");
            } else if (e.key === "Backspace") {
                e.preventDefault();
                handleKeyInput("BACKSPACE");
            } else if (/^[a-zA-Z]$/.test(e.key)) {
                handleKeyInput(e.key.toUpperCase());
            }
        });

        // Audio Buttons
        if (btnAudioWordEl) {
            btnAudioWordEl.addEventListener("click", () => {
                if (currentTargetWordObj) speak(currentTargetWordObj.word, btnAudioWordEl);
            });
        }

        if (btnAudioMeaningEl) {
            btnAudioMeaningEl.addEventListener("click", () => {
                if (currentTargetWordObj) speak(currentTargetWordObj.meaning, btnAudioMeaningEl);
            });
        }

        if (btnAudioSentenceEl) {
            btnAudioSentenceEl.addEventListener("click", () => {
                if (currentTargetWordObj) speak(currentTargetWordObj.sentence, btnAudioSentenceEl);
            });
        }

        // Modal Proceed Button
        if (btnWordleProceedEl) {
            btnWordleProceedEl.addEventListener("click", handleProceed);
        }

        // Random New Word Button (Direct API Fetch)
        if (btnWordleRandomWordEl) {
            btnWordleRandomWordEl.addEventListener("click", async () => {
                if (isFetchingWord) return;
                isFetchingWord = true;
                showToast("Fetching new word from API...", 1500);
                try {
                    const freshWord = await fetchFreshWordFromAPI();
                    resetBoard(freshWord);
                    showToast("New mystery word ready!", 1600);
                } catch (e) {
                    showToast("Could not fetch new word", 1600);
                } finally {
                    isFetchingWord = false;
                }
            });
        }

        // Back to Menu
        if (btnWordleBackEl) {
            btnWordleBackEl.addEventListener("click", () => {
                hideWordleModal();
                if (typeof onBackCallback === "function") {
                    onBackCallback();
                }
            });
        }

        // Skip to Quiz
        if (btnWordleSkipEl) {
            btnWordleSkipEl.addEventListener("click", () => {
                markVisitorCompleted();
                handleProceed();
            });
        }
    }

    function handleProceed() {
        markVisitorCompleted();
        hideWordleModal();
        if (typeof onProceedCallback === "function") {
            onProceedCallback();
        }
    }

    // ── Public API ───────────────────────────────────────────────
    async function startWordle(options = {}) {
        initDOMReferences();
        onProceedCallback = options.onProceed || null;
        onBackCallback = options.onBack || null;
        activePlayerName = options.playerName || "Teacher Ash";
        activePlayerImage = options.playerImage || "ashhead.png";

        const playerPillEl = document.getElementById("wordlePlayerPill");
        if (playerPillEl) {
            playerPillEl.innerHTML = `<img src="${activePlayerImage}" alt="" class="wordle-player-thumb" /><span>Playing as <strong>${activePlayerName}</strong></span>`;
        }

        updateSkipButtonVisibility();

        if (!currentTargetWordObj) {
            const todayWord = await getDailyMysteryWord();
            resetBoard(todayWord);
        } else {
            renderGrid();
            renderKeyboard();
        }
    }

    async function init() {
        initDOMReferences();
        attachGlobalListeners();
        updateSkipButtonVisibility();

        // Fetch / load today's mystery word directly from API
        currentTargetWordObj = await getDailyMysteryWord();
        currentTargetWord = currentTargetWordObj.word.toUpperCase();
    }

    // Expose to window
    window.MaoWordle = {
        init,
        startWordle,
        reset: async () => resetBoard(await getDailyMysteryWord()),
        setRandomWord: async () => resetBoard(await fetchFreshWordFromAPI()),
        getCurrentWord: () => currentTargetWordObj,
        isValidEnglishWord,
        updateSkipButtonVisibility
    };

    // Auto-init on load
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
