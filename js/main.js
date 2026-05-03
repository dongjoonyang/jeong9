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


/* ─── Lab Page: Video Autoplay on Scroll ──────── */
(function () {
  const videos = document.querySelectorAll('.lab-grid video');
  if (videos.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.play().catch(e => console.log("Auto-play prevented", e));
      } else {
        entry.target.pause();
      }
    });
  }, { threshold: 0.1 });

  videos.forEach(video => {
    // Remove autoplay attribute to let observer handle it
    video.removeAttribute('autoplay');
    video.pause();
    observer.observe(video);
  });
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
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = project.title;
      const plainTitle = tempDiv.textContent || tempDiv.innerText || "";
      document.title = `${plainTitle} — KIM JEONG GYU`;
      titleEl.innerHTML = project.title;
      document.getElementById('projectDesc').innerText = project.desc;
      document.getElementById('projectTags').innerHTML = project.tags;
      
      const contentArea = document.getElementById('projectContent');
      if (project.contents && Array.isArray(project.contents)) {
        project.contents.forEach((item, index) => {
          const wrapper = document.createElement('div');
          wrapper.className = 'content-item';
          wrapper.style.width = '100%';
          wrapper.style.position = 'relative';

          if (item.type === 'video') {
            const video = document.createElement('video');
            video.src = item.src;
            if (item.poster) video.poster = item.poster;
            video.loop = true;
            video.muted = true;
            video.playsInline = true;
            video.style.width = '100%';
            video.style.display = 'block';
            
            // Intersection Observer to play/pause video
            const observer = new IntersectionObserver((entries) => {
              entries.forEach(entry => {
                if (entry.isIntersecting) {
                  // If it's the first video, add a small delay for better entrance
                  if (index === 1 && !video.dataset.playedOnce) {
                    setTimeout(() => {
                      video.play().catch(e => console.log("Auto-play prevented", e));
                      video.dataset.playedOnce = "true";
                    }, 1100);
                  } else {
                    video.play().catch(e => console.log("Auto-play prevented", e));
                  }
                } else {
                  video.pause();
                }
              });
            }, { threshold: 0.1 });
            
            observer.observe(video);
            wrapper.appendChild(video);
          } else {
            const img = document.createElement('img');
            img.src = item.src;
            img.style.width = '100%';
            img.style.height = 'auto';
            img.style.display = 'block';
            wrapper.appendChild(img);
          }
          contentArea.appendChild(wrapper);
        });
      }
    })
    .catch(err => {
      console.error('Error loading project data:', err);
      location.href = 'index.html';
    });
})();
