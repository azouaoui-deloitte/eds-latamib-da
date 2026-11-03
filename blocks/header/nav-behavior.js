/*
 * Header interactions, bound on the rendered `nav#nav` (EDS header block or the server-rendered
 * header Experience Fragment). Self-contained: also shipped as the AEM clientlib-site nav.js.
 *  - current page link (underline), drawer (tablet / mobile), search panel, Escape,
 *  - sticky bar once the header has scrolled out of view (desktop >= 1025px).
 */
export default function initNav(nav) {
  if (!nav || nav.dataset.navBound) return;
  nav.dataset.navBound = 'true';
  const isDesktop = window.matchMedia('(min-width: 1025px)');
  const wrapper = nav.closest('.nav-wrapper') || nav.parentElement;
  const header = nav.closest('header') || wrapper;

  const normalizePath = (href) => {
    const { pathname } = new URL(href, window.location);
    return pathname.replace(/\.html$/, '').replace(/\/index$/, '/').replace(/(.)\/$/, '$1');
  };
  const current = normalizePath(window.location.href);
  nav.querySelectorAll('.nav-sections li').forEach((li) => {
    const a = li.querySelector('a[href]');
    if (!a || new URL(a.href, window.location).origin !== window.location.origin) return;
    const active = normalizePath(a.href) === current;
    li.classList.toggle('active', active);
    if (active) a.setAttribute('aria-current', 'page');
  });

  const hamburger = nav.querySelector('.nav-hamburger button');
  const toggleDrawer = (open) => {
    const expanded = open ?? nav.getAttribute('aria-expanded') !== 'true';
    nav.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    hamburger?.setAttribute('aria-label', expanded ? 'Close navigation' : 'Open navigation');
    document.body.classList.toggle('nav-open', expanded);
    if (expanded) nav.querySelector('.nav-close')?.focus();
  };

  const search = nav.querySelector('.nav-search');
  const toggleSearch = (open) => {
    if (!search) return;
    const expanded = open ?? search.getAttribute('aria-expanded') !== 'true';
    search.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    search.querySelector('.nav-search-toggle')?.setAttribute('aria-label', expanded ? 'Close search' : 'Search');
    if (expanded) search.querySelector('input')?.focus();
  };

  hamburger?.addEventListener('click', () => toggleDrawer());
  nav.querySelector('.nav-close')?.addEventListener('click', () => toggleDrawer(false));
  nav.querySelector('.nav-overlay')?.addEventListener('click', () => toggleDrawer(false));
  search?.querySelector('.nav-search-toggle')?.addEventListener('click', () => toggleSearch());
  window.addEventListener('keydown', (e) => {
    if (e.code !== 'Escape') return;
    if (nav.getAttribute('aria-expanded') === 'true') toggleDrawer(false);
    toggleSearch(false);
  });
  isDesktop.addEventListener('change', () => { toggleDrawer(false); toggleSearch(false); });

  // threshold measured while not stuck: a fixed bar no longer contributes to the header height
  let threshold = header.offsetHeight;
  const onScroll = () => {
    if (!wrapper.classList.contains('is-stuck')) threshold = header.offsetHeight || threshold;
    wrapper.classList.toggle('is-stuck', isDesktop.matches && window.scrollY > threshold);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
