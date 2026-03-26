const componentCache = new Map();

async function fetchComponentTemplate(name) {
  if (componentCache.has(name)) return componentCache.get(name);
  const response = await fetch(`${window.SG_COMPONENT_BASE || ''}components/${name}.html`);
  if (!response.ok) throw new Error(`Failed to load component: ${name}`);
  const html = await response.text();
  componentCache.set(name, html);
  return html;
}

function applyTemplateVariables(template, variables = {}) {
  return Object.entries(variables).reduce((output, [key, value]) => {
    return output.replaceAll(`{{${key}}}`, value ?? '');
  }, template);
}

function getActiveStateMap(activePage) {
  const pages = ['HOME', 'MARKETPLACE', 'UC', 'SELL', 'CONTACT', 'ABOUT'];
  return pages.reduce((map, key) => {
    map[`${key}_ACTIVE`] = key === activePage ? 'active' : '';
    return map;
  }, {});
}

async function injectPartial(target, componentName, variables = {}) {
  const template = await fetchComponentTemplate(componentName);
  target.innerHTML = applyTemplateVariables(template, variables);
}

async function loadSharedLayout(options = {}) {
  const base = options.base || '';
  const activePage = options.activePage || '';
  const navbarTarget = document.querySelector('[data-shared-navbar]');
  const footerTarget = document.querySelector('[data-shared-footer]');

  if (navbarTarget) {
    await injectPartial(navbarTarget, 'navbar', { BASE: base, ...getActiveStateMap(activePage) });
    const languagePlaceholder = navbarTarget.querySelector('[data-component-placeholder="language-switcher"]');
    if (languagePlaceholder) await injectPartial(languagePlaceholder, 'language-switcher');
  }

  if (footerTarget) {
    await injectPartial(footerTarget, 'footer', { BASE: base });
  }
}

async function renderTemplate(componentName, variables = {}) {
  const template = await fetchComponentTemplate(componentName);
  return applyTemplateVariables(template, variables);
}

window.ShaheenComponents = {
  loadSharedLayout,
  renderTemplate,
  applyTemplateVariables
};
