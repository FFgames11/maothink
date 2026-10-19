/* ============================================================
   MaoThink - Questionnaire Set 2026-10-19

   A completely new, self-validating English question bank.
   The previous bank is preserved under:
   archive/questionnaires-2026-10-19/
   ============================================================ */

const GAME_QUESTION_COUNT = 50;
const QUESTION_SET_ID = "2026-10-19";
const QUESTION_POOL = [];
const HARD_QUESTION_POOL = [];

function addQuestion(pool, level, category, question, choices, answer, points) {
  pool.push({ level, category, question, choices, answer, points, questionSet: QUESTION_SET_ID });
}

function addGrid(pool, level, category, leftItems, rightItems, builder, points) {
  leftItems.forEach((left) => rightItems.forEach((right) => {
    const item = builder(left, right);
    addQuestion(pool, level, category, item.question, item.choices, item.answer, points);
  }));
}

// A1: possessives, present continuous, object pronouns, demonstratives, time prepositions.
const A1_OWNERS = [["I", "my"], ["you", "your"], ["Lina", "her"], ["Omar", "his"], ["we", "our"]];
const A1_OBJECTS = ["passport", "lunchbox", "notebook", "umbrella", "camera"];
addGrid(QUESTION_POOL, "A1", "Grammar", A1_OWNERS, A1_OBJECTS, ([owner, answer], object) => ({
  question: `Choose the possessive word: ${owner} packed ___ ${object}.`,
  choices: [answer, ...["my", "your", "her", "his", "our"].filter((word) => word !== answer).slice(0, 3)], answer
}), 10);

const A1_CONTINUOUS_SUBJECTS = [["I", "am"], ["The baby", "is"], ["Our teacher", "is"], ["You", "are"], ["The neighbours", "are"]];
const A1_ACTIONS = [["read", "reading"], ["dance", "dancing"], ["swim", "swimming"], ["write", "writing"], ["run", "running"]];
addGrid(QUESTION_POOL, "A1", "Grammar", A1_CONTINUOUS_SUBJECTS, A1_ACTIONS, ([subject, auxiliary], [base, ing]) => {
  const answer = `${auxiliary} ${ing}`;
  return { question: `Use “${base}” for an action happening now: ${subject} ___ at the moment.`, choices: [answer, `${auxiliary} ${base}`, `does ${base}`, `${base}s`], answer };
}, 10);

const A1_PRONOUN_TARGETS = [["the speaker", "me"], ["the listener", "you"], ["a boy named Ben", "him"], ["a girl named Mei", "her"], ["the speaker and a friend", "us"]];
const A1_PRONOUN_LEADS = ["Please call", "The coach thanked", "Maya invited", "Could you help", "The guide showed the map to"];
addGrid(QUESTION_POOL, "A1", "Grammar", A1_PRONOUN_TARGETS, A1_PRONOUN_LEADS, ([target, answer], lead) => ({
  question: `Which object pronoun replaces ${target}? ${lead} ___.`,
  choices: [answer, ...["me", "you", "him", "her", "us"].filter((word) => word !== answer).slice(0, 3)], answer
}), 10);

const A1_DEMONSTRATIVES = [["one cup beside me", "This", "is"], ["one kite far away", "That", "is"], ["two keys beside me", "These", "are"], ["three boats far away", "Those", "are"], ["several photos in my hand", "These", "are"]];
const A1_DEMO_SETTINGS = ["at the market", "during the lesson", "in the garden", "on our trip", "inside the museum"];
addGrid(QUESTION_POOL, "A1", "Grammar", A1_DEMONSTRATIVES, A1_DEMO_SETTINGS, ([description, answer, verb], setting) => ({
  question: `${setting}, point to ${description}: “___ ${verb} what I mean.”`, choices: [answer, ...["This", "That", "These", "Those"].filter((word) => word !== answer)], answer
}), 10);

const A1_TIMES = [["7:30", "at"], ["Tuesday", "on"], ["December", "in"], ["noon", "at"], ["the weekend", "on"]];
const A1_TIME_LEADS = ["The shop opens", "Our class begins", "The bus arrives", "I practise piano", "They meet us"];
addGrid(QUESTION_POOL, "A1", "Grammar", A1_TIMES, A1_TIME_LEADS, ([time, answer], lead) => ({
  question: `Add the correct time preposition: ${lead} ___ ${time}.`, choices: [answer, ...["at", "on", "in", "for"].filter((word) => word !== answer)], answer
}), 10);

// A2: quantity, interrupted actions, verb patterns, superlatives, and planned actions.
const A2_NOUNS = [["rice", "much"], ["emails", "many"], ["traffic", "much"], ["chairs", "many"], ["information", "much"]];
const A2_QUANTITY_LEADS = ["How ___ did you find?", "We do not have ___ left.", "Was there ___ available?", "I wonder how ___ they need.", "There is not ___ here."];
addGrid(QUESTION_POOL, "A2", "Grammar", A2_NOUNS, A2_QUANTITY_LEADS, ([noun, answer], lead) => ({
  question: `Choose the quantity word for “${noun}”: ${lead.replace("___", "___")} (${noun})`, choices: [answer, answer === "many" ? "much" : "many", "a few", "several"], answer
}), 10);

const A2_INTERRUPTED = [["I", "was"], ["Eva", "was"], ["The driver", "was"], ["We", "were"], ["The children", "were"]];
const A2_ING_ACTIONS = [["cook", "cooking"], ["cycle", "cycling"], ["shop", "shopping"], ["study", "studying"], ["travel", "travelling"]];
addGrid(QUESTION_POOL, "A2", "Grammar", A2_INTERRUPTED, A2_ING_ACTIONS, ([subject, auxiliary], [base, ing]) => {
  const answer = `${auxiliary} ${ing}`;
  return { question: `Use “${base}” for the interrupted action: ${subject} ___ when the phone rang.`, choices: [answer, `${auxiliary} ${base}`, `has ${ing}`, `did ${ing}`], answer };
}, 10);

const A2_PATTERNS = [["enjoys", "-ing"], ["finished", "-ing"], ["wants", "to"], ["decided", "to"], ["hopes", "to"]];
const A2_VERBS = [["paint", "painting"], ["visit", "visiting"], ["learn", "learning"], ["cook", "cooking"], ["travel", "travelling"]];
addGrid(QUESTION_POOL, "A2", "Grammar", A2_PATTERNS, A2_VERBS, ([lead, pattern], [base, ing]) => {
  const answer = pattern === "to" ? `to ${base}` : ing;
  return { question: `Select the form of “${base}”: Nadi ${lead} ___ during the holiday.`, choices: [answer, base, `to ${ing}`, `${base}s`], answer };
}, 10);

const A2_SUPERLATIVES = [["bright", "the brightest"], ["busy", "the busiest"], ["comfortable", "the most comfortable"], ["good", "the best"], ["far", "the farthest"]];
const A2_GROUPS = ["in the whole shop", "among the five routes", "of all the rooms", "in our class", "on the entire island"];
addGrid(QUESTION_POOL, "A2", "Grammar", A2_SUPERLATIVES, A2_GROUPS, ([base, answer], group) => ({
  question: `Use the superlative of “${base}”: This option is ___ ${group}.`, choices: [answer, base, answer.replace("the ", ""), `more ${base}`], answer
}), 10);

const A2_PLANNERS = ["I am", "She is", "Ravi is", "We are", "They are"];
const A2_PLANS = [["bake a cake", "bake"], ["clean the beach", "clean"], ["join the club", "join"], ["watch the parade", "watch"], ["plant a tree", "plant"]];
addGrid(QUESTION_POOL, "A2", "Grammar", A2_PLANNERS, A2_PLANS, (subject, [plan, base]) => {
  const answer = `going to ${plan}`;
  return { question: `Express this prior plan—“${plan}”: ${subject} ___ tomorrow.`, choices: [answer, `go to ${plan}`, `going ${base}`, `will going to ${base}`], answer };
}, 10);

// B1: relative clauses, reported speech, experience, hypothetical results, and modal meaning.
const B1_RELATIVES = [["chef", "who"], ["musician", "who"], ["neighbour", "who"], ["device", "which"], ["website", "which"]];
const B1_RELATIVE_ENDINGS = ["appeared in the report", "was mentioned by our guide", "became the subject of a documentary", "received a design award", "attracted attention online"];
addGrid(QUESTION_POOL, "B1", "Grammar", B1_RELATIVES, B1_RELATIVE_ENDINGS, ([noun, answer], ending) => ({
  question: `Supply the relative word: The ${noun} ___ ${ending} is easy to identify.`, choices: [answer, ...["who", "which", "where", "whose"].filter((word) => word !== answer)], answer
}), 10);

const B1_SPEAKERS = ["Amir", "Chloe", "My aunt", "The captain", "Our tutor"];
const B1_QUOTES = [["I am tired", "was tired"], ["I need a map", "needed a map"], ["I know the answer", "knew the answer"], ["I feel better", "felt better"], ["I have a ticket", "had a ticket"]];
addGrid(QUESTION_POOL, "B1", "Grammar", B1_SPEAKERS, B1_QUOTES, (speaker, [quote, reported]) => {
  const answer = `${speaker} said that ${speaker} ${reported}.`;
  return { question: `Report this statement: ${speaker} said, “${quote}.”`, choices: [answer, `${speaker} said that ${speaker} ${quote.slice(2)}.`, `${speaker} says that I ${reported}.`, `${speaker} told that ${speaker} ${reported}.`], answer };
}, 10);

const B1_EXPERIENCE_SUBJECTS = [["I", "have"], ["You", "have"], ["Marta", "has"], ["The pilot", "has"], ["We", "have"]];
const B1_PARTICIPLES = [["ride", "ridden a horse"], ["see", "seen snow"], ["eat", "eaten seaweed"], ["write", "written a poem"], ["fly", "flown in a helicopter"]];
addGrid(QUESTION_POOL, "B1", "Grammar", B1_EXPERIENCE_SUBJECTS, B1_PARTICIPLES, ([subject, auxiliary], [base, phrase]) => {
  const answer = `${auxiliary} ${phrase}`;
  return { question: `Use “${base}” to describe life experience: ${subject} ___ before.`, choices: [answer, `did ${base}`, `${auxiliary} ${base}`, `was ${phrase}`], answer };
}, 10);

const B1_HYPOTHETICALS = ["found a wallet", "spoke four languages", "owned a boat", "met an astronaut", "lived near the office"];
const B1_RESULTS = ["I would tell my closest friend", "I would need time to adjust", "I would change my daily routine", "I would make a careful plan", "I would consider my options"];
addGrid(QUESTION_POOL, "B1", "Grammar", B1_HYPOTHETICALS, B1_RESULTS, (condition, answer) => ({
  question: `Complete this unreal situation with the intended result “${answer.replace("I would ", "I ")}”: If I ${condition}, ___.`, choices: [answer, answer.replace("would", "will"), answer.replace("would", "did"), answer.replace("would", "have")], answer
}), 10);

const B1_MODAL_CASES = [["a strong recommendation", "should"], ["a rule or obligation", "must"], ["a lack of necessity", "do not have to"], ["a present possibility", "might"], ["a past ability", "could"]];
const B1_MODAL_ACTIONS = ["wear a helmet", "save a copy", "bring an umbrella", "speak to the manager", "use the side entrance"];
addGrid(QUESTION_POOL, "B1", "Grammar", B1_MODAL_CASES, B1_MODAL_ACTIONS, ([meaning, answer], action) => ({
  question: `Which modal phrase expresses ${meaning}? You ___ ${action}.`, choices: [answer, ...["should", "must", "do not have to", "might", "could"].filter((word) => word !== answer).slice(0, 3)], answer
}), 10);

// B2: passive voice, concession, causatives, regrets, and modal-perfect meanings.
const B2_PASSIVE_SUBJECTS = ["The mural", "The software", "The bridge", "The invitations", "The final schedule"];
const B2_PASSIVE_VERBS = [["paint", "was painted"], ["update", "was updated"], ["inspect", "was inspected"], ["deliver", "was delivered"], ["approve", "was approved"]];
addGrid(QUESTION_POOL, "B2", "Grammar", B2_PASSIVE_SUBJECTS, B2_PASSIVE_VERBS, (subject, [base, answer]) => ({
  question: `Put “${base}” in the past passive: ${subject} ___ before noon.`, choices: [answer, `did ${base}`, `has ${base}`, `was ${base}`], answer
}), 10);

const B2_CONCESSIONS = ["the heavy rain", "her limited experience", "the high price", "their late arrival", "the narrow space"];
const B2_MAIN_CLAUSES = ["the concert continued", "she handled the task well", "every ticket was sold", "they were admitted", "the furniture fitted"];
addGrid(QUESTION_POOL, "B2", "Grammar", B2_CONCESSIONS, B2_MAIN_CLAUSES, (nounPhrase, mainClause) => {
  const answer = `Despite ${nounPhrase}, ${mainClause}.`;
  return { question: `Join these ideas with “despite”: ${nounPhrase}; ${mainClause}.`, choices: [answer, `Despite of ${nounPhrase}, ${mainClause}.`, `Although ${nounPhrase}, but ${mainClause}.`, `Despite ${nounPhrase}, but ${mainClause}.`], answer };
}, 10);

const B2_CAUSATIVE_SUBJECTS = ["I", "Nora", "The director", "We", "Our neighbours"];
const B2_SERVICES = [["repair the laptop", "the laptop repaired"], ["clean the windows", "the windows cleaned"], ["print the banners", "the banners printed"], ["test the alarm", "the alarm tested"], ["deliver the sofa", "the sofa delivered"]];
addGrid(QUESTION_POOL, "B2", "Grammar", B2_CAUSATIVE_SUBJECTS, B2_SERVICES, (subject, [service, objectPhrase]) => {
  const answer = `had ${objectPhrase}`;
  return { question: `Show that a professional did the service “${service}”: ${subject} ___ yesterday.`, choices: [answer, `had repaired ${objectPhrase}`, `made ${objectPhrase}`, `did ${objectPhrase}`], answer };
}, 10);

const B2_REGRETS = [["leaving the phone uncharged", "had charged the phone"], ["missing the rehearsal", "had attended the rehearsal"], ["selling the bicycle", "had not sold the bicycle"], ["forgetting the appointment", "had remembered the appointment"], ["taking the wrong train", "had taken the right train"]];
const B2_REGRET_SPEAKERS = ["I wish I", "He wishes he", "Maya wishes she", "We wish we", "They wish they"];
addGrid(QUESTION_POOL, "B2", "Grammar", B2_REGRETS, B2_REGRET_SPEAKERS, ([reality, answerEnding], lead) => {
  const answer = `${lead} ${answerEnding}.`;
  return { question: `Begin with “${lead}” to express regret about this past fact—${reality}:`, choices: [answer, `${lead} ${answerEnding.replace("had ", "")}.`, `${lead} would ${answerEnding.replace("had ", "")}.`, `${lead} have ${answerEnding.replace("had ", "")}.`], answer };
}, 10);

const B2_MODAL_PERFECTS = [["a missed obligation", "should have"], ["a certain past deduction", "must have"], ["an impossible past deduction", "cannot have"], ["an unrealized possibility", "could have"], ["an unnecessary completed action", "need not have"]];
const B2_PAST_ACTIONS = ["checked the lock", "taken the earlier bus", "read the instructions", "kept the receipt", "called the office"];
addGrid(QUESTION_POOL, "B2", "Grammar", B2_MODAL_PERFECTS, B2_PAST_ACTIONS, ([meaning, answer], action) => ({
  question: `Choose the modal-perfect phrase for ${meaning}: Sam ___ ${action}.`, choices: [answer, ...["should have", "must have", "cannot have", "could have", "need not have"].filter((word) => word !== answer).slice(0, 3)], answer
}), 10);

// C1: five advanced transformation families, 100 unique questions each.
const C1_EVENTS = ["reading the appendix", "checking the timestamps", "interviewing the witness", "reviewing the budget", "testing the backup", "consulting the archive", "mapping the route", "comparing the samples", "hearing both accounts", "examining the contract"];
const C1_DISCOVERIES = [["the analyst", "notice", "the discrepancy"], ["the editors", "find", "the missing citation"], ["the engineer", "identify", "the fault"], ["the panel", "understand", "the objection"], ["the auditors", "detect", "the duplicate payment"], ["the doctor", "recognize", "the pattern"], ["the crew", "locate", "the leak"], ["the curator", "confirm", "the painting's origin"], ["the lawyer", "spot", "the contradiction"], ["the researchers", "question", "the initial assumption"]];
addGrid(HARD_QUESTION_POOL, "C1", "Advanced Grammar", C1_EVENTS, C1_DISCOVERIES, (event, [subject, base, object]) => {
  const answer = `did ${subject} ${base} ${object}`;
  return { question: `Invert a clause with subject “${subject}”, verb “${base}”, and object “${object}”: Only after ${event} ___ .`, choices: [answer, `${subject} did ${base} ${object}`, `had ${subject} ${base} ${object}`, `${subject} ${base} ${object}`], answer };
}, 20);

const C1_DEADLINES = ["the vote was counted", "the doors had closed", "the data were released", "the final bell rang", "the fog had lifted", "the permit arrived", "the repairs were complete", "the chair intervened", "the last guest departed", "the embargo ended"];
const C1_DELAYED_ACTIONS = [["the result", "become public", "did the result become public"], ["the train", "leave", "did the train leave"], ["the team", "respond", "did the team respond"], ["the audience", "relax", "did the audience relax"], ["the aircraft", "take off", "did the aircraft take off"], ["construction", "begin", "did construction begin"], ["the network", "return online", "did the network return online"], ["the debate", "resume", "did the debate resume"], ["the staff", "lock up", "did the staff lock up"], ["trade", "restart", "did trade restart"]];
addGrid(HARD_QUESTION_POOL, "C1", "Advanced Grammar", C1_DEADLINES, C1_DELAYED_ACTIONS, (deadline, [subject, base, answer]) => ({
  question: `Invert the action “${subject} ${base}”: Not until ${deadline} ___ .`, choices: [answer, `${subject} did ${base}`, `${subject} ${base}`, `had ${subject} ${base}`], answer
}), 20);

const C1_REPORTS = [["People believe", "is believed"], ["Experts consider", "is considered"], ["Officials expect", "is expected"], ["Historians understand", "is understood"], ["Witnesses report", "is reported"], ["Analysts estimate", "is estimated"], ["Scientists know", "is known"], ["Reviewers claim", "is claimed"], ["Observers assume", "is assumed"], ["Investigators allege", "is alleged"]];
const C1_REPORTED_SUBJECTS = [["the manuscript", "is authentic", "to be authentic"], ["the species", "is endangered", "to be endangered"], ["the merger", "will happen soon", "to happen soon"], ["the settlement", "dates from antiquity", "to date from antiquity"], ["the vessel", "sank offshore", "to have sunk offshore"], ["the collection", "is worth millions", "to be worth millions"], ["the compound", "reacts with water", "to react with water"], ["the sequel", "is in production", "to be in production"], ["the signal", "comes from the north", "to come from the north"], ["the suspect", "left early", "to have left early"]];
addGrid(HARD_QUESTION_POOL, "C1", "Advanced Grammar", C1_REPORTS, C1_REPORTED_SUBJECTS, ([activeLead, passive], [subject, finitePredicate, infinitive]) => {
  const answer = `${subject} ${passive} ${infinitive}.`;
  return { question: `Rewrite impersonally: “${activeLead} that ${subject} ${finitePredicate}.”`, choices: [answer, `${subject} believes ${infinitive}.`, `It ${passive} ${subject} ${infinitive}.`, `${subject} ${passive} that ${infinitive}.`], answer };
}, 20);

const C1_PRESENT_STATES = ["the streets are flooded", "the team is exhausted", "the files are missing", "the hall is overcrowded", "the engine is damaged", "the account is inaccessible", "the crops are failing", "the schedule is chaotic", "the shoreline is polluted", "the evidence is incomplete"];
const C1_PAST_CAUSES = ["the preventive work had succeeded", "the warning had been followed", "the earlier plan had worked", "the specialists had intervened", "the proper checks had been made", "the backup measure had held", "the risk had been addressed", "the recommended action had been taken", "the initial response had been effective", "the contingency plan had been used"];
addGrid(HARD_QUESTION_POOL, "C1", "Advanced Grammar", C1_PRESENT_STATES, C1_PAST_CAUSES, (state, condition) => {
  const answer = state.replace(/\b(?:is|are)\b/, "would not be");
  return {
  question: `Link the past cause to the present state “${state}”: If ${condition}, ___.`, choices: [answer, answer.replace("would not be", "will not be"), answer.replace("would not be", "would not have been"), answer.replace("would not be", "is not")], answer
  };
}, 20);

const C1_FOCUSES = ["the handwritten note", "her calm response", "the second prototype", "their shared history", "the smallest detail", "his willingness to listen", "the unexpected detour", "the local volunteers", "the final rehearsal", "the independent audit"];
const C1_IMPACTS = ["resolved the mystery", "prevented an argument", "passed every stress test", "made cooperation possible", "exposed the forgery", "restored the team's trust", "led them to the viewpoint", "kept the shelter open", "revealed the timing problem", "uncovered the accounting error"];
addGrid(HARD_QUESTION_POOL, "C1", "Advanced Grammar", C1_FOCUSES, C1_IMPACTS, (focus, impact) => {
  const answer = `What ${impact} was ${focus}.`;
  return { question: `Create a what-cleft emphasizing “${focus}”: ${focus} ${impact}.`, choices: [answer, `What was ${focus} ${impact}.`, `It ${impact} what ${focus}.`, `${focus} was what ${impact}.`], answer };
}, 20);

(function validateQuestionBank() {
  const expected = [[QUESTION_POOL, 500, "regular"], [HARD_QUESTION_POOL, 500, "hard"]];
  const prompts = new Set();

  expected.forEach(([pool, size, label]) => {
    if (pool.length !== size) throw new Error(`New ${label} question bank has ${pool.length} entries; expected ${size}.`);
    pool.forEach((item) => {
      if (prompts.has(item.question)) throw new Error(`Duplicate new question: ${item.question}`);
      prompts.add(item.question);
      if (item.choices.length !== 4 || new Set(item.choices).size !== 4) throw new Error(`Choices must be four unique values: ${item.question}`);
      if (!item.choices.includes(item.answer)) throw new Error(`Answer is missing from choices: ${item.question}`);
    });
  });
})();
