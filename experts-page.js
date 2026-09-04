const root = document.querySelector('#people-root');
const search = document.querySelector('#people-search');
const modal = document.querySelector('#person-modal');
const groups = [...new Set(window.NASS_EXPERTS.map((expert) => expert.group))];

window.NASS_EXPERTS.forEach((expert) => {
  const profile = expert.profile || {};
  const fields = [
    expert.name, expert.role, profile.summary,
    ...(profile.credentials || []), ...(profile.achievements || []),
    ...(profile.experience || []), ...(profile.competencies || []),
    ...(profile.industries || []),
  ];
  expert._searchText = fields.filter(Boolean).join(' ').toLocaleLowerCase('ru');
});

function escapeHtml(value = '') {
  return value.replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[char]);
}

function cleanProfileText(value = '') {
  return value.replace(/^\s*[•·▪◦‣●○◆◇►▸*-]+\s*/, '').replace(/\s*[•·▪◦‣●○◆◇►▸]+\s*/g, ' ').replace(/\s+([,.;:!?])/g, '$1').replace(/([;:])(?=\S)/g, '$1 ').replace(/,(?=\S)/g, (match, offset, str) => (/\d/.test(str[offset - 1]) && /\d/.test(str[offset + 1])) ? ',' : ', ').replace(/\s{2,}/g, ' ').replace(/;\s*;+/g, ';').trim();
}

function cleanRole(value = '') {
  return cleanProfileText(value).replace(/\s*;\s*;+/g, '; ').replace(/\s*\/\s*/g, ' / ').replace(/;\s*$/g, '').replace(/\s{2,}/g, ' ').trim();
}

function normalizeProfileItems(items = []) {
  const prepared = items.map((rawValue) => cleanProfileText(String(rawValue || '').trim())).filter(Boolean);
  return [...new Set(prepared)];
}

function render() {
  const query = search.value.trim().toLocaleLowerCase('ru');
  root.innerHTML = groups.map((group) => {
    const people = window.NASS_EXPERTS.filter((expert) => expert.group === group && expert._searchText.includes(query));
    if (!people.length) return '';
    return `<section class="people-group"><h2>${group}</h2><div class="people-grid">${people.map((expert) => `<button class="person" type="button" data-name="${expert.name.replaceAll('"', '&quot;')}">${expert.image ? `<img src="./assets/experts/${expert.image}" alt="${expert.name}" loading="lazy">` : `<span class="person-mark">${expert.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>`}<h3>${expert.name}</h3><p>${cleanRole(expert.role)}</p><span class="person-more">Подробнее ↗</span></button>`).join('')}</div></section>`;
  }).join('');
  if (!root.innerHTML) root.innerHTML = '<p class="empty-state">По этому запросу никого не найдено.</p>';
}

root.addEventListener('click', (event) => {
  const card = event.target.closest('.person');
  if (!card) return;
  const expert = window.NASS_EXPERTS.find((item) => item.name === card.dataset.name);
  const profile = expert.profile || {};
  const section = (title, items) => {
    const normalizedItems = normalizeProfileItems(items);
    return normalizedItems.length ? `<section class="profile-section"><h3>${title}</h3><ul>${normalizedItems.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></section>` : '';
  };
  modal.querySelector('.modal-media').innerHTML = expert.image ? `<img src="./assets/experts/${expert.image}" alt="${expert.name}">` : `<span class="person-mark">${expert.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</span>`;
  modal.querySelector('.modal-copy').innerHTML = `
    <p class="section-index">${expert.group}</p><h2>${expert.name}</h2>
    <p class="modal-role">${cleanRole(expert.role)}</p>
    ${profile.summary ? `<p class="profile-summary">${profile.summary}</p>` : ''}
    <div class="profile-grid">
      ${section('Регалии и профессиональные роли', profile.credentials)}
      ${section('Ключевые достижения', profile.achievements)}
      ${section('Опыт', profile.experience)}
      ${section('Компетенции', profile.competencies)}
      ${section('Отрасли', profile.industries)}
    </div>
    <div class="profile-links">
      ${(profile.links || []).map((link) => `<a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.label} ↗</a>`).join('')}
      ${profile.sourceCard ? `<a href="./assets/expert-profiles/${profile.sourceCard}" target="_blank">Оригинальная карточка ↗</a>` : ''}
      <a href="mailto:info@addwisors.ru?subject=Консультация с ${encodeURIComponent(expert.name)}">Обсудить консультацию →</a>
    </div>`;
  modal.showModal();
});
modal.addEventListener('click', (event) => { if (event.target === modal || event.target.closest('.modal-close')) modal.close(); });
search.addEventListener('input', render);
render();

const requestedExpert = new URLSearchParams(window.location.search).get('expert');
if (requestedExpert) {
  const requestedCard = [...root.querySelectorAll('.person')].find((card) => card.dataset.name === requestedExpert);
  requestedCard?.click();
}
