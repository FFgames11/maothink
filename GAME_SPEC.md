# MaoThink – Game Specification Document

> **Purpose:** This document is the canonical reference for the MaoThink livestream quiz game. Any AI assistant picking up future updates should read this first to understand the full context, mechanics, and design decisions before making changes.

---

## 1. Project Overview

**Name:** MaoThink  
**Type:** Browser-based interactive quiz game, designed for use as an overlay or screen during a livestream.  
**Tagline:** "How smart are you today?"  
**Tech Stack:** Vanilla HTML, CSS, JavaScript — no frameworks, no build step needed.  
**Entry Point:** `index.html` (loads `style.css`, `questions.js`, `questions-extra.js`, `question-facts.js`, `question-generator.js`, and `game.js` in that order)

### File Structure

Question logic is split across `questions.js` and `questions-extra.js` (legacy/configuration and shared base facts), `question-facts.js` (new verified raw facts), and `question-generator.js` (weighted persistent generation).

```
livestream game/
├── index.html        — Full game markup and screen structure
├── style.css         — All visual styling, animations, and responsive rules
├── game.js           — All game logic, state management, and UI control
├── questions.js      — Question pool and configuration constants
├── mascot.png        — MaoThink mascot image (bouncing cat-like character)
├── chellehead.png    — Player character head image (circular avatar used in the staircase climber and correct-answer notification)
└── GAME_SPEC.md      — This document
```

---

## 2. Game Flow (Screens)

The game has **three primary screens** managed via CSS classes (`.screen`, `.active`, `.exiting`):

### 2.1 Start Screen (`#screenStart`)
- Displayed on initial load.
- Shows the MaoThink mascot with a bouncing animation.
- Displays the brand name "**Mao**Think" in two-color typography.
- Three stat pills:
  - `?` — "50 Levels"
  - `T` — "Multiple Choice"
  - `!` — "One Chance"
- A **"Let's Play!"** button triggers `startGame()`.

### 2.2 Quiz Screen (`#screenQuiz`)
- The main gameplay screen.
- Fixed brand panel in top-left (mascot + "MaoThink" name).
- A **mascot peek** element (`.quiz-mascot-peek`): the mascot is absolutely positioned above the question card via a `.card-wrapper` positioning context. It uses `top: -170px`, `width: 280px`, `z-index: 1`. The lower body overlaps/hides behind the card. It bounces gently using `softBounce` animation. These values were manually tuned by the developer — **do not change them without checking visually first**.
- A **question card** (glass-morphism style) showing:
  - Level counter (e.g., "Level 1 / 50")
  - The question text
  - A "One chance only" warning row
- A **2-column choices grid** with four answer buttons (A, B, C, D).
- A **staircase climber panel** fixed on the right side of the screen.
- **No category ribbon** — the category label was removed from the UI.

### 2.3 Result Screen (`#screenResult`)
- Displayed after all levels are completed.
- Shows mascot (bouncing).
- A **dynamic title** based on performance (e.g., "Perfect Score", "Excellent", "Well Done", "Not Bad", "Keep Going").
- A **circular score ring** (SVG with animated stroke-dashoffset) showing the player's score vs. max score.
- A **result breakdown** listing every level with "cleared" or "missed" status.
- A **"Play Again"** button that resets and restarts the game.

### Screen Transitions
Screens fade out with a slight downward slide (`translateY(22px) scale(0.985)`) and fade in from slightly below (`translateY(18px) scale(0.99)`). Transition duration is **350ms**.

---

## 3. Question System

> **Current implementation (September 2026):** The runtime question system is fully generated rather than selected from `QUESTION_POOL` or `HARD_QUESTION_POOL`. `question-generator.js` constructs questions on demand using procedural rules and verified local fact tables. The legacy question objects remain loaded for backward-compatible saved sessions, but new games never select from them.

### 3.0 Runtime Generator (`question-generator.js`)

- A new random seed is created at the start of every normal or challenge game.
- Regular questions use a weighted mix: approximately 10% basic arithmetic and 90% knowledge/pop-culture generators.
- The basic arithmetic group contains addition, subtraction, multiplication, division, and percentages. Each accounts for approximately 2% of regular questions.
- Hard questions use only harder geography and harder science templates. Algebra, order-of-operations, and power generators are retired and are also replaced when found in an older saved generated session.
- Every generated question is validated to contain exactly four unique choices and exactly one included correct answer.
- Prompt text is tracked throughout the session to prevent generated duplicates.
- Every generator category traverses a shuffled permutation of all its compact combination indexes. A combination cannot repeat until that category completes its entire cycle.
- Persistent cycle records are stored under `maothink-question-history-v1` in `localStorage`. Each record contains only its category size, cycle, position, permutation parameters, and last index—not full question text.
- Exhaustion resets only the depleted category. The new cycle uses a different permutation and cannot begin with the question that ended the previous cycle.
- The seed, current generator state, generated question list, and seen prompt list are saved in `sessionStorage`, so a reload resumes the same game reliably.
- Normal mode still uses 40 regular 10-point questions followed by 10 hard 20-point questions.
- Challenge mode generates seven regular and three hard questions, then shuffles their order.
- Wrong-answer fallback levels receive a newly generated unseen question at the appropriate difficulty.

### 3.1 Legacy Question Pool (`questions.js`)

The following arrays are retained for backward compatibility with sessions created before the generator migration. They are not a source for newly started games.

- **`GAME_QUESTION_COUNT`** = `50` (the number of levels per game session)
- **`QUESTION_POOL`** = a large array of question objects. Currently contains **~216 questions** across three "games" worth of content (GAME 1, GAME 2, GAME 3 + hard final round).

**Each question object has:**
```js
{
  category: "🌍 Geography",   // Emoji + category label string
  question: "...",             // The question text
  choices: ["A", "B", "C", "D"], // Always exactly 4 choices
  answer: "...",               // Must match one of the choices exactly
  points: 10 | 20             // Point value for the question
}
```

### 3.2 Generated Question Difficulty Tiers

Generated sessions are split into two tiers by level:

| Tier | Source | Points | Appears At |
|---|---|---|---|
| Regular | Regular generator categories | 10 pts | Levels 1–40 |
| Hard (Final Round) | Hard generator categories | 20 pts | Levels 41–50 |

- `FINAL_ROUND_COUNT` = `Math.min(10, TOTAL_QS, QUESTION_POOL.length)` = **10**
- `REGULAR_LEVEL_COUNT` = `TOTAL_QS - FINAL_ROUND_COUNT` = **40**

### 3.3 Question List Construction (`buildQuestionList`)

On game start:
1. Creates a fresh seeded generator that loads persistent category-cycle positions from `localStorage`.
2. Generates 40 unique regular questions.
3. Generates 10 unique hard questions for the final round.
4. Saves the resulting questions and generator state to `sessionStorage`.

> **Important:** Hard questions always occupy the last 10 levels in normal mode. Challenge mode generates seven regular and three hard questions and shuffles them together.

### 3.4 Wrong Answer — Question Refresh (`refreshQuestionForLevel`)

When a player answers wrong:
- They fall back one level (see §4.3).
- When re-entering that level, `refreshQuestionForLevel(index)` is called.
- It generates a question that is **both (a) different from the current assignments and (b) not yet seen this session** (`answeredQuestions` Set).
- A seen question is any question that was ever *loaded onto the screen*, tracked via `answeredQuestions.add()` at the top of `loadQuestion()`.
- The replacement advances the relevant persistent generator category, so it also cannot repeat a question used in an earlier game until that category's full cycle is exhausted.
- `answeredQuestions` is reset to an empty `Set` on every `startGame()` call.

### 3.5 Current Categories

Regular generator families:

- Basic arithmetic (low-probability group)
- Capitals and world geography
- Chemical elements, astronomy, and biology
- General literature and literary characters
- Inventions and technology
- World history
- Famous international songs
- Famous games (company and protagonist patterns)
- Famous anime (premise and creator patterns)
- Famous movies (director and story-clue patterns)
- Famous artists and celebrities

Hard generator families:

- Hard geography
- Hard science

---

## 4. Core Gameplay Mechanics

### 4.1 One-Chance Rule
- Each level offers **exactly one attempt**.
- Once a choice is clicked, `answered = true` is set immediately; all further clicks are ignored.
- All buttons are disabled after an answer is submitted.

### 4.2 Correct Answer
1. The selected button gets the `choice-correct` class (green highlight).
2. `score += question.points` (10 or 20).
3. Result logged: `{ level, question, correct: true, attempts: 1 }`.
4. Confetti burst (80 particles).
5. Success notification shown: player head image + "Correct" + answer text + `+N pts`.
6. **Climber moves up** one step on the staircase.
7. After **1700ms**, the game advances to the next level.

### 4.3 Wrong Answer
1. The selected button gets the `choice-wrong` class (red highlight) + a `wrongFlash` shake animation.
2. The question card gets a `shake` animation.
3. All other choices are dimmed (`choice-dim`), and the **correct answer is highlighted** green.
4. Error notification shown: "Wrong answer" + "Correct answer: [Label]. [Text]".
5. **Climber falls back** one step on the staircase.
6. Result logged: `{ level, question, correct: false, attempts: 1 }`.
7. After **1800ms**, the game moves back to `currentIndex - 1` (one level back), loading a **refreshed question** for that level.
8. `currentIndex` can never go below `0` (clamped).

> **Key mechanic:** A wrong answer does NOT end the game. It sends the player one level backward and gives them a new question for that level. The game only ends when `currentIndex >= questionList.length` (i.e., after completing level 50).

### 4.4 Scoring
- Max possible score = sum of all question `points` values in the session.
- A 50-level session has 40 × 10pt + 10 × 20pt = **600 points max**.
- Score is cumulative; only correct answers add points.
- Wrong answers subtract no points (no penalty beyond falling back a level).

### 4.5 End-of-Game Condition
- When `currentIndex` reaches `questionList.length` (after correctly answering level 50), `endGame()` is called.
- The **Dance Overlay** triggers first, then the Result Screen.

---

## 5. Staircase Climber

This is the signature visual mechanic of MaoThink — a staircase on the right side of the screen where a character (using `krishhead.png` as a circular avatar) physically climbs or falls with each answer.

### 5.1 Staircase Structure
- **5 visible steps** at a time (`TOTAL_STEPS = 5`), rendered as `.step-1` through `.step-5`.
- Each step has a level number label beneath it.
- Steps have three visual states:
  - **Default** — uncleared (dimmed label)
  - **`step-cleared`** — levels below the player (orange-tinted label)
  - **`step-active`** — the player's current level (bright orange/gold gradient label)
  - **`step-focus`** — the next question's level (white border highlight)

### 5.2 Camera Window System
- The staircase acts as a **sliding camera window** over 50 levels.
- `getWindowStart(level)` computes which 5 levels are visible, anchoring the player near **slot 3** (`CAMERA_ANCHOR_SLOT = 3`).
- `getVisibleSlot(level)` returns where (1–5) the player appears on screen.

### 5.3 Staircase Panning Animation
- When the player moves and the window needs to shift, the `stairTrack` element pans with a CSS animation (`stairTrackPan`, 680ms, cubic-bezier spring).
- Pan direction:
  - **Climb** (window shifts forward): pan `−60px, +40px` (left and up — the staircase scrolls upward).
  - **Fall** (window shifts back): pan `+60px, −40px`.
- After the pan animation, `stairWindowStart` is updated and labels are refreshed.

### 5.4 Climber Position Coordinates
The climber (`#climber`) is absolutely positioned. Hard-coded coordinates per slot:

| Slot | `left` | `bottom` |
|------|--------|----------|
| 0 | 10px | 4px |
| 1 | 42px | 48px |
| 2 | 102px | 88px |
| 3 | 162px | 128px |
| 4 | 222px | 168px |
| 5 | 282px | 208px |

CSS `transition` on `.climber` (500ms cubic-bezier spring) handles the smooth glide between positions.

### 5.5 Climber Animations
- **Idle:** `characterIdle` — subtle float up/down + slight rotation (1.8s loop).
- **Step Up:** `stepUpAnim` — squash, jump arc, land with bounce (680ms, cubic-bezier spring).
- **Fall Back:** `fallBackAnim` — brief float up then fall with rotation (700ms).
- **Shadow:** Scales down during movement animations for grounding effect.

### 5.6 Speech Bubble
A white speech bubble floats above the climber with contextual messages based on progress:
- `playerLevel < 1` → "Answer correctly to climb higher."
- `playerLevel < 10` → "Good start. Keep climbing."
- `playerLevel < 25` → "You are building momentum."
- `playerLevel < 40` → "You are in the higher levels now."
- `playerLevel < 50` → "Final stretch. Stay sharp."
- `playerLevel >= 50` → "You made it to the top."

---

## 6. Dance Overlay (Game Completion Celebration)

When all 50 levels are cleared, before showing results:

1. A full-screen **Dance Overlay** (`#danceOverlay`) appears with an orange→gold→blue gradient background.
2. Shows the mascot bouncing, "DANCE TIME!" in large text, and the message **"The teacher will now dance live for you!"** — this is a livestream-specific hook where the real host performs.
3. A **big confetti burst** (220 particles) is launched.
4. Player clicks **"See Results →"** to dismiss and proceed to the Result Screen.
5. If score ≥ 60% of max, another confetti burst fires on the Result Screen.

---

## 7. Visual Design System

### 7.1 Color Palette (CSS Custom Properties)

| Variable | Value | Usage |
|---|---|---|
| `--clr-bg` | `#120712` | Main background |
| `--clr-bg-deep` | `#09040d` | Deepest background tone |
| `--clr-panel` | `rgba(21,15,39,0.76)` | Glass card backgrounds |
| `--clr-panel-strong` | `rgba(18,12,34,0.92)` | Darker panels |
| `--clr-text` | `#fff9f2` | Primary text |
| `--clr-text-dim` | `rgba(255,244,231,0.72)` | Secondary/dimmed text |
| `--clr-border` | `rgba(255,255,255,0.14)` | Card borders |
| `--clr-orange` | `#f97316` | Primary accent (buttons, steps, ring) |
| `--clr-amber` | `#fbbf24` | Secondary accent (gradients) |
| `--clr-red` | `#ef4444` | Wrong answer feedback |
| `--clr-blue` | `#38bdf8` | Background accent spotlight |
| `--clr-green` | `#22c55e` | Correct answer feedback |

### 7.2 Typography

| Variable | Font | Usage |
|---|---|---|
| `--font-body` | Nunito (400/600/700/800/900) | All body text, choices, labels |
| `--font-brand` | Fredoka (500/600/700) | Brand name, Dance Overlay title, Result title |

Both fonts loaded from **Google Fonts**.

### 7.3 Background Layers

The background is composed of multiple stacked layers (bottom to top):
1. **Body gradient** — deep purple/dark radial + linear gradient (`#0d0615 → #18091b → #120712`).
2. **`#bgCanvas`** — animated floating white particles (60 particles, slow drift).
3. **`.bg-grid`** — subtle 34×34px grid lines with radial mask fade.
4. **`.floating-shapes`** — 20 random symbols (`? ! * # $ % & + = ~`) floating upward (opacity 0.08–0.26).
5. **`.spotlight-1`** — top-right orange glow blur.
6. **`.spotlight-2`** — bottom-left blue glow blur.

### 7.4 Glassmorphism (`.glass-card`)
Applied to: start card, question card, result card.
- `backdrop-filter: blur(20px)`
- Subtle white gradient overlay on top
- `--clr-panel` semi-transparent background
- `1px solid rgba(255,255,255,0.14)` border
- Large drop shadow

### 7.5 Buttons

| Class | Style |
|---|---|
| `.btn-primary` | Orange→Amber gradient, dark text |
| `.btn-glow` | Orange glow box-shadow |
| `.btn-next` | Semi-transparent white, large (44px font) |

All buttons: `border-radius: 18px`, lift on hover (`translateY(-2px)`), press on active (`translateY(1px)`).

---

## 8. Notification System

Notifications appear at **top-right** (fixed position, `z-index: 120`).

### Success Notification
- Shown for **2200ms**.
- Green-bordered card with player head image jumping, "Correct", the answer text, and point value in mint green.
- Triggers small confetti (80 particles).

### Wrong Answer Notification
- Shown for **1500ms**.
- Red-bordered card with "Wrong answer" + correct answer revealed.
- No image shown.

---

## 9. Confetti System

The confetti runs on `#confettiCanvas` (full-screen, `z-index: 180`, pointer-events: none).

- **Small burst** (correct answer): 80 particles.
- **Big burst** (dance overlay / good result): 220 particles.
- Colors: `#FFD700, #FF6B6B, #4ECDC4, #A855F7, #3B82F6, #F59E0B, #10B981, #EC4899`
- Particles fall from top with random horizontal drift, rotation, and fade-out.
- Canvas hides itself when all particles leave the screen.

---

## 10. Responsive Design

| Breakpoint | Changes |
|---|---|
| `≤ 1180px` | Quiz padding reduced right; staircase scales to 1.16× |
| `≤ 900px` | Quiz uses bottom padding for staircase (stacks below); choices go 1-column; notifications move to bottom |
| `≤ 560px` | Font size reduces to 16px; cards have tighter padding; staircase scales to 0.9× |

---

## 11. State Variables

| Variable | Type | Description |
|---|---|---|
| `questionList` | `Array` | Ordered list of question objects for the current session |
| `currentIndex` | `number` | 0-based index of the current level (0 = Level 1) |
| `score` | `number` | Cumulative points earned |
| `answered` | `boolean` | Guard to prevent double-answer on current question |
| `results` | `Array` | Log of `{ level, question, correct, attempts }` per level attempt |
| `playerLevel` | `number` | Staircase position (1-based; 0 = not started) |
| `stairWindowStart` | `number` | First level number visible in the staircase window |
| `currentCorrectMeta` | `Object/null` | `{ label, answer }` for the current question's correct choice |
| `answeredQuestions` | `Set` | Question text shown this session; prevents repeats during generation and fall-back movement |
| `questionGeneratorSeed` | `number` | Seed for the current session's pseudorandom generator |
| `questionGenerator` | `Object/null` | Active generator with session PRNG state and persistent category-cycle access |

---

## 12. Key Design Decisions & Context

1. **"One Chance" branding** — The game is explicitly marketed as one chance per question. Wrong answers don't end the game but *push the player back*, creating a rubber-band tension ideal for a live audience watching on stream.

2. **"The teacher will now dance"** — The dance overlay is a **real-world livestream mechanic**. When a viewer/student clears all 50 levels, the host (teacher) performs a live dance on stream. Do not remove this.

3. **`chellehead.png`** — The face/avatar image of the current player character used as the staircase climber and in the correct-answer notification popup. It is displayed as a 56×56px circle with a white border.

4. **`mascot.png`** — The MaoThink branded mascot. Used on the start screen, result screen, dance overlay, the fixed top-left brand panel during the quiz, and the **mascot peek** element that peeks above the question card.

5. **Persistent generated cycles** — New games use `question-generator.js`, not the legacy question objects. Each generator category walks a compact shuffled combination cycle stored in `localStorage`, preventing cross-game repeats until that category is exhausted.

6. **Legacy pools remain loaded** — `questions.js` and the old question arrays remain for configuration, fact data setup, and backward-compatible session restoration. Do not use them when constructing a new game.

7. **No timer** — Intentional. There is no countdown per question. The livestream host controls pacing verbally.

8. **No lives/hearts** — The `heartRow` element exists in the DOM and `renderHearts()` is called but renders nothing. The original design had hearts; they were removed in favor of the "one chance + fall back" mechanic. The element should remain for potential future use.

---

## 13. Adding New Questions (Instructions for AI)

To add a generated question family:
1. Open `question-generator.js`.
2. Add a definition to `regularGenerators` or `hardGenerators` with a stable, unique `kind`, the exact number of possible combinations in `size`, and an index-driven `build()` function.
3. Decode the supplied combination index deterministically. Do not choose the question's core operands or fact randomly inside `build()`; otherwise the cycle cannot guarantee uniqueness.
4. Random answer-choice ordering and distractor construction are allowed because they do not change the question identity.
5. Pass the definition, cycle, and combination index to `makeQuestion()` so `generatorKey` remains compact and stable.
6. Ensure every result has exactly four unique choices and that `answer` matches one choice exactly.

To add verified fact content, extend the relevant fact table in `question-facts.js` (or the shared legacy base tables in `questions-extra.js`). Changing a category's calculated `size` automatically starts a fresh compatible cycle record for that category.

---

## 14. Potential Future Features (Ideas, Not Implemented)

- **Timer per question** — Add a countdown (e.g., 30 seconds) per question.
- **Lives/Hearts** — Re-implement the `heartRow` (DOM is already in place) with a limited number of retries before game over.
- **Leaderboard / Score Save** — LocalStorage or backend integration for tracking high scores.
- **Sound Effects** — Correct/wrong/climb audio cues.
- **Multiple game modes** — e.g., speed mode, category-only mode.
- **Viewer participation** — Poll-style overlay where viewers vote on answers via chat.
- **Difficulty selection** — Let players choose Easy/Medium/Hard before starting.
