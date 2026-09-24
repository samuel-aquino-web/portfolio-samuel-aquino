const services = {
  pintura: {
    kind: 'PINTURA / REFLEXO',
    title: 'O brilho começa<br>na superfície.',
    description: 'Avaliação da pintura, correção de marcas superficiais e polimento para recuperar profundidade e nitidez dos reflexos.',
    action: 'PEDIR AVALIAÇÃO DE PINTURA',
    booking: 'Correção de pintura',
    number: '01'
  },
  protecao: {
    kind: 'PROTEÇÃO / ACABAMENTO',
    title: 'Cuidado que<br>permanece.',
    description: 'Preparação da superfície e aplicação de proteção cerâmica para facilitar a manutenção e preservar o acabamento.',
    action: 'PEDIR AVALIAÇÃO DE PROTEÇÃO',
    booking: 'Proteção cerâmica',
    number: '02'
  },
  interior: {
    kind: 'INTERIOR / CONFORTO',
    title: 'Outra sensação<br>ao entrar.',
    description: 'Limpeza detalhada de superfícies e materiais internos, com atenção aos lugares que a rotina costuma esquecer.',
    action: 'PEDIR AVALIAÇÃO DO INTERIOR',
    booking: 'Interior completo',
    number: '03'
  }
};

const $ = selector => document.querySelector(selector);
const tabs = [...document.querySelectorAll('.service-tab')];
const bookingChoices = [...document.querySelectorAll('input[name="service"]')];
const menuToggle = $('#menu-toggle');
const menu = $('#main-nav');

function selectService(key, focus = false) {
  const service = services[key];
  if (!service) return;
  tabs.forEach(tab => {
    const selected = tab.dataset.service === key;
    tab.classList.toggle('active', selected);
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected && focus) tab.focus();
  });
  $('#service-panel').setAttribute('aria-labelledby', `tab-${key}`);
  $('#service-kind').textContent = service.kind;
  $('#service-title').innerHTML = service.title;
  $('#service-description').textContent = service.description;
  $('#service-cta').firstChild.textContent = `${service.action} `;
  $('#service-image-label').textContent = `O CUIDADO DE PERTO / ${service.number}`;
  bookingChoices.forEach(choice => { choice.checked = choice.value === service.booking; });
}

tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectService(tab.dataset.service));
  tab.addEventListener('keydown', event => {
    let target = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') target = (index + 1) % tabs.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') target = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === 'Home') target = 0;
    else if (event.key === 'End') target = tabs.length - 1;
    else return;
    event.preventDefault();
    selectService(tabs[target].dataset.service, true);
  });
});

document.querySelectorAll('[data-service-link]').forEach(link => {
  link.addEventListener('click', () => selectService(link.dataset.serviceLink));
});

const compareRange = $('#compare-range');
const compareFrame = $('#compare-frame');
function updateComparison() {
  compareFrame.style.setProperty('--split', `${compareRange.value}%`);
  compareRange.setAttribute('aria-valuetext', `${compareRange.value}% da imagem antes visível`);
}
compareRange.addEventListener('input', updateComparison);
updateComparison();
let draggingComparison = false;
function setComparisonFromPointer(event) {
  const bounds = compareFrame.getBoundingClientRect();
  const value = Math.max(0, Math.min(100, Math.round((event.clientX - bounds.left) / bounds.width * 100)));
  compareRange.value = String(value);
  updateComparison();
}
compareFrame.addEventListener('pointerdown', event => {
  if (event.pointerType === 'mouse' && event.button !== 0) return;
  draggingComparison = true;
  compareFrame.setPointerCapture(event.pointerId);
  setComparisonFromPointer(event);
});
compareFrame.addEventListener('pointermove', event => {
  if (draggingComparison) setComparisonFromPointer(event);
});
compareFrame.addEventListener('pointerup', () => { draggingComparison = false; });
compareFrame.addEventListener('pointercancel', () => { draggingComparison = false; });

menuToggle.addEventListener('click', () => {
  const open = menu.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});
menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  menu.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
}));
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape' || !menu.classList.contains('is-open')) return;
  menu.classList.remove('is-open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
  menuToggle.focus();
});

$('#booking-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const note = $('#form-note');
  note.textContent = 'Solicitação simulada com sucesso. Nenhum dado foi enviado ou armazenado.';
  note.classList.add('success');
  form.reset();
  selectService(document.querySelector('.service-tab.active').dataset.service);
});

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.07 });
  document.body.classList.add('js-ready');
  items.forEach(item => observer.observe(item));
}
