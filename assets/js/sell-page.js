/* =========================
   Seller form logic
   - validation
   - success handling
   - backend-ready placeholder submit
   ========================= */

function getSellLanguage() {
  return typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'en';
}

function getSellText(key, fallback = '') {
  const dictionary = translations[getSellLanguage()] || translations.en;
  return getNestedValue(dictionary, key) || fallback;
}

/* -------------------------
   Validation
   ------------------------- */
function validateSellForm(form) {
  const values = Object.fromEntries(new FormData(form).entries());
  const errors = {};

  if (!values.fullName.trim()) errors.fullName = getSellText('sellPage.validation.fullName', 'Full name is required.');
  if (!values.phoneContact.trim()) errors.phoneContact = getSellText('sellPage.validation.phoneContact', 'A phone number or messaging contact is required.');
  if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = getSellText('sellPage.validation.email', 'Please enter a valid email address.');
  if (!values.gameName.trim()) errors.gameName = getSellText('sellPage.validation.gameName', 'Please select a game.');
  if (!values.accountTitle.trim()) errors.accountTitle = getSellText('sellPage.validation.accountTitle', 'Account title is required.');
  if (!values.level.trim()) errors.level = getSellText('sellPage.validation.level', 'Level information is required.');
  if (!values.region.trim()) errors.region = getSellText('sellPage.validation.region', 'Region is required.');
  if (!values.price.trim()) {
    errors.price = getSellText('sellPage.validation.priceRequired', 'Price is required.');
  } else if (Number(values.price) <= 0) {
    errors.price = getSellText('sellPage.validation.priceInvalid', 'Please enter a valid price greater than zero.');
  }
  if (!values.features.trim()) errors.features = getSellText('sellPage.validation.features', 'Please list some account features.');
  if (!values.description.trim()) errors.description = getSellText('sellPage.validation.description', 'Description is required.');
  if (!values.contactMethod.trim()) errors.contactMethod = getSellText('sellPage.validation.contactMethod', 'Please choose your preferred contact method.');

  return errors;
}

/* -------------------------
   Submit handling
   ------------------------- */
function handleSellSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const successMessage = document.getElementById('sellSuccessMessage');

  window.ShaheenApp?.clearFormErrors(form);

  const errors = validateSellForm(form);
  if (Object.keys(errors).length > 0) {
    Object.entries(errors).forEach(([field, message]) => {
      window.ShaheenApp?.showFormFieldError(form, field, message);
    });

    window.ShaheenApp?.showGlobalAlert({
      type: 'error',
      title: getSellText('sellPage.validation.contactMethod', 'Please review the form'),
      message: getSellText('sellPage.formSubtitle', 'Fill in the details below. Required fields help us prepare a clearer listing for buyers.'),
      timeout: 3200
    });
    return;
  }

  const submissionData = Object.fromEntries(new FormData(form).entries());
  console.log('Seller submission placeholder payload:', submissionData);

  if (successMessage) {
    successMessage.classList.remove('d-none');
    successMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  window.ShaheenApp?.showGlobalAlert({
    type: 'success',
    title: getSellText('sellPage.successTitle', 'Submission received'),
    message: getSellText('sellPage.successText', 'Your account details were captured in the frontend demo.'),
    timeout: 3800
  });

  form.reset();
}

/* -------------------------
   Form bootstrapping
   ------------------------- */
function bindSellForm() {
  const form = document.getElementById('sellAccountForm');
  if (!form) return;

  form.addEventListener('submit', handleSellSubmit);
  form.addEventListener('reset', () => {
    window.ShaheenApp?.clearFormErrors(form);
    const successMessage = document.getElementById('sellSuccessMessage');
    if (successMessage) successMessage.classList.add('d-none');
  });
}

function initializeSellPage() {
  if (!document.getElementById('sellAccountForm')) return;
  bindSellForm();
}

document.addEventListener('DOMContentLoaded', initializeSellPage);
