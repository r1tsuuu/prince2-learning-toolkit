/* ==========================================================================
   DARK MODE
   Theme is applied on <html> before body renders (inline script in <head>).
   This listener handles user-initiated toggles and persists the preference.
   CSS variables in style.css handle all color changes when .dark is present.
   ========================================================================== */

const darkToggle = document.getElementById('dark-mode-toggle');

darkToggle.addEventListener('click', function () {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

/* ==========================================================================
   READING PROGRESS BAR
   Throttled with requestAnimationFrame so the DOM write happens at most once
   per frame, not on every pixel of scroll.
   ========================================================================== */

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

/* ==========================================================================
   ACTIVE NAVIGATION HIGHLIGHTING
   IntersectionObserver is used instead of a scroll listener — it fires only
   when a section crosses the threshold, making it more performant.
   A section is considered active when 40% or more of it is in the viewport.
   ========================================================================== */

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

/* ==========================================================================
   ACCORDION — Learning Modules
   One item open at a time. Clicking an open item closes it.
   CSS max-height transition handles the animation — no JS animation needed.
   ========================================================================== */

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

/* ==========================================================================
   GLOSSARY — Live Search
   Filters .glossary-item elements by their <dt> text on each keystroke.
   Shows a "no results" message when nothing matches.
   ========================================================================== */

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
