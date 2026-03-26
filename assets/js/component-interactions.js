function initializeSharedMobileMenu() {
  document.querySelectorAll('.js-mobile-menu-toggle').forEach((button) => {
    const targetSelector = button.getAttribute('data-bs-target');
    const target = targetSelector ? document.querySelector(targetSelector) : null;
    if (!target) return;

    button.addEventListener('click', () => {
      const isExpanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isExpanded));
      target.classList.toggle('show', !isExpanded);
    });
  });
}

function initializeSharedFaqAccordion(scope = document) {
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

function initializeSharedComponentInteractions(scope = document) {
  initializeSharedMobileMenu();
  initializeSharedFaqAccordion(scope);
}

document.addEventListener('DOMContentLoaded', () => {
  initializeSharedComponentInteractions();
});

window.ShaheenComponentInteractions = {
  initializeSharedComponentInteractions,
  initializeSharedFaqAccordion,
  initializeSharedMobileMenu
};
