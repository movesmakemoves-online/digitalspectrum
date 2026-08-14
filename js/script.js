// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

navToggle.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  navToggle.classList.toggle('open', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

mainNav.querySelectorAll('.nav-link').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// Dropdowns — hover works on desktop via CSS; this handles tap/click and keyboard.
// Covers both the Services nav item and the button lower down the homepage.
document.querySelectorAll('.has-dropdown').forEach((item) => {
  const trigger = item.querySelector('.nav-link--parent, .dropdown-trigger');
  if (!trigger) return;

  const isButton = trigger.tagName === 'BUTTON';

  trigger.addEventListener('click', (e) => {
    // A button always toggles. A link only intercepts on touch/narrow layouts,
    // where hover doesn't exist — otherwise it should still navigate.
    const isTouchLayout = window.matchMedia('(hover: none), (max-width: 860px)').matches;
    if (isButton || (isTouchLayout && !item.classList.contains('open'))) {
      e.preventDefault();
      const nowOpen = !item.classList.contains('open');
      item.classList.toggle('open', nowOpen);
      trigger.setAttribute('aria-expanded', String(nowOpen));
    }
  });

  item.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      item.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.focus();
    }
  });
});

document.addEventListener('click', (e) => {
  document.querySelectorAll('.has-dropdown.open').forEach((item) => {
    if (!item.contains(e.target)) {
      item.classList.remove('open');
      item.querySelector('.nav-link--parent, .dropdown-trigger')?.setAttribute('aria-expanded', 'false');
    }
  });
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
);
revealEls.forEach((el) => revealObserver.observe(el));

// Active nav link for current page
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach((link) => {
  // Strip any #anchor so links like contact.html#contact-details still match the page
  const linkPage = (link.getAttribute('href') || '').split('#')[0];
  if (linkPage === currentPage) {
    link.classList.add('active');
  }
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();

// Contact form (Netlify Forms — only actually submits once deployed on Netlify)
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formStatus = document.getElementById('form-status');
    const formData = new FormData(contactForm);
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(formData).toString(),
    })
      .then(() => {
        formStatus.textContent = "Thanks — we've got your request and will follow up within 1–2 business days.";
        contactForm.reset();
      })
      .catch(() => {
        formStatus.textContent = 'Something went wrong sending that — please email services@digitalspectrumlabs.co.uk directly instead.';
      });
  });
}

// Izmwear slideshow on card hover
const izmwearCard = document.getElementById('izmwear-card');
if (izmwearCard) {
  const slides = izmwearCard.querySelectorAll('.slide');
  let currentSlide = 0;
  let slideshowInterval;

  function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[n].classList.add('active');
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  izmwearCard.addEventListener('mouseenter', () => {
    currentSlide = 0;
    showSlide(0);
    slideshowInterval = setInterval(nextSlide, 1800);
  });

  izmwearCard.addEventListener('mouseleave', () => {
    clearInterval(slideshowInterval);
    slides.forEach(slide => slide.classList.remove('active'));
  });
}
