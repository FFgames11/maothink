/* ============================================================
   MaoThink - Verified fact tables for generated knowledge questions
   These are raw facts, not ready-made question objects.
   ============================================================ */

const MAO_ASTRONOMY_FACTS = [
  ["the largest planet in our Solar System", "Jupiter"],
  ["the planet famous for its prominent ring system", "Saturn"],
  ["the hottest planet in our Solar System", "Venus"],
  ["the planet known as the Red Planet", "Mars"],
  ["the closest planet to the Sun", "Mercury"],
  ["the planet that rotates on its side", "Uranus"],
  ["the farthest recognized planet from the Sun", "Neptune"],
  ["Earth's natural satellite", "The Moon"],
  ["the galaxy containing our Solar System", "The Milky Way"],
  ["the star at the center of our Solar System", "The Sun"],
  ["the force that keeps planets in orbit", "Gravity"],
  ["the first person to walk on the Moon", "Neil Armstrong"],
  ["the first artificial satellite launched into orbit", "Sputnik 1"],
  ["the space telescope launched in 1990", "Hubble Space Telescope"],
  ["the boundary around a black hole beyond which light cannot escape", "Event horizon"],
  ["a small rocky object traveling through space", "Meteoroid"],
  ["the point in a planet's orbit closest to the Sun", "Perihelion"],
  ["the dwarf planet once classified as the ninth planet", "Pluto"],
  ["the nearest major galaxy to the Milky Way", "Andromeda Galaxy"],
  ["the constellation containing the stars known as Orion's Belt", "Orion"]
];

const MAO_BIOLOGY_FACTS = [
  ["the organ that pumps blood around the human body", "Heart"],
  ["the largest organ of the human body", "Skin"],
  ["the organ primarily responsible for filtering blood and producing urine", "Kidneys"],
  ["the organ that produces insulin", "Pancreas"],
  ["the part of a cell containing most of its genetic material", "Nucleus"],
  ["the molecule that carries genetic instructions", "DNA"],
  ["the blood cells that transport oxygen", "Red blood cells"],
  ["the blood cells that help fight infection", "White blood cells"],
  ["the process plants use to convert light into chemical energy", "Photosynthesis"],
  ["the pigment that makes most plants green", "Chlorophyll"],
  ["the basic unit of life", "Cell"],
  ["the cell division that produces two genetically identical cells", "Mitosis"],
  ["the cell division that produces gametes", "Meiosis"],
  ["the organelle commonly called the powerhouse of the cell", "Mitochondrion"],
  ["the part of the brain associated with balance and coordination", "Cerebellum"],
  ["the bone protecting the brain", "Skull"],
  ["the longest bone in the human body", "Femur"],
  ["the tiny air sacs where gas exchange occurs in the lungs", "Alveoli"],
  ["the universal donor blood type for red-cell transfusions", "O negative"],
  ["the study of heredity and variation", "Genetics"]
];

const MAO_TECHNOLOGY_FACTS = [
  ["the inventor of the World Wide Web", "Tim Berners-Lee"],
  ["the creator of the Python programming language", "Guido van Rossum"],
  ["the creator of the Linux kernel", "Linus Torvalds"],
  ["the principal designer of the C programming language", "Dennis Ritchie"],
  ["the creator of the Java programming language", "James Gosling"],
  ["the inventor whose name is associated with the Braille writing system", "Louis Braille"],
  ["the inventor of dynamite", "Alfred Nobel"],
  ["the inventor commonly credited with the telephone", "Alexander Graham Bell"],
  ["the brothers credited with the first successful powered airplane", "Wright brothers"],
  ["the scientist who developed the first successful smallpox vaccine", "Edward Jenner"],
  ["the company that developed the Windows operating system", "Microsoft"],
  ["the company that created the Android operating system before Google acquired it", "Android Inc."],
  ["the company behind the PlayStation console", "Sony"],
  ["the company behind the Xbox console", "Microsoft"],
  ["the company that introduced the Macintosh computer", "Apple"],
  ["the meaning of the abbreviation CPU", "Central Processing Unit"],
  ["the meaning of the abbreviation URL", "Uniform Resource Locator"],
  ["the meaning of the abbreviation USB", "Universal Serial Bus"],
  ["the meaning of the abbreviation RAM", "Random Access Memory"],
  ["the meaning of the abbreviation GPS", "Global Positioning System"]
];

const MAO_HISTORY_FACTS = [
  ["the civilization that developed cuneiform writing", "Sumerians"],
  ["the ancient civilization that built Machu Picchu", "Inca"],
  ["the empire ruled by Mansa Musa", "Mali Empire"],
  ["the first emperor of a unified China", "Qin Shi Huang"],
  ["the city buried by Mount Vesuvius in 79 CE", "Pompeii"],
  ["the document signed in 1215 that limited the English king's power", "Magna Carta"],
  ["the explorer whose expedition completed the first circumnavigation of Earth", "Ferdinand Magellan"],
  ["the country where the Renaissance began", "Italy"],
  ["the event symbolized by the storming of the Bastille", "French Revolution"],
  ["the battle that marked Napoleon's final defeat", "Battle of Waterloo"],
  ["the treaty associated with ending World War I for Germany", "Treaty of Versailles"],
  ["the leader of India's nonviolent independence movement", "Mahatma Gandhi"],
  ["the first president of independent Ghana", "Kwame Nkrumah"],
  ["the South African leader elected president in 1994", "Nelson Mandela"],
  ["the wall whose opening in 1989 symbolized the end of a divided Germany", "Berlin Wall"],
  ["the ship on which the Pilgrims traveled to North America in 1620", "Mayflower"],
  ["the ancient wonder located in Alexandria", "Lighthouse of Alexandria"],
  ["the empire ruled by Suleiman the Magnificent", "Ottoman Empire"],
  ["the Japanese political transformation beginning in 1868", "Meiji Restoration"],
  ["the war fought between Athens and Sparta", "Peloponnesian War"]
];

const MAO_WORLD_GEOGRAPHY_FACTS = [
  ["the country containing the ancient city of Petra", "Jordan"],
  ["the country containing Salar de Uyuni", "Bolivia"],
  ["the country containing Mount Kilimanjaro", "Tanzania"],
  ["the country containing the city of Marrakech", "Morocco"],
  ["the country containing Angkor Wat", "Cambodia"],
  ["the country containing the historic city of Timbuktu", "Mali"],
  ["the country containing the fjord known as Geirangerfjord", "Norway"],
  ["the country containing the ancient site of Chichen Itza", "Mexico"],
  ["the country containing the Serengeti National Park", "Tanzania"],
  ["the country containing the city of Dubrovnik", "Croatia"],
  ["the river flowing through Egypt into the Mediterranean Sea", "Nile"],
  ["the longest mountain range on land", "Andes"],
  ["the largest hot desert in the world", "Sahara"],
  ["the ocean between Africa, Asia, and Australia", "Indian Ocean"],
  ["the strait separating Spain from Morocco", "Strait of Gibraltar"],
  ["the continent containing the most countries", "Africa"],
  ["the largest island that is not considered a continent", "Greenland"],
  ["the sea between Europe and Africa", "Mediterranean Sea"],
  ["the mountain range traditionally dividing Europe and Asia", "Ural Mountains"],
  ["the country made up of more than 17,000 islands", "Indonesia"]
];

const MAO_LITERATURE_CHARACTER_FACTS = [
  ["Sherlock Holmes", "Arthur Conan Doyle"],
  ["Elizabeth Bennet", "Jane Austen"],
  ["Atticus Finch", "Harper Lee"],
  ["Jay Gatsby", "F. Scott Fitzgerald"],
  ["Huckleberry Finn", "Mark Twain"],
  ["Ebenezer Scrooge", "Charles Dickens"],
  ["Don Quixote", "Miguel de Cervantes"],
  ["Gregor Samsa", "Franz Kafka"],
  ["Captain Ahab", "Herman Melville"],
  ["Holden Caulfield", "J. D. Salinger"],
  ["Jane Eyre", "Charlotte Bronte"],
  ["Victor Frankenstein", "Mary Shelley"],
  ["Dorian Gray", "Oscar Wilde"],
  ["Hercule Poirot", "Agatha Christie"],
  ["Winnie-the-Pooh", "A. A. Milne"],
  ["Peter Pan", "J. M. Barrie"],
  ["Bilbo Baggins", "J. R. R. Tolkien"],
  ["Aslan", "C. S. Lewis"],
  ["Matilda Wormwood", "Roald Dahl"],
  ["Anne Shirley", "Lucy Maud Montgomery"]
];

const MAO_SONG_FACTS = [
  ["Risk It All", "Bruno Mars"],
  ["Shape of You", "Ed Sheeran"],
  ["Rolling in the Deep", "Adele"],
  ["Blinding Lights", "The Weeknd"],
  ["bad guy", "Billie Eilish"],
  ["Flowers", "Miley Cyrus"],
  ["Dynamite", "BTS"],
  ["Gangnam Style", "PSY"],
  ["Despacito", "Luis Fonsi"],
  ["Levitating", "Dua Lipa"],
  ["Roar", "Katy Perry"],
  ["Shake It Off", "Taylor Swift"],
  ["Just the Way You Are", "Bruno Mars"],
  ["Someone Like You", "Adele"],
  ["Havana", "Camila Cabello"],
  ["As It Was", "Harry Styles"],
  ["Believer", "Imagine Dragons"],
  ["Counting Stars", "OneRepublic"],
  ["Poker Face", "Lady Gaga"],
  ["APT.", "ROSÉ and Bruno Mars"]
];

const MAO_GAME_COMPANY_FACTS = [
  ["Minecraft", "Mojang Studios", "developed"],
  ["Fortnite", "Epic Games", "developed"],
  ["League of Legends", "Riot Games", "developed"],
  ["VALORANT", "Riot Games", "developed"],
  ["Genshin Impact", "miHoYo", "developed"],
  ["The Legend of Zelda series", "Nintendo", "publishes"],
  ["Honor of Kings", "TiMi Studio Group", "developed"],
  ["PUBG Mobile", "LIGHTSPEED STUDIOS and KRAFTON", "co-developed"],
  ["Roblox", "Roblox Corporation", "developed"],
  ["Mobile Legends: Bang Bang", "MOONTON Games", "developed"],
  ["Free Fire", "Garena", "publishes"],
  ["Overwatch", "Blizzard Entertainment", "developed"],
  ["The Sims series", "Electronic Arts", "publishes"],
  ["Final Fantasy series", "Square Enix", "develops and publishes"],
  ["Sonic the Hedgehog series", "Sega", "publishes"]
];

const MAO_GAME_PROTAGONIST_FACTS = [
  ["The Legend of Zelda", "Link"],
  ["God of War", "Kratos"],
  ["Tomb Raider", "Lara Croft"],
  ["Halo", "Master Chief"],
  ["Super Mario", "Mario"],
  ["Sonic the Hedgehog", "Sonic"],
  ["Assassin's Creed II", "Ezio Auditore"],
  ["The Witcher 3", "Geralt of Rivia"],
  ["Red Dead Redemption 2", "Arthur Morgan"],
  ["Horizon Zero Dawn", "Aloy"],
  ["Final Fantasy VII", "Cloud Strife"],
  ["Metroid", "Samus Aran"],
  ["Uncharted", "Nathan Drake"],
  ["Ghost of Tsushima", "Jin Sakai"],
  ["Metal Gear Solid", "Solid Snake"]
];

const MAO_ANIME_PREMISE_FACTS = [
  ["humanity fighting giant humanoid creatures called Titans", "Attack on Titan"],
  ["a boy hunting demons while seeking a cure for his sister", "Demon Slayer"],
  ["a student discovering a notebook that can kill anyone whose name is written in it", "Death Note"],
  ["students training to become professional superheroes", "My Hero Academia"],
  ["pirates searching for a legendary treasure", "One Piece"],
  ["a young ninja dreaming of becoming Hokage", "Naruto"],
  ["sorcerers battling supernatural curses", "Jujutsu Kaisen"],
  ["two brothers using alchemy to restore their bodies", "Fullmetal Alchemist"],
  ["a spy, an assassin, and a telepath forming a pretend family", "SPY x FAMILY"],
  ["a schoolgirl becoming a guardian who fights evil by moonlight", "Sailor Moon"],
  ["a trainer traveling with a creature named Pikachu", "Pokemon"],
  ["a powerful Saiyan warrior repeatedly defending Earth", "Dragon Ball"],
  ["hunters taking a dangerous exam and pursuing extraordinary adventures", "Hunter x Hunter"],
  ["soul reapers protecting people from supernatural threats", "Bleach"],
  ["a boy who becomes half-ghoul after a life-changing operation", "Tokyo Ghoul"]
];

const MAO_ANIME_CREATOR_FACTS = [
  ["Hajime Isayama", "Attack on Titan"],
  ["Masashi Kishimoto", "Naruto"],
  ["Eiichiro Oda", "One Piece"],
  ["Akira Toriyama", "Dragon Ball"],
  ["Koyoharu Gotouge", "Demon Slayer"],
  ["Naoko Takeuchi", "Sailor Moon"],
  ["Tsugumi Ohba", "Death Note"],
  ["Kohei Horikoshi", "My Hero Academia"],
  ["Gege Akutami", "Jujutsu Kaisen"],
  ["Hiromu Arakawa", "Fullmetal Alchemist"],
  ["Tatsuya Endo", "SPY x FAMILY"],
  ["Sui Ishida", "Tokyo Ghoul"],
  ["Tite Kubo", "Bleach"],
  ["Yoshihiro Togashi", "Hunter x Hunter"],
  ["Hirohiko Araki", "JoJo's Bizarre Adventure"]
];

const MAO_MOVIE_DIRECTOR_FACTS = [
  ["Titanic", "James Cameron"],
  ["Jurassic Park", "Steven Spielberg"],
  ["Inception", "Christopher Nolan"],
  ["Parasite", "Bong Joon Ho"],
  ["The Lord of the Rings: The Fellowship of the Ring", "Peter Jackson"],
  ["Spirited Away", "Hayao Miyazaki"],
  ["The Matrix", "Lana and Lilly Wachowski"],
  ["The Godfather", "Francis Ford Coppola"],
  ["Jaws", "Steven Spielberg"],
  ["Avatar", "James Cameron"],
  ["Pulp Fiction", "Quentin Tarantino"],
  ["Gladiator", "Ridley Scott"],
  ["Barbie", "Greta Gerwig"],
  ["Oppenheimer", "Christopher Nolan"],
  ["Black Panther", "Ryan Coogler"]
];

const MAO_MOVIE_CLUE_FACTS = [
  ["toys that come alive when humans are absent", "Toy Story"],
  ["an ogre whose peaceful swamp is disrupted", "Shrek"],
  ["personified emotions living inside a young girl's mind", "Inside Out"],
  ["humans visiting the moon Pandora", "Avatar"],
  ["the fictional African nation of Wakanda", "Black Panther"],
  ["a romance aboard a doomed ocean liner", "Titanic"],
  ["thieves entering dreams to steal or plant ideas", "Inception"],
  ["a theme park populated by cloned dinosaurs", "Jurassic Park"],
  ["a quest to destroy a powerful ring in Mordor", "The Lord of the Rings"],
  ["a clownfish crossing the ocean to find his son", "Finding Nemo"],
  ["two royal sisters and magical ice powers", "Frozen"],
  ["a family entering the Land of the Dead during Dia de los Muertos", "Coco"],
  ["a teenager traveling through time in a DeLorean", "Back to the Future"],
  ["a young wizard attending Hogwarts", "Harry Potter and the Sorcerer's Stone"],
  ["a robot left to clean an abandoned Earth", "WALL-E"]
];

const MAO_CELEBRITY_FACTS = [
  ["portrayed Iron Man in the Marvel Cinematic Universe", "Robert Downey Jr."],
  ["portrayed Hermione Granger in the Harry Potter films", "Emma Watson"],
  ["founded the Fenty beauty brand", "Rihanna"],
  ["is known as the King of Pop", "Michael Jackson"],
  ["is known as the Queen of Soul", "Aretha Franklin"],
  ["portrayed Jack Sparrow in the Pirates of the Caribbean films", "Johnny Depp"],
  ["portrayed Katniss Everdeen in The Hunger Games films", "Jennifer Lawrence"],
  ["portrayed the title character in the Barbie film", "Margot Robbie"],
  ["portrayed Black Panther in the film of the same name", "Chadwick Boseman"],
  ["created and starred in the sitcom Mr. Bean", "Rowan Atkinson"],
  ["is a football star nicknamed CR7", "Cristiano Ronaldo"],
  ["is an Argentine football star who captained his country to the 2022 World Cup title", "Lionel Messi"],
  ["became famous as a member of the Beatles", "Paul McCartney"],
  ["played the title role in Edward Scissorhands", "Johnny Depp"],
  ["portrayed Wonder Woman in the DC films", "Gal Gadot"],
  ["portrayed Wednesday Addams in the television series Wednesday", "Jenna Ortega"],
  ["portrayed Spider-Man in the MCU film Spider-Man: Homecoming", "Tom Holland"],
  ["is the singer behind the stage persona Sasha Fierce", "Beyonce"],
  ["starred as Neo in The Matrix", "Keanu Reeves"],
  ["portrayed Jack Dawson in the film Titanic", "Leonardo DiCaprio"]
];
