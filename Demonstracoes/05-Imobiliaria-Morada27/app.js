const properties = [
  {
    id: 'horizonte', name: 'Casa Horizonte', title: 'Casa<br><em>Horizonte.</em>', short: 'HORIZONTE',
    kind: 'CASA · VENDA', location: 'VILA DAS ÁRVORES · CIDADE EXEMPLO',
    image: 'assets/casa-vidro.webp', imageAlt: 'Casa contemporânea com fachada de pedra, vidro e jardim',
    description: 'Arquitetura aberta para o jardim. Luz de fim de tarde e espaço para a rotina acontecer com calma.',
    detail: 'Ambientes integrados, materiais naturais e janelas generosas aproximam a casa do jardim. Um endereço imaginado para quem aprecia a luz mudando ao longo do dia e gosta de receber sem abrir mão da tranquilidade.',
    area: '186 m²', rooms: '3 quartos', parking: '2 vagas', price: 'R$ 1.280.000'
  },
  {
    id: 'aurora', name: 'Apartamento Aurora', title: 'Apartamento<br><em>Aurora.</em>', short: 'AURORA',
    kind: 'APARTAMENTO · VENDA', location: 'CENTRO ALTO · CIDADE EXEMPLO',
    image: 'assets/apartamento-cidade.webp', imageAlt: 'Sala de apartamento com janelas amplas e vista para a cidade',
    description: 'A cidade em perspectiva. Interiores acolhedores, linhas leves e o horizonte como parte da sala.',
    detail: 'Um apartamento imaginado para equilibrar a energia urbana e a pausa de chegar em casa. A sala se abre para a paisagem; luz, texturas quentes e circulação simples fazem cada ambiente parecer maior.',
    area: '112 m²', rooms: '2 quartos', parking: '2 vagas', price: 'R$ 780.000'
  },
  {
    id: 'patio', name: 'Casa do Pátio', title: 'Casa do<br><em>Pátio.</em>', short: 'PÁTIO',
    kind: 'CASA · ALUGUEL', location: 'JARDIM SUL · CIDADE EXEMPLO',
    image: 'assets/casa-patio.webp', imageAlt: 'Casa térrea com pátio verde, água e materiais naturais',
    description: 'Um refúgio urbano onde a natureza entra, a casa respira e os encontros acontecem ao ar livre.',
    detail: 'Pátio verde, materiais de toque natural e espaços de convivência que atravessam a fronteira entre dentro e fora. Um lugar fictício para desacelerar sem sair da cidade.',
    area: '164 m²', rooms: '3 quartos', parking: '2 vagas', price: 'R$ 6.400 /mês'
  }
];

const $ = selector => document.querySelector(selector);
const hero = $('.hero');
const heroPhoto = $('#hero-photo');
const selectorOptions = $('#selector-options');
const modal = $('#property-modal');
const modalPanel = $('.modal-panel');
const closeModalButton = $('#close-modal');
let activeIndex = 0;
let imageTimer;
let focusBeforeModal;

function renderSelector() {
  selectorOptions.innerHTML = properties.map((property, index) => `
    <button class="selector-option" type="button" data-select="${index}" aria-label="Destacar ${property.name}" aria-pressed="${index === activeIndex}">
      <img src="${property.image}" alt="" ${index ? 'loading="lazy"' : ''}>
      <span>${String(index + 1).padStart(2, '0')} / ${property.short}</span>
    </button>`).join('');
}

function showProperty(index) {
  const nextIndex = (index + properties.length) % properties.length;
  if (nextIndex === activeIndex) return;
  activeIndex = nextIndex;
  const property = properties[activeIndex];
  clearTimeout(imageTimer);
  hero.classList.add('is-changing');
  imageTimer = setTimeout(() => {
    heroPhoto.src = property.image;
    hero.classList.remove('is-changing');
  }, 170);
  $('#hero-number').textContent = String(activeIndex + 1).padStart(2, '0');
  $('#hero-location').innerHTML = '<svg class="icon" aria-hidden="true"><use href="#icon-pin"/></svg>' + property.location;
  $('#hero-title').innerHTML = property.title;
  $('#hero-description').textContent = property.description;
  $('#hero-facts').innerHTML = `<span>${property.area}</span><i></i><span>${property.rooms}</span><i></i><span>${property.parking}</span>`;
  $('#hero-price').textContent = property.price;
  selectorOptions.querySelectorAll('.selector-option').forEach((button, i) => button.setAttribute('aria-pressed', String(i === activeIndex)));
}

renderSelector();
selectorOptions.addEventListener('click', event => {
  const button = event.target.closest('[data-select]');
  if (button) showProperty(Number(button.dataset.select));
});
$('#previous-property').addEventListener('click', () => showProperty(activeIndex - 1));
$('#next-property').addEventListener('click', () => showProperty(activeIndex + 1));

function openModal(id) {
  const property = properties.find(item => item.id === id);
  if (!property) return;
  focusBeforeModal = document.activeElement;
  $('#modal-image').src = property.image;
  $('#modal-image').alt = property.imageAlt;
  $('#modal-kind').textContent = property.kind;
  $('#modal-title').textContent = property.name;
  $('#modal-location').textContent = property.location;
  $('#modal-description').textContent = property.detail;
  $('#modal-facts').innerHTML = `
    <div><strong>${property.area}</strong><span>ÁREA</span></div>
    <div><strong>${property.rooms.split(' ')[0]}</strong><span>QUARTOS</span></div>
    <div><strong>${property.parking.split(' ')[0]}</strong><span>VAGAS</span></div>`;
  $('#modal-price').textContent = property.price;
  const notice = $('#modal-notice');
  notice.textContent = 'Este é um projeto demonstrativo. Nenhum contato é enviado.';
  notice.classList.remove('success');
  modal.hidden = false;
  document.body.classList.add('modal-open');
  modalPanel.scrollTop = 0;
  closeModalButton.focus();
}

function closeModal() {
  if (modal.hidden) return;
  modal.hidden = true;
  document.body.classList.remove('modal-open');
  if (focusBeforeModal?.isConnected) focusBeforeModal.focus();
}

$('#hero-open').addEventListener('click', () => openModal(properties[activeIndex].id));
document.querySelectorAll('[data-open]').forEach(button => button.addEventListener('click', () => openModal(button.dataset.open)));
closeModalButton.addEventListener('click', closeModal);
$('.modal-backdrop').addEventListener('click', closeModal);
$('#modal-interest').addEventListener('click', () => {
  const notice = $('#modal-notice');
  notice.textContent = 'Interesse simulado. Nenhuma informação foi enviada.';
  notice.classList.add('success');
});
document.addEventListener('keydown', event => {
  if (modal.hidden) return;
  if (event.key === 'Escape') { closeModal(); return; }
  if (event.key !== 'Tab') return;
  const focusable = [...modalPanel.querySelectorAll('button, a[href], input, select, textarea, [tabindex]:not([tabindex="-1"])')].filter(element => !element.disabled);
  const first = focusable[0];
  const last = focusable.at(-1);
  if (!first || !last) return;
  if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
  else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
});

const filterButtons = document.querySelectorAll('[data-filter]');
const cards = document.querySelectorAll('.property-card');
filterButtons.forEach(button => button.addEventListener('click', () => {
  const filter = button.dataset.filter;
  filterButtons.forEach(item => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  let count = 0;
  cards.forEach(card => {
    card.hidden = filter !== 'todos' && card.dataset.type !== filter;
    if (!card.hidden) count++;
  });
  $('#result-count').textContent = `${String(count).padStart(2, '0')} ${count === 1 ? 'IMÓVEL' : 'IMÓVEIS'}`;
}));

const navToggle = $('#nav-toggle');
const nav = $('#main-nav');
navToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});
nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Abrir menu');
}));

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  document.body.classList.add('js-ready');
  revealItems.forEach(item => observer.observe(item));
}

