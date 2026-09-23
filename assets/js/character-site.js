import { mountEnSite } from './character/bootstrap.js?v=b22fc17de69c';

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  document.body.classList.remove('is-preload');
  mountEnSite();
}
