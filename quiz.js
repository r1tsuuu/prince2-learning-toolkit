const quizData = [
  {
    question: 'How many principles does PRINCE2 define?',
    options: ['5', '6', '7', '9'],
    correctIndex: 2
  },
  {
    question: 'What does the acronym PRINCE2 stand for?',
    options: [
      'Projects IN Controlled Environments',
      'Professional Initiative for New Controlled Enterprises',
      'Projects in New Commercial Environments',
      'Program for Integrated Controlled Execution'
    ],
    correctIndex: 0
  },
  {
    question: 'How many themes are there in PRINCE2?',
    options: ['5', '6', '7', '8'],
    correctIndex: 2
  },
  {
    question: 'Which role has overall responsibility for the project and is directly accountable to corporate or programme management?',
    options: ['Project Manager', 'Senior User', 'Executive', 'Senior Supplier'],
    correctIndex: 2
  },
  {
    question: 'Which PRINCE2 theme addresses why the project is being undertaken and whether it remains justified?',
    options: ['Plans', 'Risk', 'Quality', 'Business Case'],
    correctIndex: 3
  },
  {
    question: 'What is "tolerance" in PRINCE2?',
    options: [
      'The maximum number of issues a project can have',
      'The permissible deviation from a plan\'s targets before escalation is required',
      'The minimum quality standard a product must meet',
      'The time allowed between management stages'
    ],
    correctIndex: 1
  },
  {
    question: 'Which PRINCE2 process is primarily concerned with assigning and checking Work Packages?',
    options: [
      'Directing a Project',
      'Initiating a Project',
      'Controlling a Stage',
      'Managing Stage Boundaries'
    ],
    correctIndex: 2
  },
  {
    question: 'Which document is the primary "contract" between the Project Manager and the Project Board for the life of the project?',
    options: [
      'Project Brief',
      'Project Initiation Document',
      'Business Case',
      'Benefits Review Plan'
    ],
    correctIndex: 1
  },
  {
    question: 'What type of report does a Team Manager prepare for the Project Manager to update on Work Package progress?',
    options: ['Highlight Report', 'Checkpoint Report', 'End Stage Report', 'Exception Report'],
    correctIndex: 1
  },
  {
    question: 'Which PRINCE2 process runs throughout the entire project life cycle and is the responsibility of the Project Board?',
    options: [
      'Controlling a Stage',
      'Managing Product Delivery',
      'Directing a Project',
      'Starting Up a Project'
    ],
    correctIndex: 2
  },
  {
    question: 'PRINCE2 is best described as which type of methodology?',
    options: [
      'Agile and iterative by default',
      'Process-based, scalable, and non-prescriptive about techniques',
      'Fully predictive with a fixed plan',
      'Risk-first with adaptive planning cycles'
    ],
    correctIndex: 1
  },
  {
    question: 'An Exception Report is created when a forecast deviation exceeds which level of tolerance?',
    options: ['Team tolerance', 'Stage tolerance', 'Project tolerance', 'Programme tolerance'],
    correctIndex: 1
  }
];

const PASS_THRESHOLD = 0.7;   // 70%
const AUTO_ADVANCE_MS = 1500; // ms to show answer feedback before advancing

const quizIntro       = document.getElementById('quiz-intro');
const quizBody        = document.getElementById('quiz-body');
const quizResults     = document.getElementById('quiz-results');
const startBtn        = document.getElementById('start-quiz-btn');
const retryBtn        = document.getElementById('retry-btn');
const questionCounter = document.getElementById('question-counter');
const questionText    = document.getElementById('question-text');
const answerOptions   = document.getElementById('answer-options');
const quizProgressBar = document.getElementById('quiz-progress-bar');
const scoreFraction   = document.getElementById('score-fraction');
const scorePercent    = document.getElementById('score-percent');
const scoreMessage    = document.getElementById('score-message');
const prevBestLine    = document.getElementById('prev-best-line');
const prevBestValue   = document.getElementById('prev-best-value');
const lastScoreLine   = document.getElementById('last-score-line');
const lastScoreEl     = document.getElementById('last-score');
const certificate       = document.getElementById('certificate');
const certScore         = document.getElementById('cert-score');
const certStudentName   = document.getElementById('cert-student-name');
const certDateEl        = document.getElementById('cert-date');
const certNameInput     = document.getElementById('cert-name');
const printCertBtn      = document.getElementById('print-cert-btn');

let currentQuestion = 0;
let score = 0;


function showOnly(el) {
  [quizIntro, quizBody, quizResults].forEach(function (panel) {
    panel.hidden = panel !== el;
  });
}

function updateProgressBar(index) {
  const pct = (index / quizData.length) * 100;
  quizProgressBar.style.width = pct + '%';
  quizProgressBar.setAttribute('aria-valuenow', Math.round(pct));
}

function formatScore(correct, total) {
  return correct + ' / ' + total;
}

function formatPct(correct, total) {
  return Math.round((correct / total) * 100) + '%';
}

// Three message tiers based on score percentage
function messageForScore(pct) {
  if (pct >= 0.7) return 'Excellent work — you\'ve passed!';
  if (pct >= 0.5) return 'Good effort! A bit more review and you\'ll nail it.';
  return 'Keep studying — try the flashcards and give it another go!';
}

function renderQuestion(index) {
  const q = quizData[index];

  updateProgressBar(index);
  questionCounter.textContent = 'Question ' + (index + 1) + ' of ' + quizData.length;
  questionText.textContent = q.question;

  // Clear previous answer buttons
  answerOptions.innerHTML = '';

  q.options.forEach(function (optionText, i) {
    const btn = document.createElement('button');
    btn.className = 'answer-option';
    btn.textContent = optionText;
    btn.addEventListener('click', function () {
      handleAnswer(i, q.correctIndex);
    });
    answerOptions.appendChild(btn);
  });
}

function handleAnswer(selectedIndex, correctIndex) {
  const buttons = answerOptions.querySelectorAll('.answer-option');

  // Lock all buttons immediately — user cannot change their answer
  buttons.forEach(function (btn) {
    btn.disabled = true;
  });

  // Show feedback: correct answer turns green, wrong selection turns rust
  buttons[correctIndex].classList.add('correct');
  if (selectedIndex !== correctIndex) {
    buttons[selectedIndex].classList.add('wrong');
  } else {
    score++;
  }

  // Pause so the user sees the feedback, then advance
  setTimeout(function () {
    currentQuestion++;
    if (currentQuestion < quizData.length) {
      renderQuestion(currentQuestion);
    } else {
      showResults();
    }
  }, AUTO_ADVANCE_MS);
}

function showResults() {
  const total = quizData.length;
  const pct = score / total;
  const pctStr = formatPct(score, total);
  const fracStr = formatScore(score, total);

  // Fill score display
  scoreFraction.textContent = fracStr;
  scorePercent.textContent = pctStr;
  scoreMessage.textContent = messageForScore(pct);

  // Show previous best if one exists
  const previousBest = localStorage.getItem('quizBestScore');
  if (previousBest) {
    prevBestLine.hidden = false;
    prevBestValue.textContent = previousBest;
  } else {
    prevBestLine.hidden = true;
  }

  // Save new best if this attempt is better than the stored one
  const currentPctNum = Math.round(pct * 100);
  const previousPctNum = previousBest ? parseInt(previousBest, 10) : 0;
  if (currentPctNum > previousPctNum) {
    localStorage.setItem('quizBestScore', pctStr);
    // Also refresh the intro screen's last-score for when the user retries
    lastScoreEl.textContent = pctStr;
    lastScoreLine.hidden = false;
  }

  // Progress bar to 100% at the end
  updateProgressBar(total);
  showOnly(quizResults);

  // Reveal certificate only if score meets or exceeds the pass threshold
  if (pct >= PASS_THRESHOLD) {
    certificate.hidden = false;
    certScore.textContent = fracStr + ' (' + pctStr + ')';
    // Set today's date on the certificate
    certDateEl.textContent = new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
    // Reset name input and preview in case this is a retry
    certNameInput.value = '';
    certStudentName.textContent = 'Your Name';
    certNameInput.focus();
  } else {
    certificate.hidden = true;
  }
}

function startQuiz() {
  currentQuestion = 0;
  score = 0;
  updateProgressBar(0);
  renderQuestion(0);
  showOnly(quizBody);
}

(function populateLastScore() {
  const saved = localStorage.getItem('quizBestScore');
  if (saved) {
    lastScoreLine.hidden = false;
    lastScoreEl.textContent = saved;
  }
})();


startBtn.addEventListener('click', startQuiz);
retryBtn.addEventListener('click', startQuiz);

// Live name preview — updates the certificate as the user types
certNameInput.addEventListener('input', function () {
  const name = certNameInput.value.trim();
  certStudentName.textContent = name.length > 0 ? name : 'Your Name';
});

printCertBtn.addEventListener('click', function () {
  // If name is still the placeholder, nudge the user before printing
  if (certNameInput.value.trim().length === 0) {
    certNameInput.focus();
    certNameInput.style.borderColor = 'var(--color-accent-rust)';
    setTimeout(function () {
      certNameInput.style.borderColor = '';
    }, 1800);
    return;
  }
  window.print();
});
