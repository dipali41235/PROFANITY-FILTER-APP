const checkBtn = document.getElementById("checkBtn");
const copyBtn = document.getElementById("copyBtn");
const textInput = document.getElementById("textInput");
const originalEl = document.getElementById("original");
const censoredEl = document.getElementById("censored");
const hasProfanityEl = document.getElementById("hasProfanity");
const outputCard = document.getElementById("outputCard");
const spinner = document.getElementById("spinner");
const errorMessage = document.getElementById("errorMessage");

// Simple client-side profanity filter as fallback
const profanityWords = [
  'damn', 'hell', 'shit', 'fuck', 'bitch', 'ass', 'bastard', 'crap',
  'piss', 'cock', 'dick', 'pussy', 'whore', 'slut', 'fag', 'retard'
];

function clientSideProfanityFilter(text) {
  let censored = text;
  let hasProfanity = false;

  profanityWords.forEach(word => {
    const regex = new RegExp(`\\b${word}\\b`, 'gi');
    if (regex.test(text)) {
      hasProfanity = true;
      censored = censored.replace(regex, '*'.repeat(word.length));
    }
  });

  return {
    original: text,
    censored: censored,
    has_profanity: hasProfanity
  };
}

function showError(message) {
  errorMessage.innerHTML = `<div class="error-message">${message}</div>`;
  setTimeout(() => {
    errorMessage.innerHTML = '';
  }, 5000);
}

checkBtn.addEventListener("click", async () => {
  const text = textInput.value.trim();
  if (!text) {
    showError("Please enter some text to analyze!");
    return;
  }

  spinner.classList.add("show");
  outputCard.classList.remove("show");
  errorMessage.innerHTML = '';

  try {
    // Try API first (you'll need to add a real API key)
    // For now, we'll use the client-side filter
    
    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const data = clientSideProfanityFilter(text);

    originalEl.textContent = data.original;
    censoredEl.textContent = data.censored;
    
    const statusBadge = data.has_profanity 
      ? '<span class="status-badge flagged">Profanity Detected</span>'
      : '<span class="status-badge clean">Clean Text</span>';
    hasProfanityEl.innerHTML = statusBadge;

    outputCard.classList.add("show");
  } catch (err) {
    showError("Analysis failed. Please try again.");
    console.error("Filter error:", err);
  } finally {
    spinner.classList.remove("show");
  }
});

copyBtn.addEventListener("click", async () => {
  const text = censoredEl.textContent;
  try {
    await navigator.clipboard.writeText(text);
    
    // Temporary success feedback
    const originalText = copyBtn.textContent;
    copyBtn.textContent = "✅ Copied!";
    copyBtn.style.background = "linear-gradient(135deg, #48bb78, #38a169)";
    
    setTimeout(() => {
      copyBtn.textContent = originalText;
      copyBtn.style.background = "";
    }, 2000);
  } catch (err) {
    showError("Failed to copy text. Please try manually selecting and copying.");
  }
});

// Enter key support
textInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.ctrlKey) {
    checkBtn.click();
  }
});

// Auto-resize textarea
textInput.addEventListener("input", function() {
  this.style.height = "auto";
  this.style.height = (this.scrollHeight) + "px";
});