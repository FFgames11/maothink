// ============================================================
// MaoThink - English question bank
// Levels 1-40: a mixed selection of A1-B2 English language,
//              grammar, and vocabulary questions
// Levels 41-50: C1 English language, grammar, and vocabulary
// ============================================================

const GAME_QUESTION_COUNT = 50;

const QUESTION_POOL = [
  // A1 (Levels 1-10)
  { level: "A1", category: "Grammar", question: "Which sentence uses the verb 'be' correctly?", choices: ["She are a teacher.", "She is a teacher.", "She am a teacher.", "She be a teacher."], answer: "She is a teacher.", points: 10 },
  { level: "A1", category: "Vocabulary", question: "Which word is the opposite of 'big'?", choices: ["Tall", "Small", "Wide", "Heavy"], answer: "Small", points: 10 },
  { level: "A1", category: "Grammar", question: "Complete the sentence: I ___ from Singapore.", choices: ["am", "is", "are", "be"], answer: "am", points: 10 },
  { level: "A1", category: "Vocabulary", question: "Which word names a colour?", choices: ["Blue", "Chair", "Walk", "Happy"], answer: "Blue", points: 10 },
  { level: "A1", category: "Grammar", question: "Choose the correct plural of 'book'.", choices: ["bookes", "books", "book's", "book"], answer: "books", points: 10 },
  { level: "A1", category: "Vocabulary", question: "Which animal says 'meow'?", choices: ["Dog", "Bird", "Cat", "Horse"], answer: "Cat", points: 10 },
  { level: "A1", category: "Grammar", question: "Complete the sentence: He ___ football every Sunday.", choices: ["play", "plays", "playing", "played"], answer: "plays", points: 10 },
  { level: "A1", category: "English Language", question: "Which greeting is normally used in the morning?", choices: ["Good night", "Good morning", "Goodbye", "See you"], answer: "Good morning", points: 10 },
  { level: "A1", category: "Grammar", question: "Complete the question: ___ is your name?", choices: ["Who", "What", "Where", "When"], answer: "What", points: 10 },
  { level: "A1", category: "Vocabulary", question: "Which item do you use to write on paper?", choices: ["Spoon", "Shoe", "Pencil", "Plate"], answer: "Pencil", points: 10 },

  // A2 (Levels 11-20)
  { level: "A2", category: "Grammar", question: "Complete the sentence: We ___ to the cinema yesterday.", choices: ["go", "goes", "went", "going"], answer: "went", points: 10 },
  { level: "A2", category: "Vocabulary", question: "Which word means 'very tired'?", choices: ["Excited", "Exhausted", "Surprised", "Interested"], answer: "Exhausted", points: 10 },
  { level: "A2", category: "Grammar", question: "Which sentence correctly describes several apples?", choices: ["There is some apples.", "There are some apples.", "There are an apples.", "There is any apples."], answer: "There are some apples.", points: 10 },
  { level: "A2", category: "Vocabulary", question: "A person who serves food in a restaurant is a ___.", choices: ["waiter", "pilot", "farmer", "mechanic"], answer: "waiter", points: 10 },
  { level: "A2", category: "Grammar", question: "Complete the sentence: This bag is ___ than that one.", choices: ["cheap", "cheapest", "cheaper", "more cheap"], answer: "cheaper", points: 10 },
  { level: "A2", category: "English Language", question: "Which phrase is a polite way to ask for help?", choices: ["Help me now.", "Could you help me, please?", "You help me.", "Helping me?"], answer: "Could you help me, please?", points: 10 },
  { level: "A2", category: "Grammar", question: "Complete the sentence: I have lived here ___ 2022.", choices: ["for", "since", "during", "from"], answer: "since", points: 10 },
  { level: "A2", category: "Vocabulary", question: "Which word is closest in meaning to 'begin'?", choices: ["Finish", "Stop", "Start", "Wait"], answer: "Start", points: 10 },
  { level: "A2", category: "Grammar", question: "Complete the sentence: You ___ wear a seat belt in a car.", choices: ["must", "might", "would", "could"], answer: "must", points: 10 },
  { level: "A2", category: "Vocabulary", question: "If the sky is full of clouds, the weather is ___.", choices: ["cloudy", "sunny", "dry", "windless"], answer: "cloudy", points: 10 },

  // B1 (Levels 21-30)
  { level: "B1", category: "Grammar", question: "Complete the sentence: If it rains, we ___ at home.", choices: ["stay", "stayed", "will stay", "would stay"], answer: "will stay", points: 10 },
  { level: "B1", category: "Vocabulary", question: "Which word is closest in meaning to 'reliable'?", choices: ["Dependable", "Careless", "Unusual", "Temporary"], answer: "Dependable", points: 10 },
  { level: "B1", category: "Grammar", question: "Choose the correct passive sentence.", choices: ["The bridge built in 1990.", "The bridge was built in 1990.", "The bridge was build in 1990.", "The bridge is built in 1990."], answer: "The bridge was built in 1990.", points: 10 },
  { level: "B1", category: "English Language", question: "What does the phrase 'give up' mean in 'Don't give up'?", choices: ["Donate something", "Stop trying", "Stand up", "Return something"], answer: "Stop trying", points: 10 },
  { level: "B1", category: "Grammar", question: "Complete the sentence: She asked me where I ___.", choices: ["live", "lived", "will live", "am living"], answer: "lived", points: 10 },
  { level: "B1", category: "Vocabulary", question: "Choose the correct word: The instructions were clear and easy to ___.", choices: ["follow", "lead", "catch", "reach"], answer: "follow", points: 10 },
  { level: "B1", category: "Grammar", question: "Complete the sentence: I ___ this book yet.", choices: ["didn't finish", "haven't finished", "don't finish", "wasn't finishing"], answer: "haven't finished", points: 10 },
  { level: "B1", category: "English Language", question: "Which sentence expresses a suggestion?", choices: ["You must leave now.", "Why don't we take a break?", "I left yesterday.", "Are you leaving?"], answer: "Why don't we take a break?", points: 10 },
  { level: "B1", category: "Vocabulary", question: "What does 'avoid' mean?", choices: ["To keep away from", "To look carefully at", "To agree with", "To prepare for"], answer: "To keep away from", points: 10 },
  { level: "B1", category: "Grammar", question: "Complete the sentence: He is interested ___ learning Japanese.", choices: ["at", "on", "in", "for"], answer: "in", points: 10 },

  // B2 (Levels 31-40)
  { level: "B2", category: "Grammar", question: "Complete the sentence: If I ___ about the delay, I would have called you.", choices: ["knew", "had known", "would know", "have known"], answer: "had known", points: 10 },
  { level: "B2", category: "Vocabulary", question: "Which word is closest in meaning to 'significant'?", choices: ["Minor", "Important", "Ordinary", "Uncertain"], answer: "Important", points: 10 },
  { level: "B2", category: "Grammar", question: "Which sentence correctly expresses a present wish?", choices: ["I wish I can speak French.", "I wish I could speak French.", "I wish I will speak French.", "I wish I speak French."], answer: "I wish I could speak French.", points: 10 },
  { level: "B2", category: "English Language", question: "What does 'to get the hang of something' mean?", choices: ["To become skilled at it", "To lose interest in it", "To postpone it", "To explain it badly"], answer: "To become skilled at it", points: 10 },
  { level: "B2", category: "Grammar", question: "Complete the sentence: By next June, they ___ the project.", choices: ["complete", "completed", "will complete", "will have completed"], answer: "will have completed", points: 10 },
  { level: "B2", category: "Vocabulary", question: "Choose the best word: The company plans to ___ its services into new markets.", choices: ["expand", "scatter", "stretch", "inflate"], answer: "expand", points: 10 },
  { level: "B2", category: "Grammar", question: "Complete the sentence: She denied ___ the confidential document.", choices: ["to copy", "copy", "copying", "copied"], answer: "copying", points: 10 },
  { level: "B2", category: "English Language", question: "Which sentence is the most formal?", choices: ["Send me the details soon.", "I want the details right now.", "Could you please provide the details at your earliest convenience?", "Can you shoot me the details?"], answer: "Could you please provide the details at your earliest convenience?", points: 10 },
  { level: "B2", category: "Vocabulary", question: "What does 'inevitable' mean?", choices: ["Able to be prevented", "Certain to happen", "Difficult to explain", "Unlikely to matter"], answer: "Certain to happen", points: 10 },
  { level: "B2", category: "Grammar", question: "Complete the sentence: Not only ___ late, but he also forgot the tickets.", choices: ["he arrived", "did he arrive", "he did arrive", "arrived he"], answer: "did he arrive", points: 10 }
];

const HARD_QUESTION_POOL = [
  // C1 (Levels 41-50)
  { level: "C1", category: "Grammar", question: "Complete the sentence: Seldom ___ such a compelling argument.", choices: ["I have heard", "have I heard", "I heard", "did I have heard"], answer: "have I heard", points: 20 },
  { level: "C1", category: "Vocabulary", question: "Which word best completes the sentence? Her explanation was so ___ that it resolved every doubt.", choices: ["ambiguous", "cogent", "arbitrary", "tentative"], answer: "cogent", points: 20 },
  { level: "C1", category: "Grammar", question: "Complete the sentence: Had the warning been issued earlier, the damage ___.", choices: ["might have been avoided", "might be avoided", "will have avoided", "would avoid"], answer: "might have been avoided", points: 20 },
  { level: "C1", category: "English Language", question: "What does the idiom 'to play devil's advocate' mean?", choices: ["To support a dishonest person", "To argue an opposing view for discussion", "To avoid taking any position", "To deliberately offend someone"], answer: "To argue an opposing view for discussion", points: 20 },
  { level: "C1", category: "Vocabulary", question: "Which word means 'to make a problem less severe'?", choices: ["Exacerbate", "Mitigate", "Invalidate", "Proliferate"], answer: "Mitigate", points: 20 },
  { level: "C1", category: "Grammar", question: "Choose the sentence with the correct subjunctive form.", choices: ["The committee recommended that he resign immediately.", "The committee recommended that he resigns immediately.", "The committee recommended that he resigned immediately.", "The committee recommended him to resigns immediately."], answer: "The committee recommended that he resign immediately.", points: 20 },
  { level: "C1", category: "Vocabulary", question: "Which word best describes a statement that appears self-contradictory but may be true?", choices: ["Paradoxical", "Superficial", "Redundant", "Unanimous"], answer: "Paradoxical", points: 20 },
  { level: "C1", category: "Grammar", question: "Complete the sentence: No sooner ___ the announcement than the phones began ringing.", choices: ["they made", "had they made", "they had made", "did they made"], answer: "had they made", points: 20 },
  { level: "C1", category: "English Language", question: "Which sentence uses 'disinterested' in its standard formal sense?", choices: ["She was disinterested because the lecture was dull.", "A disinterested judge considered both sides fairly.", "He felt disinterested in joining the club.", "The bored audience became increasingly disinterested."], answer: "A disinterested judge considered both sides fairly.", points: 20 },
  { level: "C1", category: "Vocabulary", question: "Choose the best word: The report was criticised for being ___, as it mentioned only evidence supporting its conclusion.", choices: ["impartial", "selective", "comprehensive", "conclusive"], answer: "selective", points: 20 }
];

// Build a large, varied bank without storing hundreds of repetitive object
// literals. Every generated entry is a complete question object used by the
// same game logic as the hand-written questions above.
function addQuestion(pool, level, category, question, choices, answer, points) {
  pool.push({ level, category, question, choices, answer, points });
}

function otherValues(entries, field, index) {
  return [1, 3, 5].map((offset) => entries[(index + offset) % entries.length][field]);
}

function addVocabularySet(pool, level, points, entries) {
  entries.forEach((entry, index) => {
    addQuestion(pool, level, "Vocabulary", `${level} vocabulary: Which word is closest in meaning to '${entry.word}'?`, [entry.synonym, ...otherValues(entries, "synonym", index)], entry.synonym, points);
    addQuestion(pool, level, "Vocabulary", `${level} vocabulary: Which word is the opposite of '${entry.word}'?`, [entry.antonym, ...otherValues(entries, "antonym", index)], entry.antonym, points);
    addQuestion(pool, level, "Vocabulary", `${level} vocabulary: What is the best definition of '${entry.word}'?`, [entry.definition, ...otherValues(entries, "definition", index)], entry.definition, points);
    addQuestion(pool, level, "English Language", entry.context, [entry.word, ...otherValues(entries, "word", index)], entry.word, points);
    addQuestion(pool, level, "English Language", `Choose the word that means '${entry.definition}'.`, [entry.word, ...otherValues(entries, "word", index)], entry.word, points);
  });
}

const REGULAR_VOCABULARY = {
  A1: [
    { word: "quick", synonym: "fast", antonym: "slow", definition: "moving with speed", context: "The rabbit is very ___ and wins the race." },
    { word: "happy", synonym: "glad", antonym: "sad", definition: "feeling pleased", context: "Mina feels ___ because today is her birthday." },
    { word: "begin", synonym: "start", antonym: "finish", definition: "to do the first part of something", context: "The lesson will ___ at nine o'clock." },
    { word: "quiet", synonym: "silent", antonym: "noisy", definition: "making little or no sound", context: "Please be ___ while the baby is sleeping." },
    { word: "easy", synonym: "simple", antonym: "difficult", definition: "not hard to do", context: "This puzzle is ___, so I can solve it quickly." },
    { word: "near", synonym: "close", antonym: "far", definition: "a short distance away", context: "The shop is ___ my house, so I walk there." },
    { word: "clean", synonym: "tidy", antonym: "dirty", definition: "free from dirt", context: "Wash the table so that it is ___." },
    { word: "strong", synonym: "powerful", antonym: "weak", definition: "having a lot of physical power", context: "The ___ athlete can lift the heavy box." }
  ],
  A2: [
    { word: "ancient", synonym: "old", antonym: "modern", definition: "belonging to a very distant past", context: "We visited an ___ castle built centuries ago." },
    { word: "repair", synonym: "fix", antonym: "damage", definition: "to make something work again", context: "A mechanic will ___ my broken bicycle." },
    { word: "choose", synonym: "select", antonym: "reject", definition: "to decide which one you want", context: "You may ___ one dessert from the menu." },
    { word: "crowded", synonym: "packed", antonym: "empty", definition: "full of people", context: "The train was very ___ during the morning rush." },
    { word: "polite", synonym: "courteous", antonym: "rude", definition: "showing good manners", context: "It is ___ to say please and thank you." },
    { word: "borrow", synonym: "take temporarily", antonym: "lend", definition: "to use something and return it later", context: "May I ___ your pen for a minute?" },
    { word: "arrive", synonym: "reach", antonym: "depart", definition: "to get to a place", context: "Our flight will ___ at six in the evening." },
    { word: "healthy", synonym: "well", antonym: "ill", definition: "in good physical condition", context: "Regular exercise helps you stay ___." }
  ],
  B1: [
    { word: "accurate", synonym: "correct", antonym: "incorrect", definition: "free from mistakes", context: "The map is ___ and shows every street clearly." },
    { word: "benefit", synonym: "advantage", antonym: "drawback", definition: "a helpful or positive effect", context: "One ___ of cycling is improved fitness." },
    { word: "decline", synonym: "decrease", antonym: "increase", definition: "to become smaller or less", context: "Sales began to ___ after the price rose." },
    { word: "essential", synonym: "necessary", antonym: "optional", definition: "completely needed", context: "Clean water is ___ for human life." },
    { word: "flexible", synonym: "adaptable", antonym: "rigid", definition: "able to change easily", context: "Our schedule is ___, so we can meet tomorrow instead." },
    { word: "maintain", synonym: "preserve", antonym: "neglect", definition: "to keep in good condition", context: "You should ___ your car by checking it regularly." },
    { word: "persuade", synonym: "convince", antonym: "discourage", definition: "to make someone agree to do something", context: "She tried to ___ her friends to join the club." },
    { word: "require", synonym: "need", antonym: "waive", definition: "to make something necessary", context: "Most jobs ___ applicants to submit a résumé." }
  ],
  B2: [
    { word: "ambiguous", synonym: "unclear", antonym: "explicit", definition: "open to more than one interpretation", context: "The instruction was ___, so nobody knew exactly what to do." },
    { word: "compelling", synonym: "convincing", antonym: "unpersuasive", definition: "able to attract attention or belief", context: "The lawyer presented a ___ argument supported by evidence." },
    { word: "diminish", synonym: "lessen", antonym: "intensify", definition: "to make or become smaller", context: "The pain should ___ after you take the medicine." },
    { word: "feasible", synonym: "practical", antonym: "impossible", definition: "possible and realistic to achieve", context: "The team must decide whether the plan is financially ___." },
    { word: "impartial", synonym: "unbiased", antonym: "prejudiced", definition: "treating all sides fairly", context: "A judge must remain ___ throughout a trial." },
    { word: "prevalent", synonym: "widespread", antonym: "rare", definition: "common in a particular place or time", context: "Remote work has become increasingly ___ in the industry." },
    { word: "reluctant", synonym: "unwilling", antonym: "eager", definition: "hesitant about doing something", context: "He was ___ to speak before such a large audience." },
    { word: "subsequent", synonym: "following", antonym: "previous", definition: "coming after something else", context: "The first experiment failed, but ___ attempts succeeded." }
  ]
};

Object.entries(REGULAR_VOCABULARY).forEach(([level, entries]) => addVocabularySet(QUESTION_POOL, level, 10, entries));

// Each function below contributes 25 distinct grammar questions to its CEFR
// band. Together with the vocabulary sets and the ten original questions,
// each band contains exactly 125 questions.
const A1_SUBJECTS = [["I", "am"], ["You", "are"], ["He", "is"], ["She", "is"], ["We", "are"]];
const A1_COMPLEMENTS = ["ready for class", "at the library", "very hungry", "from Malaysia", "happy today"];
A1_SUBJECTS.forEach(([subject, answer]) => A1_COMPLEMENTS.forEach((ending) =>
  addQuestion(QUESTION_POOL, "A1", "Grammar", `Complete the sentence: ${subject} ___ ${ending}.`, ["am", "is", "are", "be"], answer, 10)
));

const A1_VERBS = [["work", "works", "working", "worked"], ["play", "plays", "playing", "played"], ["cook", "cooks", "cooking", "cooked"], ["help", "helps", "helping", "helped"], ["walk", "walks", "walking", "walked"]];
const A1_PEOPLE = [["My brother", true], ["Sara", true], ["They", false], ["My friends", false], ["The teacher", true]];
A1_PEOPLE.forEach(([subject, singular]) => A1_VERBS.forEach(([base, third, ing, past]) =>
  addQuestion(QUESTION_POOL, "A1", "Grammar", `Use the verb '${base}' in the present simple: ${subject} ___ every day.`, [base, third, ing, past], singular ? third : base, 10)
));

const A1_ARTICLES = [["apple", "an"], ["banana", "a"], ["umbrella", "an"], ["book", "a"], ["orange", "an"]];
const A1_BUYERS = ["I bought", "She wants", "He found", "We need", "They shared"];
A1_BUYERS.forEach((lead) => A1_ARTICLES.forEach(([noun, answer]) =>
  addQuestion(QUESTION_POOL, "A1", "Grammar", `Complete the sentence: ${lead} ___ ${noun}.`, ["a", "an", "the", "some"], answer, 10)
));

const A2_PAST = [["go", "went", "gone", "going"], ["see", "saw", "seen", "seeing"], ["buy", "bought", "boughten", "buying"], ["write", "wrote", "written", "writing"], ["take", "took", "taken", "taking"]];
const A2_TIME_LEADS = ["Yesterday I", "Last week we", "On Monday they", "This morning she", "Two days ago he"];
A2_TIME_LEADS.forEach((lead) => A2_PAST.forEach(([base, past, participle, ing]) =>
  addQuestion(QUESTION_POOL, "A2", "Grammar", `Use the verb '${base}' in the past simple: ${lead} ___ it.`, [base, past, participle, ing], past, 10)
));

const A2_ADJECTIVES = [["tall", "taller", "tallest", "more tall"], ["fast", "faster", "fastest", "more fast"], ["cheap", "cheaper", "cheapest", "more cheap"], ["small", "smaller", "smallest", "more small"], ["young", "younger", "youngest", "more young"]];
const A2_COMPARE = ["This one", "My bicycle", "The blue building", "Her dog", "Their new model"];
A2_COMPARE.forEach((subject) => A2_ADJECTIVES.forEach(([base, comparative, superlative, wrong]) =>
  addQuestion(QUESTION_POOL, "A2", "Grammar", `Use the comparative form of '${base}': ${subject} is ___ than the old one.`, [base, comparative, superlative, wrong], comparative, 10)
));

const A2_DURATIONS = [["Monday", "since"], ["2019", "since"], ["three hours", "for"], ["a long time", "for"], ["last summer", "since"]];
const A2_RESIDENTS = ["I have lived here", "She has worked there", "We have known him", "They have studied English", "He has owned the shop"];
A2_RESIDENTS.forEach((lead) => A2_DURATIONS.forEach(([time, answer]) =>
  addQuestion(QUESTION_POOL, "A2", "Grammar", `Complete the sentence: ${lead} ___ ${time}.`, ["since", "for", "during", "from"], answer, 10)
));

const B1_CONDITIONS = ["it rains tomorrow", "you study regularly", "we leave now", "she calls tonight", "they miss the bus"];
const B1_RESULTS = ["we will stay inside", "you will improve", "we will arrive early", "I will tell her", "they will be late"];
B1_CONDITIONS.forEach((condition) => B1_RESULTS.forEach((result) =>
  addQuestion(QUESTION_POOL, "B1", "Grammar", `Complete the first conditional to express this result: '${result}'. If ${condition}, ___.`, [result, result.replace("will", "would"), result.replace("will", "had"), result.replace("will", "have")], result, 10)
));

const B1_OBJECTS = ["The report", "The meal", "The road", "The invitations", "The room"];
const B1_ACTIONS = [["complete", "completed"], ["prepare", "prepared"], ["close", "closed"], ["send", "sent"], ["clean", "cleaned"]];
B1_OBJECTS.forEach((subject) => B1_ACTIONS.forEach(([base, participle]) =>
  addQuestion(QUESTION_POOL, "B1", "Grammar", `Use the verb '${base}' to complete the passive sentence: ${subject} was ___ yesterday.`, [base, participle, `${base}s`, `${base}ing`], participle, 10)
));

const B1_PREPOSITIONS = [["interested", "in"], ["afraid", "of"], ["good", "at"], ["responsible", "for"], ["familiar", "with"]];
const B1_TOPICS = ["learning languages", "large spiders", "solving puzzles", "organising the event", "this software"];
B1_PREPOSITIONS.forEach(([adjective, answer]) => B1_TOPICS.forEach((topic) =>
  addQuestion(QUESTION_POOL, "B1", "Grammar", `Complete the sentence: She is ${adjective} ___ ${topic}.`, ["in", "of", "at", "for", "with"].filter((value, index, array) => array.indexOf(value) === index).slice(0, 4).includes(answer) ? [answer, ...["in", "of", "at", "for", "with"].filter((value) => value !== answer).slice(0, 3)] : [answer, "in", "of", "at"], answer, 10)
));

const B2_IF_CLAUSES = ["I had known about the traffic", "she had checked the address", "we had booked earlier", "they had followed the advice", "he had saved the document"];
const B2_OUTCOMES = ["I would have left sooner", "she would have arrived", "we would have found seats", "they would have avoided the problem", "he would not have lost his work"];
B2_IF_CLAUSES.forEach((condition) => B2_OUTCOMES.forEach((result) =>
  addQuestion(QUESTION_POOL, "B2", "Grammar", `Complete the third conditional to express this outcome: '${result}'. If ${condition}, ___.`, [result, result.replace("would", "will"), result.replace("would", "might"), result.replace("would", "had")], result, 10)
));

const B2_TASKS = ["finish the project", "write the report", "complete the course", "review every application", "deliver all the orders"];
const B2_DEADLINES = ["by Friday", "by next June", "before the meeting", "by the end of the day", "before you arrive"];
B2_TASKS.forEach((task) => B2_DEADLINES.forEach((deadline) => {
  const answer = `will have ${task.replace(/^\w+/, (verb) => ({ finish: "finished", write: "written", complete: "completed", review: "reviewed", deliver: "delivered" }[verb]))}`;
  addQuestion(QUESTION_POOL, "B2", "Grammar", `Use the future perfect for the task '${task}': They ___ ${deadline}.`, [answer, `will ${task}`, `have ${task}`, `would ${task}`], answer, 10);
}));

const B2_PATTERNS = [["denied", "taking", "take", "took"], ["admitted", "making", "make", "made"], ["considered", "moving", "move", "moved"], ["suggested", "waiting", "wait", "waited"], ["avoided", "answering", "answer", "answered"]];
const B2_ENDINGS = ["the file", "a mistake", "to another city", "until Monday", "the difficult question"];
B2_PATTERNS.forEach(([verb, answer, base, past]) => B2_ENDINGS.forEach((ending) =>
  addQuestion(QUESTION_POOL, "B2", "Grammar", `Complete the sentence: She ${verb} ___ ${ending}.`, [answer, `to ${base}`, past, base], answer, 10)
));

const C1_VOCABULARY = [
  { word: "abate", synonym: "subside", antonym: "intensify", definition: "to become less severe", context: "The storm began to ___ shortly before dawn." },
  { word: "austere", synonym: "severe", antonym: "luxurious", definition: "plain and without comfort", context: "The monastery's rooms were deliberately ___." },
  { word: "candid", synonym: "frank", antonym: "evasive", definition: "truthful and straightforward", context: "The director gave a ___ account of the company's failures." },
  { word: "dearth", synonym: "scarcity", antonym: "abundance", definition: "a serious lack of something", context: "A ___ of reliable evidence weakened the claim." },
  { word: "eclectic", synonym: "diverse", antonym: "uniform", definition: "drawn from many different sources", context: "Her ___ taste ranges from opera to electronic music." },
  { word: "fastidious", synonym: "meticulous", antonym: "careless", definition: "very attentive to detail", context: "The editor is ___ about punctuation and formatting." },
  { word: "gregarious", synonym: "sociable", antonym: "reclusive", definition: "fond of being with other people", context: "His ___ nature makes him comfortable at large events." },
  { word: "hackneyed", synonym: "overused", antonym: "original", definition: "lacking impact because of repeated use", context: "The speech relied on ___ phrases and tired clichés." }
];
addVocabularySet(HARD_QUESTION_POOL, "C1", 20, C1_VOCABULARY);

// Five advanced grammar families add 450 C1 questions (90 per family).
const C1_OPENERS = ["Rarely", "Seldom", "Never before", "At no time", "Under no circumstances", "On no account", "Not once", "Hardly ever", "Only rarely", "In no way"];
const C1_CLAUSES = [
  ["the committee", "has", "encountered such resistance"], ["the researchers", "have", "observed this phenomenon"], ["the company", "has", "faced a greater challenge"],
  ["the delegates", "have", "reached agreement so quickly"], ["the court", "has", "considered such evidence"], ["the editors", "have", "received so many complaints"],
  ["the system", "has", "failed without warning"], ["the participants", "have", "questioned the underlying assumption"], ["the policy", "has", "attracted widespread support"]
];
C1_OPENERS.forEach((opener) => C1_CLAUSES.forEach(([subject, auxiliary, ending]) => {
  const answer = `${auxiliary} ${subject} ${ending}`;
  addQuestion(HARD_QUESTION_POOL, "C1", "Grammar", `Invert the clause '${subject} ${auxiliary} ${ending}' after '${opener}': ${opener} ___ .`, [answer, `${subject} ${auxiliary} ${ending}`, `did ${subject} ${ending}`, `${auxiliary} ${ending} ${subject}`], answer, 20);
}));

const C1_RECOMMENDATIONS = ["The board recommended", "The doctor insisted", "The chairperson proposed", "The report suggested", "The judge ordered", "The adviser requested", "The committee demanded", "The policy requires", "The director urged", "The regulation stipulates"];
const C1_ACTIONS = [
  ["he", "resign immediately"], ["she", "submit a revised draft"], ["the company", "disclose the figures"], ["each member", "attend the hearing"], ["the applicant", "provide identification"],
  ["the team", "reconsider its approach"], ["the tenant", "vacate the property"], ["the minister", "address the issue"], ["every report", "be independently reviewed"]
];
C1_RECOMMENDATIONS.forEach((lead) => C1_ACTIONS.forEach(([subject, base]) => {
  const answer = `${subject} ${base}`;
  addQuestion(HARD_QUESTION_POOL, "C1", "Grammar", `Use the formal subjunctive for '${subject} ${base}': ${lead} that ___ .`, [answer, `${subject} to ${base}`, `${subject} would ${base}`, `${subject} should to ${base}`], answer, 20);
}));

const C1_IF_CLAUSES = ["the data been verified", "the warning arrived sooner", "the talks not collapsed", "the funds been allocated", "the witness come forward", "the flaw been detected", "the rules been clarified", "the market remained stable", "the evidence been disclosed", "the system been tested"];
const C1_MODAL_RESULTS = ["the error might have been avoided", "the outcome could have been different", "the project would have continued", "the damage might have been limited", "the inquiry could have concluded sooner", "the decision would have been reconsidered", "the dispute might have been resolved", "the investment could have succeeded", "the verdict might have changed"];
C1_IF_CLAUSES.forEach((condition) => C1_MODAL_RESULTS.forEach((result) =>
  addQuestion(HARD_QUESTION_POOL, "C1", "Grammar", `Complete the advanced conditional with the outcome '${result}': Had ${condition}, ___.`, [result, result.replace(/(might|could|would) have/, "$1"), result.replace(/^(the \w+ )?(might|could|would)/, "$1will"), result.replace(/^(the \w+ )?(might|could|would)/, "$1can")], result, 20)
));

const C1_FOCUS = ["the lack of evidence", "her persistence", "the revised timetable", "their shared objective", "the final interview", "his detailed notes", "the unexpected delay", "the public response", "the second proposal", "the independent review"];
const C1_EFFECTS = ["changed the committee's mind", "enabled the team to succeed", "caused the greatest concern", "ultimately resolved the dispute", "revealed the central problem", "made the difference", "prompted further investigation", "secured widespread support", "led to the policy change"];
C1_FOCUS.forEach((focus) => C1_EFFECTS.forEach((effect) => {
  const answer = `It was ${focus} that ${effect}`;
  addQuestion(HARD_QUESTION_POOL, "C1", "Grammar", `Form a cleft sentence emphasising '${focus}' in the statement '${focus} ${effect}'.`, [answer, `It ${focus} was that ${effect}`, `What was ${focus} that ${effect}`, `There was ${focus} who ${effect}`], answer, 20);
}));

const C1_CONCESSIONS = ["Difficult though the task was", "Compelling though the argument seemed", "Carefully though the plan was devised", "Experienced though the team was", "Limited though the evidence remained", "Unlikely though the outcome appeared", "Complex though the procedure became", "Strong though the opposition was", "Persuasive though her case sounded", "Costly though the solution proved"];
const C1_MAIN_CLAUSES = ["they completed it on schedule", "the panel remained unconvinced", "several flaws eventually emerged", "it still required outside support", "the inquiry reached a firm conclusion", "the possibility could not be dismissed", "the staff followed every step", "the measure was ultimately approved", "the jury rejected it"];
C1_CONCESSIONS.forEach((concession) => C1_MAIN_CLAUSES.forEach((mainClause) => {
  const answer = `${concession}, ${mainClause}`;
  addQuestion(HARD_QUESTION_POOL, "C1", "English Language", `Combine '${concession}' with '${mainClause}' using a correct inverted concessive clause.`, [answer, `${concession.replace(" though", " despite")}, ${mainClause}`, `Although ${concession}, but ${mainClause}`, `${concession} however ${mainClause}`], answer, 20);
}));

if (QUESTION_POOL.length !== 500 || HARD_QUESTION_POOL.length !== 500) {
  throw new Error(`Question bank size mismatch: ${QUESTION_POOL.length} regular, ${HARD_QUESTION_POOL.length} C1.`);
}
