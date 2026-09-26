const progress = document.getElementById('scrollProgress');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.getElementById('mobileMenu');
const gallery = document.getElementById('workGallery');
const projectDetail = gallery.querySelector('.project-detail');
let galleryAnimationTimer;
const projects = {
  brasa: {
    number: 'PROJETO 01 / 03',
    title: 'BRASA<br><em>94.</em>',
    description: 'Uma hamburgueria que coloca o produto em cena. Sabores selecionáveis, movimento e uma sacola de pedido simulada.',
    tags: ['VISUAL CINEMATOGRÁFICO', 'CARDÁPIO INTERATIVO', 'SACOLA SIMULADA'],
    image: 'assets/brasa-site.png',
    mobileImage: 'assets/brasa-mobile-clean.png',
    alt: 'Captura da página inicial do site Brasa 94',
    label: 'BRASA 94 / PÁGINA INICIAL',
    count: '01 — 03',
    href: '../Demonstracoes/04-Hamburgueria-Brasa94/index.html'
  },
  morada: {
    number: 'PROJETO 02 / 03',
    title: 'MORADA<br><em>27.</em>',
    description: 'Uma vitrine imobiliária para explorar espaços com calma. Imóveis selecionáveis, catálogo filtrável e detalhes em janelas próprias.',
    tags: ['DIREÇÃO EDITORIAL', 'CATÁLOGO FILTRÁVEL', 'FICHAS DE IMÓVEIS'],
    image: 'assets/morada-site.png',
    mobileImage: 'assets/morada-mobile-clean.png',
    alt: 'Captura da página inicial do site Morada 27',
    label: 'MORADA 27 / PÁGINA INICIAL',
    count: '02 — 03',
    href: '../Demonstracoes/05-Imobiliaria-Morada27/index.html'
  },
  nox: {
    number: 'PROJETO 03 / 03',
    title: 'NOX<br><em>STUDIO.</em>',
    description: 'Uma experiência de estética automotiva que valoriza o detalhe. Serviços claros e comparação visual de antes e depois.',
    tags: ['IDENTIDADE PREMIUM', 'SERVIÇOS INTERATIVOS', 'ANTES E DEPOIS'],
    image: 'assets/nox-site.png',
    mobileImage: 'assets/nox-mobile-clean.png',
    alt: 'Captura da página inicial do site NOX Studio',
    label: 'NOX STUDIO / PÁGINA INICIAL',
    count: '03 — 03',
    href: '../Demonstracoes/06-Estetica-Automotiva-NoxStudio/index.html'
  }
};

function updateProgress() {
  const max = document.documentElement.scrollHeight - innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
}
addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Abrir menu');
  mobileMenu.hidden = true;
  document.body.classList.remove('menu-open');
}
menuToggle.addEventListener('click', () => {
  const opening = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(opening));
  menuToggle.setAttribute('aria-label', opening ? 'Fechar menu' : 'Abrir menu');
  mobileMenu.hidden = !opening;
  document.body.classList.toggle('menu-open', opening);
});
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') closeMenu();
});
addEventListener('resize', () => {
  if (innerWidth > 850 && menuToggle.getAttribute('aria-expanded') === 'true') closeMenu();
});

document.querySelectorAll('[data-project-tab]').forEach(button => {
  button.addEventListener('click', () => {
    const key = button.dataset.projectTab;
    const project = projects[key];
    if (!project || gallery.dataset.project === key) return;
    gallery.dataset.project = key;
    document.getElementById('projectNumber').textContent = project.number;
    document.getElementById('projectTitle').innerHTML = project.title;
    document.getElementById('projectDescription').textContent = project.description;
    document.getElementById('projectTags').replaceChildren(...project.tags.map(tag => {
      const span = document.createElement('span');
      span.textContent = tag;
      return span;
    }));
    const image = document.getElementById('projectImage');
    image.src = project.image;
    document.getElementById('projectPhoneImage').src = project.mobileImage;
    image.alt = project.alt;
    document.getElementById('screenLabel').textContent = project.label;
    document.getElementById('screenCount').textContent = project.count;
    document.getElementById('projectLink').href = project.href;
    document.querySelectorAll('[data-project-tab]').forEach(tab => {
      const selected = tab === button;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-pressed', String(selected));
    });
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      projectDetail.classList.remove('is-changing');
      void projectDetail.offsetWidth;
      projectDetail.classList.add('is-changing');
      clearTimeout(galleryAnimationTimer);
      galleryAnimationTimer = setTimeout(() => projectDetail.classList.remove('is-changing'), 650);
    }
  });
});

const heroStage = document.getElementById('heroStage');
document.querySelectorAll('[data-hero-project]').forEach(button => {
  button.addEventListener('click', () => {
    const key = button.dataset.heroProject;
    const project = projects[key];
    if (!project || heroStage.dataset.featured === key) return;
    heroStage.dataset.featured = key;
    const image = document.getElementById('heroFeatureImage');
    image.src = project.image;
    image.alt = `Prévia do site ${key === 'brasa' ? 'Brasa 94' : key === 'morada' ? 'Morada 27' : 'NOX Studio'}`;
    const name = key === 'brasa' ? 'BRASA 94' : key === 'morada' ? 'MORADA 27' : 'NOX STUDIO';
    document.getElementById('heroBrowserLabel').textContent = `${project.count.slice(0, 2)} / ${name}`;
    const other = Object.keys(projects).filter(candidate => candidate !== key);
    document.getElementById('heroSideOne').src = projects[other[0]].image;
    document.getElementById('heroSideTwo').src = projects[other[1]].image;
    document.querySelectorAll('[data-hero-project]').forEach(tab => {
      const selected = tab === button;
      tab.classList.toggle('active', selected);
      tab.setAttribute('aria-pressed', String(selected));
    });
  });
});

if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .08, rootMargin: '0px 0px 40px 0px' });
  document.querySelectorAll('.reveal,.enter').forEach(element => observer.observe(element));
} else {
  document.querySelectorAll('.reveal,.enter').forEach(element => element.classList.add('visible'));
}
