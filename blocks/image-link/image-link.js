import { moveInstrumentation } from '../../scripts/scripts.js';

/**
 * Image link: an image that links to a page (Experience infographic -> Clients).
 * Rows: 1. image  2. link
 * @param {Element} block The image-link block element
 */
export default function decorate(block) {
  const picture = block.querySelector('picture');
  const link = block.querySelector('a[href]');
  if (!picture) return;
  const figure = document.createElement('div');
  figure.className = 'image-link-media';
  if (link) {
    const a = document.createElement('a');
    a.href = link.href;
    a.title = link.title || link.textContent.trim();
    moveInstrumentation(link, a);
    a.append(picture);
    figure.append(a);
  } else {
    figure.append(picture);
  }
  const [firstRow] = block.children;
  moveInstrumentation(firstRow, figure);
  block.replaceChildren(figure);
}
