const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const projects = {
  brasa: {name:'Brasa 94',type:'Hamburgueria',slug:'brasa94',number:'01',description:'Uma hamburgueria com o produto em destaque, sabores selecionáveis, cardápio interativo e sacola de pedido simulada.',tags:['Cardápio interativo','Seleção de sabores','Sacola simulada'],image:'assets/brasa-site.png',mobile:'assets/brasa-mobile-clean.png',href:'Demonstracoes/04-Hamburgueria-Brasa94/index.html'},
  morada: {name:'Morada 27',type:'Imobiliário',slug:'morada27',number:'02',description:'Uma apresentação imobiliária com imóveis selecionáveis, catálogo filtrável e fichas para conhecer cada espaço com mais detalhes.',tags:['Catálogo filtrável','Seleção de imóveis','Fichas detalhadas'],image:'assets/morada-site.png',mobile:'assets/morada-mobile-clean.png',href:'Demonstracoes/05-Imobiliaria-Morada27/index.html'},
  nox: {name:'NOX Studio',type:'Estética automotiva',slug:'noxstudio',number:'03',description:'Um site de estética automotiva com serviços organizados, seleção de tratamentos e comparação visual de antes e depois.',tags:['Serviços interativos','Comparador visual','Identidade própria'],image:'assets/nox-site.png',mobile:'assets/nox-mobile-clean.png',href:'Demonstracoes/06-Estetica-Automotiva-NoxStudio/index.html'}
};
const gallery=document.getElementById('workGallery'), hero=document.getElementById('heroStage');
let galleryTimer,heroTimer;
function animate(element){if(reducedMotion.matches)return;element.classList.remove('is-changing');void element.offsetWidth;element.classList.add('is-changing');}
function selectProject(key){const p=projects[key];if(!p||gallery.dataset.project===key)return;gallery.dataset.project=key;
 document.getElementById('projectNumber').textContent=`PROJETO ${p.number} / 03`;
 const title=document.getElementById('projectTitle');title.replaceChildren(document.createTextNode(p.name));const dot=document.createElement('span');dot.textContent='.';title.append(dot);
 document.getElementById('projectDescription').textContent=p.description;
 document.getElementById('projectTags').replaceChildren(...p.tags.map(tag=>{const span=document.createElement('span');span.textContent=tag;return span;}));
 const image=document.getElementById('projectImage');image.src=p.image;image.alt=`Captura da página inicial do site ${p.name}`;
 document.getElementById('projectPhoneImage').src=p.mobile;
 document.getElementById('screenLabel').textContent=`${p.name.toUpperCase()} / PÁGINA INICIAL`;
 document.getElementById('screenCount').textContent=`${p.number} — 03`;
 document.getElementById('projectLink').href=p.href;
 document.querySelectorAll('[data-project-tab]').forEach(button=>{const active=button.dataset.projectTab===key;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
 const detail=gallery.querySelector('.project-detail');animate(detail);clearTimeout(galleryTimer);galleryTimer=setTimeout(()=>detail.classList.remove('is-changing'),400);
}
function selectHero(key){const p=projects[key];if(!p||hero.dataset.featured===key)return;hero.dataset.featured=key;
 const image=document.getElementById('heroFeatureImage');image.src=p.image;image.alt=`Prévia do site ${p.name}`;
 document.getElementById('heroBrowserLabel').textContent=`${p.slug} / página inicial`;
 document.getElementById('heroPreviewName').textContent=p.name;
 document.getElementById('heroPreviewType').textContent=`${p.type} · demonstração autoral`;
 const link=document.getElementById('heroPreviewLink');link.href=p.href;link.setAttribute('aria-label',`Abrir demonstração ${p.name}`);
 document.querySelectorAll('[data-hero-project]').forEach(button=>{const active=button.dataset.heroProject===key;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));});
 animate(hero);clearTimeout(heroTimer);heroTimer=setTimeout(()=>hero.classList.remove('is-changing'),350);
}
document.querySelectorAll('[data-project-tab]').forEach(button=>button.addEventListener('click',()=>selectProject(button.dataset.projectTab)));
document.querySelectorAll('[data-hero-project]').forEach(button=>button.addEventListener('click',()=>selectHero(button.dataset.heroProject)));
function switchWithKeyboard(selector,select,keyName){document.querySelectorAll(selector).forEach(button=>button.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;event.preventDefault();const buttons=[...document.querySelectorAll(selector)];let i=buttons.indexOf(button);i=event.key==='Home'?0:event.key==='End'?buttons.length-1:(i+(event.key==='ArrowRight'?1:-1)+buttons.length)%buttons.length;buttons[i].focus({preventScroll:true});select(buttons[i].dataset[keyName]);}));}
switchWithKeyboard('[data-project-tab]',selectProject,'projectTab');switchWithKeyboard('[data-hero-project]',selectHero,'heroProject');
const toggle=document.querySelector('.menu-toggle'),menu=document.getElementById('mobileMenu');
function closeMenu(returnFocus=false){toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Abrir menu');menu.hidden=true;document.body.classList.remove('menu-open');if(returnFocus)toggle.focus({preventScroll:true});}
toggle.addEventListener('click',()=>{if(toggle.getAttribute('aria-expanded')==='true'){closeMenu(true);return;}toggle.setAttribute('aria-expanded','true');toggle.setAttribute('aria-label','Fechar menu');menu.hidden=false;document.body.classList.add('menu-open');menu.querySelector('a').focus({preventScroll:true});});
menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>closeMenu()));
addEventListener('keydown',event=>{if(menu.hidden)return;if(event.key==='Escape'){event.preventDefault();closeMenu(true);}if(event.key==='Tab'){const items=[toggle,...menu.querySelectorAll('a')],first=items[0],last=items.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}}});
addEventListener('resize',()=>{if(innerWidth>850&&!menu.hidden)closeMenu();});
const progress=document.getElementById('scrollProgress');let progressPending=false;
function updateProgress(){const total=document.documentElement.scrollHeight-innerHeight;progress.style.transform=`scaleX(${total>0?Math.min(1,scrollY/total):0})`;progressPending=false;}
addEventListener('scroll',()=>{if(!progressPending){progressPending=true;requestAnimationFrame(updateProgress);}},{passive:true});addEventListener('resize',updateProgress);updateProgress();
if('IntersectionObserver' in window&&!reducedMotion.matches){document.documentElement.classList.add('motion-ready');const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}}),{threshold:.06,rootMargin:'0px 0px 30px 0px'});document.querySelectorAll('.reveal,.enter').forEach(element=>observer.observe(element));}
function reserveHostingBadge(){if(document.getElementById('nl-badge-frame')){document.documentElement.classList.add('has-hosting-badge');return true;}return false;}
if(!reserveHostingBadge()){const observer=new MutationObserver(()=>{if(reserveHostingBadge())observer.disconnect();});observer.observe(document.body,{childList:true,subtree:true});setTimeout(()=>observer.disconnect(),30000);}
