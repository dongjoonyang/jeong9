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
    if (el) el.style.cursor = el.scrollWidth > el.clientWidth ? 'grab' : 'default';
  }
  window.addEventListener('resize', checkOverflow);
  checkOverflow();
})();


/* ─── Dynamic Project Loading ───────────────── */
(function () {
  const titleEl = document.getElementById('projectTitle');
  if (!titleEl) return; // Only run on project.html

  const params = new URLSearchParams(window.location.search);
  const projectId = params.get('id');

  if (!projectId) {
    location.href = 'index.html';
    return;
  }

  fetch('js/projects.json')
    .then(res => res.json())
    .then(data => {
      const project = data[projectId];
      if (!project) {
        location.href = 'index.html';
        return;
      }

      // Update Page Content
      document.title = `${project.title.replace('<br>', ' ')} — KIM JEONG GYU`;
      titleEl.innerHTML = project.title;
      document.getElementById('projectDesc').innerText = project.desc;
      document.getElementById('projectTags').innerHTML = project.tags;
      
      const contentArea = document.getElementById('projectContent');
      if (project.contents && Array.isArray(project.contents)) {
        project.contents.forEach(path => {
          if (path.endsWith('.mp4')) {
            const video = document.createElement('video');
            video.src = path;
            video.autoplay = true;
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            video.style.width = '100%';
            video.style.display = 'block';
            contentArea.appendChild(video);
          } else {
            const img = document.createElement('img');
            img.src = path;
            img.style.width = '100%';
            img.style.height = 'auto';
            img.style.display = 'block';
            contentArea.appendChild(img);
          }
        });
      }
    })
    .catch(err => {
      console.error('Error loading project data:', err);
      location.href = 'index.html';
    });
})();
