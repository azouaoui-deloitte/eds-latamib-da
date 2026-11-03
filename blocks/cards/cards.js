import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

/** "Sale & Acquisitions" -> "SA" (watermark letters of the service cards) */
function initials(text) {
  return text.split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .map((w) => w[0].toUpperCase())
    .join('')
    .slice(0, 3);
}

function decorateService(li) {
  const heading = li.querySelector('h1, h2, h3, h4, h5, h6');
  if (heading) {
    const mark = document.createElement('span');
    mark.className = 'cards-card-watermark';
    mark.setAttribute('aria-hidden', 'true');
    mark.textContent = initials(heading.textContent);
    li.prepend(mark);
  }
}

function decorateTeamMember(li) {
  const link = li.querySelector('.cards-card-body a[href]');
  const image = li.querySelector('.cards-card-image');
  if (!link || !image) return;
  const contact = document.createElement('div');
  contact.className = 'cards-card-contact';
  const a = document.createElement('a');
  a.href = link.href;
  a.rel = 'nofollow';
  a.setAttribute('aria-label', link.textContent.trim());
  contact.append(a);
  image.append(contact);
}

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    if (/\.svg(\?|$)/i.test(img.getAttribute('src'))) return;
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  if (block.classList.contains('services')) ul.querySelectorAll(':scope > li').forEach(decorateService);
  if (block.classList.contains('team')) ul.querySelectorAll(':scope > li').forEach(decorateTeamMember);
  block.replaceChildren(ul);
}
