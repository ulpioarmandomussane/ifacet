
document.addEventListener('DOMContentLoaded', () => {

  // Scroll-reveal nativo (substitui a biblioteca AOS — sem dependência externa)
  const revealEls = document.querySelectorAll('[data-aos]');
  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = Number(entry.target.dataset.aosDelay || 0);
          setTimeout(() => entry.target.classList.add('aos-visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    revealEls.forEach(el => observer.observe(el));
  } else {
    // Sem suporte a IntersectionObserver: mostra tudo de imediato
    revealEls.forEach(el => el.classList.add('aos-visible'));
  }

  // Ano dinâmico no rodapé
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Header com fundo ao rolar
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (window.scrollY > 24) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Menu mobile
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('mainNav');
  const navClose = document.getElementById('navClose');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      navToggle.classList.toggle('open', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Fecha o menu ao clicar no X
    if (navClose) {
      navClose.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    }

    // Fecha o menu ao clicar num link
    mainNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        navToggle.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Formulário de contacto — envia o pedido via WhatsApp
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nome = form.nome.value.trim();
      const telefone = form.telefone.value.trim();
      const curso = form.curso.value;
      const mensagem = form.mensagem.value.trim();

      if (!nome || !telefone || !curso) {
        status.textContent = 'Por favor, preencha todos os campos obrigatórios.';
        status.style.color = '#B23A3A';
        return;
      }

      const texto = encodeURIComponent(
        `Olá IFACET! Meu nome é ${nome}.\n` +
        `Contacto: ${telefone}\n` +
        `Curso de interesse: ${curso}\n` +
        (mensagem ? `Mensagem: ${mensagem}` : 'Gostaria de receber mais informações sobre o curso.')
      );

      status.textContent = 'A abrir o WhatsApp com o seu pedido...';
      status.style.color = '#1E8449';

      window.open(`https://wa.me/258860642173?text=${texto}`, '_blank');
      form.reset();
    });
  }

  // = Galeria: álbuns =
  const albumCards = Array.from(document.querySelectorAll('.album-card'));
  const albumGrid = document.getElementById('albumGrid');
  const albumView = document.getElementById('albumView');
  const albumViewTitle = document.getElementById('albumViewTitle');
  const albumBack = document.getElementById('albumBack');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));

  const albumTitles = {
    graduacao: 'Graduação',
    aulas: 'Aulas & Laboratório',
    campus: 'Campus IFACET',
    estagio: 'Estágios',
  };

  function openAlbum(albumKey) {
    galleryItems.forEach(item => {
      item.classList.toggle('is-hidden', item.dataset.album !== albumKey);
    });
    if (albumViewTitle) albumViewTitle.textContent = albumTitles[albumKey] || 'Álbum';
    if (albumGrid) albumGrid.classList.add('is-hidden');
    if (albumView) {
      albumView.classList.add('open');
      albumView.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function closeAlbum() {
    if (albumView) albumView.classList.remove('open');
    if (albumGrid) {
      albumGrid.classList.remove('is-hidden');
      albumGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  albumCards.forEach(card => {
    card.addEventListener('click', () => openAlbum(card.dataset.album));
  });

  if (albumBack) albumBack.addEventListener('click', closeAlbum);

  // = Galeria: lightbox =
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');

  let currentIndex = 0;

  function visibleItems() {
    return galleryItems.filter(item => !item.classList.contains('is-hidden'));
  }

  function openLightbox(index) {
    const items = visibleItems();
    if (!items.length) return;
    currentIndex = (index + items.length) % items.length;
    const item = items[currentIndex];
    const img = item.querySelector('img');
    const caption = item.querySelector('.gallery-caption');

    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = caption ? caption.textContent : '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const items = visibleItems();
      const idx = items.indexOf(item);
      openLightbox(idx);
    });
  });

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', () => openLightbox(currentIndex - 1));
  if (lightboxNext) lightboxNext.addEventListener('click', () => openLightbox(currentIndex + 1));

  if (lightbox) {
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (lightbox && lightbox.classList.contains('open')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') openLightbox(currentIndex + 1);
      if (e.key === 'ArrowLeft') openLightbox(currentIndex - 1);
    } else if (albumView && albumView.classList.contains('open') && e.key === 'Escape') {
      closeAlbum();
    } else if (libView && libView.classList.contains('open') && e.key === 'Escape') {
      closeLib();
    }
  });

  // = Biblioteca: cursos e manuais =
  const libCards = Array.from(document.querySelectorAll('.lib-card'));
  const libGrid = document.getElementById('libGrid');
  const libView = document.getElementById('libView');
  const libViewTitle = document.getElementById('libViewTitle');
  const libBack = document.getElementById('libBack');
  const libManuals = Array.from(document.querySelectorAll('.lib-manual'));

  const libTitles = {
    enfermagem: 'Enfermagem Geral',
    smi: 'Saúde Materno Infantil',
    medicina: 'Medicina Geral',
    'adm-publica': 'Administração Pública',
    gestao: 'Gestão',
  };

  function openLib(libKey) {
    libManuals.forEach(manual => {
      manual.classList.toggle('is-visible', manual.dataset.lib === libKey);
    });
    if (libViewTitle) libViewTitle.textContent = libTitles[libKey] || 'Curso';
    if (libGrid) libGrid.classList.add('is-hidden');
    if (libView) {
      libView.classList.add('open');
      libView.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function closeLib() {
    if (libView) libView.classList.remove('open');
    if (libGrid) {
      libGrid.classList.remove('is-hidden');
      libGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  libCards.forEach(card => {
    card.addEventListener('click', () => openLib(card.dataset.lib));
  });

  if (libBack) libBack.addEventListener('click', closeLib);

});
