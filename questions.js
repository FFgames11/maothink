/* ============================================================
   MaoThink - Questionnaire Set 2026-10-19

   A completely new, self-validating English question bank.
   The previous bank is preserved under:
   archive/questionnaires-2026-10-19/
   ============================================================ */

const GAME_QUESTION_COUNT = 50;
const QUESTION_SET_ID = "2026-10-19-expanded-v2";
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
const A1_OWNERS = [["I", "my"], ["you", "your"], ["Lina", "her"], ["Omar", "his"], ["we", "our"], ["Sara", "her"], ["Mr Tan", "his"], ["my teammate and I", "our"]];
const A1_OBJECTS = ["passport", "lunchbox", "notebook", "umbrella", "camera", "backpack", "ticket", "water bottle"];
addGrid(QUESTION_POOL, "A1", "Grammar", A1_OWNERS, A1_OBJECTS, ([owner, answer], object) => ({
  question: `Choose the possessive word: ${owner} packed ___ ${object}.`,
  choices: [answer, ...["my", "your", "her", "his", "our"].filter((word) => word !== answer).slice(0, 3)], answer
}), 10);

const A1_CONTINUOUS_SUBJECTS = [["I", "am"], ["The baby", "is"], ["Our teacher", "is"], ["You", "are"], ["The neighbours", "are"], ["My cousins", "are"], ["Mr Lee", "is"], ["The cat", "is"]];
const A1_ACTIONS = [["read", "reading"], ["dance", "dancing"], ["swim", "swimming"], ["write", "writing"], ["run", "running"], ["sing", "singing"], ["sit", "sitting"], ["make", "making"]];
addGrid(QUESTION_POOL, "A1", "Grammar", A1_CONTINUOUS_SUBJECTS, A1_ACTIONS, ([subject, auxiliary], [base, ing]) => {
  const answer = `${auxiliary} ${ing}`;
  return { question: `Use “${base}” for an action happening now: ${subject} ___ at the moment.`, choices: [answer, `${auxiliary} ${base}`, `does ${base}`, `${base}s`], answer };
}, 10);

const A1_PRONOUN_TARGETS = [["the speaker", "me"], ["the listener", "you"], ["a boy named Ben", "him"], ["a girl named Mei", "her"], ["the speaker and a friend", "us"], ["two visiting students", "them"], ["the speaker's team", "us"], ["a man named Raj", "him"]];
const A1_PRONOUN_LEADS = ["Please call", "The coach thanked", "Maya invited", "Could you help", "The guide showed the map to", "The host welcomed", "Our neighbour recognised", "The nurse spoke to"];
addGrid(QUESTION_POOL, "A1", "Grammar", A1_PRONOUN_TARGETS, A1_PRONOUN_LEADS, ([target, answer], lead) => ({
  question: `Which object pronoun replaces ${target}? ${lead} ___.`,
  choices: [answer, ...["me", "you", "him", "her", "us", "them"].filter((word) => word !== answer).slice(0, 3)], answer
}), 10);

const A1_DEMONSTRATIVES = [["one cup beside me", "This", "is"], ["one kite far away", "That", "is"], ["two keys beside me", "These", "are"], ["three boats far away", "Those", "are"], ["several photos in my hand", "These", "are"], ["one tower in the distance", "That", "is"], ["two shells at my feet", "These", "are"], ["four stars far above us", "Those", "are"]];
const A1_DEMO_SETTINGS = ["at the market", "during the lesson", "in the garden", "on our trip", "inside the museum", "beside the lake", "at the station", "from the balcony"];
addGrid(QUESTION_POOL, "A1", "Grammar", A1_DEMONSTRATIVES, A1_DEMO_SETTINGS, ([description, answer, verb], setting) => ({
  question: `${setting}, point to ${description}: “___ ${verb} what I mean.”`, choices: [answer, ...["This", "That", "These", "Those"].filter((word) => word !== answer)], answer
}), 10);

const A1_TIMES = [["7:30", "at"], ["Tuesday", "on"], ["December", "in"], ["noon", "at"], ["the weekend", "on"], ["2027", "in"], ["Friday evening", "on"], ["midnight", "at"]];
const A1_TIME_LEADS = ["The shop opens", "Our class begins", "The bus arrives", "I practise piano", "They meet us", "The film starts", "We visit Grandma", "The library closes"];
addGrid(QUESTION_POOL, "A1", "Grammar", A1_TIMES, A1_TIME_LEADS, ([time, answer], lead) => ({
  question: `Add the correct time preposition: ${lead} ___ ${time}.`, choices: [answer, ...["at", "on", "in", "for"].filter((word) => word !== answer)], answer
}), 10);

// A2: quantity, interrupted actions, verb patterns, superlatives, and planned actions.
const A2_NOUNS = [["rice", "much"], ["emails", "many"], ["traffic", "much"], ["chairs", "many"], ["information", "much"], ["luggage", "much"], ["suggestions", "many"], ["equipment", "much"]];
const A2_QUANTITY_LEADS = ["How ___ did you find?", "We do not have ___ left.", "Was there ___ available?", "I wonder how ___ they need.", "There is not ___ here.", "Do you know how ___ arrived?", "They asked how ___ remained.", "Can you estimate how ___ was used?"];
addGrid(QUESTION_POOL, "A2", "Grammar", A2_NOUNS, A2_QUANTITY_LEADS, ([noun, answer], lead) => ({
  question: `Choose the quantity word for “${noun}”: ${lead.replace("___", "___")} (${noun})`, choices: [answer, answer === "many" ? "much" : "many", "a few", "several"], answer
}), 10);

const A2_INTERRUPTED = [["I", "was"], ["Eva", "was"], ["The driver", "was"], ["We", "were"], ["The children", "were"], ["My parents", "were"], ["The guard", "was"], ["You", "were"]];
const A2_ING_ACTIONS = [["cook", "cooking"], ["cycle", "cycling"], ["shop", "shopping"], ["study", "studying"], ["travel", "travelling"], ["wait", "waiting"], ["jog", "jogging"], ["lie", "lying"]];
addGrid(QUESTION_POOL, "A2", "Grammar", A2_INTERRUPTED, A2_ING_ACTIONS, ([subject, auxiliary], [base, ing]) => {
  const answer = `${auxiliary} ${ing}`;
  return { question: `Use “${base}” for the interrupted action: ${subject} ___ when the phone rang.`, choices: [answer, `${auxiliary} ${base}`, `has ${ing}`, `did ${ing}`], answer };
}, 10);

const A2_PATTERNS = [["enjoys", "-ing"], ["finished", "-ing"], ["wants", "to"], ["decided", "to"], ["hopes", "to"], ["avoids", "-ing"], ["plans", "to"], ["keeps", "-ing"]];
const A2_VERBS = [["paint", "painting"], ["visit", "visiting"], ["learn", "learning"], ["cook", "cooking"], ["travel", "travelling"], ["dance", "dancing"], ["write", "writing"], ["swim", "swimming"]];
addGrid(QUESTION_POOL, "A2", "Grammar", A2_PATTERNS, A2_VERBS, ([lead, pattern], [base, ing]) => {
  const answer = pattern === "to" ? `to ${base}` : ing;
  return { question: `Select the form of “${base}”: Nadi ${lead} ___ during the holiday.`, choices: [answer, base, `to ${ing}`, `${base}s`], answer };
}, 10);

const A2_SUPERLATIVES = [["bright", "the brightest"], ["busy", "the busiest"], ["comfortable", "the most comfortable"], ["good", "the best"], ["far", "the farthest"], ["interesting", "the most interesting"], ["bad", "the worst"], ["quiet", "the quietest"]];
const A2_GROUPS = ["in the whole shop", "among the five routes", "of all the rooms", "in our class", "on the entire island", "in the exhibition", "of the three proposals", "along this street"];
addGrid(QUESTION_POOL, "A2", "Grammar", A2_SUPERLATIVES, A2_GROUPS, ([base, answer], group) => ({
  question: `Use the superlative of “${base}”: This option is ___ ${group}.`, choices: [answer, base, answer.replace("the ", ""), `more ${base}`], answer
}), 10);

const A2_PLANNERS = ["I am", "She is", "Ravi is", "We are", "They are", "My cousins are", "The coach is", "You are"];
const A2_PLANS = [["bake a cake", "bake"], ["clean the beach", "clean"], ["join the club", "join"], ["watch the parade", "watch"], ["plant a tree", "plant"], ["visit the aquarium", "visit"], ["organise a picnic", "organise"], ["learn first aid", "learn"]];
addGrid(QUESTION_POOL, "A2", "Grammar", A2_PLANNERS, A2_PLANS, (subject, [plan, base]) => {
  const answer = `going to ${plan}`;
  return { question: `Express this prior plan—“${plan}”: ${subject} ___ tomorrow.`, choices: [answer, `go to ${plan}`, `going ${base}`, `will going to ${base}`], answer };
}, 10);

// B1: tense sequencing, reported questions, formal relatives, condition
// linkers, and contextual phrasal verbs (100 questions per family).
const B1_ARRIVALS = ["the chair arrived", "the guests sat down", "the bell rang", "the manager called", "the doors opened", "the broadcast began", "the inspector appeared", "the storm reached us", "the courier returned", "the audience entered"];
const B1_COMPLETED_ACTIONS = [["finish", "finished", "the report"], ["send", "sent", "the invitations"], ["choose", "chosen", "a venue"], ["write", "written", "the announcement"], ["prepare", "prepared", "the equipment"], ["hide", "hidden", "the spare key"], ["take", "taken", "the photographs"], ["make", "made", "a backup"], ["read", "read", "the instructions"], ["cancel", "cancelled", "the booking"]];
addGrid(QUESTION_POOL, "B1", "Tense & Aspect", B1_ARRIVALS, B1_COMPLETED_ACTIONS, (arrival, [base, participle, object]) => {
  const answer = `had ${participle} ${object}`;
  return { question: `Show which action was completed first: By the time ${arrival}, they ___ . (verb: ${base})`, choices: [answer, `${participle} ${object}`, `have ${participle} ${object}`, `were ${participle} ${object}`], answer };
}, 10);

const B1_REPORTERS = ["Amir", "Chloe", "The receptionist", "Our tutor", "The captain", "Maya", "The technician", "My neighbour", "The organiser", "The journalist"];
const B1_DIRECT_QUESTIONS = [["Where is the entrance?", "where the entrance was", "where was the entrance"], ["Why did the alarm stop?", "why the alarm had stopped", "why had the alarm stopped"], ["When will the results arrive?", "when the results would arrive", "when would the results arrive"], ["Who owns this bicycle?", "who owned that bicycle", "who did own that bicycle"], ["How can I reset the device?", "how to reset the device", "how could I reset the device"], ["Is the office open?", "whether the office was open", "whether was the office open"], ["What does this symbol mean?", "what that symbol meant", "what did that symbol mean"], ["Where have they moved?", "where they had moved", "where had they moved"], ["Why is the road closed?", "why the road was closed", "why was the road closed"], ["When does the exhibition end?", "when the exhibition ended", "when did the exhibition end"]];
addGrid(QUESTION_POOL, "B1", "Reported Speech", B1_REPORTERS, B1_DIRECT_QUESTIONS, (reporter, [direct, reported, inverted]) => {
  const answer = `${reporter} asked ${reported}.`;
  return { question: `Report the question without direct-question word order: ${reporter} asked, "${direct}"`, choices: [answer, `${reporter} asked ${inverted}.`, `${reporter} said ${reported}.`, `${reporter} asked that ${reported}.`], answer };
}, 10);

const B1_PEOPLE = ["consultant", "architect", "researcher", "applicant", "musician", "translator", "witness", "engineer", "editor", "photographer"];
const B1_PREPOSITIONAL_RELATIVES = [["to", "I sent the draft"], ["with", "we discussed the proposal"], ["from", "the message arrived"], ["for", "the award was intended"], ["about", "they had complained"], ["by", "the article was written"], ["against", "the evidence was presented"], ["through", "the agreement was reached"], ["without", "the project could not continue"], ["upon", "the committee relied"]];
addGrid(QUESTION_POOL, "B1", "Relative Clauses", B1_PEOPLE, B1_PREPOSITIONAL_RELATIVES, (person, [preposition, tail]) => {
  const answer = `${preposition} whom`;
  return { question: `Choose the formal relative phrase: The ${person} ___ ${tail} will attend the meeting.`, choices: [answer, `${preposition} who`, `who ${preposition}`, `${preposition} which`], answer };
}, 10);

const B1_LINKERS = [["except if", "unless"], ["only on the condition that", "provided that"], ["regardless of whether", "even if"], ["as a precaution against", "in case"], ["on the condition that", "as long as"], ["assuming that", "supposing"], ["because of the possibility that", "in the event that"], ["with no consideration of whether", "whether or not"], ["taking it as true that", "assuming that"], ["immediately after", "once"]];
const B1_CONDITION_CLAUSES = ["the weather changes", "the payment arrives", "the signal fails", "the room becomes crowded", "the timetable is revised", "the supplier agrees", "the roads remain open", "the data are accurate", "the permit is renewed", "the team finishes early"];
addGrid(QUESTION_POOL, "B1", "Linking Ideas", B1_LINKERS, B1_CONDITION_CLAUSES, ([meaning, answer], clause) => ({
  question: `Which linker means "${meaning}" here? We will continue ___ ${clause}.`, choices: [answer, ...["unless", "provided that", "even if", "in case", "as long as", "supposing", "in the event that", "whether or not", "assuming that", "once"].filter((item) => item !== answer).slice(0, 3)], answer
}), 10);

const B1_NAMES = ["Aisha", "Ben", "Carla", "Dev", "Elena", "Farid", "Grace", "Hugo", "Inez", "Jon"];
const B1_PHRASAL_VERBS = [
  ["look into the complaint", "investigate the complaint", "ignore the complaint", "repeat the complaint", "publish the complaint"],
  ["put off the meeting", "postpone the meeting", "attend the meeting", "shorten the meeting", "record the meeting"],
  ["carry out the survey", "conduct the survey", "cancel the survey", "design the survey", "question the survey"],
  ["turn down the offer", "reject the offer", "improve the offer", "repeat the offer", "accept the offer"],
  ["bring up the budget", "mention the budget", "increase the budget", "hide the budget", "approve the budget"],
  ["work out the total", "calculate the total", "reduce the total", "copy the total", "guess the total"],
  ["take over the project", "assume control of the project", "abandon the project", "review the project", "fund the project"],
  ["point out the error", "draw attention to the error", "correct the error", "repeat the error", "cause the error"],
  ["set up the equipment", "prepare the equipment for use", "sell the equipment", "repair the equipment", "store the equipment"],
  ["come across the document", "find the document unexpectedly", "translate the document", "destroy the document", "request the document"]
];
addGrid(QUESTION_POOL, "B1", "Vocabulary in Context", B1_NAMES, B1_PHRASAL_VERBS, (name, [phrase, answer, wrong1, wrong2, wrong3]) => ({
  question: `${name} decided to "${phrase}." What does the quoted phrase mean?`, choices: [answer, wrong1, wrong2, wrong3], answer
}), 10);

// B2: mixed conditionals, perfect infinitives, reduced clauses, nuanced
// modal-perfect meanings, and advanced collocations (100 per family).
const B2_CONDITIONAL_SUBJECTS = ["Aisha", "Ben", "Carla", "Dev", "Elena", "Farid", "Grace", "Hugo", "Inez", "Jon"];
const B2_CAUSE_RESULT_PAIRS = [
  ["had accepted the scholarship", "would be living abroad now", "would have lived abroad", "will be living abroad now", "had been living abroad"],
  ["had backed up the files", "would have the original data now", "would have had the original data", "will have the original data now", "had had the original data"],
  ["had studied engineering", "would understand this design now", "would have understood this design", "will understand this design now", "had understood this design"],
  ["had followed the directions", "would not be lost now", "would not have got lost", "will not be lost now", "had not been lost"],
  ["had taken the earlier flight", "would already be at the conference", "would already have reached the conference", "will already be at the conference", "had already been at the conference"],
  ["had kept the receipt", "could return the device now", "could have returned the device", "can return the device now", "had returned the device"],
  ["had learned Mandarin", "would be able to translate this now", "would have been able to translate this", "will be able to translate this now", "had been able to translate this"],
  ["had invested more cautiously", "would not be in debt now", "would not have fallen into debt", "will not be in debt now", "had not been in debt"],
  ["had booked in advance", "would have a seat now", "would have had a seat", "will have a seat now", "had had a seat"],
  ["had checked the forecast", "would not be soaked now", "would not have got soaked", "will not be soaked now", "had not been soaked"]
];
addGrid(QUESTION_POOL, "B2", "Mixed Conditionals", B2_CONDITIONAL_SUBJECTS, B2_CAUSE_RESULT_PAIRS, (subject, [cause, answer, wrong1, wrong2, wrong3]) => ({
  question: `Express the intended present result "${answer.replace(/^(?:would|could) /, "").replace(/ now$/, "")}": If ${subject} ${cause}, ${subject} ___ .`, choices: [answer, wrong1, wrong2, wrong3], answer
}), 10);

const B2_APPEARANCES = ["appears", "seems", "is believed", "is thought", "is reported", "is understood", "is alleged", "is known", "is considered", "is estimated"];
const B2_PRIOR_ACTIONS = [["leave before dawn", "to have left before dawn"], ["misplace the key", "to have misplaced the key"], ["discover the fault", "to have discovered the fault"], ["change the figures", "to have changed the figures"], ["reach an agreement", "to have reached an agreement"], ["ignore the warning", "to have ignored the warning"], ["solve the problem", "to have solved the problem"], ["cross the border", "to have crossed the border"], ["underestimate the cost", "to have underestimated the cost"], ["delay the launch", "to have delayed the launch"]];
addGrid(QUESTION_POOL, "B2", "Perfect Infinitives", B2_APPEARANCES, B2_PRIOR_ACTIONS, (lead, [basePhrase, answer]) => ({
  question: `Show that the action "${basePhrase}" happened earlier: The director ${lead} ___ .`, choices: [answer, answer.replace("to have ", "to "), answer.replace("to have ", "having "), answer.replace("to have ", "to be ")], answer
}), 10);

const B2_COMPLETED_STEPS = [["check", "Having checked"], ["read", "Having read"], ["compare", "Having compared"], ["finish", "Having finished"], ["consult", "Having consulted"], ["review", "Having reviewed"], ["test", "Having tested"], ["interview", "Having interviewed"], ["measure", "Having measured"], ["confirm", "Having confirmed"]];
const B2_FOLLOW_UPS = ["the team submitted its recommendation", "the editor approved the article", "the mechanic replaced the component", "the panel announced its decision", "the doctor revised the treatment", "the auditor signed the report", "the guide changed the route", "the architect altered the plan", "the scientist repeated the trial", "the lawyer prepared the appeal"];
addGrid(QUESTION_POOL, "B2", "Participle Clauses", B2_COMPLETED_STEPS, B2_FOLLOW_UPS, ([base, opening], followUp) => {
  const answer = `${opening} all the evidence, ${followUp}.`;
  return { question: `Show that "${base} all the evidence" happened before this main action—"${followUp}":`, choices: [answer, `${base} all the evidence, ${followUp}.`, `Having to ${base} all the evidence, ${followUp}.`, `Was ${base} all the evidence, ${followUp}.`], answer };
}, 10);

const B2_MODAL_NUANCES = [["strong logical certainty about the past", "must have"], ["a plausible but uncertain past possibility", "may have"], ["a past event known to be impossible", "cannot have"], ["an unfulfilled past duty", "should have"], ["criticism of a past action", "should not have"], ["an unused past opportunity", "could have"], ["an unnecessary action that was completed", "need not have"], ["a formal expression of past duty", "ought to have"], ["a likely past event", "will have"], ["a hypothetical past willingness", "would have"]];
const B2_EVIDENCE_ACTIONS = ["noticed the discrepancy", "taken a different route", "misread the instructions", "saved a local copy", "contacted the supplier", "anticipated the delay", "verified the signature", "requested an extension", "recognised the landmark", "recorded the conversation"];
addGrid(QUESTION_POOL, "B2", "Modal Meaning", B2_MODAL_NUANCES, B2_EVIDENCE_ACTIONS, ([meaning, answer], action) => ({
  question: `Select the modal-perfect phrase expressing ${meaning}: The analyst ___ ${action}.`, choices: [answer, ...["must have", "may have", "cannot have", "should have", "should not have", "could have", "need not have", "ought to have", "will have", "would have"].filter((item) => item !== answer).slice(0, 3)], answer
}), 10);

const B2_SCENARIOS = ["In the risk assessment", "During the negotiations", "In her formal complaint", "While reviewing the evidence", "At the strategy meeting", "In the final recommendation", "During the safety briefing", "In its annual report", "At the public hearing", "While planning the response"];
const B2_COLLOCATIONS = [
  ["___ all relevant factors", "take into account", "make into account", "bring into account", "put under account"],
  ["___ a tentative conclusion", "draw", "pull", "take", "do"],
  ["___ serious concerns", "raise", "lift", "grow", "rise"],
  ["___ a substantial threat", "pose", "place", "set", "make"],
  ["___ the minimum requirement", "meet", "reach", "touch", "arrive at"],
  ["___ a workable compromise", "reach", "catch", "meet", "arrive"],
  ["___ full responsibility", "bear", "hold", "carry on", "wear"],
  ["___ a formal complaint", "lodge", "store", "house", "position"],
  ["___ additional resources", "allocate", "locate", "attribute", "appoint"],
  ["___ considerable caution", "exercise", "train", "perform", "practise on"]
];
addGrid(QUESTION_POOL, "B2", "Academic Vocabulary", B2_SCENARIOS, B2_COLLOCATIONS, (scenario, [gap, answer, wrong1, wrong2, wrong3]) => ({
  question: `${scenario}, choose the natural collocation: ${gap}.`, choices: [answer, wrong1, wrong2, wrong3], answer
}), 10);

// C1: five advanced transformation families, expanded below.
const C1_EVENTS = ["reading the appendix", "checking the timestamps", "interviewing the witness", "reviewing the budget", "testing the backup", "consulting the archive", "mapping the route", "comparing the samples", "hearing both accounts", "examining the contract"];
const C1_DISCOVERIES = [["the analyst", "notice", "the discrepancy"], ["the editors", "find", "the missing citation"], ["the engineer", "identify", "the fault"], ["the panel", "understand", "the objection"], ["the auditors", "detect", "the duplicate payment"], ["the doctor", "recognize", "the pattern"], ["the crew", "locate", "the leak"], ["the curator", "confirm", "the painting's origin"], ["the lawyer", "spot", "the contradiction"], ["the researchers", "question", "the initial assumption"]];
C1_EVENTS.push("reconstructing the timeline", "cross-referencing the testimony");
C1_DISCOVERIES.push(["the investigators", "uncover", "the concealed transaction"], ["the linguist", "recognize", "the dialectal shift"]);
addGrid(HARD_QUESTION_POOL, "C1", "Advanced Grammar", C1_EVENTS, C1_DISCOVERIES, (event, [subject, base, object]) => {
  const answer = `did ${subject} ${base} ${object}`;
  return { question: `Invert a clause with subject “${subject}”, verb “${base}”, and object “${object}”: Only after ${event} ___ .`, choices: [answer, `${subject} did ${base} ${object}`, `had ${subject} ${base} ${object}`, `${subject} ${base} ${object}`], answer };
}, 20);

const C1_DEADLINES = ["the vote was counted", "the doors had closed", "the data were released", "the final bell rang", "the fog had lifted", "the permit arrived", "the repairs were complete", "the chair intervened", "the last guest departed", "the embargo ended"];
const C1_DELAYED_ACTIONS = [["the result", "become public", "did the result become public"], ["the train", "leave", "did the train leave"], ["the team", "respond", "did the team respond"], ["the audience", "relax", "did the audience relax"], ["the aircraft", "take off", "did the aircraft take off"], ["construction", "begin", "did construction begin"], ["the network", "return online", "did the network return online"], ["the debate", "resume", "did the debate resume"], ["the staff", "lock up", "did the staff lock up"], ["trade", "restart", "did trade restart"]];
C1_DEADLINES.push("the forensic review concluded", "the injunction was lifted");
C1_DELAYED_ACTIONS.push(["the discrepancy", "come to light", "did the discrepancy come to light"], ["the negotiations", "move forward", "did the negotiations move forward"]);
addGrid(HARD_QUESTION_POOL, "C1", "Advanced Grammar", C1_DEADLINES, C1_DELAYED_ACTIONS, (deadline, [subject, base, answer]) => ({
  question: `Invert the action “${subject} ${base}”: Not until ${deadline} ___ .`, choices: [answer, `${subject} did ${base}`, `${subject} ${base}`, `had ${subject} ${base}`], answer
}), 20);

const C1_REPORTS = [["People believe", "is believed"], ["Experts consider", "is considered"], ["Officials expect", "is expected"], ["Historians understand", "is understood"], ["Witnesses report", "is reported"], ["Analysts estimate", "is estimated"], ["Scientists know", "is known"], ["Reviewers claim", "is claimed"], ["Observers assume", "is assumed"], ["Investigators allege", "is alleged"]];
const C1_REPORTED_SUBJECTS = [["the manuscript", "is authentic", "to be authentic"], ["the species", "is endangered", "to be endangered"], ["the merger", "will happen soon", "to happen soon"], ["the settlement", "dates from antiquity", "to date from antiquity"], ["the vessel", "sank offshore", "to have sunk offshore"], ["the collection", "is worth millions", "to be worth millions"], ["the compound", "reacts with water", "to react with water"], ["the sequel", "is in production", "to be in production"], ["the signal", "comes from the north", "to come from the north"], ["the suspect", "left early", "to have left early"]];
C1_REPORTS.push(["Economists project", "is projected"], ["Legal scholars maintain", "is maintained"]);
C1_REPORTED_SUBJECTS.push(["the market", "will recover gradually", "to recover gradually"], ["the precedent", "remains applicable", "to remain applicable"]);
addGrid(HARD_QUESTION_POOL, "C1", "Advanced Grammar", C1_REPORTS, C1_REPORTED_SUBJECTS, ([activeLead, passive], [subject, finitePredicate, infinitive]) => {
  const answer = `${subject} ${passive} ${infinitive}.`;
  return { question: `Rewrite impersonally: “${activeLead} that ${subject} ${finitePredicate}.”`, choices: [answer, `${subject} believes ${infinitive}.`, `It ${passive} ${subject} ${infinitive}.`, `${subject} ${passive} that ${infinitive}.`], answer };
}, 20);

const C1_PRESENT_STATES = ["the streets are flooded", "the team is exhausted", "the files are missing", "the hall is overcrowded", "the engine is damaged", "the account is inaccessible", "the crops are failing", "the schedule is chaotic", "the shoreline is polluted", "the evidence is incomplete"];
const C1_PAST_CAUSES = ["the preventive work had succeeded", "the warning had been followed", "the earlier plan had worked", "the specialists had intervened", "the proper checks had been made", "the backup measure had held", "the risk had been addressed", "the recommended action had been taken", "the initial response had been effective", "the contingency plan had been used"];
C1_PRESENT_STATES.push("the negotiations are stalled", "the database is vulnerable");
C1_PAST_CAUSES.push("the mediator had been consulted", "the security patch had been deployed");
addGrid(HARD_QUESTION_POOL, "C1", "Advanced Grammar", C1_PRESENT_STATES, C1_PAST_CAUSES, (state, condition) => {
  const answer = state.replace(/\b(?:is|are)\b/, "would not be");
  return {
  question: `Link the past cause to the present state “${state}”: If ${condition}, ___.`, choices: [answer, answer.replace("would not be", "will not be"), answer.replace("would not be", "would not have been"), answer.replace("would not be", "is not")], answer
  };
}, 20);

const C1_FOCUSES = ["the handwritten note", "her calm response", "the second prototype", "their shared history", "the smallest detail", "his willingness to listen", "the unexpected detour", "the local volunteers", "the final rehearsal", "the independent audit"];
const C1_IMPACTS = ["resolved the mystery", "prevented an argument", "passed every stress test", "made cooperation possible", "exposed the forgery", "restored the team's trust", "led them to the viewpoint", "kept the shelter open", "revealed the timing problem", "uncovered the accounting error"];
C1_FOCUSES.push("the dissenting opinion", "the overlooked footnote");
C1_IMPACTS.push("reframed the constitutional debate", "undermined the central premise");
addGrid(HARD_QUESTION_POOL, "C1", "Advanced Grammar", C1_FOCUSES, C1_IMPACTS, (focus, impact) => {
  const answer = `What ${impact} was ${focus}.`;
  return { question: `Create a what-cleft emphasizing “${focus}”: ${focus} ${impact}.`, choices: [answer, `What was ${focus} ${impact}.`, `It ${impact} what ${focus}.`, `${focus} was what ${impact}.`], answer };
}, 20);

(function validateQuestionBank() {
  const expected = [[QUESTION_POOL, 1640, "regular"], [HARD_QUESTION_POOL, 720, "hard"]];
  const expectedLevels = { A1: 320, A2: 320, B1: 500, B2: 500, C1: 720 };
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

  Object.entries(expectedLevels).forEach(([level, size]) => {
    const actual = [...QUESTION_POOL, ...HARD_QUESTION_POOL].filter((item) => item.level === level).length;
    if (actual !== size) throw new Error(`${level} question bank has ${actual} entries; expected ${size}.`);
  });
})();
