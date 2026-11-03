/**
 * Hero: full-width background image, a heading and a call-to-action
 * (replaces the single-slide Revolution Slider of latamib.com).
 * Rows: 1. image  2. text (heading + **button**)
 * @param {Element} block The hero block element
 */
export default function decorate(block) {
  const [imageRow, textRow] = [...block.children];
  imageRow?.classList.add('hero-image');
  textRow?.classList.add('hero-content');
  const img = imageRow?.querySelector('img');
  if (img) {
    img.loading = 'eager';
    img.fetchPriority = 'high';
  }
  // entrance animation of the source slider (title, then button), skipped in the editor
  if (!document.documentElement.classList.contains('adobe-ue-edit')
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    block.classList.add('hero-animate');
  }
}
