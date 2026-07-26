export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  el.classList.add('lv-highlight');
  window.setTimeout(() => el.classList.remove('lv-highlight'), 1000);
}
