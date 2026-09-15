/* ============================================================
   MaoThink - Persistent cycle-based hybrid question generator
   Builds questions on demand from rules and verified fact data.
   ============================================================ */

(function () {
  "use strict";

  const HISTORY_KEY = "maothink-question-history-v1";
  const HISTORY_VERSION = 1;
  const RETIRED_HISTORY_KINDS = ["linear-equation", "order-of-operations", "power"];

  function normalizeSeed(seed) {
    const numericSeed = Number(seed) >>> 0;
    return numericSeed || 0x6d2b79f5;
  }

  function create(seed, restoredState) {
    let state = normalizeSeed(restoredState === undefined || restoredState === null ? seed : restoredState);
    const history = loadHistory();

    function random() {
      state = (state + 0x6d2b79f5) >>> 0;
      let value = state;
      value = Math.imul(value ^ (value >>> 15), value | 1);
      value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
      return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
    }

    function randomUint32() {
      return Math.floor(random() * 4294967296) >>> 0;
    }

    function integer(min, max) {
      return Math.floor(random() * (max - min + 1)) + min;
    }

    function pick(items) {
      return items[integer(0, items.length - 1)];
    }

    function shuffle(items) {
      for (let index = items.length - 1; index > 0; index -= 1) {
        const swapIndex = integer(0, index);
        [items[index], items[swapIndex]] = [items[swapIndex], items[index]];
      }
      return items;
    }

    function loadHistory() {
      try {
        const saved = JSON.parse(window.localStorage.getItem(HISTORY_KEY));
        if (saved && saved.version === HISTORY_VERSION && saved.categories && typeof saved.categories === "object") {
          RETIRED_HISTORY_KINDS.forEach((kind) => delete saved.categories[kind]);
          return saved;
        }
      } catch (error) {
        console.warn("Unable to read MaoThink question history; using an in-memory cycle.", error);
      }
      return { version: HISTORY_VERSION, categories: {} };
    }

    function saveHistory() {
      try {
        window.localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      } catch (error) {
        console.warn("Unable to save MaoThink question history; this cycle will last only for the current page.", error);
      }
    }

    function greatestCommonDivisor(left, right) {
      let a = Math.abs(left);
      let b = Math.abs(right);
      while (b !== 0) {
        [a, b] = [b, a % b];
      }
      return a;
    }

    function mix(value) {
      let mixed = value >>> 0;
      mixed = Math.imul(mixed ^ (mixed >>> 16), 0x21f0aaad);
      mixed = Math.imul(mixed ^ (mixed >>> 15), 0x735a2d97);
      return (mixed ^ (mixed >>> 15)) >>> 0;
    }

    function permutationParameters(size, orderSeed, cycle) {
      if (size <= 1) return { multiplier: 1, offset: 0 };

      let multiplier = (mix(orderSeed ^ cycle ^ 0x9e3779b9) % size) || 1;
      while (greatestCommonDivisor(multiplier, size) !== 1) {
        multiplier = (multiplier + 1) % size || 1;
      }

      const offset = mix(orderSeed ^ cycle ^ 0x85ebca6b) % size;
      return { multiplier, offset };
    }

    function setCycleParameters(record) {
      const parameters = permutationParameters(record.size, record.orderSeed, record.cycle);
      record.multiplier = parameters.multiplier;
      record.offset = parameters.offset;
      if (record.cycle > 0 && record.offset === record.lastIndex && record.size > 1) {
        record.offset = (record.offset + 1) % record.size;
      }
    }

    function takeCycleIndex(definition) {
      let record = history.categories[definition.kind];
      if (!record || record.size !== definition.size) {
        record = {
          size: definition.size,
          cycle: 0,
          position: 0,
          orderSeed: randomUint32(),
          lastIndex: -1
        };
        history.categories[definition.kind] = record;
        setCycleParameters(record);
      } else if (!Number.isInteger(record.multiplier) || !Number.isInteger(record.offset)) {
        setCycleParameters(record);
      }

      if (record.position >= definition.size) {
        record.cycle += 1;
        record.position = 0;
        setCycleParameters(record);
      }

      const combinationIndex = ((record.multiplier * record.position) + record.offset) % definition.size;
      record.position += 1;
      record.lastIndex = combinationIndex;
      saveHistory();

      return { combinationIndex, cycle: record.cycle };
    }

    function numericChoices(answer, minimumStep) {
      const choices = new Set([answer]);
      const step = Math.max(1, minimumStep || Math.ceil(Math.abs(answer) * 0.08));
      let offset = 1;
      while (choices.size < 4) {
        const direction = offset % 2 === 0 ? -1 : 1;
        const distance = Math.ceil(offset / 2) * step + integer(0, Math.max(1, step - 1));
        const candidate = answer + (direction * distance);
        if (candidate >= 0) choices.add(candidate);
        offset += 1;
      }
      return shuffle(Array.from(choices, String));
    }

    function factChoices(facts, answer) {
      const alternatives = shuffle(
        Array.from(new Set(facts.map((fact) => fact[1]).filter((value) => value !== answer)))
      ).slice(0, 3);
      return shuffle([answer, ...alternatives]);
    }

    function makeQuestion(category, text, choices, answer, points, definition, cycle, combinationIndex) {
      return {
        category,
        question: text,
        choices,
        answer: String(answer),
        points,
        generated: true,
        generatorKind: definition.kind,
        generatorKey: `${definition.kind}:${combinationIndex}`,
        generatorCycle: cycle
      };
    }

    function decodeIndex(index, dimensions) {
      const values = [];
      let remaining = index;
      for (let position = dimensions.length - 1; position >= 0; position -= 1) {
        values[position] = remaining % dimensions[position];
        remaining = Math.floor(remaining / dimensions[position]);
      }
      return values;
    }

    const multiplicationPairs = [];
    for (let left = 3; left <= 16; left += 1) {
      for (let right = left; right <= 16; right += 1) {
        multiplicationPairs.push([left, right]);
      }
    }

    const percentages = [10, 20, 25, 50, 75];
    const reversedCapitalFacts = EXTRA_CAPITAL_FACTS.map(([country, capital]) => [capital, country]);
    const reversedElementFacts = EXTRA_ELEMENT_FACTS.map(([element, symbol]) => [symbol, element]);

    function factGenerator(kind, category, facts, questionBuilder, choiceFactsForIndex) {
      return {
        kind,
        size: facts.length,
        build(index, cycle, definition) {
          const fact = facts[index];
          const choiceFacts = choiceFactsForIndex ? choiceFactsForIndex(index) : facts;
          return makeQuestion(category, questionBuilder(fact), factChoices(choiceFacts, fact[1]), fact[1], 10, definition, cycle, index);
        }
      };
    }

    const regularGenerators = [
      {
        kind: "addition",
        size: 138 * 89,
        build(index, cycle, definition) {
          const [leftOffset, rightOffset] = decodeIndex(index, [138, 89]);
          const left = 12 + leftOffset;
          const right = 8 + rightOffset;
          const answer = left + right;
          return makeQuestion("Math", `What is ${left} + ${right}?`, numericChoices(answer), answer, 10, definition, cycle, index);
        }
      },
      {
        kind: "subtraction",
        size: 83 * 114,
        build(index, cycle, definition) {
          const [rightOffset, answerOffset] = decodeIndex(index, [83, 114]);
          const right = 7 + rightOffset;
          const answer = 12 + answerOffset;
          const left = answer + right;
          return makeQuestion("Math", `What is ${left} - ${right}?`, numericChoices(answer), answer, 10, definition, cycle, index);
        }
      },
      {
        kind: "multiplication",
        size: multiplicationPairs.length,
        build(index, cycle, definition) {
          const [left, right] = multiplicationPairs[index];
          const answer = left * right;
          return makeQuestion("Math", `What is ${left} x ${right}?`, numericChoices(answer, left), answer, 10, definition, cycle, index);
        }
      },
      {
        kind: "division",
        size: 12 * 16,
        build(index, cycle, definition) {
          const [divisorOffset, answerOffset] = decodeIndex(index, [12, 16]);
          const divisor = 3 + divisorOffset;
          const answer = 3 + answerOffset;
          const dividend = divisor * answer;
          return makeQuestion("Math", `What is ${dividend} / ${divisor}?`, numericChoices(answer, 2), answer, 10, definition, cycle, index);
        }
      },
      {
        kind: "percentage",
        size: percentages.length * 19,
        build(index, cycle, definition) {
          const [percentageIndex, baseOffset] = decodeIndex(index, [percentages.length, 19]);
          const percent = percentages[percentageIndex];
          const base = (2 + baseOffset) * 20;
          const answer = (base * percent) / 100;
          return makeQuestion("Math", `What is ${percent}% of ${base}?`, numericChoices(answer, 5), answer, 10, definition, cycle, index);
        }
      },
      {
        kind: "capital",
        size: EXTRA_CAPITAL_FACTS.length * 2,
        build(index, cycle, definition) {
          const factIndex = Math.floor(index / 2);
          const direction = index % 2;
          const fact = EXTRA_CAPITAL_FACTS[factIndex];
          if (direction === 0) {
            return makeQuestion("Geography", `Which city is the capital of ${fact[0]}?`, factChoices(EXTRA_CAPITAL_FACTS, fact[1]), fact[1], 10, definition, cycle, index);
          }
          return makeQuestion("Geography", `${fact[1]} is the capital of which country?`, factChoices(reversedCapitalFacts, fact[0]), fact[0], 10, definition, cycle, index);
        }
      },
      {
        kind: "element",
        size: EXTRA_ELEMENT_FACTS.length * 2,
        build(index, cycle, definition) {
          const factIndex = Math.floor(index / 2);
          const direction = index % 2;
          const fact = EXTRA_ELEMENT_FACTS[factIndex];
          if (direction === 0) {
            return makeQuestion("Science", `Which chemical symbol represents ${fact[0]}?`, factChoices(EXTRA_ELEMENT_FACTS, fact[1]), fact[1], 10, definition, cycle, index);
          }
          return makeQuestion("Science", `Which element has the chemical symbol ${fact[1]}?`, factChoices(reversedElementFacts, fact[0]), fact[0], 10, definition, cycle, index);
        }
      },
      {
        kind: "literature",
        size: EXTRA_LITERATURE_FACTS.length,
        build(index, cycle, definition) {
          const fact = EXTRA_LITERATURE_FACTS[index];
          return makeQuestion("Art & Culture", `Who wrote '${fact[0]}'?`, factChoices(EXTRA_LITERATURE_FACTS, fact[1]), fact[1], 10, definition, cycle, index);
        }
      },
      factGenerator("literature-characters", "General Literature", MAO_LITERATURE_CHARACTER_FACTS, (fact) => `Which author created the character ${fact[0]}?`),
      factGenerator(
        "world-geography",
        "World Geography",
        MAO_WORLD_GEOGRAPHY_FACTS,
        (fact) => `Which answer correctly identifies ${fact[0]}?`,
        (index) => index < 10 || index === 19
          ? [...MAO_WORLD_GEOGRAPHY_FACTS.slice(0, 10), MAO_WORLD_GEOGRAPHY_FACTS[19]]
          : MAO_WORLD_GEOGRAPHY_FACTS.slice(10, 19)
      ),
      factGenerator(
        "astronomy",
        "Astronomy",
        MAO_ASTRONOMY_FACTS,
        (fact) => `Which answer correctly identifies ${fact[0]}?`,
        (index) => index < 7 ? MAO_ASTRONOMY_FACTS.slice(0, 7) : MAO_ASTRONOMY_FACTS.slice(7)
      ),
      factGenerator("biology", "Biology", MAO_BIOLOGY_FACTS, (fact) => `Which answer correctly identifies ${fact[0]}?`),
      factGenerator(
        "technology",
        "Inventions & Technology",
        MAO_TECHNOLOGY_FACTS,
        (fact) => `Which answer correctly identifies ${fact[0]}?`,
        (index) => index < 10
          ? MAO_TECHNOLOGY_FACTS.slice(0, 10)
          : index < 15
            ? MAO_TECHNOLOGY_FACTS.slice(10, 15)
            : MAO_TECHNOLOGY_FACTS.slice(15)
      ),
      factGenerator("world-history", "World History", MAO_HISTORY_FACTS, (fact) => `Which answer correctly identifies ${fact[0]}?`),
      factGenerator("famous-songs", "Famous International Songs", MAO_SONG_FACTS, (fact) => `Who is the lead artist behind the song '${fact[0]}'?`),
      {
        kind: "famous-games",
        size: MAO_GAME_COMPANY_FACTS.length + MAO_GAME_PROTAGONIST_FACTS.length,
        build(index, cycle, definition) {
          if (index < MAO_GAME_COMPANY_FACTS.length) {
            const fact = MAO_GAME_COMPANY_FACTS[index];
            return makeQuestion("Famous Games", `Which company ${fact[2]} ${fact[0]}?`, factChoices(MAO_GAME_COMPANY_FACTS, fact[1]), fact[1], 10, definition, cycle, index);
          }
          const protagonistIndex = index - MAO_GAME_COMPANY_FACTS.length;
          const fact = MAO_GAME_PROTAGONIST_FACTS[protagonistIndex];
          return makeQuestion("Famous Games", `Who is the main protagonist of ${fact[0]}?`, factChoices(MAO_GAME_PROTAGONIST_FACTS, fact[1]), fact[1], 10, definition, cycle, index);
        }
      },
      {
        kind: "famous-anime",
        size: MAO_ANIME_PREMISE_FACTS.length + MAO_ANIME_CREATOR_FACTS.length,
        build(index, cycle, definition) {
          if (index < MAO_ANIME_PREMISE_FACTS.length) {
            const fact = MAO_ANIME_PREMISE_FACTS[index];
            return makeQuestion("Famous Anime", `Which anime is about ${fact[0]}?`, factChoices(MAO_ANIME_PREMISE_FACTS, fact[1]), fact[1], 10, definition, cycle, index);
          }
          const creatorIndex = index - MAO_ANIME_PREMISE_FACTS.length;
          const fact = MAO_ANIME_CREATOR_FACTS[creatorIndex];
          return makeQuestion("Famous Anime", `Which anime or manga was written by ${fact[0]}?`, factChoices(MAO_ANIME_CREATOR_FACTS, fact[1]), fact[1], 10, definition, cycle, index);
        }
      },
      {
        kind: "famous-movies",
        size: MAO_MOVIE_DIRECTOR_FACTS.length + MAO_MOVIE_CLUE_FACTS.length,
        build(index, cycle, definition) {
          if (index < MAO_MOVIE_DIRECTOR_FACTS.length) {
            const fact = MAO_MOVIE_DIRECTOR_FACTS[index];
            return makeQuestion("Famous Movies", `Who directed the movie '${fact[0]}'?`, factChoices(MAO_MOVIE_DIRECTOR_FACTS, fact[1]), fact[1], 10, definition, cycle, index);
          }
          const clueIndex = index - MAO_MOVIE_DIRECTOR_FACTS.length;
          const fact = MAO_MOVIE_CLUE_FACTS[clueIndex];
          return makeQuestion("Famous Movies", `Which movie features ${fact[0]}?`, factChoices(MAO_MOVIE_CLUE_FACTS, fact[1]), fact[1], 10, definition, cycle, index);
        }
      },
      factGenerator("famous-celebrities", "Famous Artists & Celebrities", MAO_CELEBRITY_FACTS, (fact) => `Which famous artist or celebrity ${fact[0]}?`)
    ];

    const hardGenerators = [
      {
        kind: "hard-capital",
        size: EXTRA_HARD_CAPITAL_FACTS.length,
        build(index, cycle, definition) {
          const fact = EXTRA_HARD_CAPITAL_FACTS[index];
          return makeQuestion("Geography", `Which city is the capital of ${fact[0]}?`, factChoices(EXTRA_HARD_CAPITAL_FACTS, fact[1]), fact[1], 20, definition, cycle, index);
        }
      },
      {
        kind: "hard-science",
        size: EXTRA_HARD_SCIENCE_FACTS.length,
        build(index, cycle, definition) {
          const fact = EXTRA_HARD_SCIENCE_FACTS[index];
          return makeQuestion("Science", `What is ${fact[0]}?`, factChoices(EXTRA_HARD_SCIENCE_FACTS, fact[1]), fact[1], 20, definition, cycle, index);
        }
      }
    ];

    const arithmeticKinds = new Set(["addition", "subtraction", "multiplication", "division", "percentage"]);

    function orderGenerators(difficulty) {
      if (difficulty === "hard") return shuffle([...hardGenerators]);

      const arithmeticGenerators = regularGenerators.filter((definition) => arithmeticKinds.has(definition.kind));
      const knowledgeGenerators = regularGenerators.filter((definition) => !arithmeticKinds.has(definition.kind));
      const chooseArithmeticFirst = random() < 0.1;
      return chooseArithmeticFirst
        ? [...shuffle(arithmeticGenerators), ...shuffle(knowledgeGenerators)]
        : [...shuffle(knowledgeGenerators), ...shuffle(arithmeticGenerators)];
    }

    function generate(difficulty, excludedQuestions) {
      const excluded = excludedQuestions instanceof Set ? excludedQuestions : new Set(excludedQuestions || []);
      const generators = orderGenerators(difficulty);

      for (const definition of generators) {
        const attemptsForCategory = Math.min(definition.size, excluded.size + 1);
        for (let attempt = 0; attempt < attemptsForCategory; attempt += 1) {
          const { combinationIndex, cycle } = takeCycleIndex(definition);
          const generatedQuestion = definition.build(combinationIndex, cycle, definition);
          const validChoices = generatedQuestion.choices.length === 4 &&
            new Set(generatedQuestion.choices).size === 4 &&
            generatedQuestion.choices.includes(generatedQuestion.answer);
          if (validChoices && !excluded.has(generatedQuestion.question)) return generatedQuestion;
        }
      }
      return null;
    }

    function getHistorySummary() {
      return Object.fromEntries(Object.entries(history.categories).map(([kind, record]) => [kind, {
        cycle: record.cycle,
        position: record.position,
        size: record.size,
        remaining: Math.max(0, record.size - record.position)
      }]));
    }

    return {
      generate,
      getState: () => state >>> 0,
      getHistorySummary
    };
  }

  window.MaoQuestionGenerator = { create, historyKey: HISTORY_KEY };
})();
