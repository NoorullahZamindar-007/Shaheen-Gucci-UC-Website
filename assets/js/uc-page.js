function getUcLanguage() {
  return typeof getCurrentLanguage === 'function' ? getCurrentLanguage() : 'en';
}

function getUcText(key, fallback = '') {
  const dictionary = translations[getUcLanguage()] || translations.en;
  return getNestedValue(dictionary, key) || fallback;
}

function formatUcPrice(price) {
  return `$${price.toFixed(2)}`;
}

function renderUcPackages() {
  const grid = document.getElementById('ucPackagesGrid');
  if (!grid) return;

  const buyLabel = getUcText('buttons.buyNow', 'Buy Now');
  const contactLabel = getUcText('buttons.contactUs', 'Contact Us');
  const discountLabel = getUcText('ucPage.discountLabel', 'Discount');

  grid.innerHTML = ucPackages.map((pkg) => `
    <div class="col-sm-6 col-xl-4">
      <article class="uc-card ${pkg.featured ? 'featured' : ''}">
        <div class="uc-card-top">
          <span class="uc-amount">${pkg.ucAmount} UC</span>
          ${pkg.discount ? `<span class="uc-discount">${discountLabel}: ${pkg.discount}</span>` : ''}
        </div>
        <div class="uc-price">${formatUcPrice(pkg.price)}</div>
        <p class="uc-card-note">${getUcText('ucPage.cardNote', 'Quick contact support and fast order confirmation.')}</p>
        <div class="uc-card-actions">
          <a href="contact.html" class="btn btn-info offer-cta">${buyLabel}</a>
          <a href="contact.html" class="btn btn-outline-light offer-cta secondary">${contactLabel}</a>
        </div>
      </article>
    </div>
  `).join('');
}

function initializeUcPage() {
  if (!document.getElementById('ucPackagesGrid')) return;
  renderUcPackages();
  document.addEventListener('languageChanged', renderUcPackages);
}

document.addEventListener('DOMContentLoaded', initializeUcPage);
