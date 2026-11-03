import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import initFooter from './footer-behavior.js';

const AREAS = ['footer-logo', 'footer-menu', 'footer-contact', 'footer-legal'];

/**
 * Contact section: each item starts with an icon paragraph (`:globe:`, `:phone:`),
 * followed by its title and text.
 */
function decorateContact(section) {
  const wrapper = section.querySelector('.default-content-wrapper') || section;
  const items = [];
  [...wrapper.children].forEach((el) => {
    const isIcon = el.tagName === 'P' && el.querySelector('.icon') && !el.textContent.trim();
    if (isIcon || !items.length) {
      const item = document.createElement('div');
      item.className = 'footer-contact-item';
      items.push(item);
    }
    if (isIcon) el.classList.add('footer-contact-icon');
    items[items.length - 1].append(el);
  });
  const cols = items.map((item) => {
    const col = document.createElement('div');
    col.className = 'footer-contact-col';
    const text = document.createElement('div');
    text.className = 'footer-contact-text';
    [...item.children].filter((c) => !c.classList.contains('footer-contact-icon')).forEach((c) => text.append(c));
    item.append(text);
    col.append(item);
    return col;
  });
  wrapper.replaceChildren(...cols);
}

/** footer built from the footer document (Edge Delivery / DA): logo, menu, contact, legal */
async function buildFooter(footerPath) {
  const fragment = await loadFragment(footerPath);
  if (!fragment) return null;
  const inner = document.createElement('div');
  inner.className = 'footer-inner';
  [...fragment.querySelectorAll(':scope > .section')].forEach((section, i) => {
    if (AREAS[i]) section.classList.add(AREAS[i]);
    if (AREAS[i] === 'footer-contact') decorateContact(section);
    inner.append(section);
  });
  return inner;
}

/**
 * Server-rendered footer of an AEM Experience Fragment (latamib/components/footer):
 * the `.footer-inner` of the XF variation content.
 */
async function loadExperienceFragment(path) {
  try {
    const resp = await fetch(`${path.replace(/\.html$/, '')}.content.html?wcmmode=disabled`);
    if (!resp.ok) return null;
    const doc = new DOMParser().parseFromString(await resp.text(), 'text/html');
    const inner = doc.querySelector('.footer-inner');
    return inner ? document.adoptNode(inner) : null;
  } catch {
    return null;
  }
}

/**
 * Latam IB footer: the footer Experience Fragment (AEM footer component) set in the `footer`
 * metadata; otherwise the footer document. Markup already server-rendered in the block is
 * only bound.
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  let inner = block.querySelector('.footer-inner');
  if (!inner) {
    const footerMeta = getMetadata('footer');
    // default: footer document of the current directory (/footer on Edge,
    // /content/latamib/en/footer on AEM)
    const footerPath = footerMeta
      ? new URL(footerMeta, window.location).pathname
      : `${window.location.pathname.replace(/\/[^/]*$/, '')}/footer`;
    inner = (footerPath.includes('/experience-fragments/') && await loadExperienceFragment(footerPath))
      || await buildFooter(footerPath);
    block.textContent = '';
    if (!inner) return;
    block.append(inner);
  }
  initFooter(inner);
}
