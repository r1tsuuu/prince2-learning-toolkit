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
