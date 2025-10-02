
const checkBtn = document.getElementById("checkBtn");
const copyBtn = document.getElementById("copyBtn");
const copyOriginalBtn = document.getElementById("copyOriginalBtn");
const clearBtn = document.getElementById("clearBtn");
const sampleBtn = document.getElementById("sampleBtn");
const shareBtn = document.getElementById("shareBtn");
const showHistoryBtn = document.getElementById("showHistoryBtn");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

const textInput = document.getElementById("textInput");
const originalEl = document.getElementById("original");
const censoredEl = document.getElementById("censored");
const hasProfanityEl = document.getElementById("hasProfanity");
const outputCard = document.getElementById("outputCard");
const historyCard = document.getElementById("historyCard");
const spinner = document.getElementById("spinner");
const errorMessage = document.getElementById("errorMessage");


const charCount = document.getElementById("charCount");
const wordCount = document.getElementById("wordCount");
const cleanWords = document.getElementById("cleanWords");
const flaggedWords = document.getElementById("flaggedWords");
const severityScore = document.getElementById("severityScore");
const detectedWordsResult = document.getElementById("detectedWordsResult");
const detectedWordsList = document.getElementById("detectedWordsList");
const historyList = document.getElementById("historyList");


const sensitivitySelect = document.getElementById("sensitivity");
const replacementSelect = document.getElementById("replacement");
const preserveLengthCheck = document.getElementById("preserveLength");
const highlightWordsCheck = document.getElementById("highlightWords");


const profanityDatabase = {
  low: [
    // Basic/Mild pr
    'damn', 'hell', 'crap', 'darn', 'piss', 'bloody', 'bugger', 'bollocks'
  ],
  medium: [
    // Common profanity
    'shit', 'fuck', 'bitch', 'ass', 'asshole', 'bastard', 'cock', 'dick', 
    'pussy', 'whore', 'slut', 'prick', 'twat', 'wanker', 'turd', 'screw',
    'jackass', 'dumbass', 'smartass', 'bullshit', 'horseshit', 'dipshit',
    'clusterfuck', 'motherfucker', 'cocksucker', 'dickhead', 'shithead',
    'fucked', 'fucking', 'fuckin', 'bitchy', 'bitchin', 'shitty', 'crappy',
    'pissy', 'arse', 'arsehole', 'tosser', 'git', 'sod', 'pillock',
    'fuckface', 'shitface', 'asshat', 'dickwad', 'fuckwit', 'shitstain',
    'cockhead', 'pisshead', 'dickweed', 'asswipe', 'shitbag', 'fucknut',
    'dickface', 'shitlord', 'assclown', 'fucktard', 'shitwit', 'dickbag'
  ],
  high: [
    // Includes mild language and borderline words
    'stupid', 'idiot', 'moron', 'dumb', 'loser', 'suck', 'sucks', 'sucked',
    'lame', 'retard', 'retarded', 'spastic', 'mental', 'psycho', 'nuts', 
    'insane', 'crazy', 'freak', 'weirdo', 'shut up', 'shutup', 'screw you', 
    'kiss my ass', 'go to hell', 'slob', 'pig', 'dog', 'cow', 'rat', 'snake', 
    'worm', 'scum', 'trash', 'garbage', 'filth', 'dirt', 'gutter', 'lowlife',
    
    // Religious profanity
    'goddam', 'goddamn', 'jesus christ', 'christ', 'holy shit', 'holy crap',
    'god damn', 'for gods sake', 'jesus', 'lord', 'omg', 'oh my god',
    
    // Body parts used inappropriately
    'boob', 'boobs', 'tit', 'tits', 'breast', 'nipple', 'butt', 'butthole',
    'penis', 'vagina', 'balls', 'nuts', 'testicles', 'scrotum', 'booty',
    'hooters', 'melons', 'jugs', 'knockers', 'rack', 'assets', 'junk',
    
    // Sexual terms
    'sex', 'sexy', 'horny', 'aroused', 'orgasm', 'masturbate', 'porn',
    'pornography', 'nude', 'naked', 'strip', 'hooker', 'prostitute',
    'escort', 'pimp', 'whoring', 'slutty', 'kinky', 'bondage', 'fetish',
    'erotic', 'seductive', 'naughty', 'dirty', 'filthy', 'nasty',
    
    // Drug references
    'weed', 'pot', 'marijuana', 'drug', 'cocaine', 'heroin', 'meth',
    'crack', 'dope', 'high', 'stoned', 'drunk', 'wasted', 'hammered',
    'blazed', 'baked', 'lit', 'faded', 'buzzed', 'smashed'
  ]
};


let analysisHistory = JSON.parse(localStorage.getItem('profanityFilterHistory') || '[]');

const sampleTexts = [
  "This is a clean sample text with no inappropriate content. It's perfect for testing the filter system.",
  "What the hell













