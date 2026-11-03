/*
 * Footer interactions, bound on the rendered `.footer-inner` (EDS footer block or the
 * server-rendered footer Experience Fragment): back-to-top button shown after 300px.
 * Self-contained: also shipped as the AEM clientlib-site footer.js.
 */
export default function initFooter(inner) {
  if (!inner || inner.dataset.footerBound) return;
  inner.dataset.footerBound = 'true';
  let button = inner.querySelector('.back-to-top');
  if (!button) {
    button = document.createElement('a');
    button.href = '#';
    button.className = 'back-to-top';
    button.setAttribute('aria-label', 'Back to top');
    inner.append(button);
  }
  button.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  const onScroll = () => button.classList.toggle('show', window.scrollY > 300);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
