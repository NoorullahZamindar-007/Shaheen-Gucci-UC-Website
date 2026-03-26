/* =========================
   Contact form logic
   - validation
   - success/error handling
   - backend-ready placeholder submit
   ========================= */

function getContactLanguage() {
  return typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'en';
}

function getContactText(key, fallback = '') {
  const dictionary = translations[getContactLanguage()] || translations.en;
  return getNestedValue(dictionary, key) || fallback;
}

/* -------------------------
   Validation
   ------------------------- */
function validateContactForm(form) {
  const values = Object.fromEntries(new FormData(form).entries());
  const errors = {};

  if (!values.name.trim()) errors.name = getContactText('contactPage.validation.name', 'Name is required.');
  if (!values.email.trim()) {
    errors.email = getContactText('contactPage.validation.emailRequired', 'Email is required.');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = getContactText('contactPage.validation.emailInvalid', 'Please enter a valid email address.');
  }
  if (!values.subject.trim()) errors.subject = getContactText('contactPage.validation.subject', 'Subject is required.');
  if (!values.message.trim()) errors.message = getContactText('contactPage.validation.message', 'Message is required.');

  return errors;
}

/* -------------------------
   Submit handling
   ------------------------- */
function handleContactSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const successMessage = document.getElementById('contactSuccessMessage');
  const errorBanner = document.getElementById('contactErrorMessage');

  window.ShaheenApp?.clearFormErrors(form);
  if (successMessage) successMessage.classList.add('d-none');
  if (errorBanner) errorBanner.classList.add('d-none');

  const errors = validateContactForm(form);
  if (Object.keys(errors).length > 0) {
    Object.entries(errors).forEach(([field, message]) => {
      window.ShaheenApp?.showFormFieldError(form, field, message);
    });

    if (errorBanner) errorBanner.classList.remove('d-none');
    window.ShaheenApp?.showGlobalAlert({
      type: 'error',
      title: getContactText('contactPage.errorTitle', 'Please fix the highlighted fields'),
      message: getContactText('contactPage.errorText', 'Some required information is missing or invalid.'),
      timeout: 3200
    });
    return;
  }

  const submissionData = Object.fromEntries(new FormData(form).entries());
  console.log('Contact form placeholder payload:', submissionData);

  if (successMessage) {
    successMessage.classList.remove('d-none');
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  window.ShaheenApp?.showGlobalAlert({
    type: 'success',
    title: getContactText('contactPage.successTitle', 'Message received'),
    message: getContactText('contactPage.successText', 'Your message was captured in the frontend demo. Connect this form later for real submissions.'),
    timeout: 3800
  });

  form.reset();
}

/* -------------------------
   Form bootstrapping
   ------------------------- */
function bindContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', handleContactSubmit);
  form.addEventListener('reset', () => {
    window.ShaheenApp?.clearFormErrors(form);
    const successMessage = document.getElementById('contactSuccessMessage');
    const errorBanner = document.getElementById('contactErrorMessage');
    if (successMessage) successMessage.classList.add('d-none');
    if (errorBanner) errorBanner.classList.add('d-none');
  });
}

function initializeContactPage() {
  if (!document.getElementById('contactForm')) return;
  bindContactForm();
}

document.addEventListener('DOMContentLoaded', initializeContactPage);
