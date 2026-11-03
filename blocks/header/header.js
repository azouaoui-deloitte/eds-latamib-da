import { getMetadata } from '../../scripts/aem.js';
import { getContentRoot } from '../../scripts/scripts.js';
import { loadFragment } from '../fragment/fragment.js';
import initNav from './nav-behavior.js';

/**
 * Nav document (`nav` page / DA document), one section per area:
 *  1. brand: desktop logo image, mobile logo image
 *  2. sections: list of links (main menu)
 *  3. tools: icon links, e.g. `:linkedin:` (social) and `:search:` (search form action)
 */
function parseNav(fragment) {
  const [brand, sections, tools] = [...fragment.querySelectorAll(':scope > .section')];
  return {
    logos: brand ? [...brand.querySelectorAll('picture')] : [],
    brandLink: brand?.querySelector('a[href]'),
    menu: sections?.querySelector('ul'),
    tools: tools ? [...tools.querySelectorAll('a[href]')] : [],
    sections: [brand, sections, tools],
  };
}

function buildSearch(link) {
  const url = new URL(link.href);
  const param = [...url.searchParams.keys()][0] || 's';
  const search = document.createElement('div');
  search.className = 'nav-search';
  search.setAttribute('aria-expanded', 'false');
  search.innerHTML = `<button type="button" class="nav-search-toggle" aria-label="Search"></button>
    <div class="nav-search-panel">
      <form role="search" method="get" action="${url.origin}${url.pathname}">
        <label><span class="nav-sr-only">Search for:</span>
          <input type="search" name="${param}" placeholder="Search …" autocomplete="off"></label>
        <button type="submit" aria-label="Submit search"></button>
      </form>
    </div>`;
  return search;
}

/** header built from the nav document (Edge Delivery / DA) */
async function buildNav(navPath) {
  const fragment = await loadFragment(navPath);
  if (!fragment) return null;
  const parsed = parseNav(fragment);

  const nav = document.createElement('nav');
  nav.id = 'nav';
  nav.setAttribute('aria-expanded', 'false');
  nav.setAttribute('aria-label', 'Main');

  const brand = document.createElement('div');
  brand.className = 'nav-brand';
  const home = document.createElement('a');
  home.href = parsed.brandLink?.href || parsed.menu?.querySelector('a[href]')?.href || `${getContentRoot()}/`;
  home.setAttribute('aria-label', 'Home');
  parsed.logos.forEach((pic, i) => {
    pic.classList.add(i === 0 ? 'nav-logo-desktop' : 'nav-logo-mobile');
    pic.querySelector('img')?.setAttribute('loading', 'eager');
    home.append(pic);
  });
  if (parsed.logos.length === 1) parsed.logos[0].classList.add('nav-logo-mobile');
  brand.append(home);

  const sections = document.createElement('div');
  sections.className = 'nav-sections';
  sections.id = 'nav-sections';
  const close = document.createElement('button');
  close.type = 'button';
  close.className = 'nav-close';
  close.setAttribute('aria-label', 'Close navigation');
  sections.append(close);
  if (parsed.menu) sections.append(parsed.menu);

  const tools = document.createElement('div');
  tools.className = 'nav-tools';
  parsed.tools.forEach((a) => {
    const icon = a.querySelector('.icon');
    const name = icon ? [...icon.classList].find((c) => c.startsWith('icon-') && c !== 'icon')?.substring(5) : '';
    if (name === 'search') {
      tools.append(buildSearch(a));
      return;
    }
    a.className = `nav-social nav-social-${name || 'link'}`;
    if (!a.getAttribute('aria-label')) a.setAttribute('aria-label', a.title || name);
    tools.append(a);
  });
  const hamburger = document.createElement('div');
  hamburger.className = 'nav-hamburger';
  hamburger.innerHTML = '<button type="button" aria-controls="nav-sections" aria-label="Open navigation"><span class="nav-hamburger-icon"></span></button>';
  tools.append(hamburger);

  const overlay = document.createElement('div');
  overlay.className = 'nav-overlay';
  nav.append(brand, sections, tools, overlay);

  // keep the Universal Editor instrumentation of the nav sections on their rendered areas
  [brand, sections, tools].forEach((area, i) => {
    const src = parsed.sections[i];
    if (!src) return;
    [...src.attributes].filter(({ name }) => name.startsWith('data-aue-')).forEach(({ name, value }) => area.setAttribute(name, value));
  });

  const wrapper = document.createElement('div');
  wrapper.className = 'nav-wrapper';
  wrapper.append(nav);
  return wrapper;
}

/**
 * Server-rendered header of an AEM Experience Fragment (latamib/components/header):
 * the `.nav-wrapper` of the XF variation content.
 */
async function loadExperienceFragment(path) {
  try {
    const resp = await fetch(`${path.replace(/\.html$/, '')}.content.html?wcmmode=disabled`);
    if (!resp.ok) return null;
    const doc = new DOMParser().parseFromString(await resp.text(), 'text/html');
    const wrapper = doc.querySelector('.nav-wrapper');
    return wrapper ? document.adoptNode(wrapper) : null;
  } catch {
    return null;
  }
}

/**
 * Latam IB header: the header Experience Fragment (AEM header component) set in the `nav`
 * metadata; otherwise the nav document. Markup already server-rendered in the block is only bound.
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  let nav = block.querySelector('nav#nav');
  if (!nav) {
    const navMeta = getMetadata('nav');
    // default: nav document of the current directory (/nav on Edge, /content/latamib/en/nav on AEM)
    const navPath = navMeta
      ? new URL(navMeta, window.location).pathname
      : `${window.location.pathname.replace(/\/[^/]*$/, '')}/nav`;
    const wrapper = (navPath.includes('/experience-fragments/') && await loadExperienceFragment(navPath))
      || await buildNav(navPath);
    block.textContent = '';
    if (!wrapper) return;
    block.append(wrapper);
    nav = wrapper.querySelector('nav#nav');
  }
  initNav(nav);
}
