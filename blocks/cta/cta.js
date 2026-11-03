/**
 * Call to action banner: background image, heading and a button.
 * Rows: 1. background image  2. text (heading + ***button***)
 * @param {Element} block The cta block element
 */
export default function decorate(block) {
  const [imageRow, textRow] = [...block.children];
  if (imageRow?.querySelector('picture')) imageRow.classList.add('cta-background');
  textRow?.classList.add('cta-content');
}
