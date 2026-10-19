// MaoThink expanded question bank: 300 regular questions and 100 hard questions.
// Loaded after questions.js and before game.js.

function makeNumberChoices(answer, spread, seed) {
  const values = [answer, answer + spread, answer - spread, answer + (spread * 2)].map(String);
  const shift = seed % values.length;
  return values.slice(shift).concat(values.slice(0, shift));
}

function makeFactQuestions(facts, category, questionBuilder, points) {
  return facts.map(([subject, answer], index) => {
    const choices = [answer, facts[(index + 7) % facts.length][1], facts[(index + 19) % facts.length][1], facts[(index + 31) % facts.length][1]];
    const shift = index % choices.length;
    return { category, question: questionBuilder(subject), choices: choices.slice(shift).concat(choices.slice(0, shift)), answer, points };
  });
}

const EXTRA_CAPITAL_FACTS = [
  ["Argentina", "Buenos Aires"], ["Austria", "Vienna"], ["Bangladesh", "Dhaka"], ["Belgium", "Brussels"], ["Brazil", "Brasilia"],
  ["Bulgaria", "Sofia"], ["Canada", "Ottawa"], ["Chile", "Santiago"], ["China", "Beijing"], ["Colombia", "Bogota"],
  ["Croatia", "Zagreb"], ["Cuba", "Havana"], ["Czechia", "Prague"], ["Denmark", "Copenhagen"], ["Egypt", "Cairo"],
  ["Finland", "Helsinki"], ["France", "Paris"], ["Germany", "Berlin"], ["Greece", "Athens"], ["Hungary", "Budapest"],
  ["Iceland", "Reykjavik"], ["India", "New Delhi"], ["Indonesia", "Jakarta"], ["Ireland", "Dublin"], ["Italy", "Rome"],
  ["Japan", "Tokyo"], ["Kenya", "Nairobi"], ["Malaysia", "Kuala Lumpur"], ["Mexico", "Mexico City"], ["Mongolia", "Ulaanbaatar"],
  ["Morocco", "Rabat"], ["Nepal", "Kathmandu"], ["Netherlands", "Amsterdam"], ["New Zealand", "Wellington"], ["Nigeria", "Abuja"],
  ["Norway", "Oslo"], ["Pakistan", "Islamabad"], ["Peru", "Lima"], ["Philippines", "Manila"], ["Poland", "Warsaw"],
  ["Portugal", "Lisbon"], ["Romania", "Bucharest"], ["Saudi Arabia", "Riyadh"], ["South Korea", "Seoul"], ["Spain", "Madrid"],
  ["Sweden", "Stockholm"], ["Thailand", "Bangkok"], ["Turkey", "Ankara"], ["United Kingdom", "London"], ["Vietnam", "Hanoi"]
];

const EXTRA_ELEMENT_FACTS = [
  ["Hydrogen", "H"], ["Helium", "He"], ["Lithium", "Li"], ["Beryllium", "Be"], ["Boron", "B"],
  ["Carbon", "C"], ["Nitrogen", "N"], ["Oxygen", "O"], ["Fluorine", "F"], ["Neon", "Ne"],
  ["Sodium", "Na"], ["Magnesium", "Mg"], ["Aluminium", "Al"], ["Silicon", "Si"], ["Phosphorus", "P"],
  ["Sulfur", "S"], ["Chlorine", "Cl"], ["Argon", "Ar"], ["Potassium", "K"], ["Calcium", "Ca"],
  ["Scandium", "Sc"], ["Titanium", "Ti"], ["Vanadium", "V"], ["Chromium", "Cr"], ["Manganese", "Mn"],
  ["Iron", "Fe"], ["Cobalt", "Co"], ["Nickel", "Ni"], ["Copper", "Cu"], ["Zinc", "Zn"],
  ["Gallium", "Ga"], ["Germanium", "Ge"], ["Arsenic", "As"], ["Selenium", "Se"], ["Bromine", "Br"],
  ["Krypton", "Kr"], ["Rubidium", "Rb"], ["Strontium", "Sr"], ["Silver", "Ag"], ["Tin", "Sn"],
  ["Iodine", "I"], ["Xenon", "Xe"], ["Cesium", "Cs"], ["Barium", "Ba"], ["Tungsten", "W"],
  ["Platinum", "Pt"], ["Gold", "Au"], ["Mercury", "Hg"], ["Lead", "Pb"], ["Uranium", "U"]
];

const EXTRA_LITERATURE_FACTS = [
  ["Pride and Prejudice", "Jane Austen"], ["1984", "George Orwell"], ["The Odyssey", "Homer"], ["Don Quixote", "Miguel de Cervantes"], ["The Divine Comedy", "Dante Alighieri"],
  ["The Great Gatsby", "F. Scott Fitzgerald"], ["Jane Eyre", "Charlotte Bronte"], ["Wuthering Heights", "Emily Bronte"], ["Moby-Dick", "Herman Melville"], ["War and Peace", "Leo Tolstoy"],
  ["Crime and Punishment", "Fyodor Dostoevsky"], ["The Stranger", "Albert Camus"], ["The Trial", "Franz Kafka"], ["Beloved", "Toni Morrison"], ["Things Fall Apart", "Chinua Achebe"],
  ["The Handmaid's Tale", "Margaret Atwood"], ["Fahrenheit 451", "Ray Bradbury"], ["Brave New World", "Aldous Huxley"], ["Frankenstein", "Mary Shelley"], ["Dracula", "Bram Stoker"],
  ["The Picture of Dorian Gray", "Oscar Wilde"], ["The Old Man and the Sea", "Ernest Hemingway"], ["The Grapes of Wrath", "John Steinbeck"], ["Mrs Dalloway", "Virginia Woolf"], ["Invisible Man", "Ralph Ellison"],
  ["The Color Purple", "Alice Walker"], ["The Little Prince", "Antoine de Saint-Exupery"], ["The Name of the Rose", "Umberto Eco"], ["The Alchemist", "Paulo Coelho"], ["The Kite Runner", "Khaled Hosseini"],
  ["Life of Pi", "Yann Martel"], ["The Road", "Cormac McCarthy"], ["Catch-22", "Joseph Heller"], ["Slaughterhouse-Five", "Kurt Vonnegut"], ["A Clockwork Orange", "Anthony Burgess"],
  ["The Bell Jar", "Sylvia Plath"], ["Rebecca", "Daphne du Maurier"], ["Middlemarch", "George Eliot"], ["Gulliver's Travels", "Jonathan Swift"], ["Robinson Crusoe", "Daniel Defoe"],
  ["Treasure Island", "Robert Louis Stevenson"], ["The Wind in the Willows", "Kenneth Grahame"], ["Anne of Green Gables", "L. M. Montgomery"], ["The Secret Garden", "Frances Hodgson Burnett"], ["A Wrinkle in Time", "Madeleine L'Engle"],
  ["The Giver", "Lois Lowry"], ["Holes", "Louis Sachar"], ["Charlotte's Web", "E. B. White"], ["Matilda", "Roald Dahl"], ["The Book Thief", "Markus Zusak"]
];

const EXTRA_REGULAR_QUESTIONS = [
  ...makeFactQuestions(EXTRA_CAPITAL_FACTS, "Geography", country => `Which city serves as the national capital of ${country}?`, 10),
  ...makeFactQuestions(EXTRA_ELEMENT_FACTS, "Science", element => `Which chemical symbol represents ${element}?`, 10),
  ...makeFactQuestions(EXTRA_LITERATURE_FACTS, "Art & Culture", work => `Who wrote '${work}'?`, 10),
  ...Array.from({ length: 50 }, (_, index) => {
    const a = 24 + index;
    const b = 13 + ((index * 7) % 31);
    const answer = a + b;
    return { category: "Math", question: `What is ${a} + ${b}?`, choices: makeNumberChoices(answer, 2 + (index % 4), index), answer: String(answer), points: 10 };
  }),
  ...Array.from({ length: 50 }, (_, index) => {
    const a = 72 + (index * 2);
    const b = 11 + ((index * 3) % 37);
    const answer = a - b;
    return { category: "Math", question: `What is ${a} - ${b}?`, choices: makeNumberChoices(answer, 3 + (index % 5), index + 1), answer: String(answer), points: 10 };
  }),
  ...Array.from({ length: 50 }, (_, index) => {
    const a = 6 + (index % 13);
    const b = 7 + Math.floor(index / 5);
    const answer = a * b;
    return { category: "Math", question: `What is ${a} × ${b}?`, choices: makeNumberChoices(answer, a, index + 2), answer: String(answer), points: 10 };
  })
];

QUESTION_POOL.push(...EXTRA_REGULAR_QUESTIONS);

const EXTRA_HARD_CAPITAL_FACTS = [
  ["Bhutan", "Thimphu"], ["Botswana", "Gaborone"], ["Brunei", "Bandar Seri Begawan"], ["Burkina Faso", "Ouagadougou"], ["Burundi", "Gitega"],
  ["Comoros", "Moroni"], ["Eritrea", "Asmara"], ["Gabon", "Libreville"], ["Fiji", "Suva"], ["Kyrgyzstan", "Bishkek"],
  ["Laos", "Vientiane"], ["Lesotho", "Maseru"], ["Liechtenstein", "Vaduz"], ["Madagascar", "Antananarivo"], ["Malawi", "Lilongwe"],
  ["Maldives", "Male"], ["Mauritania", "Nouakchott"], ["Moldova", "Chisinau"], ["Montenegro", "Podgorica"], ["Mozambique", "Maputo"],
  ["Namibia", "Windhoek"], ["Palau", "Ngerulmud"], ["Suriname", "Paramaribo"], ["Tajikistan", "Dushanbe"], ["Vanuatu", "Port Vila"]
];

const EXTRA_HARD_SCIENCE_FACTS = [
  ["the SI unit of catalytic activity", "katal"], ["the SI unit of luminous flux", "lumen"], ["the SI unit of absorbed radiation dose", "gray"], ["the SI unit of radioactive activity", "becquerel"], ["the SI unit of magnetic flux", "weber"],
  ["the SI unit of magnetic flux density", "tesla"], ["the SI unit of inductance", "henry"], ["the SI unit of electric conductance", "siemens"], ["the SI unit of capacitance", "farad"], ["the SI unit of illuminance", "lux"],
  ["the boundary around a black hole beyond which light cannot escape", "event horizon"], ["the process in which an atomic nucleus splits", "nuclear fission"], ["the process in which light nuclei combine", "nuclear fusion"], ["the organelle that modifies and packages proteins", "Golgi apparatus"], ["the enzyme that unwinds DNA during replication", "helicase"],
  ["the cell division that produces gametes", "meiosis"], ["the atmospheric layer directly above the stratosphere", "mesosphere"], ["the scale used to classify mineral hardness", "Mohs scale"], ["the point in an orbit nearest the Sun", "perihelion"], ["the point in an orbit farthest from the Sun", "aphelion"],
  ["the apparent shift of a nearby star against distant stars", "stellar parallax"], ["the process by which plants lose water vapor through leaves", "transpiration"], ["the conversion of atmospheric nitrogen into usable compounds", "nitrogen fixation"], ["the boundary where two air masses meet", "weather front"], ["the study of fungi", "mycology"]
];

const EXTRA_HARD_QUESTIONS = [
  ...makeFactQuestions(EXTRA_HARD_CAPITAL_FACTS, "Geography", country => `Which city is the capital of ${country}?`, 20),
  ...makeFactQuestions(EXTRA_HARD_SCIENCE_FACTS, "Science", term => `What is ${term}?`, 20),
  ...Array.from({ length: 25 }, (_, index) => {
    const multiplier = 3 + (index % 7);
    const solution = 8 + index;
    const constant = 5 + ((index * 4) % 17);
    const total = (multiplier * solution) + constant;
    return { category: "Math", question: `Solve for x: ${multiplier}x + ${constant} = ${total}.`, choices: makeNumberChoices(solution, 1 + (index % 3), index), answer: String(solution), points: 20 };
  }),
  ...Array.from({ length: 25 }, (_, index) => {
    const a = 14 + index;
    const b = 3 + (index % 6);
    const c = 4 + (index % 5);
    const d = 2 + (index % 4);
    const answer = a + (b * c) - d;
    return { category: "Math", question: `Evaluate using order of operations: ${a} + ${b} × ${c} - ${d}.`, choices: makeNumberChoices(answer, 2 + (index % 4), index + 1), answer: String(answer), points: 20 };
  })
];

HARD_QUESTION_POOL.push(...EXTRA_HARD_QUESTIONS);
