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
