import { readFile, writeFile } from 'node:fs/promises';

const ocrPath = process.argv[2];
if (!ocrPath) throw new Error('Pass OCR JSON path');
const experts = JSON.parse(await readFile(new URL('../experts-data.json', import.meta.url), 'utf8'));
const ocr = JSON.parse(await readFile(ocrPath, 'utf8'));
const headings = /^(РЕГАЛИИ|ДОСТИЖЕНИЯ|ОПЫТ|КОМПЕТЕНЦИИ|ОТРАСЛИ):?$/i;

function lines(value = '') {
  return value.split('\n').map((line) => line.trim()).filter((line) => line && !headings.test(line) && line !== 'Д');
}

function bullets(value = '') {
  const result = [];
  for (const line of lines(value)) {
    if (/^[•·-]/.test(line)) result.push(line.replace(/^[•·-]\s*/, ''));
    else if (result.length) result[result.length - 1] += ` ${line}`;
    else result.push(line);
  }
  return result;
}

for (const [index, expert] of experts.entries()) {
  const key = Object.keys(ocr).find((name) => name.startsWith(`expert-${String(index + 1).padStart(2, '0')}-profile-1.`));
  const source = key ? ocr[key] : null;
  expert.profile = source ? {
    credentials: bullets(source.credentials),
    achievements: bullets(source.achievements),
    experience: lines(source.experience),
    competencies: bullets(source.competencies),
    industries: bullets(source.industries),
    sourceCard: key,
  } : { credentials: [], achievements: [], experience: [], competencies: [], industries: [], sourceCard: null };
}

const ekaterina = experts.find((expert) => expert.name === 'Егорова Екатерина');
if (ekaterina) {
  ekaterina.role = 'Сооснователь НАСС; AI Product Manager & Business Analyst; Product Owner внутренних цифровых и AI-enabled платформ';
  ekaterina.profile = {
    summary: 'Бизнес-аналитик и Product Owner с опытом более 8 лет в бизнес-анализе, улучшении процессов, product delivery и организационных изменениях в банковской, fintech- и корпоративной среде. Переводит сложные операционные задачи в работающие цифровые продукты — от discovery и требований до внедрения и развития.',
    credentials: [
      'Сооснователь и эксперт НАСС — консультирование стартапов и технологических компаний по бизнес-процессам и подготовке кейсов к банковскому пилотированию',
      'Методолог Skillbox, курс «Профессия — бизнес-аналитик»',
      'Преподаватель РАНХиГС, курс «Анализ инвестиционных проектов»',
      'Магистр информационных систем, GPA 5,0/5,0; выпускная работа вошла в число двух лучших работ выпуска',
    ],
    achievements: [
      'Спроектировала и за три месяца создала StaffMap — платформу управления ресурсами и портфелем для департамента из 95 сотрудников',
      'Создала связанную экосистему BA Academy + Assessment для оценки, развития компетенций и профессионального сообщества',
      'Разработала AI-инструменты качества требований: Epic Validator и Backlog Builder',
      'Автоматизировала EOW-отчётность для 45 сотрудников и трёх лидов, сократив подготовку с рабочего дня до одного часа',
      'Разработала шестиэтапную методику реинжиниринга, апробированную более чем на 20 банковских процессах',
    ],
    experience: [
      'С 2025 года — AI Product Manager & Business Analyst в департаменте Agile-трансформации крупной корпоративной финансовой организации',
      '2024–2025 — Business Analyst & Product Owner: трансформация B2B-сервиса и банковского бэк-офиса',
      'Предыдущий опыт — корпоративные инновации, технологический бренд, акселерационные программы и запуск цифровых продуктов в production',
    ],
    competencies: ['Business Analysis', 'Product Ownership', 'Product Discovery', 'Requirements Engineering', 'Process Improvement', 'AI Product Development', 'Internal Platforms', 'Operational Transformation', 'Change Management'],
    industries: ['Banking', 'FinTech', 'HRTech', 'EdTech', 'Enterprise AI', 'Internal Tools', 'Corporate Innovation'],
    sourceCard: 'expert-19-profile-1.png',
    links: [
      { label: 'Профессиональный сайт', url: 'https://ekaterinaegorova.com' },
      { label: 'LinkedIn', url: 'https://linkedin.com/in/kateegorova' },
    ],
  };
}

const verifiedProfiles = {
  'Семён Фомин': {
    summary: 'Предприниматель, бизнес-диагностик и ментор технологических компаний. Помогает командам проверять рыночные гипотезы, выстраивать масштабирование и готовиться к работе с корпорациями и инвесторами.',
    credentials: ['Сооснователь НАСС', 'Ментор Фонда «Сколково», ФРИИ, МТС и Центра предпринимательства', 'Управляющий партнёр экспертной платформы «СОВЕТ#1»', 'Лидер FinTech-трека стартап-клуба «Деловой России»', 'Кандидат технических наук, MBA'],
    achievements: ['Лидировал проекты цифровой трансформации для Газпромбанка, Россельхозбанка и Совкомбанка в совместных программах с Фондом «Сколково»', 'Модерировал банковские секции Газпромбанка и ВТБ на Startup Village', 'Участвует в экспертных советах технологических конкурсов и развитии менторских программ'],
    experience: ['Предпринимательство, бизнес-консалтинг и развитие технологических компаний', 'Диагностика бизнес-моделей, постановка долгосрочных целей и поиск сценариев масштабирования', 'Модерация групповых разборов и ко-менторинговых сессий'],
    competencies: ['Бизнес-диагностика', 'Масштабирование', 'Business Development', 'Менторинг', 'Питчинг', 'Корпоративные инновации'],
    industries: ['FinTech', 'Banking', 'IT', 'Technology Startups'],
    links: [{ label: 'Профиль TechFounders', url: 'https://techfounders.ru/2025/authors/19488' }, { label: 'Молтен Консалтинг', url: 'https://molten-consulting.com/' }],
  },
  'Васильев Сергей': {
    summary: 'Венчурный инвестор, трекер и ментор стартапов и действующего бизнеса с многолетним опытом сопровождения проектов от идеи до масштабирования.',
    credentials: ['Венчурный партнёр Friendly VC и YellowRockets', 'Ассоциированный партнёр O2Consulting по корпоративным инновациям', 'Ментор Фонда «Сколково»', 'Победитель премии «Трекер года 2024» в номинации «Вклад в развитие профессии трекера»'],
    achievements: ['Более 200 проектов — от стадии идеи до компаний с выручкой до 6 млрд рублей в год', 'Более 5 лет практики в качестве трекера и ментора', '16 лет опыта в сфере венчурных инвестиций'],
    experience: ['Венчурные инвестиции и работа с портфельными компаниями', 'Корпоративные акселераторы и инновационные программы', 'Трекинг стартапов и действующего бизнеса'],
    competencies: ['Венчурные инвестиции', 'Трекинг', 'Масштабирование', 'Корпоративные инновации', 'Инвестиционная готовность'],
    industries: ['Venture Capital', 'Technology Startups', 'Corporate Innovation'],
    links: [{ label: 'O2Consulting', url: 'https://o2consulting.ru/tpost/5ureg17ft1-sergei-vasilev-laureat-premii-treker-god' }, { label: 'Профиль Сколково', url: 'https://skfinance.events.sk.ru/' }],
  },
  'Абрамкин Александр': {
    summary: 'Консультант по организационному развитию, стратегическому HR и формированию управленческих команд в IT и высокотехнологичных отраслях.',
    credentials: ['Основатель HeadExpert', 'Инженерное образование и степень MBA', 'Квалификация независимого директора и бизнес-тренера', 'Бывший председатель HR-клуба АПКИТ и член Совета ТПП РФ по развитию IT и цифровой экономики'],
    achievements: ['Более 300 проектов для российских и международных компаний', 'Клиенты и проекты: IBM, SAP, Konica Minolta, Phoenix Contact, Merlion, Polymedia, Т1 и Avito', 'Развитие одного из крупнейших профессиональных HR-сообществ российского IT-рынка'],
    experience: ['Организационное развитие и стратегический HR-консалтинг', 'Формирование управленческих команд', 'Исследовательские и аналитические проекты', 'Работа в консультативных советах компаний'],
    competencies: ['Организационное развитие', 'Стратегический HR', 'Executive Search', 'Управленческие команды', 'Независимый директор'],
    industries: ['IT', 'High Tech', 'Professional Services'],
    links: [{ label: 'Профиль Forbes Congress', url: 'https://fcongress.forbes.ru/spikeryi/aleksandr-abramkin' }],
  },
  'Токтамысов Даурен': {
    summary: 'Финансист, инвестор и руководитель с опытом корпоративных финансов, инвестиционных проектов и работы в советах директоров.',
    credentials: ['Председатель Совета директоров АО «Кофейни Даблби»', 'Партнёр ARTFCT.VC', 'Бывший CFO ВЭБ Инжиниринг, UFG и ЛУКОЙЛ'],
    achievements: [],
    experience: ['Корпоративные финансы и финансовое управление', 'Инвестиции и работа с портфельными компаниями', 'Корпоративное управление и советы директоров'],
    competencies: ['Финансы', 'Инвестиции', 'Corporate Governance', 'CFO Advisory', 'Стратегия'],
    industries: ['Finance', 'Venture Capital', 'Retail & HoReCa', 'Oil & Gas'],
    links: [],
  },
  'Филоненко Георгий': {
    summary: 'IT-руководитель, troubleshooter, ментор и коуч. Помогает техническим лидерам и начинающим управленцам переводить бизнес-задачи на язык разработки и выстраивать устойчивые IT-команды.',
    credentials: ['Руководитель направления web-разработки в «Газпромнефть — Региональные продажи»', 'Более 18 лет в IT', 'Прошёл путь от системного администратора и backend-разработчика до руководителя'],
    achievements: [],
    experience: ['Проектирование, масштабирование и развитие IT-подразделений', 'Backend-разработка и техническое руководство', 'Менторинг лидеров команд и начинающих управленцев', 'Диагностика проблем в процессах и технологических системах'],
    competencies: ['IT Management', 'Leadership', 'Business Mindset', 'Coaching', 'Troubleshooting', 'Backend'],
    industries: ['IT', 'Energy', 'Enterprise Technology'],
    links: [{ label: 'GetMentor', url: 'https://getmentor.dev/mentor/georgiy-filonenko-2555' }, { label: 'Хабр', url: 'https://habr.com/ru/users/calm_archer/' }],
  },
};

for (const expert of experts) {
  if (verifiedProfiles[expert.name]) expert.profile = { ...verifiedProfiles[expert.name], sourceCard: null };
}

await writeFile(new URL('../experts-data.json', import.meta.url), `${JSON.stringify(experts, null, 2)}\n`);
await writeFile(new URL('../experts-data.js', import.meta.url), `window.NASS_EXPERTS = ${JSON.stringify(experts, null, 2)};\n`);
console.log(`Merged structured profiles for ${experts.filter((expert) => expert.profile.sourceCard).length}/${experts.length} experts.`);
