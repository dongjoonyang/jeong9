/* ─── Active nav link ─────────────────────────── */
(function () {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === path) link.classList.add('active');
  });
})();


/* ─── Project intro: drag to scroll ──────────── */
(function () {
  const el = document.getElementById('dragIntro');
  if (!el) return;

  let isDown = false;
  let startX, scrollLeft;

  // Only active when content overflows (desktop single-column doesn't overflow)
  el.style.overflowX = 'auto';
  el.style.scrollbarWidth = 'none'; // Firefox
  el.style.msOverflowStyle = 'none'; // IE

  // Hide webkit scrollbar via inline style injection
  const style = document.createElement('style');
  style.textContent = '#dragIntro::-webkit-scrollbar { display: none; }';
  document.head.appendChild(style);

  el.addEventListener('mousedown', e => {
    isDown = true;
    el.style.cursor = 'grabbing';
    startX = e.pageX - el.offsetLeft;
    scrollLeft = el.scrollLeft;
  });

  document.addEventListener('mouseup', () => {
    isDown = false;
    if (el) el.style.cursor = 'grab';
  });

  el.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - el.offsetLeft;
    const walk = (x - startX) * 1.2;
    el.scrollLeft = scrollLeft - walk;
  });

  el.addEventListener('mouseleave', () => {
    if (isDown) {
      isDown = false;
      el.style.cursor = 'grab';
    }
  });

  // Set grab cursor only when draggable (content wider than container)
  function checkOverflow() {
    el.style.cursor = el.scrollWidth > el.clientWidth ? 'grab' : 'default';
  }
  window.addEventListener('resize', checkOverflow);
  checkOverflow();
})();
