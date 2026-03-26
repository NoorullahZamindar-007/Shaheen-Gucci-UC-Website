/* =========================
   Shaheen Shared App Runtime
   - language switcher
   - mobile navbar toggle
   - FAQ accordion
   - smooth scrolling
   - back to top button
   - scroll reveal animations
   - shared alerts and validation helpers
   ========================= */

const SITE_LANGUAGES = {
  en: { code: 'en', label: 'English', dir: 'ltr' },
  fa: { code: 'fa', label: 'دری', dir: 'rtl' },
  ps: { code: 'ps', label: 'پښتو', dir: 'rtl' }
};

const DEFAULT_LANGUAGE = 'en';
const STORAGE_KEY = 'sgogc-language';

/* -------------------------
   Utility helpers
   ------------------------- */
function getNestedValue(object, path) {
  return path.split('.').reduce((accumulator, key) => accumulator && accumulator[key], object);
}

function debounce(callback, delay = 200) {
  let timeoutId;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => callback(...args), delay);
  };
}

function getCurrentLanguage() {
  const savedLanguage = localStorage.getItem(STORAGE_KEY);
  return SITE_LANGUAGES[savedLanguage] ? savedLanguage : DEFAULT_LANGUAGE;
}

/* -------------------------
   Language and RTL system
   ------------------------- */
function setDocumentDirection(language) {
  const langConfig = SITE_LANGUAGES[language] || SITE_LANGUAGES[DEFAULT_LANGUAGE];
  document.documentElement.lang = langConfig.code;
  document.documentElement.dir = langConfig.dir;
  document.body.classList.toggle('lang-rtl', langConfig.dir === 'rtl');
  document.body.classList.toggle('lang-ltr', langConfig.dir === 'ltr');
}

function applyTranslationToElement(element, dictionary) {
  const key = element.dataset.i18n;
  if (!key) return;

  const value = getNestedValue(dictionary, key);
  if (typeof value !== 'string') return;

  const targetAttribute = element.dataset.i18nAttr;
  if (targetAttribute) {
    element.setAttribute(targetAttribute, value);
    return;
  }

  if (element.dataset.i18nHtml === 'true') {
    element.innerHTML = value;
    return;
  }

  element.textContent = value;
}

function applySpecialTranslations(dictionary) {
  document.querySelectorAll('[data-i18n-placeholder]').forEach((element) => {
    const value = getNestedValue(dictionary, element.dataset.i18nPlaceholder);
    if (typeof value === 'string') element.setAttribute('placeholder', value);
  });

  document.querySelectorAll('[data-i18n-title]').forEach((element) => {
    const value = getNestedValue(dictionary, element.dataset.i18nTitle);
    if (typeof value === 'string') element.setAttribute('title', value);
  });

  document.querySelectorAll('[data-i18n-value]').forEach((element) => {
    const value = getNestedValue(dictionary, element.dataset.i18nValue);
    if (typeof value === 'string') element.setAttribute('value', value);
  });
}

function updateLanguageSwitcher(language, dictionary) {
  const currentLanguageLabel = document.getElementById('currentLanguageLabel');
  if (currentLanguageLabel) {
    currentLanguageLabel.textContent = dictionary.languageLabel || SITE_LANGUAGES[language].label;
  }

  document.querySelectorAll('.language-option').forEach((button) => {
    const isActive = button.dataset.lang === language;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function renderLatestOffers(language) {
  const offersContainer = document.getElementById('latestOffers');
  if (!offersContainer) return;

  const dictionary = translations[language] || translations[DEFAULT_LANGUAGE];
  const offers = dictionary.latestOffers || translations[DEFAULT_LANGUAGE].latestOffers || [];
  const buyLabel = getNestedValue(dictionary, 'offers.button') || 'Buy Now';

  offersContainer.innerHTML = offers.map((offer) => `
    <div class="col-md-6 col-xl-4 scroll-reveal">
      <article class="offer-card">
        <div class="offer-cover">
          <div class="offer-badge"><i class="bi bi-stars"></i><span>${offer.category}</span></div>
          <div class="offer-rank">${offer.rank}</div>
        </div>
        <div class="offer-body">
          <h3 class="offer-title">${offer.title}</h3>
          <p class="offer-meta">${offer.meta}</p>
          <div class="offer-tags">${offer.tags.map((tag) => `<span>${tag}</span>`).join('')}</div>
          <div class="offer-footer">
            <div class="offer-price">${offer.price}</div>
            <a href="pages/contact.html" class="btn btn-info offer-cta">${buyLabel}</a>
          </div>
        </div>
      </article>
    </div>
  `).join('');

  initializeScrollReveal();
}

function applyPageTranslations(language) {
  const dictionary = translations[language] || translations[DEFAULT_LANGUAGE];

  document.body.classList.add('language-switching');
  setDocumentDirection(language);

  document.querySelectorAll('[data-i18n]').forEach((element) => {
    applyTranslationToElement(element, dictionary);
  });

  applySpecialTranslations(dictionary);
  updateLanguageSwitcher(language, dictionary);
  renderLatestOffers(language);

  requestAnimationFrame(() => {
    document.body.classList.remove('language-switching');
  });

  document.dispatchEvent(new CustomEvent('languageChanged', { detail: { language, dictionary } }));
}

function setLanguage(language) {
  const nextLanguage = SITE_LANGUAGES[language] ? language : DEFAULT_LANGUAGE;
  localStorage.setItem(STORAGE_KEY, nextLanguage);
  applyPageTranslations(nextLanguage);
}

function bindLanguageSwitcher() {
  document.querySelectorAll('.language-option').forEach((button) => {
    button.addEventListener('click', () => {
      setLanguage(button.dataset.lang);
    });
  });
}

/* -------------------------
   Mobile navigation
   ------------------------- */
function closeNavbarMenu(button, target) {
  if (!button || !target) return;
  button.setAttribute('aria-expanded', 'false');
  target.classList.remove('show', 'is-open');
}

function openNavbarMenu(button, target) {
  if (!button || !target) return;
  button.setAttribute('aria-expanded', 'true');
  target.classList.add('show', 'is-open');
}

function initializeMobileNavbar() {
  const toggles = document.querySelectorAll('.navbar-toggler, .js-mobile-menu-toggle');

  toggles.forEach((button) => {
    if (button.dataset.bound === 'true') return;
    button.dataset.bound = 'true';

    const targetId = button.getAttribute('aria-controls') || (button.getAttribute('data-bs-target') || '').replace('#', '');
    const target = targetId ? document.getElementById(targetId) : null;
    if (!target) return;

    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      if (isExpanded) {
        closeNavbarMenu(button, target);
      } else {
        openNavbarMenu(button, target);
      }
    });

    target.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 992) {
          closeNavbarMenu(button, target);
        }
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth >= 992) {
        target.classList.remove('show', 'is-open');
        button.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

function initializeNavbarDropdowns() {
  const dropdownButtons = document.querySelectorAll('.nav-item.dropdown > .dropdown-toggle');

  dropdownButtons.forEach((button) => {
    if (button.dataset.dropdownBound === 'true') return;
    button.dataset.dropdownBound = 'true';

    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      const parent = button.closest('.nav-item.dropdown');
      if (!parent) return;

      const isOpen = parent.classList.contains('is-open');

      document.querySelectorAll('.nav-item.dropdown.is-open').forEach((openDropdown) => {
        if (openDropdown !== parent) {
          openDropdown.classList.remove('is-open');
          const openButton = openDropdown.querySelector('.dropdown-toggle');
          if (openButton) openButton.setAttribute('aria-expanded', 'false');
        }
      });

      parent.classList.toggle('is-open', !isOpen);
      button.setAttribute('aria-expanded', String(!isOpen));
    });
  });

  document.addEventListener('click', (event) => {
    document.querySelectorAll('.nav-item.dropdown.is-open').forEach((dropdown) => {
      if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('is-open');
        const button = dropdown.querySelector('.dropdown-toggle');
        if (button) button.setAttribute('aria-expanded', 'false');
      }
    });
  });
}

/* -------------------------
   FAQ accordion
   ------------------------- */
function initializeFaqAccordion(scope = document) {
  scope.querySelectorAll('.faq-toggle').forEach((button) => {
    if (button.dataset.bound === 'true') return;
    button.dataset.bound = 'true';

    button.addEventListener('click', () => {
      const panel = button.closest('.faq-item-panel');
      const answer = panel ? panel.querySelector('.faq-answer') : null;
      if (!panel || !answer) return;

      const isOpen = panel.classList.contains('open');
      panel.classList.toggle('open', !isOpen);
      button.setAttribute('aria-expanded', String(!isOpen));
      answer.style.maxHeight = !isOpen ? `${answer.scrollHeight}px` : '0px';
    });
  });
}

/* -------------------------
   Smooth scrolling
   ------------------------- */
function initializeSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    if (anchor.dataset.bound === 'true') return;
    anchor.dataset.bound = 'true';

    anchor.addEventListener('click', (event) => {
      const href = anchor.getAttribute('href');
      if (!href || href === '#') return;

      const target = document.querySelector(href);
      if (!target) return;

      event.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* -------------------------
   Back to top button
   ------------------------- */
function ensureBackToTopButton() {
  if (document.getElementById('backToTopButton')) return;

  const button = document.createElement('button');
  button.id = 'backToTopButton';
  button.className = 'back-to-top-button';
  button.type = 'button';
  button.setAttribute('aria-label', 'Back to top');
  button.innerHTML = '<i class="bi bi-arrow-up"></i>';
  document.body.appendChild(button);
}

function initializeBackToTop() {
  ensureBackToTopButton();
  const button = document.getElementById('backToTopButton');
  if (!button || button.dataset.bound === 'true') return;
  button.dataset.bound = 'true';

  const toggleVisibility = debounce(() => {
    button.classList.toggle('visible', window.scrollY > 360);
  }, 40);

  window.addEventListener('scroll', toggleVisibility, { passive: true });
  toggleVisibility();

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* -------------------------
   Scroll reveal animation
   ------------------------- */
let scrollRevealObserver;

function initializeScrollReveal() {
  const revealTargets = document.querySelectorAll([
    '.scroll-reveal',
    '.feature-card',
    '.category-card',
    '.market-card',
    '.uc-card',
    '.contact-card',
    '.info-card',
    '.trust-tile',
    '.offer-card'
  ].join(','));

  if (!('IntersectionObserver' in window)) {
    revealTargets.forEach((element) => element.classList.add('is-visible'));
    return;
  }

  if (!scrollRevealObserver) {
    scrollRevealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          scrollRevealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  }

  revealTargets.forEach((element, index) => {
    element.classList.add('scroll-reveal');
    element.style.transitionDelay = `${Math.min(index % 4, 3) * 60}ms`;
    if (!element.classList.contains('is-visible')) {
      scrollRevealObserver.observe(element);
    }
  });
}

/* -------------------------
   Shared alert components
   ------------------------- */
function ensureAlertRoot() {
  let alertRoot = document.getElementById('globalAlertRoot');
  if (alertRoot) return alertRoot;

  alertRoot = document.createElement('div');
  alertRoot.id = 'globalAlertRoot';
  alertRoot.className = 'global-alert-root';
  document.body.appendChild(alertRoot);
  return alertRoot;
}

function showGlobalAlert(options = {}) {
  const { type = 'success', title = '', message = '', timeout = 4000 } = options;
  const root = ensureAlertRoot();
  const alert = document.createElement('div');
  alert.className = `global-alert global-alert-${type}`;
  alert.innerHTML = `
    <div class="global-alert-icon"><i class="bi ${type === 'error' ? 'bi-exclamation-circle-fill' : 'bi-check-circle-fill'}"></i></div>
    <div class="global-alert-body">
      <strong>${title}</strong>
      <p>${message}</p>
    </div>
    <button class="global-alert-close" type="button" aria-label="Close alert"><i class="bi bi-x-lg"></i></button>
  `;

  root.appendChild(alert);
  requestAnimationFrame(() => alert.classList.add('visible'));

  const removeAlert = () => {
    alert.classList.remove('visible');
    window.setTimeout(() => alert.remove(), 220);
  };

  alert.querySelector('.global-alert-close')?.addEventListener('click', removeAlert);
  if (timeout > 0) window.setTimeout(removeAlert, timeout);
}

/* -------------------------
   Shared form helpers
   ------------------------- */
function clearFormErrors(form, selector = '.marketplace-input, .marketplace-select, .form-control, .form-select') {
  form.querySelectorAll('.field-error').forEach((element) => {
    element.textContent = '';
  });

  form.querySelectorAll(selector).forEach((field) => {
    field.classList.remove('is-invalid');
  });
}

function showFormFieldError(form, fieldName, message) {
  const errorElement = form.querySelector(`[data-error-for="${fieldName}"]`);
  const field = form.elements[fieldName];
  if (errorElement) errorElement.textContent = message;
  if (field) field.classList.add('is-invalid');
}

/* -------------------------
   Main bootstrap
   ------------------------- */
function initializeCoreFeatures() {
  bindLanguageSwitcher();
  initializeMobileNavbar();
  initializeNavbarDropdowns();
  initializeFaqAccordion();
  initializeSmoothScrolling();
  initializeBackToTop();
  initializeScrollReveal();
  applyPageTranslations(getCurrentLanguage());
}

document.addEventListener('DOMContentLoaded', initializeCoreFeatures);

window.ShaheenApp = {
  getNestedValue,
  getCurrentLanguage,
  setLanguage,
  applyPageTranslations,
  initializeFaqAccordion,
  initializeMobileNavbar,
  initializeSmoothScrolling,
  initializeBackToTop,
  initializeScrollReveal,
  showGlobalAlert,
  clearFormErrors,
  showFormFieldError
};

