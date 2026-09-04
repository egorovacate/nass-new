const categoryRules = {
  strategy: /стратег|управлен|advisory|развити/i,
  finance: /финанс|инвест|венчур|cfo|бюджет/i,
  innovation: /инновац|технолог|цифров|стартап/i,
  team: /команд|hr|персонал|лидер|коуч/i
};
const preferredGroups = new Set(['Члены Правления', 'Экспертный совет']);
const expertPool = (window.NASS_EXPERTS || []).filter((expert) => preferredGroups.has(expert.group) && expert.image);
const featuredExperts = ['Члены Правления', 'Экспертный совет'].flatMap((group) => expertPool.filter((expert) => expert.group === group).slice(0, 3));
const experts = featuredExperts.map((expert) => {
  const profile = expert.profile || {};
  const text = [expert.role, ...(profile.competencies || []), ...(profile.industries || [])].join(' ');
  const category = Object.entries(categoryRules).filter(([, rule]) => rule.test(text)).map(([name]) => name);
  const role = expert.role.replace(/\s*;\s*/g, '; ').replace(/,\s*/g, ', ').replace(/;\s*$/g, '').trim();
  return { ...expert, role, category: category.length ? category : ['strategy'], tags: (profile.competencies || []).slice(0, 2) };
});

const grid = document.querySelector('#expert-grid');
const empty = document.querySelector('#empty-state');

function renderExperts() {
  if (!grid || !empty) return;
  const visible = experts;
  grid.innerHTML = visible.map((expert) => `
    <article class="expert-card reveal-card">
      <div class="expert-portrait"><img src="./assets/experts/${expert.image}" alt="${expert.name}" loading="lazy"></div>
      <div class="expert-content"><p>${expert.group}</p><h3>${expert.name}</h3><p class="expert-description">${expert.role}</p><div class="expert-tags">${expert.tags.map((tag) => `<span>${tag}</span>`).join('')}</div><a class="expert-profile-link" href="./experts.html?expert=${encodeURIComponent(expert.name)}">Профиль эксперта <span>↗</span></a></div>
    </article>`).join('');
  empty.hidden = visible.length > 0;
}

renderExperts();

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  }), { threshold: 0.12 });
  document.querySelectorAll('.reveal, section').forEach((element) => observer.observe(element));
} else {
  document.querySelectorAll('.reveal, section').forEach((element) => element.classList.add('is-visible'));
}
