const burgers = [
  { id: 'duplo', name: 'BRASA DUPLO', lines: 'BRASA<br>DUPLO', category: 'O ORIGINAL DA CASA', type: 'carne', description: 'Dois smash burgers, cheddar derretido, picles e molho da casa no pão brioche.', price: 39, image: 'assets/brasa-duplo.png', layers: 'assets/brasa-duplo-camadas.png', alt: 'Hambúrguer duplo com queijo, alface e picles' },
  { id: 'bacon', name: 'BACON FUMAÇA', lines: 'BACON<br>FUMAÇA', category: 'PARA QUEM GOSTA DE INTENSIDADE', type: 'carne', description: 'Carne na chapa, cheddar, bacon crocante, cebola caramelizada e molho defumado.', price: 43, image: 'assets/bacon-fumaca.png', layers: 'assets/bacon-fumaca-camadas.png', alt: 'Hambúrguer com bacon, queijo e cebola caramelizada' },
  { id: 'frango', name: 'FRANGO CROCANTE', lines: 'FRANGO<br>CROCANTE', category: 'CROCÂNCIA EM CADA MORDIDA', type: 'frango', description: 'Frango crocante, salada fresca, cebola roxa em conserva e molho de ervas.', price: 37, image: 'assets/frango-crocante.png', layers: 'assets/frango-crocante-camadas.png', alt: 'Hambúrguer de frango crocante com salada e molho' }
];

const money = value => `R$ ${value.toLocaleString('pt-BR')}`;
const $ = selector => document.querySelector(selector);
const selection = $('#selection-options');
const grid = $('#burger-grid');
const bagLayer = $('#bag-layer');
const bagItems = $('#bag-items');
const toast = $('#toast');
const quantities = new Map();
let activeIndex = 0;
let activeFilter = 'todos';
let toastTimer;
let switchTimer;
let lastFocus;
let exploded = false;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
}

function renderSelection() {
  selection.innerHTML = burgers.map((burger, index) => `
    <button class="selection-option ${index === activeIndex ? 'active' : ''}" type="button" data-select="${index}" title="${burger.name}" aria-label="Mostrar ${burger.name}" aria-pressed="${index === activeIndex}">
      <img src="${burger.image}" alt="" loading="lazy"><span class="selection-copy"><small>0${index + 1}</small><b>${burger.name}</b></span>
    </button>`).join('');
}

function setHero(index) {
  const nextIndex = (index + burgers.length) % burgers.length;
  if (nextIndex === activeIndex && $('#hero-image').complete) return;
  activeIndex = nextIndex;
  const burger = burgers[activeIndex];
  const stage = $('#hero-product');
  clearTimeout(switchTimer);
  stage.classList.remove('exploded');
  $('#exploded-stack').setAttribute('aria-hidden', 'true');
  $('#hero-image').removeAttribute('aria-hidden');
  stage.classList.add('is-switching');
  switchTimer = setTimeout(() => {
    exploded = false;
    $('#hero-image').src = burger.image;
    $('#hero-image').alt = burger.alt;
    stage.dataset.burger = burger.id;
    $('#exploded-stack').setAttribute('aria-label', `Ingredientes do ${burger.name} separados em camadas`);
    $('#exploded-stack').querySelectorAll('.layer').forEach(layer => { layer.src = burger.layers; });
    $('#hero-category').textContent = burger.category;
    $('#hero-heading').innerHTML = burger.lines;
    $('#hero-description').textContent = burger.description;
    $('#hero-price').textContent = money(burger.price);
    $('#hero-index').textContent = `${String(activeIndex + 1).padStart(2, '0')} / 03`;
    $('#slide-position').textContent = `${String(activeIndex + 1).padStart(2, '0')} / 03`;
    $('#layers-toggle').setAttribute('aria-pressed', 'false');
    $('#layers-toggle span').textContent = 'VER EM CAMADAS';
    renderSelection();
    stage.classList.remove('is-switching');
  }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 180);
}

function renderMenu() {
  const query = $('#menu-search').value.trim().toLocaleLowerCase('pt-BR');
  const filtered = burgers.filter(burger =>
    (activeFilter === 'todos' || burger.type === activeFilter) &&
    `${burger.name} ${burger.description}`.toLocaleLowerCase('pt-BR').includes(query)
  );
  grid.innerHTML = filtered.length ? filtered.map((burger) => `
    <article class="burger-card">
      <div class="burger-card-visual"><span class="burger-card-number">0${burgers.indexOf(burger) + 1} / 03</span><img src="${burger.image}" alt="${burger.alt}" loading="lazy"></div>
      <div class="burger-card-info"><span class="burger-card-label">${burger.category}</span><h3>${burger.name}</h3><p>${burger.description}</p><div class="burger-card-bottom"><strong>${money(burger.price)}</strong><button type="button" data-add="${burger.id}" aria-label="Adicionar ${burger.name} à sacola"><svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M12 4v16M4 12h16"/></svg></button></div></div>
    </article>`).join('') : '<p class="empty-results">Nenhum hambúrguer encontrado. Tente outro termo ou filtro.</p>';
}

function totalCount() { return [...quantities.values()].reduce((sum, quantity) => sum + quantity, 0); }
function totalPrice() { return burgers.reduce((sum, burger) => sum + burger.price * (quantities.get(burger.id) || 0), 0); }
function updateCounts() { document.querySelectorAll('.bag-count').forEach(el => el.textContent = totalCount()); }

function renderBag() {
  const chosen = burgers.filter(burger => quantities.get(burger.id));
  bagItems.innerHTML = chosen.length ? chosen.map(burger => `
    <div class="bag-item"><img src="${burger.image}" alt=""><div><h3>${burger.name}</h3><small>${money(burger.price)} cada</small></div><strong>${money(burger.price * quantities.get(burger.id))}</strong>
    <div class="bag-item-controls"><button type="button" data-decrease="${burger.id}" aria-label="Diminuir ${burger.name}">−</button><span>${quantities.get(burger.id)}</span><button type="button" data-increase="${burger.id}" aria-label="Aumentar ${burger.name}">+</button><button class="remove" type="button" data-remove="${burger.id}">Remover</button></div></div>`).join('') : '<div class="bag-empty"><strong>SUA SACOLA ESTÁ VAZIA.</strong><p>Escolha um hambúrguer para começar uma simulação.</p></div>';
  $('#bag-total').textContent = money(totalPrice());
  $('#finish-order').disabled = !chosen.length;
  updateCounts();
}

function changeQuantity(id, delta) {
  const burger = burgers.find(item => item.id === id);
  if (!burger) return;
  const next = Math.max(0, (quantities.get(id) || 0) + delta);
  if (next) quantities.set(id, next); else quantities.delete(id);
  renderBag();
  if (delta > 0) showToast(`${burger.name} adicionado à sacola`);
}

function openBag() {
  lastFocus = document.activeElement;
  renderBag();
  bagLayer.hidden = false;
  document.body.classList.add('bag-open');
  $('#close-bag').focus();
}

function closeBag() {
  bagLayer.hidden = true;
  document.body.classList.remove('bag-open');
  if (lastFocus instanceof HTMLElement) lastFocus.focus();
}

selection.addEventListener('click', event => {
  const button = event.target.closest('[data-select]');
  if (button) setHero(Number(button.dataset.select));
});
$('#previous-burger').addEventListener('click', () => setHero(activeIndex - 1));
$('#next-burger').addEventListener('click', () => setHero(activeIndex + 1));
$('#hero-add').addEventListener('click', () => changeQuantity(burgers[activeIndex].id, 1));
$('#layers-toggle').addEventListener('click', () => {
  exploded = !exploded;
  $('#hero-product').classList.toggle('exploded', exploded);
  $('#exploded-stack').setAttribute('aria-hidden', String(!exploded));
  $('#hero-image').setAttribute('aria-hidden', String(exploded));
  $('#layers-toggle').setAttribute('aria-pressed', String(exploded));
  $('#layers-toggle span').textContent = exploded ? 'MONTAR BURGER' : 'VER EM CAMADAS';
});
$('#open-bag').addEventListener('click', openBag);
$('#close-bag').addEventListener('click', closeBag);
bagLayer.addEventListener('click', event => { if (event.target.closest('[data-close-bag]')) closeBag(); });
grid.addEventListener('click', event => { const button = event.target.closest('[data-add]'); if (button) changeQuantity(button.dataset.add, 1); });
bagItems.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.dataset.increase) changeQuantity(button.dataset.increase, 1);
  if (button.dataset.decrease) changeQuantity(button.dataset.decrease, -1);
  if (button.dataset.remove) { quantities.delete(button.dataset.remove); renderBag(); }
});
$('#finish-order').addEventListener('click', () => {
  if (!totalCount()) return;
  quantities.clear();
  bagItems.innerHTML = '<div class="bag-success"><span aria-hidden="true">✓</span><h3>SIMULAÇÃO CONCLUÍDA.</h3><p>Este projeto é uma demonstração. Nenhum pedido foi enviado ou cobrado.</p><button type="button" id="back-to-menu">Voltar ao cardápio</button></div>';
  $('#bag-total').textContent = money(0);
  $('#finish-order').disabled = true;
  updateCounts();
});
bagItems.addEventListener('click', event => {
  if (event.target.id === 'back-to-menu') { closeBag(); $('#cardapio').scrollIntoView({ behavior: 'smooth' }); }
});
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  activeFilter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
  renderMenu();
}));
$('#menu-search').addEventListener('input', renderMenu);
const navToggle = $('#nav-toggle');
navToggle.addEventListener('click', () => {
  const open = $('#main-nav').classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
});
$('#main-nav').addEventListener('click', event => { if (event.target.closest('a')) { $('#main-nav').classList.remove('open'); navToggle.setAttribute('aria-expanded', 'false'); navToggle.setAttribute('aria-label', 'Abrir menu'); } });
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !bagLayer.hidden) closeBag();
  if (!bagLayer.hidden && event.key === 'Tab') {
    const focusable = [...bagLayer.querySelectorAll('button:not([disabled])')];
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }
  if (['ArrowLeft', 'ArrowRight'].includes(event.key) && document.activeElement.closest?.('.hero-selection')) {
    event.preventDefault(); setHero(activeIndex + (event.key === 'ArrowRight' ? 1 : -1));
  }
});

renderSelection();
renderMenu();
renderBag();
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: .12 });
  reveals.forEach(element => observer.observe(element));
  document.body.classList.add('js-ready');
}
if (window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
  const hero = $('.hero');
  const stage = $('#hero-product');
  let frame = 0;
  hero.addEventListener('pointermove', event => {
    if (frame) return;
    const bounds = hero.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width - .5) * 18;
    const y = ((event.clientY - bounds.top) / bounds.height - .5) * 14;
    frame = requestAnimationFrame(() => {
      stage.style.setProperty('--shift-x', `${x.toFixed(1)}px`);
      stage.style.setProperty('--shift-y', `${y.toFixed(1)}px`);
      frame = 0;
    });
  });
  hero.addEventListener('pointerleave', () => {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    stage.style.setProperty('--shift-x', '0px');
    stage.style.setProperty('--shift-y', '0px');
  });
}
