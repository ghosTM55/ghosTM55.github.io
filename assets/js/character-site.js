import { mountEnSite } from './character/bootstrap.js?v=fe795a3070be';

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  document.body.classList.remove('is-preload');
  mountEnSite();
}
