const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('main section[id]');

function updateNavbarState() {
  navbar.classList.toggle('scrolled', window.scrollY > 30);
}

function updateActiveLink() {
  let currentId = sections[0]?.id;
  const offset = 140;

  sections.forEach((section) => {
    const top = section.getBoundingClientRect().top;
    if (top - offset <= 0) currentId = section.id;
  });

  navLinks.forEach((link) => {
    link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
  });
}

const progressBar = document.getElementById('scroll-progress');

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = `${progress}%`;
}

const backToTop = document.getElementById('back-to-top');

function updateBackToTop() {
  backToTop.classList.toggle('show', window.scrollY > 600);
}

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

let scrollScheduled = false;

function onScroll() {
  if (!scrollScheduled) {
    scrollScheduled = true;
    requestAnimationFrame(() => {
      updateNavbarState();
      updateActiveLink();
      updateScrollProgress();
      updateBackToTop();
      scrollScheduled = false;
    });
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const navToggle = document.getElementById('nav-toggle');
const navLinksWrap = document.getElementById('nav-links');

function closeMobileNav() {
  navToggle.classList.remove('open');
  navLinksWrap.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}

navToggle.addEventListener('click', () => {
  const isOpen = navLinksWrap.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinksWrap.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', closeMobileNav);
});

const revealTargets = document.querySelectorAll('.reveal, .speed-divider');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
);

revealTargets.forEach((el) => revealObserver.observe(el));

function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  if (Number.isNaN(target)) return;

  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
    el.textContent = Math.round(eased * target);
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target;
    }
  }

  requestAnimationFrame(tick);
}

const counterEls = document.querySelectorAll('.telemetry-num[data-count]');

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

counterEls.forEach((el) => counterObserver.observe(el));

const bgVideo = document.getElementById('bg-video');
const audioControl = document.getElementById('audio-control');
const audioLabel = audioControl.querySelector('.audio-label');

audioControl.addEventListener('click', () => {
  const nowPlaying = bgVideo.muted; // about to unmute
  bgVideo.muted = !bgVideo.muted;
  audioControl.classList.toggle('playing', nowPlaying);
  audioControl.setAttribute('aria-pressed', String(nowPlaying));
  audioLabel.textContent = nowPlaying ? 'Sound Off' : 'Sound On';
});

const suggestionForm = document.getElementById('suggestion-form');
const formSuccess = document.getElementById('form-success');

suggestionForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!suggestionForm.checkValidity()) {
    suggestionForm.reportValidity();
    return;
  }

  formSuccess.classList.add('show');
  suggestionForm.reset();

  window.clearTimeout(suggestionForm._hideTimer);
  suggestionForm._hideTimer = window.setTimeout(() => {
    formSuccess.classList.remove('show');
  }, 4000);
});


