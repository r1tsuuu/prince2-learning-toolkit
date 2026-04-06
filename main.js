const hamburger   = document.getElementById('nav-hamburger');
const navDrawer   = document.querySelector('.nav-links');
const navScrim    = document.getElementById('nav-scrim');

function openNav() {
  hamburger.classList.add('open');
  navDrawer.classList.add('open');
  navScrim.classList.add('open');
  hamburger.setAttribute('aria-expanded', 'true');
  document.body.style.overflow = 'hidden'; // prevent scroll behind drawer
}

function closeNav() {
  hamburger.classList.remove('open');
  navDrawer.classList.remove('open');
  navScrim.classList.remove('open');
  hamburger.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', function () {
  hamburger.classList.contains('open') ? closeNav() : openNav();
});

navScrim.addEventListener('click', closeNav);

// Close when a nav link is tapped (the page scrolls to the section)
navDrawer.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', closeNav);
});

// Close on Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeNav();
});

const darkToggle = document.getElementById('dark-mode-toggle');

darkToggle.addEventListener('click', function () {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

const progressBar = document.getElementById('progress-bar');
let rafPending = false;

window.addEventListener('scroll', function () {
  if (rafPending) return;
  rafPending = true;
  requestAnimationFrame(function () {
    const scrolled = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
    progressBar.style.width = scrolled + '%';
    progressBar.setAttribute('aria-valuenow', Math.round(scrolled));
    rafPending = false;
  });
});

const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) return;
    const id = entry.target.id;
    navLinks.forEach(function (link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + id);
    });
  });
}, { threshold: 0.4 });

document.querySelectorAll('main section[id]').forEach(function (section) {
  sectionObserver.observe(section);
});


// Elements to reveal as single units (sections, quiz cards, resource blocks)
const revealSingles = document.querySelectorAll(
  'main section, .quiz-card, .resource-block, .about-block'
);

// Elements whose children should stagger (glossary items, course table rows,
// accordion items, flashcard controls)
const staggerParents = {
  '.accordion':         '.accordion-item',
  '.course-table tbody': 'tr',
  '#glossary-list':     '.glossary-item',
  '.flashcard-scene, .flashcard-controls, .flashcard-actions': null
};

const revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.15 });

// Mark and observe single-reveal elements
revealSingles.forEach(function (el) {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// Mark and observe staggered children
[
  { parent: '.accordion',          child: '.accordion-item' },
  { parent: '.course-table tbody', child: 'tr'              },
  { parent: '#glossary-list',      child: '.glossary-item'  },
  { parent: '.flashcard-scene',    child: null              }
].forEach(function (group) {
  const parentEl = document.querySelector(group.parent);
  if (!parentEl) return;

  const children = group.child
    ? parentEl.querySelectorAll(group.child)
    : [parentEl];

  children.forEach(function (child, i) {
    child.classList.add('reveal');
    child.style.setProperty('--reveal-delay', (i * 60) + 'ms');
    revealObserver.observe(child);
  });
});

document.querySelectorAll('.accordion-header').forEach(function (header) {
  header.addEventListener('click', function () {
    const item = header.parentElement;
    const isOpen = item.classList.contains('open');

    // Close all items
    document.querySelectorAll('.accordion-item').forEach(function (el) {
      el.classList.remove('open');
      el.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
    });

    // Open the clicked item if it was not already open
    if (!isOpen) {
      item.classList.add('open');
      header.setAttribute('aria-expanded', 'true');
    }
  });
});

const glossarySearch = document.getElementById('glossary-search');
const glossaryItems = document.querySelectorAll('.glossary-item');
const glossaryNoResults = document.getElementById('glossary-no-results');

glossarySearch.addEventListener('input', function () {
  const query = glossarySearch.value.toLowerCase().trim();
  let visibleCount = 0;

  glossaryItems.forEach(function (item) {
    const term = item.querySelector('dt').textContent.toLowerCase();
    const matches = term.includes(query);
    item.style.display = matches ? '' : 'none';
    if (matches) visibleCount++;
  });

  glossaryNoResults.hidden = visibleCount > 0;
});

const flashcardData = [
  {
    term: 'Business Case',
    definition: 'Justification for undertaking a project, based on estimated costs, risks, and expected benefits. Owned by the Executive throughout the project.'
  },
  {
    term: 'Executive',
    definition: 'The single individual with overall responsibility for the project, accountable to corporate or programme management. Chairs the Project Board.'
  },
  {
    term: 'Project Board',
    definition: 'The body accountable for the overall direction and management of the project. Comprises the Executive, Senior User, and Senior Supplier.'
  },
  {
    term: 'Tolerance',
    definition: 'The permissible deviation above and below a plan\'s target for time, cost, quality, scope, risk, or benefit before the deviation must be escalated to the next management level.'
  },
  {
    term: 'Work Package',
    definition: 'An assignment given by the Project Manager to a Team Manager describing the work to be done, quality requirements, constraints, and reporting expectations.'
  },
  {
    term: 'Risk Register',
    definition: 'A record of identified risks relating to the project, including their status, probability, impact, and the responses planned to manage them.'
  },
  {
    term: 'Highlight Report',
    definition: 'A time-driven report from the Project Manager to the Project Board summarising stage progress and any forecast deviations from the Stage Plan.'
  },
  {
    term: 'Checkpoint Report',
    definition: 'A progress report prepared by a Team Manager for the Project Manager covering the current status of a Work Package.'
  },
  {
    term: 'Exception Report',
    definition: 'A report describing a forecast deviation beyond agreed tolerances, its cause, impact, options, and a recommended course of action. Triggers an Exception Plan.'
  },
  {
    term: 'Product Description',
    definition: 'A document defining a product\'s purpose, composition, format, quality criteria, and the skills required to create and review it.'
  },
  {
    term: 'Stage Plan',
    definition: 'A detailed plan for the current management stage, created near the end of the previous stage. Used by the Project Manager to control day-to-day work.'
  },
  {
    term: 'Benefits Review Plan',
    definition: 'A plan defining how and when the achievement of the project\'s expected benefits will be measured. Maintained by the Executive.'
  },
  {
    term: 'Change Authority',
    definition: 'A person or group delegated authority by the Project Board to approve changes to the project within defined limits, avoiding bottlenecks at Board level.'
  },
  {
    term: 'Lessons Log',
    definition: 'An informal repository for lessons learned during the project, recording both positive experiences and problems so they can be shared with future projects.'
  },
  {
    term: 'Project Initiation Document (PID)',
    definition: 'The primary contract between the Project Manager and the Project Board. Brings together the Business Case, approach, plans, controls, and team structure to form the basis for project governance.'
  }
];

let deck = flashcardData.slice();
let currentIndex = 0;
let hasFlipped = false;

const flashcard = document.getElementById('flashcard');
const cardCounter = document.getElementById('card-counter');
const flipHint = flashcard.querySelector('.flip-hint');
const cardTerm = flashcard.querySelector('.card-term');
const cardDef = flashcard.querySelector('.card-def');

function renderCard() {
  const card = deck[currentIndex];
  cardTerm.textContent = card.term;
  cardDef.textContent = card.definition;
  flashcard.classList.remove('flipped');
  cardCounter.textContent = (currentIndex + 1) + ' / ' + deck.length;
}

// Flip on click or Enter/Space keypress
flashcard.addEventListener('click', function () {
  flashcard.classList.toggle('flipped');
  if (!hasFlipped) {
    hasFlipped = true;
    flipHint.classList.add('hidden');
  }
});

flashcard.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    flashcard.click();
  }
});

document.getElementById('next-card').addEventListener('click', function () {
  currentIndex = (currentIndex + 1) % deck.length;
  renderCard();
});

document.getElementById('prev-card').addEventListener('click', function () {
  currentIndex = (currentIndex - 1 + deck.length) % deck.length;
  renderCard();
});

// Fisher-Yates shuffle
document.getElementById('shuffle-btn').addEventListener('click', function () {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = deck[i];
    deck[i] = deck[j];
    deck[j] = temp;
  }
  currentIndex = 0;
  renderCard();
});

// Restart restores original order
document.getElementById('restart-btn').addEventListener('click', function () {
  deck = flashcardData.slice();
  currentIndex = 0;
  renderCard();
});

renderCard();
