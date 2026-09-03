/* ============================================================
   MaoThink - Game Logic
   ============================================================ */

(function () {
  "use strict";

  const TOTAL_STEPS = 5;
  const TOTAL_QS = GAME_QUESTION_COUNT;
  const FINAL_ROUND_COUNT = Math.min(10, TOTAL_QS, HARD_QUESTION_POOL.length);
  const REGULAR_LEVEL_COUNT = Math.max(0, TOTAL_QS - FINAL_ROUND_COUNT);
  const CAMERA_ANCHOR_SLOT = 3;
  const STEP_SHIFT_X = 90;
  const STEP_SHIFT_Y = 72;
  const STEP_COORDS = [
    [8, 4],
    [13, 158],
    [103, 230],
    [193, 302],
    [283, 374],
    [373, 446]
  ];

  let questionList = [];
  let currentIndex = 0;
  let score = 0;
  let answered = false;
  let results = [];
  let playerLevel = 0;
  let stairWindowStart = 1;
  let currentCorrectMeta = null;
  let stairPanTimer = null;
  let climberMotionTimer = null;
  let nextQuestionTimer = null;
  let pendingResume = null;
  let answeredQuestions = new Set(); // tracks every question object shown this session

  // ── Challenge Mode state ──
  let isChallengeMode = false;
  const CHALLENGE_TOTAL = 10;
  const CHALLENGE_SECONDS = 20;
  let challengeTimerInterval = null;
  let challengeSecondsLeft = CHALLENGE_SECONDS;

  const screenPlayerSelect = document.getElementById("screenPlayerSelect");
  const screenStart = document.getElementById("screenStart");
  const screenQuiz = document.getElementById("screenQuiz");
  const screenResult = document.getElementById("screenResult");
  const btnStart = document.getElementById("btnStart");
  const btnChallenge = document.getElementById("btnChallenge");
  const btnChangePlayer = document.getElementById("btnChangePlayer");
  const btnExitGame = document.getElementById("btnExitGame");
  const selectedPlayerThumb = document.getElementById("selectedPlayerThumb");
  const selectedPlayerName = document.getElementById("selectedPlayerName");
  const btnNext = document.getElementById("btnNext");
  const btnPlayAgain = document.getElementById("btnPlayAgain");
  const categoryIcon = null;  // removed — category ribbon no longer in UI
  const categoryName = null;   // removed — category ribbon no longer in UI
  const questionNumber = document.getElementById("questionNumber");
  const questionText = document.getElementById("questionText");
  const choicesGrid = document.getElementById("choicesGrid");
  const heartRow = document.getElementById("heartRow");
  const notifOverlay = document.getElementById("notifOverlay");
  const ringProgress = document.getElementById("ringProgress");
  const ringScore = document.getElementById("ringScore");
  const ringMax = document.getElementById("ringMax");
  const resultTitle = document.getElementById("resultTitle");
  const resultMessage = document.getElementById("resultMessage");
  const resultBreakdown = document.getElementById("resultBreakdown");
  const confettiCanvas = document.getElementById("confettiCanvas");
  const statQuestions = document.getElementById("statQuestions");
  const bgCanvas = document.getElementById("bgCanvas");
  const floatingShapes = document.getElementById("floatingShapes");
  const climbScene = document.getElementById("climbScene");
  const stairTrack = document.getElementById("stairTrack");
  const climber = document.getElementById("climber");
  const speechBubble = document.getElementById("speechBubble");
  const danceOverlay = document.getElementById("danceOverlay");
  const btnCloseDance = document.getElementById("btnCloseDance");
  const challengeFailOverlay = document.getElementById("challengeFailOverlay");
  const challengeWinOverlay = document.getElementById("challengeWinOverlay");
  const challengeFailReason = document.getElementById("challengeFailReason");
  const btnTryAgain = document.getElementById("btnTryAgain");
  const btnFailBack = document.getElementById("btnFailBack");
  const btnWinBack = document.getElementById("btnWinBack");
  const challengeTimerBar = document.getElementById("challengeTimerBar");
  const challengeTimerFill = document.getElementById("challengeTimerFill");
  const challengeTimerText = document.getElementById("challengeTimerText");
  const maolingoBadge = document.getElementById("maolingoBadge");
  const climberHeadImage = document.getElementById("climberHeadImage");
  const playerOptions = Array.from(document.querySelectorAll(".player-option"));
  const stepEls = Array.from(climbScene.querySelectorAll(".step")).sort(
    (a, b) => Number(a.dataset.slot) - Number(b.dataset.slot)
  );
  const SESSION_KEY = "maothink-game-session-v1";
  let activeScreenState = "player-select";

  function saveSession(screen = activeScreenState) {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({
        version: 1,
        screen,
        selectedPlayerName: selectedPlayerName.textContent,
        selectedPlayerImage: climberHeadImage.getAttribute("src"),
        questionList,
        currentIndex,
        score,
        results,
        playerLevel,
        stairWindowStart,
        isChallengeMode,
        challengeSecondsLeft,
        pendingResume
      }));
    } catch (error) {
      console.warn("Unable to save the current MaoThink session.", error);
    }
  }

  function screenStateFor(element) {
    if (element === screenPlayerSelect) return "player-select";
    if (element === screenStart) return "menu";
    if (element === screenQuiz) return "quiz";
    return "result";
  }

  function activateScreenImmediately(screen) {
    [screenPlayerSelect, screenStart, screenQuiz, screenResult].forEach((section) => {
      section.classList.remove("active", "exiting");
    });
    screen.classList.add("active");
    activeScreenState = screenStateFor(screen);
  }

  function initBackground() {
    const symbols = ["?", "!", "*", "#", "$", "%", "&", "+", "=", "~"];
    floatingShapes.innerHTML = "";
    for (let i = 0; i < 20; i++) {
      const el = document.createElement("div");
      el.className = "f-shape";
      el.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      el.style.cssText = [
        `left: ${Math.random() * 100}%`,
        `top: ${Math.random() * 100}%`,
        `font-size: ${14 + Math.random() * 24}px`,
        `animation-delay: ${Math.random() * 8}s`,
        `animation-duration: ${6 + Math.random() * 10}s`,
        `opacity: ${0.08 + Math.random() * 0.18}`
      ].join(";");
      floatingShapes.appendChild(el);
    }

    const ctx = bgCanvas.getContext("2d");
    let width;
    let height;
    const particles = [];

    function resize() {
      width = bgCanvas.width = window.innerWidth;
      height = bgCanvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        r: 1 + Math.random() * 3,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        alpha: 0.1 + Math.random() * 0.4
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${particle.alpha})`;
        ctx.fill();
        particle.x += particle.dx;
        particle.y += particle.dy;
        if (particle.x < 0 || particle.x > width) particle.dx *= -1;
        if (particle.y < 0 || particle.y > height) particle.dy *= -1;
      });
      requestAnimationFrame(drawParticles);
    }

    drawParticles();
  }

  function showScreen(screen) {
    activeScreenState = screenStateFor(screen);
    saveSession(activeScreenState);
    [screenPlayerSelect, screenStart, screenQuiz, screenResult].forEach((section) => {
      section.classList.remove("active");
      section.classList.add("exiting");
    });
    setTimeout(() => {
      [screenPlayerSelect, screenStart, screenQuiz, screenResult].forEach((section) => section.classList.remove("exiting"));
      screen.classList.add("active");
    }, 350);
  }

  function selectPlayer(option) {
    const image = option.dataset.image;
    const name = option.dataset.name;
    climberHeadImage.src = image;
    climberHeadImage.alt = `${name} player head`;
    selectedPlayerThumb.src = image;
    selectedPlayerName.textContent = name;
    playerOptions.forEach((playerOption) => playerOption.classList.toggle("selected", playerOption === option));
    saveSession("menu");
    showScreen(screenStart);
  }

  function shuffle(items) {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [items[i], items[j]] = [items[j], items[i]];
    }
    return items;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function buildQuestionList() {
    // Pick FINAL_ROUND_COUNT random hard questions (no repeats)
    const hardQuestions = shuffle([...HARD_QUESTION_POOL]).slice(0, FINAL_ROUND_COUNT);
    const regularCount = Math.max(0, TOTAL_QS - hardQuestions.length);
    const selectedRegular = shuffle([...QUESTION_POOL]).slice(0, regularCount);
    return [...selectedRegular, ...hardQuestions].slice(0, TOTAL_QS);
  }

  function getQuestionPoolForLevel(levelIndex) {
    if (levelIndex < REGULAR_LEVEL_COUNT) {
      return QUESTION_POOL;
    }
    return HARD_QUESTION_POOL;
  }

  function getLevelRangeForLevel(levelIndex) {
    if (levelIndex < REGULAR_LEVEL_COUNT) {
      return [0, Math.max(0, REGULAR_LEVEL_COUNT - 1)];
    }
    return [REGULAR_LEVEL_COUNT, Math.max(REGULAR_LEVEL_COUNT, TOTAL_QS - 1)];
  }

  function refreshQuestionForLevel(levelIndex) {
    if (levelIndex < 0 || levelIndex >= questionList.length) return;

    const currentQuestion = questionList[levelIndex];
    const [rangeStart, rangeEnd] = getLevelRangeForLevel(levelIndex);
    const pool = getQuestionPoolForLevel(levelIndex);
    const assignedInBand = questionList.slice(rangeStart, rangeEnd + 1);

    // Exclude questions already seen/answered this session to avoid repeats
    const availableQuestions = pool.filter(
      (candidate) =>
        candidate !== currentQuestion &&
        !assignedInBand.includes(candidate) &&
        !answeredQuestions.has(candidate)
    );

    if (availableQuestions.length > 0) {
      questionList[levelIndex] = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
      return;
    }

    // Fallback: try any unseen question in the band (ignoring assignedInBand restriction)
    const unseenFallback = pool.filter(
      (candidate) => candidate !== currentQuestion && !answeredQuestions.has(candidate)
    );
    if (unseenFallback.length > 0) {
      questionList[levelIndex] = unseenFallback[Math.floor(Math.random() * unseenFallback.length)];
      return;
    }

    // Last resort: swap within the band (pool exhausted — all questions seen)
    const swapCandidates = [];
    for (let i = rangeStart; i <= rangeEnd; i += 1) {
      if (i !== levelIndex && questionList[i] !== currentQuestion) {
        swapCandidates.push(i);
      }
    }

    if (swapCandidates.length > 0) {
      const swapIndex = swapCandidates[Math.floor(Math.random() * swapCandidates.length)];
      [questionList[levelIndex], questionList[swapIndex]] = [questionList[swapIndex], questionList[levelIndex]];
    }
  }

  function getWindowStart(level) {
    const maxWindowStart = Math.max(1, TOTAL_QS - TOTAL_STEPS + 1);
    return clamp(level - (CAMERA_ANCHOR_SLOT - 1), 1, maxWindowStart);
  }

  function getVisibleSlot(level) {
    if (level <= 0) return 0;
    return clamp(level - getWindowStart(level) + 1, 1, TOTAL_STEPS);
  }

  function clearNotification() {
    notifOverlay.classList.remove("visible");
    notifOverlay.innerHTML = "";
  }

  function clearNextQuestionTimer() {
    if (nextQuestionTimer) {
      clearTimeout(nextQuestionTimer);
      nextQuestionTimer = null;
    }
    pendingResume = null;
  }

  function queueNextQuestion(step = 1, refreshCurrentLevel = false, delay = 0) {
    clearNextQuestionTimer();
    pendingResume = {
      index: clamp(currentIndex + step, 0, questionList.length),
      refreshCurrentLevel
    };
    saveSession("quiz");
    nextQuestionTimer = setTimeout(() => {
      nextQuestionTimer = null;
      pendingResume = null;
      nextQuestion(step, refreshCurrentLevel);
    }, delay);
  }

  function updateSpeechBubble() {
    if (results.length === 0 && currentIndex === 0 && playerLevel === 1) {
      speechBubble.textContent = "Answer correctly to climb higher.";
    } else if (playerLevel < 10) {
      speechBubble.textContent = "Good start. Keep climbing.";
    } else if (playerLevel < 25) {
      speechBubble.textContent = "You are building momentum.";
    } else if (playerLevel < 40) {
      speechBubble.textContent = "You are in the higher levels now.";
    } else if (playerLevel < 50) {
      speechBubble.textContent = "Final stretch. Stay sharp.";
    } else {
      speechBubble.textContent = "You made it to the top.";
    }
  }

  function updateStairLabels() {
    const focusLevel = currentIndex + 1;
    stepEls.forEach((stepEl) => {
      const slot = Number(stepEl.dataset.slot);
      const level = stairWindowStart + slot - 1;
      const label = stepEl.querySelector(".step-level");
      label.textContent = String(level);
      stepEl.classList.toggle("step-cleared", level < playerLevel);
      stepEl.classList.toggle("step-active", playerLevel > 0 && level === playerLevel);
      stepEl.classList.toggle("step-focus", level === focusLevel);
    });
  }

  function clearStairPan() {
    if (stairPanTimer) {
      clearTimeout(stairPanTimer);
      stairPanTimer = null;
    }
    stairTrack.classList.remove("stair-pan");
    stairTrack.style.setProperty("--stair-pan-x", "0px");
    stairTrack.style.setProperty("--stair-pan-y", "0px");
  }

  function animateStairPan(deltaX, deltaY, nextWindowStart) {
    clearStairPan();
    stairTrack.style.setProperty("--stair-pan-x", `${deltaX}px`);
    stairTrack.style.setProperty("--stair-pan-y", `${deltaY}px`);
    stairTrack.classList.add("stair-pan");
    stairPanTimer = setTimeout(() => {
      stairTrack.classList.remove("stair-pan");
      stairTrack.style.setProperty("--stair-pan-x", "0px");
      stairTrack.style.setProperty("--stair-pan-y", "0px");
      stairWindowStart = nextWindowStart;
      updateStairLabels();
      stairPanTimer = null;
    }, 680);
  }

  function setClimberPosition(slot, motion) {
    const [leftPx, bottomPx] = STEP_COORDS[slot];
    climber.style.left = `${leftPx}px`;
    climber.style.bottom = `${bottomPx}px`;
    climber.style.right = "auto";

    climber.classList.remove("climber-step-up", "climber-fall");
    void climber.offsetWidth;

    if (climberMotionTimer) {
      clearTimeout(climberMotionTimer);
      climberMotionTimer = null;
    }

    if (motion === "up") {
      climber.classList.add("climber-step-up");
      climberMotionTimer = setTimeout(() => climber.classList.remove("climber-step-up"), 680);
    } else if (motion === "fall") {
      climber.classList.add("climber-fall");
      climberMotionTimer = setTimeout(() => climber.classList.remove("climber-fall"), 700);
    }
  }

  function initClimber() {
    playerLevel = 1;
    stairWindowStart = 1;
    clearStairPan();
    const initialSlot = getVisibleSlot(playerLevel);
    setClimberPosition(initialSlot);
    climber.style.transition = "none";
    const [leftPx, bottomPx] = STEP_COORDS[initialSlot];
    climber.style.left = `${leftPx}px`;
    climber.style.bottom = `${bottomPx}px`;
    void climber.offsetWidth;
    climber.style.transition = "";
    updateStairLabels();
    updateSpeechBubble();
    climbScene.style.display = "block";
  }

  function restoreClimber() {
    clearStairPan();
    stairWindowStart = getWindowStart(playerLevel || 1);
    const slot = getVisibleSlot(playerLevel || 1);
    climber.style.transition = "none";
    setClimberPosition(slot);
    void climber.offsetWidth;
    climber.style.transition = "";
    updateStairLabels();
    updateSpeechBubble();
    climbScene.style.display = "block";
  }

  function triggerClimb() {
    const previousLevel = playerLevel;
    const nextLevel = Math.min(TOTAL_QS, playerLevel + 1);
    if (nextLevel === previousLevel) return;

    const previousWindow = getWindowStart(previousLevel || 1);
    const nextWindow = getWindowStart(nextLevel);
    const previousSlot = getVisibleSlot(previousLevel);
    const nextSlot = getVisibleSlot(nextLevel);

    playerLevel = nextLevel;

    if (nextWindow !== previousWindow && previousSlot > 0 && nextSlot === previousSlot) {
      animateStairPan(-STEP_SHIFT_X, STEP_SHIFT_Y, nextWindow);
      setClimberPosition(previousSlot, "up");
    } else {
      stairWindowStart = nextWindow;
      updateStairLabels();
      setClimberPosition(nextSlot, "up");
    }

    updateSpeechBubble();
  }

  function triggerFall() {
    const previousLevel = playerLevel;
    const nextLevel = Math.max(1, playerLevel - 1);
    if (nextLevel === previousLevel) return;

    const previousWindow = getWindowStart(previousLevel || 1);
    const nextWindow = getWindowStart(nextLevel || 1);
    const previousSlot = getVisibleSlot(previousLevel);
    const nextSlot = getVisibleSlot(nextLevel);

    playerLevel = nextLevel;

    if (previousSlot > 0 && nextWindow !== previousWindow && nextSlot === previousSlot) {
      animateStairPan(STEP_SHIFT_X, -STEP_SHIFT_Y, nextWindow);
      setClimberPosition(previousSlot, "fall");
    } else {
      stairWindowStart = nextWindow;
      updateStairLabels();
      setClimberPosition(nextSlot, "fall");
    }

    updateSpeechBubble();
  }

  function showDanceOverlay() {
    maolingoBadge.classList.add("hidden");
    btnExitGame.classList.add("hidden");
    danceOverlay.classList.remove("hidden");
    danceOverlay.classList.add("dance-visible");
    launchConfetti(true);
    speechBubble.textContent = "Showtime.";
  }

  function startGame() {
    isChallengeMode = false;
    clearNextQuestionTimer();
    questionList = buildQuestionList();
    currentIndex = 0;
    score = 0;
    answered = false;
    results = [];
    currentCorrectMeta = null;
    answeredQuestions = new Set();
    clearNotification();
    statQuestions.textContent = `${TOTAL_QS} Levels`;
    danceOverlay.classList.add("hidden");
    danceOverlay.classList.remove("dance-visible");
    challengeTimerBar.classList.add("hidden");
    maolingoBadge.classList.remove("hidden");
    btnExitGame.classList.remove("hidden");
    initClimber();
    saveSession("quiz");
    showScreen(screenQuiz);
    setTimeout(loadQuestion, 400);
  }

  // ── Challenge Mode functions ──────────────────────────────────────────────

  function buildChallengeQuestionList() {
    // Combine both pools, shuffle, pick 10
    const combined = [...QUESTION_POOL, ...HARD_QUESTION_POOL];
    return shuffle([...combined]).slice(0, CHALLENGE_TOTAL);
  }

  function startChallenge() {
    isChallengeMode = true;
    clearNextQuestionTimer();
    stopChallengeTimer();
    questionList = buildChallengeQuestionList();
    currentIndex = 0;
    score = 0;
    answered = false;
    results = [];
    currentCorrectMeta = null;
    answeredQuestions = new Set();
    clearNotification();
    statQuestions.textContent = `${CHALLENGE_TOTAL} Levels`;
    danceOverlay.classList.add("hidden");
    danceOverlay.classList.remove("dance-visible");
    challengeFailOverlay.classList.add("hidden");
    challengeWinOverlay.classList.add("hidden");
    challengeTimerBar.classList.remove("hidden");
    maolingoBadge.classList.remove("hidden");
    btnExitGame.classList.remove("hidden");
    initClimber();
    saveSession("quiz");
    showScreen(screenQuiz);
    setTimeout(loadQuestion, 400);
  }

  function stopChallengeTimer() {
    if (challengeTimerInterval) {
      clearInterval(challengeTimerInterval);
      challengeTimerInterval = null;
    }
  }

  function startChallengeTimer(reset = true) {
    stopChallengeTimer();
    if (reset) challengeSecondsLeft = CHALLENGE_SECONDS;
    const startingPct = Math.max(0, challengeSecondsLeft / CHALLENGE_SECONDS) * 100;
    challengeTimerFill.style.width = startingPct + "%";
    challengeTimerText.textContent = challengeSecondsLeft;
    challengeTimerBar.classList.toggle("timer-warning", challengeSecondsLeft <= 7);

    challengeTimerInterval = setInterval(() => {
      challengeSecondsLeft -= 1;
      const pct = Math.max(0, challengeSecondsLeft / CHALLENGE_SECONDS) * 100;
      challengeTimerFill.style.width = pct + "%";
      challengeTimerText.textContent = challengeSecondsLeft;
      saveSession("quiz");

      if (challengeSecondsLeft <= 7) {
        challengeTimerBar.classList.add("timer-warning");
      }

      if (challengeSecondsLeft <= 0) {
        stopChallengeTimer();
        if (!answered) {
          triggerChallengeFail("Time's up! You ran out of time.");
        }
      }
    }, 1000);
  }

  function triggerChallengeFail(reason) {
    answered = true;
    stopChallengeTimer();
    clearNextQuestionTimer();
    maolingoBadge.classList.add("hidden");
    disableChoices(true);

    const card = document.getElementById("questionCard");
    if (card) {
      card.classList.add("shake");
      setTimeout(() => card.classList.remove("shake"), 500);
    }

    challengeFailReason.textContent = reason || "Better luck next time!";

    setTimeout(() => {
      challengeFailOverlay.classList.remove("hidden");
    }, 500);
  }

  function triggerChallengeWin() {
    stopChallengeTimer();
    clearNextQuestionTimer();
    maolingoBadge.classList.add("hidden");
    launchConfetti(true);
    setTimeout(() => {
      challengeWinOverlay.classList.remove("hidden");
    }, 500);
  }

  function returnToMenu() {
    stopChallengeTimer();
    clearNextQuestionTimer();
    challengeFailOverlay.classList.add("hidden");
    challengeWinOverlay.classList.add("hidden");
    danceOverlay.classList.add("hidden");
    danceOverlay.classList.remove("dance-visible");
    challengeTimerBar.classList.add("hidden");
    maolingoBadge.classList.add("hidden");
    btnExitGame.classList.add("hidden");
    climbScene.style.display = "none";
    isChallengeMode = false;
    questionList = [];
    currentIndex = 0;
    score = 0;
    results = [];
    playerLevel = 0;
    saveSession("menu");
    showScreen(screenStart);
  }

  function exitToPlayerSelect() {
    stopChallengeTimer();
    clearNextQuestionTimer();
    challengeFailOverlay.classList.add("hidden");
    challengeWinOverlay.classList.add("hidden");
    danceOverlay.classList.add("hidden");
    danceOverlay.classList.remove("dance-visible");
    challengeTimerBar.classList.add("hidden");
    maolingoBadge.classList.add("hidden");
    btnExitGame.classList.add("hidden");
    climbScene.style.display = "none";
    clearNotification();
    isChallengeMode = false;
    questionList = [];
    currentIndex = 0;
    score = 0;
    answered = false;
    results = [];
    playerLevel = 0;
    stairWindowStart = 1;
    pendingResume = null;
    answeredQuestions = new Set();
    saveSession("player-select");
    showScreen(screenPlayerSelect);
  }
  function loadQuestion(preserveChallengeTime = false) {
    if (currentIndex >= questionList.length) {
      if (isChallengeMode) {
        triggerChallengeWin();
      } else {
        endGame();
      }
      return;
    }

    // Mark this question as seen so it is never shown again this session
    answeredQuestions.add(questionList[currentIndex]);

    clearNextQuestionTimer();
    answered = false;
    currentCorrectMeta = null;
    btnNext.classList.add("hidden");
    btnNext.classList.remove("btn-enter");
    clearNotification();

    const question = questionList[currentIndex];
    const totalLevels = isChallengeMode ? CHALLENGE_TOTAL : TOTAL_QS;
    questionNumber.textContent = `Level ${currentIndex + 1} / ${totalLevels}`;
    questionText.textContent = question.question;

    renderHearts();
    updateStairLabels();

    const labels = ["A", "B", "C", "D"];
    const shuffledChoices = shuffle([...question.choices]);
    choicesGrid.innerHTML = "";

    shuffledChoices.forEach((choice, index) => {
      const button = document.createElement("button");
      button.className = "choice-btn";
      button.id = `choice-${index}`;
      button.setAttribute("data-choice", choice);
      button.innerHTML = `<span class="choice-label">${labels[index]}</span><span class="choice-text">${choice}</span>`;
      button.addEventListener("click", () => handleAnswer(button, choice, question.answer, question.points));
      button.style.animationDelay = `${index * 80}ms`;
      button.classList.add("choice-enter");
      choicesGrid.appendChild(button);

      if (choice === question.answer) {
        currentCorrectMeta = {
          label: labels[index],
          answer: question.answer
        };
      }
    });

    const card = document.getElementById("questionCard");
    card.classList.remove("card-enter");
    void card.offsetWidth;
    card.classList.add("card-enter");

    // Start per-question countdown in Challenge Mode
    if (isChallengeMode) {
      startChallengeTimer(!preserveChallengeTime);
    }
    saveSession("quiz");
  }

  function restoreSession() {
    let saved;
    try {
      saved = JSON.parse(sessionStorage.getItem(SESSION_KEY));
    } catch (error) {
      sessionStorage.removeItem(SESSION_KEY);
      return false;
    }

    if (!saved || saved.version !== 1) return false;

    const selectedImage = saved.selectedPlayerImage || "ashhead.png";
    const selectedName = saved.selectedPlayerName === "Teacher Kresh"
      ? "Teacher Krish"
      : saved.selectedPlayerName || "Teacher Ash";
    climberHeadImage.src = selectedImage;
    climberHeadImage.alt = `${selectedName} player head`;
    selectedPlayerThumb.src = selectedImage;
    selectedPlayerName.textContent = selectedName;
    playerOptions.forEach((option) => option.classList.toggle("selected", option.dataset.image === selectedImage));

    if (Array.isArray(saved.questionList)) {
      const canonicalQuestions = [...QUESTION_POOL, ...HARD_QUESTION_POOL];
      questionList = saved.questionList.map((savedQuestion) =>
        canonicalQuestions.find((candidate) => candidate.question === savedQuestion.question) || savedQuestion
      );
    }
    currentIndex = clamp(Number(saved.currentIndex) || 0, 0, questionList.length);
    score = Number(saved.score) || 0;
    results = Array.isArray(saved.results) ? saved.results : [];
    playerLevel = clamp(Number(saved.playerLevel) || 1, 1, TOTAL_QS);
    stairWindowStart = Number(saved.stairWindowStart) || getWindowStart(playerLevel);
    isChallengeMode = Boolean(saved.isChallengeMode);
    challengeSecondsLeft = clamp(Number(saved.challengeSecondsLeft) || CHALLENGE_SECONDS, 1, CHALLENGE_SECONDS);
    answeredQuestions = new Set(questionList.slice(0, Math.min(currentIndex + 1, questionList.length)));

    let refreshResumedLevel = false;
    if (saved.pendingResume && Number.isFinite(Number(saved.pendingResume.index))) {
      currentIndex = clamp(Number(saved.pendingResume.index), 0, questionList.length);
      refreshResumedLevel = Boolean(saved.pendingResume.refreshCurrentLevel);
      pendingResume = null;
    }
    if (refreshResumedLevel && currentIndex < questionList.length) {
      refreshQuestionForLevel(currentIndex);
    }
    answered = false;

    challengeFailOverlay.classList.add("hidden");
    challengeWinOverlay.classList.add("hidden");
    danceOverlay.classList.add("hidden");
    danceOverlay.classList.remove("dance-visible");
    clearNotification();

    if (saved.screen === "quiz" && questionList.length > 0 && currentIndex < questionList.length) {
      statQuestions.textContent = `${isChallengeMode ? CHALLENGE_TOTAL : TOTAL_QS} Levels`;
      challengeTimerBar.classList.toggle("hidden", !isChallengeMode);
      maolingoBadge.classList.remove("hidden");
      btnExitGame.classList.remove("hidden");
      restoreClimber();
      activateScreenImmediately(screenQuiz);
      loadQuestion(isChallengeMode);
      return true;
    }

    if (saved.screen === "result" && questionList.length > 0) {
      activateScreenImmediately(screenResult);
      endGame();
      return true;
    }

    maolingoBadge.classList.add("hidden");
    btnExitGame.classList.add("hidden");
    climbScene.style.display = "none";
    activateScreenImmediately(saved.screen === "menu" ? screenStart : screenPlayerSelect);
    saveSession(saved.screen === "menu" ? "menu" : "player-select");
    return true;
  }

  function renderHearts() {
    if (!heartRow) return;
    heartRow.innerHTML = "";
  }

  function disableChoices(showCorrectAnswer) {
    choicesGrid.querySelectorAll(".choice-btn").forEach((button) => {
      button.disabled = true;
      const isCorrect = currentCorrectMeta && button.dataset.choice === currentCorrectMeta.answer;
      if (showCorrectAnswer && isCorrect) {
        button.classList.add("choice-correct");
      } else if (!button.classList.contains("choice-correct") && !button.classList.contains("choice-wrong")) {
        button.classList.add("choice-dim");
      }
    });
  }

  function showSuccess(answerText, points) {
    notifOverlay.innerHTML = `
      <div class="notif-card notif-success animate-pop">
        <div class="notif-mascot-wrap">
          <img src="${climberHeadImage.getAttribute("src")}" alt="Player success" class="notif-mascot jump-anim" />
        </div>
        <div class="notif-content">
          <div class="notif-title">Correct</div>
          <div class="notif-answer">${answerText}</div>
          <div class="notif-points">+${points} pts</div>
        </div>
      </div>`;
    notifOverlay.classList.add("visible");
    launchConfetti();
    setTimeout(clearNotification, 2200);
  }

  function showWrongReveal(correctMeta) {
    const answerLine = correctMeta
      ? `Correct answer: ${correctMeta.label}. ${correctMeta.answer}`
      : "Correct answer revealed.";

    notifOverlay.innerHTML = `
      <div class="notif-card notif-error animate-pop">
        <div class="notif-content">
          <div class="notif-title">Wrong answer</div>
          <div class="notif-answer">${answerLine}</div>
        </div>
      </div>`;
    notifOverlay.classList.add("visible");
    setTimeout(clearNotification, 1500);
  }

  function showWrongFlash(button) {
    button.classList.add("wrong-flash");
    setTimeout(() => button.classList.remove("wrong-flash"), 600);
  }

  function handleAnswer(button, choice, correctAnswer, points) {
    if (answered) return;
    answered = true;

    // Stop the challenge timer the moment the player clicks
    if (isChallengeMode) {
      stopChallengeTimer();
    }

    const currentLevel = currentIndex + 1;

    if (choice === correctAnswer) {
      button.classList.add("choice-correct");
      score += points;
      results.push({
        level: currentLevel,
        question: questionList[currentIndex].question,
        correct: true,
        attempts: 1
      });
      disableChoices(false);
      showSuccess(`${currentCorrectMeta.label}. ${correctAnswer}`, points);
      triggerClimb();

      if (isChallengeMode) {
        // Advance straight to next question (no fall-back mechanic in challenge)
        queueNextQuestion(1, false, 1700);
      } else {
        queueNextQuestion(1, false, 1700);
      }
      return;
    }

    // Wrong answer
    button.classList.add("choice-wrong");
    showWrongFlash(button);
    disableChoices(true);
    results.push({
      level: currentLevel,
      question: questionList[currentIndex].question,
      correct: false,
      attempts: 1
    });
    saveSession("quiz");

    const card = document.getElementById("questionCard");
    card.classList.add("shake");
    setTimeout(() => card.classList.remove("shake"), 500);

    if (isChallengeMode) {
      // Challenge mode: instant fail on wrong answer
      showWrongReveal(currentCorrectMeta);
      setTimeout(() => triggerChallengeFail("Wrong answer! You need to be perfect."), 1000);
      return;
    }

    const targetIndex = Math.max(0, currentIndex - 1);

    // Replace the wrong question at the current level NOW so the player
    // never sees it again when they advance back up to this level.
    refreshQuestionForLevel(currentIndex);

    triggerFall();
    showWrongReveal(currentCorrectMeta);
    queueNextQuestion(targetIndex - currentIndex, true, 1800);
  }

  function nextQuestion(step = 1, refreshCurrentLevel = false) {
    clearNextQuestionTimer();
    const numericStep = typeof step === "number" && Number.isFinite(step) ? step : 1;
    btnNext.classList.add("hidden");
    btnNext.classList.remove("btn-enter");
    currentIndex = clamp(currentIndex + numericStep, 0, questionList.length);
    pendingResume = null;
    if (currentIndex >= questionList.length) {
      if (isChallengeMode) {
        triggerChallengeWin();
        return;
      }
      endGame();
    } else {
      if (refreshCurrentLevel) {
        refreshQuestionForLevel(currentIndex);
      }
      loadQuestion();
    }
  }
  function endGame() {
    const maxScore = questionList.reduce((sum, question) => sum + question.points, 0);
    const pct = maxScore ? score / maxScore : 0;

    let title = "Keep Going";
    let message = "You can always climb higher on the next run.";

    if (pct === 1) {
      title = "Perfect Score";
      message = "You cleared every level flawlessly.";
    } else if (pct >= 0.8) {
      title = "Excellent";
      message = "That was a strong run.";
    } else if (pct >= 0.6) {
      title = "Well Done";
      message = "You handled the harder levels nicely.";
    } else if (pct >= 0.4) {
      title = "Not Bad";
      message = "You are getting there.";
    }

    resultTitle.textContent = title;
    resultMessage.textContent = message;
    ringScore.textContent = score;
    ringMax.textContent = `/ ${maxScore}`;

    const circumference = 2 * Math.PI * 50;
    ringProgress.style.strokeDasharray = circumference;
    ringProgress.style.strokeDashoffset = circumference;
    setTimeout(() => {
      ringProgress.style.strokeDashoffset = circumference * (1 - pct);
    }, 100);

    resultBreakdown.innerHTML = "";
    results.forEach((result) => {
      const row = document.createElement("div");
      row.className = "breakdown-row";
      row.innerHTML = `
        <span class="bd-icon">${result.correct ? "OK" : "X"}</span>
        <span class="bd-q">L${result.level}: ${result.question.substring(0, 40)}...</span>
        <span class="bd-att">${result.correct ? "cleared" : "missed"}</span>`;
      resultBreakdown.appendChild(row);
    });

    saveSession("result");
    showDanceOverlay();
  }

  function launchConfetti(big = false) {
    const canvas = confettiCanvas;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.style.display = "block";
    const ctx = canvas.getContext("2d");
    const colors = ["#FFD700", "#FF6B6B", "#4ECDC4", "#54B85A", "#39A96B", "#F59E0B", "#10B981", "#FF8C1D"];
    const count = big ? 220 : 80;
    const pieces = [];

    for (let i = 0; i < count; i++) {
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
      pieces.forEach((piece) => {
        if (piece.y < canvas.height + 30) {
          alive = true;
          ctx.save();
          ctx.translate(piece.x, piece.y);
          ctx.rotate((piece.rot * Math.PI) / 180);
          ctx.globalAlpha = piece.alpha;
          ctx.fillStyle = piece.color;
          ctx.fillRect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
          ctx.restore();
          piece.x += piece.dx;
          piece.y += piece.dy;
          piece.rot += piece.drot;
          piece.alpha = Math.max(0, piece.alpha - 0.008);
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

  playerOptions.forEach((option) => option.addEventListener("click", () => selectPlayer(option)));
  btnChangePlayer.addEventListener("click", () => showScreen(screenPlayerSelect));
  btnExitGame.addEventListener("click", exitToPlayerSelect);
  btnStart.addEventListener("click", startGame);
  btnChallenge.addEventListener("click", startChallenge);
  btnNext.addEventListener("click", () => nextQuestion());
  btnPlayAgain.addEventListener("click", startGame);
  btnTryAgain.addEventListener("click", startChallenge);
  btnFailBack.addEventListener("click", returnToMenu);
  btnWinBack.addEventListener("click", returnToMenu);
  btnCloseDance.addEventListener("click", () => {
    danceOverlay.classList.add("hidden");
    danceOverlay.classList.remove("dance-visible");
    showScreen(screenResult);
    const maxScore = questionList.reduce((sum, question) => sum + question.points, 0);
    const pct = maxScore ? score / maxScore : 0;
    if (pct >= 0.6) launchConfetti(true);
  });

  initBackground();
  if (!restoreSession()) {
    activateScreenImmediately(screenPlayerSelect);
    saveSession("player-select");
  }
})();





