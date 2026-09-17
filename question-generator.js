/* ============================================================
   MaoThink - English question generator
   Supplies A1-B2 questions for regular play and C1 questions
   for the final round and challenge mode.
   ============================================================ */

(function () {
  "use strict";

  function normalizeSeed(seed) {
    return (Number(seed) >>> 0) || 0x6d2b79f5;
  }

  function create(seed, restoredState) {
    let state = normalizeSeed(restoredState == null ? seed : restoredState);

    function random() {
      state = (state + 0x6d2b79f5) >>> 0;
      let value = state;
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    }

    function shuffle(items) {
      for (let index = items.length - 1; index > 0; index -= 1) {
        const swapIndex = Math.floor(random() * (index + 1));
        [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
      }
      return items;
    }

    function generate(difficulty, excludedQuestions) {
      const excluded = excludedQuestions instanceof Set
        ? excludedQuestions
        : new Set(excludedQuestions || []);
      const source = difficulty === "hard" ? HARD_QUESTION_POOL : QUESTION_POOL;
      const available = source.filter((question) => !excluded.has(question.question));
      if (!available.length) return null;

      const selected = available[Math.floor(random() * available.length)];
      return {
        ...selected,
        choices: shuffle([...selected.choices]),
        generated: true,
        generatorKind: selected.level.toLowerCase()
      };
    }

    return {
      generate,
      getState: () => state >>> 0,
      getHistorySummary: () => ({})
    };
  }

  window.MaoQuestionGenerator = { create };
})();
