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

// Main analysis function
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
    // Simulate API delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const data = advancedProfanityFilter(text);

    // Update main results
    originalEl.textContent = data.original;
    censoredEl.innerHTML = data.censored;
    
    // Update statistics
    cleanWords.textContent = data.statistics.clean_words;
    flaggedWords.textContent = data.statistics.flagged_words;
    severityScore.textContent = data.statistics.severity_score;
    
    // Update status badge
    let statusBadge;
    if (!data.has_profanity) {
      statusBadge = '<span class="status-badge clean">✅ Clean Text</span>';
    } else if (data.statistics.severity_score < 30) {
      statusBadge = '<span class="status-badge warning">⚠️ Mild Issues</span>';
    } else {
      statusBadge = '<span class="status-badge flagged">🚫 Profanity Detected</span>';
    }
    hasProfanityEl.innerHTML = statusBadge;
    
    // Show detected words if any
    if (data.detected_words.length > 0) {
      detectedWordsResult.style.display = 'block';
      detectedWordsList.innerHTML = data.detected_words
        .map(word => `<span class="detected-word-tag">${word}</span>`)
        .join('');
    } else {
      detectedWordsResult.style.display = 'none';
    }
    
    // Save to history
    saveToHistory(data);
    
    outputCard.classList.add("show");
  } catch (err) {
    showError("Analysis failed. Please try again.");
    console.error("Filter error:", err);
  } finally {
    spinner.classList.remove("show");
  }
});

// Copy filtered text
copyBtn.addEventListener("click", () => {
  const text = censoredEl.textContent;
  copyToClipboard(text, "✅ Filtered text copied to clipboard!");
});

// Copy original text
copyOriginalBtn.addEventListener("click", () => {
  const text = originalEl.textContent;
  copyToClipboard(text, "✅ Original text copied to clipboard!");
});

// Clear input
clearBtn.addEventListener("click", () => {
  textInput.value = '';
  updateCounts();
  outputCard.classList.remove("show");
});

// Load sample text
sampleBtn.addEventListener("click", () => {
  const randomSample = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
  textInput.value = randomSample;
  updateCounts();
});

// Share results
shareBtn.addEventListener("click", async () => {
  if (!censoredEl.textContent || censoredEl.textContent === '—') {
    showError("No results to share. Please analyze some text first.");
    return;
  }
  
  const shareText = `Profanity Filter Results:\n\nFiltered Text: ${censoredEl.textContent}\n\nClean Words: ${cleanWords.textContent} | Flagged Words: ${flaggedWords.textContent} | Risk Score: ${severityScore.textContent}`;
  
  if (navigator.share) {
    try {
      await navigator.share({
        title: 'Profanity Filter Results',
        text: shareText
      });
    } catch (err) {
      if (err.name !== 'AbortError') {
        copyToClipboard(shareText, "✅ Results copied to clipboard for sharing!");
      }
    }
  } else {
    copyToClipboard(shareText, "✅ Results copied to clipboard for sharing!");
  }
});

// Show/hide history
showHistoryBtn.addEventListener("click", () => {
  if (historyCard.style.display === 'none') {
    historyCard.style.display = 'block';
    updateHistoryDisplay();
    showHistoryBtn.textContent = '📊 Hide History';
  } else {
    historyCard.style.display = 'none';
    showHistoryBtn.textContent = '📊 Show History';
  }
});

// Clear history
clearHistoryBtn.addEventListener("click", () => {
  if (confirm('Are you sure you want to clear all analysis history?')) {
    analysisHistory = [];
    localStorage.removeItem('profanityFilterHistory');
    updateHistoryDisplay();
    showSuccess("✅ Analysis history cleared!");
  }
});

// Text input events
textInput.addEventListener("input", updateCounts);

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

// Settings change handlers
sensitivitySelect.addEventListener("change", () => {
  if (originalEl.textContent && originalEl.textContent !== '—') {
    checkBtn.click(); // Re-analyze with new settings
  }
});

replacementSelect.addEventListener("change", () => {
  if (originalEl.textContent && originalEl.textContent !== '—') {
    checkBtn.click(); // Re-analyze with new settings
  }
});

preserveLengthCheck.addEventListener("change", () => {
  if (originalEl.textContent && originalEl.textContent !== '—') {
    checkBtn.click(); // Re-analyze with new settings
  }
});

highlightWordsCheck.addEventListener("change", () => {
  if (originalEl.textContent && originalEl.textContent !== '—') {
    checkBtn.click(); // Re-analyze with new settings
  }
});

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  updateCounts();
  updateHistoryDisplay();
  
  // Add welcome message
  setTimeout(() => {
    showSuccess("🎉 Welcome to Advanced Profanity Filter! Try the sample text or enter your own.");
  }, 1000);
});
