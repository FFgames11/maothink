/* ============================================================
   MaoThink - Wordle Icebreaker Game Logic
   Self-contained mechanics for the 5-letter daily Wordle mystery word.
   ============================================================ */

(function () {
    "use strict";

    // ── Rich Curated 5-Letter English Vocabulary Catalog ─────────
    // Educational, positive, and varied words with accurate definitions,
    // phonetic guides, and natural sample sentences.
    const WORD_CATALOG = [
        {
            word: "SPARK",
            phonetic: "/spɑːrk/",
            partOfSpeech: "noun / verb",
            meaning: "A small fiery particle, or a vital quality that ignites enthusiasm, passion, or creative action.",
            sentence: "Her uplifting speech ignited a creative spark in all of the students."
        },
        {
            word: "BRAVE",
            phonetic: "/breɪv/",
            partOfSpeech: "adjective",
            meaning: "Ready to face and endure danger, difficulty, or pain with courage and resilience.",
            sentence: "The brave firefighter rushed into the smoke-filled building without hesitation."
        },
        {
            word: "BLOOM",
            phonetic: "/bluːm/",
            partOfSpeech: "verb / noun",
            meaning: "To produce vibrant flowers, or to grow, mature, and flourish into one's full potential.",
            sentence: "Under gentle guidance, the quiet young musician began to bloom."
        },
        {
            word: "CHAMP",
            phonetic: "/tʃæmp/",
            partOfSpeech: "noun",
            meaning: "A champion or victor; someone who achieves excellence through dedication and practice.",
            sentence: "He trained diligently every morning and proudly became the regional chess champ."
        },
        {
            word: "SWIFT",
            phonetic: "/swɪft/",
            partOfSpeech: "adjective",
            meaning: "Moving or capable of moving with great speed, quickness, and grace.",
            sentence: "The swift runner crossed the finish line several strides ahead of the pack."
        },
        {
            word: "NOBLE",
            phonetic: "/ˈnoʊbəl/",
            partOfSpeech: "adjective",
            meaning: "Having or showing fine personal qualities, high moral standards, or magnificent character.",
            sentence: "Standing up for fairness and honesty is always a noble choice."
        },
        {
            word: "PEARL",
            phonetic: "/pɜːrl/",
            partOfSpeech: "noun",
            meaning: "A precious lustrous gem, or a rare and valuable item or piece of good advice.",
            sentence: "The grandmother shared a timeless pearl of wisdom before the journey."
        },
        {
            word: "FLAIR",
            phonetic: "/flɛər/",
            partOfSpeech: "noun",
            meaning: "A special or instinctive aptitude, talent, or stylish elegance in doing things.",
            sentence: "She presented her science project with remarkable artistic flair and confidence."
        },
        {
            word: "OASIS",
            phonetic: "/oʊˈeɪsɪs/",
            partOfSpeech: "noun",
            meaning: "A fertile spot in a desert, or a peaceful haven that offers refuge and calm.",
            sentence: "The quiet botanical garden is a serene oasis in the heart of the noisy city."
        },
        {
            word: "VIVID",
            phonetic: "/ˈvɪvɪd/",
            partOfSpeech: "adjective",
            meaning: "Producing powerful feelings or clear, strikingly bright and realistic mental images.",
            sentence: "His vivid descriptions made the history lesson feel like a real adventure."
        },
        {
            word: "CREST",
            phonetic: "/krɛst/",
            partOfSpeech: "noun",
            meaning: "The top or highest ridge of a mountain, hill, or wave.",
            sentence: "The hikers reached the mountain crest just as the morning sun rose over the clouds."
        },
        {
            word: "TRAIL",
            phonetic: "/treɪl/",
            partOfSpeech: "noun",
            meaning: "A marked path through a forest, meadow, or mountainous wild territory.",
            sentence: "They followed the winding forest trail until they reached a glistening waterfall."
        },
        {
            word: "SHINE",
            phonetic: "/ʃaɪn/",
            partOfSpeech: "verb",
            meaning: "To give off or reflect light, or to excel conspicuously in an activity or subject.",
            sentence: "Give every student a chance to shine and celebrate their unique talents."
        },
        {
            word: "CRAFT",
            phonetic: "/kræft/",
            partOfSpeech: "noun / verb",
            meaning: "An activity involving skilled artistry, or to create something with care and precision.",
            sentence: "The author took months to craft an inspiring and suspenseful story."
        },
        {
            word: "BLISS",
            phonetic: "/blɪs/",
            partOfSpeech: "noun",
            meaning: "A state of perfect happiness, supreme peace, or profound spiritual joy.",
            sentence: "Listening to acoustic music while sipping warm tea was complete bliss."
        },
        {
            word: "PRIDE",
            phonetic: "/praɪd/",
            partOfSpeech: "noun",
            meaning: "A feeling of deep pleasure and satisfaction derived from one's own or others' achievements.",
            sentence: "The teacher beamed with pride as her students presented their projects."
        },
        {
            word: "SCOUT",
            phonetic: "/skaʊt/",
            partOfSpeech: "noun / verb",
            meaning: "A person dispatched to explore, investigate, and gather valuable information.",
            sentence: "The expedition scout discovered a safe route across the freezing river."
        },
        {
            word: "FORGE",
            phonetic: "/fɔːrdʒ/",
            partOfSpeech: "verb",
            meaning: "To create, shape, or build something strong through dedicated effort and commitment.",
            sentence: "The group worked together to forge strong bonds of teamwork and trust."
        },
        {
            word: "SAVVY",
            phonetic: "/ˈsævi/",
            partOfSpeech: "adjective",
            meaning: "Shrewd, perceptive, and possessing practical common sense and technical skill.",
            sentence: "A savvy reader knows how to find credible information across multiple sources."
        },
        {
            word: "GLEAM",
            phonetic: "/ɡliːm/",
            partOfSpeech: "verb / noun",
            meaning: "To shine softly with a warm gleam, or an instant flash of light or joyful expression.",
            sentence: "A cheerful gleam of pride lit up the teacher's eyes as the class applauded."
        },
        {
            word: "SMART",
            phonetic: "/smɑːrt/",
            partOfSpeech: "adjective",
            meaning: "Having or showing quick intelligence, clever problem solving, and sharp thinking.",
            sentence: "Her smart strategy enabled the team to solve the puzzle in record time."
        },
        {
            word: "BRIEF",
            phonetic: "/briːf/",
            partOfSpeech: "adjective",
            meaning: "Of short duration; concise, direct, and effectively communicating essential points.",
            sentence: "The manager delivered a brief, inspiring overview before the big presentation."
        },
        {
            word: "PIVOT",
            phonetic: "/ˈpɪvət/",
            partOfSpeech: "verb / noun",
            meaning: "To rotate around a fixed point, or to change direction or strategy successfully.",
            sentence: "The innovative team managed to pivot quickly when customer feedback arrived."
        },
        {
            word: "EPOCH",
            phonetic: "/ˈɛpək/",
            partOfSpeech: "noun",
            meaning: "A distinct period of time in history characterized by notable events or changes.",
            sentence: "The widespread adoption of renewable energy marks a hopeful new epoch."
        },
        {
            word: "HAVEN",
            phonetic: "/ˈheɪvən/",
            partOfSpeech: "noun",
            meaning: "A place of safety, refuge, calm sanctuary, or peaceful retreat.",
            sentence: "The school library became a welcoming haven for avid young readers."
        },
        {
            word: "LUCID",
            phonetic: "/ˈluːsɪd/",
            partOfSpeech: "adjective",
            meaning: "Expressed clearly and easy to comprehend; completely rational and well structured.",
            sentence: "The professor offered a lucid explanation of an intricate scientific principle."
        },
        {
            word: "VALOR",
            phonetic: "/ˈvælər/",
            partOfSpeech: "noun",
            meaning: "Great bravery, exceptional boldness, and heroic fortitude in the presence of danger.",
            sentence: "The community honored the young citizen for acts of selflessness and valor."
        },
        {
            word: "ACUTE",
            phonetic: "/əˈkjuːt/",
            partOfSpeech: "adjective",
            meaning: "Showing keen insight and sharp perception; perceptive, critical, or urgent.",
            sentence: "Her acute eye for subtle detail made her an outstanding proofreader and editor."
        },
        {
            word: "APTLY",
            phonetic: "/ˈæptli/",
            partOfSpeech: "adverb",
            meaning: "In a manner that is suitably appropriate, fitting, and accurately expressive.",
            sentence: "The cozy mountain retreat was aptly named 'Starlight Cabin' for its clear night skies."
        },
        {
            word: "CHEER",
            phonetic: "/tʃɪər/",
            partOfSpeech: "verb / noun",
            meaning: "To shout for joy or encouragement, or a feeling of good spirits and happiness.",
            sentence: "A warm cup of cocoa and good news brought great cheer to the family."
        },
        {
            word: "DRAFT",
            phonetic: "/dræft/",
            partOfSpeech: "noun / verb",
            meaning: "A preliminary version of a piece of writing, or to compose a thoughtful plan.",
            sentence: "She completed the first draft of her captivating essay ahead of schedule."
        },
        {
            word: "EAGER",
            phonetic: "/ˈiːɡər/",
            partOfSpeech: "adjective",
            meaning: "Keenly expectant, enthusiastic, and ready to participate with genuine interest.",
            sentence: "The eager students raised their hands to share their original hypotheses."
        },
        {
            word: "FABLE",
            phonetic: "/ˈfeɪbəl/",
            partOfSpeech: "noun",
            meaning: "A short, meaningful story featuring animals or mythical characters that teaches a moral lesson.",
            sentence: "Aesop's classic fable reminded everyone that patience and consistency bring victory."
        },
        {
            word: "GIANT",
            phonetic: "/ˈdʒaɪənt/",
            partOfSpeech: "noun / adjective",
            meaning: "Of colossal size, immense power, or someone of monumental influence and stature.",
            sentence: "William Shakespeare stands as an enduring giant in world literature."
        },
        {
            word: "HONOR",
            phonetic: "/ˈɒnər/",
            partOfSpeech: "noun / verb",
            meaning: "High respect, great esteem, integrity, and adherence to virtuous principles.",
            sentence: "It was a true honor to be selected as the keynote speaker for the ceremony."
        },
        {
            word: "IDEAL",
            phonetic: "/aɪˈdiːəl/",
            partOfSpeech: "adjective / noun",
            meaning: "Satisfying one's highest standards of perfection; the most suitable option.",
            sentence: "The quiet study lounge provided an ideal environment for exam preparation."
        },
        {
            word: "JOLLY",
            phonetic: "/ˈdʒɒli/",
            partOfSpeech: "adjective",
            meaning: "Warmly happy, cheerful, friendly, and full of pleasant humor and goodwill.",
            sentence: "Lively folk music set a jolly atmosphere throughout the harvest festival."
        },
        {
            word: "SHARP",
            phonetic: "/ʃɑːrp/",
            partOfSpeech: "adjective",
            meaning: "Having a keen edge, or intellectually quick, perceptive, and observant.",
            sentence: "His sharp mind enabled him to detect the pattern in the riddle quickly."
        },
        {
            word: "LOGIC",
            phonetic: "/ˈlɒdʒɪk/",
            partOfSpeech: "noun",
            meaning: "Reasoning conducted according to strict principles of validity, coherence, and truth.",
            sentence: "Sound logic helped the debate team construct an airtight opening argument."
        },
        {
            word: "MIRTH",
            phonetic: "/mɜːrθ/",
            partOfSpeech: "noun",
            meaning: "Gladness, amusement, and high spirits, particularly expressed in laughter.",
            sentence: "The comedy sketches filled the lecture hall with spontaneous mirth."
        },
        {
            word: "NEXUS",
            phonetic: "/ˈnɛksəs/",
            partOfSpeech: "noun",
            meaning: "A focal connection, linking point, or central hub uniting multiple ideas or networks.",
            sentence: "The university acts as a nexus where technology, art, and science converge."
        },
        {
            word: "ORBIT",
            phonetic: "/ˈɔːrbɪt/",
            partOfSpeech: "noun / verb",
            meaning: "The curved, repeating path of a celestial body or satellite around a central object.",
            sentence: "The space probe entered stable orbit around Mars and transmitted stunning photos."
        },
        {
            word: "PULSE",
            phonetic: "/pʌls/",
            partOfSpeech: "noun",
            meaning: "A regular, rhythmic throb or beat, or the vibrant energy and spirit of a community.",
            sentence: "You could feel the lively pulse of the city in its open-air evening markets."
        },
        {
            word: "QUIRK",
            phonetic: "/kwɜːrk/",
            partOfSpeech: "noun",
            meaning: "An endearing peculiarity or unique behavioral trait that makes someone memorable.",
            sentence: "His funny quirk was wearing mismatched bright socks whenever taking an exam."
        },
        {
            word: "REALM",
            phonetic: "/rɛlm/",
            partOfSpeech: "noun",
            meaning: "A kingdom, sphere of influence, or broad field of knowledge and human endeavor.",
            sentence: "Artificial intelligence continues to unlock new possibilities in the realm of medicine."
        },
        {
            word: "SURGE",
            phonetic: "/sɜːrdʒ/",
            partOfSpeech: "noun / verb",
            meaning: "A sudden, powerful forward rush or rapid increase in energy, power, or emotion.",
            sentence: "A surge of excitement spread through the auditorium as the winner was announced."
        },
        {
            word: "TEMPO",
            phonetic: "/ˈtɛmpoʊ/",
            partOfSpeech: "noun",
            meaning: "The speed, cadence, or pace of music, rhythm, or a sequence of unfolding events.",
            sentence: "The cheerful song sped up to an exhilarating tempo during the joyful chorus."
        },
        {
            word: "UNITY",
            phonetic: "/ˈjuːnɪti/",
            partOfSpeech: "noun",
            meaning: "The state of being united, working together in harmony, and mutual solidarity.",
            sentence: "The diverse team demonstrated tremendous unity in achieving their common goal."
        },
        {
            word: "VITAL",
            phonetic: "/ˈvaɪtəl/",
            partOfSpeech: "adjective",
            meaning: "Crucially essential, indispensable for life, or full of dynamic living energy.",
            sentence: "Adequate rest and proper hydration play a vital role in academic performance."
        },
        {
            word: "WHARF",
            phonetic: "/wɔːrf/",
            partOfSpeech: "noun",
            meaning: "A level landing stage beside water where ships moor to load passengers and cargo.",
            sentence: "Seagulls circled high above the historic wooden wharf as fishing boats arrived."
        },
        {
            word: "YIELD",
            phonetic: "/jiːld/",
            partOfSpeech: "verb / noun",
            meaning: "To produce a valuable crop or result, or to give way politely to others.",
            sentence: "Diligent daily practice will yield remarkable improvements in your fluency."
        },
        {
            word: "ZESTY",
            phonetic: "/ˈzɛsti/",
            partOfSpeech: "adjective",
            meaning: "Having an appetizing, fresh, stimulating flavor or an energetic and spirited quality.",
            sentence: "The chef seasoned the salad with a zesty lemon-herb dressing that delighted everyone."
        },
        {
            word: "AMITY",
            phonetic: "/ˈæmɪti/",
            partOfSpeech: "noun",
            meaning: "Friendly, peaceful relations, goodwill, and mutual harmony between people or nations.",
            sentence: "The cultural exchange program fostered lasting amity between youth from both countries."
        },
        {
            word: "BOUND",
            phonetic: "/baʊnd/",
            partOfSpeech: "adjective / verb",
            meaning: "Leaping forward with enthusiasm, or destined and determined to achieve a milestone.",
            sentence: "Armed with perseverance and curiosity, she was bound for great achievements."
        },
        {
            word: "DRIVE",
            phonetic: "/draɪv/",
            partOfSpeech: "noun / verb",
            meaning: "An innate determination, strong motivation, and energy to achieve goals.",
            sentence: "Her relentless drive and curiosity propelled her toward scientific discoveries."
        },
        {
            word: "ELITE",
            phonetic: "/ɪˈliːt/",
            partOfSpeech: "adjective / noun",
            meaning: "Representing the best, most skilled, or most accomplished individuals in a group.",
            sentence: "She earned an invitation to join the elite national mathematics olympiad team."
        },
        {
            word: "FOCUS",
            phonetic: "/ˈfoʊkəs/",
            partOfSpeech: "noun / verb",
            meaning: "The center of interest, or the ability to concentrate deeply on a specific objective.",
            sentence: "Unwavering focus during study sessions allowed him to master the vocabulary list."
        },
        {
            word: "GLINT",
            phonetic: "/ɡlɪnt/",
            partOfSpeech: "noun / verb",
            meaning: "A tiny, bright flash of light, or a momentary sparkle of wit or humor.",
            sentence: "There was a mischievous glint in his eye as he revealed the surprise."
        },
        {
            word: "HAZEL",
            phonetic: "/ˈheɪzəl/",
            partOfSpeech: "noun / adjective",
            meaning: "A small tree producing edible nuts, or a rich reddish-brown or golden-green color.",
            sentence: "The autumn leaves displayed a magnificent palette of amber and hazel."
        },
        {
            word: "INGOT",
            phonetic: "/ˈɪŋɡət/",
            partOfSpeech: "noun",
            meaning: "A block of steel, gold, or silver cast in a standard shape for storage or trade.",
            sentence: "The museum display featured a pure silver ingot recovered from a centuries-old galleon."
        },
        {
            word: "KARMA",
            phonetic: "/ˈkɑːrmə/",
            partOfSpeech: "noun",
            meaning: "The universal spiritual principle that good intentions and deeds yield positive results.",
            sentence: "Helping others without expecting praise brings genuine happiness and good karma."
        },
        {
            word: "LEMON",
            phonetic: "/ˈlɛmən/",
            partOfSpeech: "noun",
            meaning: "A yellow citrus fruit known for its refreshing, tangy flavor and fragrant peel.",
            sentence: "A slice of fresh lemon added a bright, refreshing taste to the chilled iced tea."
        },
        {
            word: "MAGIC",
            phonetic: "/ˈmædʒɪk/",
            partOfSpeech: "noun / adjective",
            meaning: "The power of apparent supernatural phenomena, or captivating and wondrous beauty.",
            sentence: "The quiet snowfall cast an enchanting magic over the sleeping winter village."
        },
        {
            word: "NORTH",
            phonetic: "/nɔːrθ/",
            partOfSpeech: "noun / adjective",
            meaning: "The compass direction toward the Arctic pole, guiding explorers and navigators.",
            sentence: "The migrating birds flew north as the warm spring weather arrived."
        },
        {
            word: "OCEAN",
            phonetic: "/ˈoʊʃən/",
            partOfSpeech: "noun",
            meaning: "A vast expanse of sea covering the majority of the Earth's surface.",
            sentence: "The boundless ocean is home to millions of extraordinary marine species."
        },
        {
            word: "PLAZA",
            phonetic: "/ˈplɑːzə/",
            partOfSpeech: "noun",
            meaning: "A public square, open courtyard, or marketplace in a city or town.",
            sentence: "Musicians gathered in the sunny plaza to entertain locals and traveling tourists."
        },
        {
            word: "QUOTA",
            phonetic: "/ˈkwoʊtə/",
            partOfSpeech: "noun",
            meaning: "A targeted share, proportion, or designated quantity of something to be achieved.",
            sentence: "The volunteer team exceeded their reading club quota well ahead of schedule."
        },
        {
            word: "RADAR",
            phonetic: "/ˈreɪdɑːr/",
            partOfSpeech: "noun",
            meaning: "A system for detecting objects via radio waves, or acute situational awareness.",
            sentence: "A talent scout kept talented young students on her radar for future scholarships."
        },
        {
            word: "SALVO",
            phonetic: "/ˈsælvoʊ/",
            partOfSpeech: "noun",
            meaning: "A simultaneous discharge of applause, questions, or fireworks in celebration.",
            sentence: "The audience erupted into a thunderous salvo of cheers when the curtain fell."
        },
        {
            word: "TITAN",
            phonetic: "/ˈtaɪtən/",
            partOfSpeech: "noun",
            meaning: "A person or entity of gigantic size, extraordinary strength, or exceptional achievement.",
            sentence: "Marie Curie remains a pioneering titan in the history of modern physics."
        },
        {
            word: "URBAN",
            phonetic: "/ˈɜːrbən/",
            partOfSpeech: "adjective",
            meaning: "Relating to, characteristic of, or located in a town or city environment.",
            sentence: "Urban community gardens bring refreshing green spaces into lively city centers."
        },
        {
            word: "VERVE",
            phonetic: "/vɜːrv/",
            partOfSpeech: "noun",
            meaning: "Vigor, lively spirit, enthusiasm, and sparkling vitality in performance or expression.",
            sentence: "The youth choir sang each upbeat anthem with contagious verve and joy."
        },
        {
            word: "WHEAT",
            phonetic: "/wiːt/",
            partOfSpeech: "noun",
            meaning: "A cultivated cereal grain yielding flour for wholesome breads and pastries.",
            sentence: "Golden fields of ripe wheat swayed gently under the warm autumn afternoon breeze."
        },
        {
            word: "ZEBRA",
            phonetic: "/ˈziːbrə/",
            partOfSpeech: "noun",
            meaning: "An African wild equine animal known for its distinctive black-and-white striped coat.",
            sentence: "A majestic zebra galloped gracefully across the open savanna plains."
        },
        {
            word: "ABBEY",
            phonetic: "/ˈæbi/",
            partOfSpeech: "noun",
            meaning: "A historic monastery, convent, or grand church building filled with heritage.",
            sentence: "Visitors admired the ancient stone arches and stained glass inside the abbey."
        },
        {
            word: "ACORN",
            phonetic: "/ˈeɪkɔːrn/",
            partOfSpeech: "noun",
            meaning: "The smooth, oval nut of an oak tree, symbolizing great potential from humble beginnings.",
            sentence: "From a tiny acorn grows a mighty oak tree that shelters generations of birds."
        },
        {
            word: "ALERT",
            phonetic: "/əˈlɜːrt/",
            partOfSpeech: "adjective",
            meaning: "Quick to notice any unusual and potentially important circumstances; watchful.",
            sentence: "The alert guard dog kept a careful eye on the orchard throughout the night."
        },
        {
            word: "AMBER",
            phonetic: "/ˈæmbər/",
            partOfSpeech: "noun / adjective",
            meaning: "A warm honey-yellow gemstone of fossilized resin, or a golden-orange hue.",
            sentence: "The late afternoon sun cast an amber glow across the quiet classroom walls."
        },
        {
            word: "ANGEL",
            phonetic: "/ˈeɪndʒəl/",
            partOfSpeech: "noun",
            meaning: "A spiritual messenger, or a person of exemplary kindness, sweetness, and virtue.",
            sentence: "The nurse was an absolute angel who comforted every worried patient with warmth."
        },
        {
            word: "APPLY",
            phonetic: "/əˈplaɪ/",
            partOfSpeech: "verb",
            meaning: "To put to practical use, or to make a formal application for study or work.",
            sentence: "Students learn how to apply scientific concepts to solve real-world problems."
        },
        {
            word: "ARMOR",
            phonetic: "/ˈɑːrmər/",
            partOfSpeech: "noun",
            meaning: "A protective covering worn to defend against harm, or mental resilience.",
            sentence: "Self-confidence and kindness serve as strong armor against negativity."
        },
        {
            word: "ARROW",
            phonetic: "/ˈæroʊ/",
            partOfSpeech: "noun",
            meaning: "A pointed projectile shot from a bow, or a symbol indicating direction.",
            sentence: "Follow the green arrow on the trail sign to reach the panoramic summit."
        },
        {
            word: "ASSET",
            phonetic: "/ˈæsɛt/",
            partOfSpeech: "noun",
            meaning: "A useful or valuable quality, person, skill, or resource.",
            sentence: "Fluency in multiple languages is an invaluable asset in today's global world."
        },
        {
            word: "BADGE",
            phonetic: "/bædʒ/",
            partOfSpeech: "noun",
            meaning: "A distinctive emblem or token worn as a symbol of achievement or membership.",
            sentence: "She proudly earned the top scout badge for leadership and community service."
        },
        {
            word: "BLAZE",
            phonetic: "/bleɪz/",
            partOfSpeech: "noun / verb",
            meaning: "A bright, brilliant flame or fire, or to set a trail of innovation for others to follow.",
            sentence: "Pioneering scientists blaze a trail that illuminates future technological breakthroughs."
        },
        {
            word: "BOOST",
            phonetic: "/buːst/",
            partOfSpeech: "verb / noun",
            meaning: "To help, encourage, or cause something to increase, improve, or flourish.",
            sentence: "A nutritious breakfast gives your mind a wonderful boost for morning study."
        },
        {
            word: "BRAIN",
            phonetic: "/breɪn/",
            partOfSpeech: "noun",
            meaning: "The remarkable organ of thought, memory, consciousness, and imagination.",
            sentence: "Solving puzzles every day helps keep the human brain sharp and active."
        },
        {
            word: "BROOK",
            phonetic: "/brʊk/",
            partOfSpeech: "noun",
            meaning: "A small, clear, natural stream flowing pleasantly through the countryside.",
            sentence: "Wildflowers bloomed on the grassy banks of the babbling brook."
        },
        {
            word: "CEDAR",
            phonetic: "/ˈsiːdər/",
            partOfSpeech: "noun",
            meaning: "A tall coniferous tree known for its fragrant, durable, and weather-resistant wood.",
            sentence: "The scent of cedar filled the carpenter's workshop as he finished the bookshelf."
        },
        {
            word: "CHIME",
            phonetic: "/tʃaɪm/",
            partOfSpeech: "verb / noun",
            meaning: "A melodious ringing sound produced by bells, or to harmonize pleasantly.",
            sentence: "The grandfather clock began to chime noon with rich, resonant notes."
        },
        {
            word: "CHORD",
            phonetic: "/kɔːrd/",
            partOfSpeech: "noun",
            meaning: "A harmonic combination of musical notes sounded together, or an emotional resonance.",
            sentence: "The pianist struck an emotional chord that moved the entire listening audience."
        },
        {
            word: "CLOAK",
            phonetic: "/kloʊk/",
            partOfSpeech: "noun / verb",
            meaning: "An outdoor overgarment, or something that envelops or conceals like a veil.",
            sentence: "A mysterious cloak of silver mist covered the harbor in the early dawn."
        },
        {
            word: "CLOUD",
            phonetic: "/klaʊd/",
            partOfSpeech: "noun",
            meaning: "A visible mass of condensed water vapor floating high in the atmosphere.",
            sentence: "A single fluffy white cloud drifted peacefully across the clear azure sky."
        },
        {
            word: "CORAL",
            phonetic: "/ˈkɒrəl/",
            partOfSpeech: "noun / adjective",
            meaning: "A marine colonial organism that builds vibrant underwater reefs, or a warm pinkish hue.",
            sentence: "Snorkelers marveled at the kaleidoscopic coral reef teeming with colorful fish."
        },
        {
            word: "CRISP",
            phonetic: "/krɪsp/",
            partOfSpeech: "adjective",
            meaning: "Pleasantly clean, cool, and invigorating; fresh and sharply defined.",
            sentence: "We took a refreshing morning walk in the crisp October mountain air."
        },
        {
            word: "CROWN",
            phonetic: "/kraʊn/",
            partOfSpeech: "noun / verb",
            meaning: "An ornate circular headpiece worn by a monarch, or the supreme culmination of an effort.",
            sentence: "Winning the championship was the glorious crown of their undefeated season."
        },
        {
            word: "DREAM",
            phonetic: "/driːm/",
            partOfSpeech: "noun / verb",
            meaning: "A cherished aspiration, ambition, or imaginative vision of what the future could be.",
            sentence: "With grit and optimism, she turned her childhood dream into inspiring reality."
        },
        {
            word: "DRIFT",
            phonetic: "/drɪft/",
            partOfSpeech: "verb / noun",
            meaning: "To be carried slowly along by a current of air or water in a serene manner.",
            sentence: "We watched colorful paper lanterns drift gently across the mirror-like lake."
        },
        {
            word: "EAGLE",
            phonetic: "/ˈiːɡəl/",
            partOfSpeech: "noun",
            meaning: "A majestic bird of prey celebrated for its powerful flight and keen vision.",
            sentence: "A golden eagle soared gracefully over the rugged peaks of the mountain range."
        },
        {
            word: "EARTH",
            phonetic: "/ɜːrθ/",
            partOfSpeech: "noun",
            meaning: "Our home planet, or the rich soil that nourishes plants, trees, and living ecosystems.",
            sentence: "Caring for planet Earth is a collective responsibility for all humankind."
        },
        {
            word: "EMBER",
            phonetic: "/ˈɛmbər/",
            partOfSpeech: "noun",
            meaning: "A glowing, warm piece of wood or coal in a dying fire, retaining lasting warmth.",
            sentence: "A solitary glowing ember kept the campfire warm throughout the frosty night."
        },
        {
            word: "FAITH",
            phonetic: "/feɪθ/",
            partOfSpeech: "noun",
            meaning: "Complete trust, confidence, or strong belief in someone, something, or a noble cause.",
            sentence: "Her unwavering faith in her students inspired them to exceed every expectation."
        },
        {
            word: "FEAST",
            phonetic: "/fiːst/",
            partOfSpeech: "noun",
            meaning: "A large, bountiful meal, or a rich celebration that delights the senses.",
            sentence: "The harvest festival concluded with a joyful feast of homemade delicacies."
        },
        {
            word: "FLAME",
            phonetic: "/fleɪm/",
            partOfSpeech: "noun",
            meaning: "A hot glowing body of ignited gas, or an intense, enduring passion for learning.",
            sentence: "The flame of curiosity burned brightly in the young scientist's heart."
        },
        {
            word: "FLEET",
            phonetic: "/fliːt/",
            partOfSpeech: "noun / adjective",
            meaning: "A group of ships sailing together, or moving with remarkable swiftness.",
            sentence: "The fleet gazelle bounded gracefully across the open savannah grassland."
        },
        {
            word: "FLOCK",
            phonetic: "/flɒk/",
            partOfSpeech: "noun / verb",
            meaning: "A group of birds or sheep, or to gather together in large enthusiastic numbers.",
            sentence: "Art enthusiasts flock to the gallery opening to admire the new paintings."
        },
        {
            word: "FLORA",
            phonetic: "/ˈflɔːrə/",
            partOfSpeech: "noun",
            meaning: "The collective plant life occurring within a specific geographic region or habitat.",
            sentence: "The alpine flora includes rare, resilient wildflowers that survive icy winds."
        },
        {
            word: "FLUTE",
            phonetic: "/fluːt/",
            partOfSpeech: "noun",
            meaning: "A slender wind instrument that produces pure, sweet, and melodic high tones.",
            sentence: "The gentle notes of a silver flute echoed softly across the concert hall."
        },
        {
            word: "FROST",
            phonetic: "/frɒst/",
            partOfSpeech: "noun",
            meaning: "A delicate deposit of tiny white ice crystals formed on cold outdoor surfaces.",
            sentence: "Intricate patterns of morning frost sparkled like diamonds on the windowpane."
        },
        {
            word: "GLOBE",
            phonetic: "/ɡloʊb/",
            partOfSpeech: "noun",
            meaning: "A spherical model of the Earth, or the entire terrestrial world and its people.",
            sentence: "Students spun the colorful desktop globe to locate countries and continents."
        },
        {
            word: "GLORY",
            phonetic: "/ˈɡlɔːri/",
            partOfSpeech: "noun",
            meaning: "High renown, magnificent beauty, or praise earned by notable achievements.",
            sentence: "The golden sunset illuminated the canyon walls in all their natural glory."
        },
        {
            word: "GRACE",
            phonetic: "/ɡreɪs/",
            partOfSpeech: "noun",
            meaning: "Simple elegance or refinement of movement, or courteous and kind goodwill.",
            sentence: "She accepted the award with humility, gratitude, and poise and grace."
        },
        {
            word: "GRAIN",
            phonetic: "/ɡreɪn/",
            partOfSpeech: "noun",
            meaning: "A seed of a cereal grass, or the smallest microscopic speck or trace of something.",
            sentence: "Every grain of truth helps in building an honest and reliable perspective."
        },
        {
            word: "GRAND",
            phonetic: "/ɡrænd/",
            partOfSpeech: "adjective",
            meaning: "Magnificent, imposing in size and scope, or splendidly impressive in design.",
            sentence: "The national park features grand canyon vistas that take your breath away."
        },
        {
            word: "GRASP",
            phonetic: "/ɡrɑːsp/",
            partOfSpeech: "verb / noun",
            meaning: "To grip firmly, or to comprehend and fully understand an intricate concept.",
            sentence: "He was quick to grasp the mathematical theory once it was explained visually."
        },
        {
            word: "GREET",
            phonetic: "/ɡriːt/",
            partOfSpeech: "verb",
            meaning: "To welcome someone with warm words, gestures, or joyful expressions of hospitality.",
            sentence: "The cheerful teacher stood by the door to greet every arriving student by name."
        },
        {
            word: "GROVE",
            phonetic: "/ɡroʊv/",
            partOfSpeech: "noun",
            meaning: "A small group or orchard of trees without dense undergrowth, offering shade.",
            sentence: "Families enjoyed picnics under the fragrant olive grove on sunny afternoons."
        },
        {
            word: "GUIDE",
            phonetic: "/ɡaɪd/",
            partOfSpeech: "noun / verb",
            meaning: "A person who leads others on a journey, or advice that points to the best path.",
            sentence: "A knowledgeable guide helped the tourists discover historical hidden gems."
        },
        {
            word: "HABIT",
            phonetic: "/ˈhæbɪt/",
            partOfSpeech: "noun",
            meaning: "A settled, regular tendency or daily practice that is repeated automatically.",
            sentence: "Reading for twenty minutes each evening is a wonderfully rewarding habit."
        },
        {
            word: "HEART",
            phonetic: "/hɑːrt/",
            partOfSpeech: "noun",
            meaning: "The muscular organ pumping life throughout the body, or the center of compassion.",
            sentence: "She poured her entire heart and soul into creating the community mural."
        },
        {
            word: "HONEY",
            phonetic: "/ˈhʌni/",
            partOfSpeech: "noun",
            meaning: "A sweet, golden viscous fluid produced by bees from nectar; soothing and delicious.",
            sentence: "A spoonful of wildflower honey added sweetness to the warm chamomile tea."
        },
        {
            word: "JEWEL",
            phonetic: "/ˈdʒuːəl/",
            partOfSpeech: "noun",
            meaning: "A precious cut stone or ornament, or something held in extraordinarily high regard.",
            sentence: "The historic botanical conservatory is the architectural jewel of the city."
        },
        {
            word: "KUDOS",
            phonetic: "/ˈkuːdoʊz/",
            partOfSpeech: "noun",
            meaning: "Praise, acclaim, honor, and congratulations given for an outstanding achievement.",
            sentence: "Kudos to the entire robotics squad for building an innovative rescue rover!"
        },
        {
            word: "LIGHT",
            phonetic: "/laɪt/",
            partOfSpeech: "noun / adjective",
            meaning: "Natural illumination that stimulates sight and brings clarity, warmth, and hope.",
            sentence: "Morning light streamed through the library window, warming the study desks."
        },
        {
            word: "LOYAL",
            phonetic: "/ˈlɔɪəl/",
            partOfSpeech: "adjective",
            meaning: "Giving or showing firm, constant, and steadfast support and fidelity to friends.",
            sentence: "A loyal friend stands by your side through both triumphs and challenging days."
        },
        {
            word: "LUNAR",
            phonetic: "/ˈluːnər/",
            partOfSpeech: "adjective",
            meaning: "Relating to or determined by the moon and its silvery glow or cycles.",
            sentence: "Stargazers set up telescopes in the open field to observe the total lunar eclipse."
        },
        {
            word: "MARCH",
            phonetic: "/mɑːrtʃ/",
            partOfSpeech: "verb / noun",
            meaning: "To walk with steady, deliberate steps, or the third inspiring month of the year.",
            sentence: "The persistent march toward equality and civil rights inspires people everywhere."
        },
        {
            word: "MEDAL",
            phonetic: "/ˈmɛdəl/",
            partOfSpeech: "noun",
            meaning: "A metal disc stamped with an emblem, awarded to honor exceptional service or victory.",
            sentence: "She proudly received a gold medal for breaking the school swimming record."
        },
        {
            word: "MERIT",
            phonetic: "/ˈmɛrɪt/",
            partOfSpeech: "noun / verb",
            meaning: "The quality of being particularly good, worthy, or deserving of praise and reward.",
            sentence: "Her proposal was chosen purely on merit and the feasibility of its design."
        },
        {
            word: "MODEL",
            phonetic: "/ˈmɒdəl/",
            partOfSpeech: "noun / adjective",
            meaning: "A standard or exemplary representation worthy of study, imitation, and praise.",
            sentence: "He served as a model citizen by actively volunteering at the community shelter."
        },
        {
            word: "MUSIC",
            phonetic: "/ˈmjuːzɪk/",
            partOfSpeech: "noun",
            meaning: "Vocal or instrumental sounds combined to produce beauty of form and emotion.",
            sentence: "Uplifting music has the universal power to bring diverse cultures together."
        },
        {
            word: "NIFTY",
            phonetic: "/ˈnɪfti/",
            partOfSpeech: "adjective",
            meaning: "Particularly good, skillful, clever, attractive, and stylish.",
            sentence: "He devised a nifty shortcut that automated the entire grading process."
        },
        {
            word: "NOVEL",
            phonetic: "/ˈnɒvəl/",
            partOfSpeech: "noun / adjective",
            meaning: "A fictitious prose narrative, or something delightfully new, fresh, and original.",
            sentence: "The engineer proposed a novel solution that cut energy consumption in half."
        },
        {
            word: "OLIVE",
            phonetic: "/ˈɒlɪv/",
            partOfSpeech: "noun / adjective",
            meaning: "A small oval fruit, or an ancient symbol of peace, healing, and reconciliation.",
            sentence: "Extending an olive branch is a traditional gesture indicating an offer of peace."
        },
        {
            word: "PANEL",
            phonetic: "/ˈpænəl/",
            partOfSpeech: "noun",
            meaning: "A group of experts gathered to discuss a topic, or a flat rectangular section.",
            sentence: "The panel of scientists answered insightful questions from eager young students."
        },
        {
            word: "PEACH",
            phonetic: "/piːtʃ/",
            partOfSpeech: "noun",
            meaning: "A sweet, juicy round fruit with velvety skin and sweet aromatic flesh.",
            sentence: "Freshly sliced ripe peach made the summer dessert irresistible."
        },
        {
            word: "PILOT",
            phonetic: "/ˈpaɪlət/",
            partOfSpeech: "noun / verb",
            meaning: "A person who operates aircraft controls, or to guide a project through trial stages.",
            sentence: "The skilled pilot navigated the passenger plane smoothly through the crosswinds."
        },
        {
            word: "PRIZE",
            phonetic: "/praɪz/",
            partOfSpeech: "noun / verb",
            meaning: "An award given in recognition of an accomplishment, or to value very highly.",
            sentence: "She took home first prize in the national high school essay competition."
        },
        {
            word: "PROUD",
            phonetic: "/praʊd/",
            partOfSpeech: "adjective",
            meaning: "Feeling deep pleasure and satisfaction in one's achievements or those of loved ones.",
            sentence: "Parents stood with proud smiles as graduates crossed the commencement stage."
        },
        {
            word: "QUEEN",
            phonetic: "/kwiːn/",
            partOfSpeech: "noun",
            meaning: "A female ruler of an independent state, or a woman regarded as preeminent in a field.",
            sentence: "Aretha Franklin was celebrated worldwide as the undisputed Queen of Soul."
        },
        {
            word: "QUEST",
            phonetic: "/kwɛst/",
            partOfSpeech: "noun",
            meaning: "A long, adventurous search or pursuit in order to achieve a meaningful goal.",
            sentence: "The research team dedicated years to their quest for clean, sustainable energy."
        },
        {
            word: "RAPID",
            phonetic: "/ˈræpɪd/",
            partOfSpeech: "adjective",
            meaning: "Happening in a brief period of time; fast, energetic, and accelerating.",
            sentence: "The student showed rapid progress in English vocabulary after daily practice."
        },
        {
            word: "RIVER",
            phonetic: "/ˈrɪvər/",
            partOfSpeech: "noun",
            meaning: "A large, natural stream of flowing water running toward an ocean, lake, or sea.",
            sentence: "The mighty river carved a spectacular canyon over millions of patient years."
        },
        {
            word: "ROBOT",
            phonetic: "/ˈroʊbɒt/",
            partOfSpeech: "noun",
            meaning: "An automated machine capable of carrying out a complex series of actions.",
            sentence: "The student team programmed a helpful robot to sort recycling items quickly."
        },
        {
            word: "ROYAL",
            phonetic: "/ˈrɔɪəl/",
            partOfSpeech: "adjective",
            meaning: "Having the status of a king or queen; magnificent, dignified, and splendid.",
            sentence: "The distinguished guests received a royal welcome at the international banquet."
        },
        {
            word: "RULER",
            phonetic: "/ˈruːlər/",
            partOfSpeech: "noun",
            meaning: "A person exercising government, or a straight measuring tool used in geometry.",
            sentence: "She used a wooden ruler to draw precise straight lines across the diagram."
        },
        {
            word: "SCALE",
            phonetic: "/skeɪl/",
            partOfSpeech: "noun / verb",
            meaning: "To climb up to the summit of, or a graduated series of musical notes or measurements.",
            sentence: "With grit and proper equipment, the mountaineers were ready to scale the cliff."
        },
        {
            word: "SCENE",
            phonetic: "/siːn/",
            partOfSpeech: "noun",
            meaning: "A picturesque view or landscape, or a sequence of continuous action in a play.",
            sentence: "The sunset over the calm emerald lake was an unforgettable and serene scene."
        },
        {
            word: "SHARE",
            phonetic: "/ʃɛər/",
            partOfSpeech: "verb",
            meaning: "To distribute, give a portion to others, or participate collaboratively.",
            sentence: "Generous leaders share credit and celebrate everyone's contributions."
        },
        {
            word: "SOLAR",
            phonetic: "/ˈsoʊlər/",
            partOfSpeech: "adjective",
            meaning: "Relating to, derived from, or powered by the radiant energy of the sun.",
            sentence: "The school roof is fitted with solar panels that generate clean electrical power."
        },
        {
            word: "SPACE",
            phonetic: "/speɪs/",
            partOfSpeech: "noun",
            meaning: "The continuous physical expanse, or the vast cosmos beyond Earth's atmosphere.",
            sentence: "Astronomers peer deep into outer space using powerful orbiting telescopes."
        },
        {
            word: "STAND",
            phonetic: "/stænd/",
            partOfSpeech: "verb / noun",
            meaning: "To remain upright, firm, and steadfast in defense of truth and integrity.",
            sentence: "Kind citizens stand together to protect vulnerable members of their community."
        },
        {
            word: "STORY",
            phonetic: "/ˈstɔːri/",
            partOfSpeech: "noun",
            meaning: "An account of imaginary or real people and events told for entertainment or learning.",
            sentence: "A captivating bedtime story transported the children into a magical wonderland."
        },
        {
            word: "SWEET",
            phonetic: "/swiːt/",
            partOfSpeech: "adjective",
            meaning: "Pleasing to the senses, having the taste of sugar, or delightfully kind in manner.",
            sentence: "Her sweet encouragement gave the nervous speaker the courage to speak up."
        },
        {
            word: "TEACH",
            phonetic: "/tiːtʃ/",
            partOfSpeech: "verb",
            meaning: "To impart knowledge to or instruct someone in how to do or understand something.",
            sentence: "Great mentors teach not only facts, but how to think critically and empathetically."
        },
        {
            word: "THEME",
            phonetic: "/θiːm/",
            partOfSpeech: "noun",
            meaning: "An underlying topic, central idea, or recurring motif in an artistic or literary work.",
            sentence: "The central theme of the novel explores courage, friendship, and resilience."
        },
        {
            word: "TIGER",
            phonetic: "/ˈtaɪɡər/",
            partOfSpeech: "noun",
            meaning: "A magnificent striped Asian wild cat recognized for power, grace, and stealth.",
            sentence: "The Bengal tiger paced silently through the lush greenery of the rainforest."
        },
        {
            word: "TRUST",
            phonetic: "/trʌst/",
            partOfSpeech: "noun / verb",
            meaning: "Firm belief in the reliability, truth, ability, and honest integrity of someone.",
            sentence: "Mutual trust forms the cornerstone of every strong and successful partnership."
        },
        {
            word: "VOICE",
            phonetic: "/vɔɪs/",
            partOfSpeech: "noun / verb",
            meaning: "Sound produced by human vocal cords, or the expression of opinion and agency.",
            sentence: "Every student's unique voice deserves to be heard, valued, and respected."
        },
        {
            word: "WATER",
            phonetic: "/ˈwɔːtər/",
            partOfSpeech: "noun",
            meaning: "The clear, colorless, odorless liquid essential for the survival of all living organisms.",
            sentence: "A cool glass of clean spring water was wonderfully refreshing on a hot day."
        },
        {
            word: "WORLD",
            phonetic: "/wɜːrld/",
            partOfSpeech: "noun",
            meaning: "The earth, together with all of its countries, peoples, and natural wonders.",
            sentence: "Traveling opens your eyes to the boundless diversity of our wonderful world."
        },
        {
            word: "YOUTH",
            phonetic: "/juːθ/",
            partOfSpeech: "noun",
            meaning: "The vibrant period of being young, full of energy, optimism, and fresh potential.",
            sentence: "The youth of today are creating inspiring solutions for global sustainability."
        }
    ];

    // ── Wordle State ─────────────────────────────────────────────
    const MAX_ROWS = 6;
    const WORD_LENGTH = 5;

    let currentTargetWordObj = null;
    let currentTargetWord = "";
    let guesses = []; // array of strings (5 letters each)
    let evaluations = []; // array of 5 status strings ('correct', 'present', 'absent')
    let currentRow = 0;
    let currentTileIndex = 0;
    let isGameOver = false;
    let isWon = false;
    let isRevealing = false;
    let onProceedCallback = null;
    let onBackCallback = null;
    let activePlayerName = "Teacher Ash";
    let activePlayerImage = "ashhead.png";

    // Elements
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
    let btnAudioWordEl = null;
    let btnAudioMeaningEl = null;
    let btnAudioSentenceEl = null;
    let btnWordleProceedEl = null;
    let wordleDatePillEl = null;
    let btnWordleRandomWordEl = null;
    let btnWordleBackEl = null;
    let btnWordleSkipEl = null;

    // Key status tracking (letter -> 'correct' | 'present' | 'absent')
    const keyStatuses = {};

    // ── Daily Deterministic Word Generator ───────────────────────
    function getTodayDateKey(date = new Date()) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    }

    function getDailyWordIndex(date = new Date()) {
        const y = date.getFullYear();
        const m = date.getMonth() + 1;
        const d = date.getDate();
        // Deterministic hash based on calendar day
        let h = (y * 372) + (m * 31) + d;
        h = ((h >> 16) ^ h) * 0x45d9f3b;
        h = ((h >> 16) ^ h) * 0x45d9f3b;
        h = (h >> 16) ^ h;
        return Math.abs(h) % WORD_CATALOG.length;
    }

    function getDailyWord(date = new Date()) {
        const index = getDailyWordIndex(date);
        return WORD_CATALOG[index];
    }

    function getRandomWord() {
        const index = Math.floor(Math.random() * WORD_CATALOG.length);
        return WORD_CATALOG[index];
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

        // If already speaking from this button, stop
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

    // ── DOM Construction ─────────────────────────────────────────
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
        btnAudioWordEl = document.getElementById("btnAudioWord");
        btnAudioMeaningEl = document.getElementById("btnAudioMeaning");
        btnAudioSentenceEl = document.getElementById("btnAudioSentence");
        btnWordleProceedEl = document.getElementById("btnWordleProceed");
        wordleDatePillEl = document.getElementById("wordleDatePill");
        btnWordleRandomWordEl = document.getElementById("btnWordleRandomWord");
        btnWordleBackEl = document.getElementById("btnWordleBack");
        btnWordleSkipEl = document.getElementById("btnWordleSkip");
    }

    function renderGrid() {
        if (!wordleGridEl) return;
        wordleGridEl.innerHTML = "";

        for (let r = 0; r < MAX_ROWS; r++) {
            const rowEl = document.createElement("div");
            rowEl.className = "wordle-row";
            rowEl.dataset.row = String(r);

            for (let c = 0; c < WORD_LENGTH; c++) {
                const tileEl = document.createElement("div");
                tileEl.className = "wordle-tile";
                tileEl.dataset.row = String(r);
                tileEl.dataset.col = String(c);
                tileEl.setAttribute("aria-label", `Row ${r + 1}, Letter ${c + 1}`);

                // If row has already been guessed, restore its letter and status
                if (guesses[r]) {
                    const letter = guesses[r][c] || "";
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

                // Apply saved status if any
                if (keyStatuses[key]) {
                    keyBtn.classList.add(`key-${keyStatuses[key]}`);
                }

                keyBtn.addEventListener("click", () => handleKeyInput(key));
                rowEl.appendChild(keyBtn);
            });

            wordleKeyboardEl.appendChild(rowEl);
        });
    }

    function showToast(message, duration = 1600) {
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
        if (rowEl) {
            rowEl.classList.add("row-shake");
            setTimeout(() => rowEl.classList.remove("row-shake"), 500);
        }
    }

    // ── User Input Handling ──────────────────────────────────────
    function handleKeyInput(key) {
        if (isGameOver || isRevealing) return;

        if (key === "ENTER") {
            submitGuess();
        } else if (key === "BACKSPACE" || key === "DELETE") {
            deleteLetter();
        } else if (/^[A-Z]$/i.test(key)) {
            addLetter(key.toUpperCase());
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

    function submitGuess() {
        if (currentTileIndex < WORD_LENGTH) {
            shakeCurrentRow();
            showToast("Please enter 5 letters");
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

        // Evaluate the guess against the mystery word
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
                triggerWinCelebration(rowEl);
            } else {
                currentRow++;
                currentTileIndex = 0;

                if (currentRow >= MAX_ROWS) {
                    isGameOver = true;
                    isWon = false;
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
        // Priority: correct > present > absent
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

        // Launch confetti if the main game canvas is available
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

        // Reset keyboard statuses
        Object.keys(keyStatuses).forEach((k) => delete keyStatuses[k]);

        hideWordleModal();
        renderGrid();
        renderKeyboard();

        if (wordleDatePillEl) {
            wordleDatePillEl.textContent = `Today: ${formatDateFriendly()} • 5 Letters`;
        }
    }

    function attachGlobalListeners() {
        window.addEventListener("keydown", (e) => {
            // Only process keys if Wordle screen is currently active
            if (!screenWordleEl || !screenWordleEl.classList.contains("active")) return;
            if (wordleModalOverlayEl && !wordleModalOverlayEl.classList.contains("hidden")) {
                // Modal is open, Enter can trigger proceed
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

        // Random New Word Button
        if (btnWordleRandomWordEl) {
            btnWordleRandomWordEl.addEventListener("click", () => {
                const nextWord = getRandomWord();
                resetBoard(nextWord);
                showToast("New mystery word generated!", 1400);
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
                handleProceed();
            });
        }
    }

    function handleProceed() {
        hideWordleModal();
        if (typeof onProceedCallback === "function") {
            onProceedCallback();
        }
    }

    // ── Public API ───────────────────────────────────────────────
    function startWordle(options = {}) {
        initDOMReferences();
        onProceedCallback = options.onProceed || null;
        onBackCallback = options.onBack || null;
        activePlayerName = options.playerName || "Teacher Ash";
        activePlayerImage = options.playerImage || "ashhead.png";

        // Update player preview pill if in markup
        const playerPillEl = document.getElementById("wordlePlayerPill");
        if (playerPillEl) {
            playerPillEl.innerHTML = `<img src="${activePlayerImage}" alt="" class="wordle-player-thumb" /><span>Playing as <strong>${activePlayerName}</strong></span>`;
        }

        // Pick today's daily mystery word (or keep current if in-session)
        if (!currentTargetWordObj) {
            const todayWord = getDailyWord();
            resetBoard(todayWord);
        } else {
            renderGrid();
            renderKeyboard();
        }
    }

    function init() {
        initDOMReferences();
        attachGlobalListeners();
        // Default to today's daily mystery word
        currentTargetWordObj = getDailyWord();
        currentTargetWord = currentTargetWordObj.word.toUpperCase();
    }

    // Expose to window
    window.MaoWordle = {
        init,
        startWordle,
        reset: () => resetBoard(getDailyWord()),
        setRandomWord: () => resetBoard(getRandomWord()),
        getCurrentWord: () => currentTargetWordObj,
        catalog: WORD_CATALOG
    };

    // Auto-init on load
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
