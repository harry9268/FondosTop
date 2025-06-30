// Modal funcionalidad
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalClose = document.getElementById('modal-close');
const modalPrev = document.getElementById('modal-prev');
const modalNext = document.getElementById('modal-next');
const images = Array.from(document.querySelectorAll('.card img'));
let currentIndex = 0;

const openModal = (index) => {
  currentIndex = index;
  const img = images[currentIndex];
  modalImg.src = img.src;
  modalImg.alt = img.alt;
  modal.classList.add('show');
};

const closeModal = () => {
  modal.classList.remove('show');
  modalImg.src = '';
};

images.forEach((img, i) => img.addEventListener('click', () => openModal(i)));

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });

modalPrev.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  openModal(currentIndex);
});

modalNext.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % images.length;
  openModal(currentIndex);
});

document.addEventListener('keydown', e => {
  if (!modal.classList.contains('show')) return;
  if (e.key === 'ArrowLeft') modalPrev.click();
  if (e.key === 'ArrowRight') modalNext.click();
  if (e.key === 'Escape') closeModal();
});

// Filtros y búsqueda
const searchInput = document.getElementById('search');
const categoryButtons = document.querySelectorAll('.category-filters button');
const cards = document.querySelectorAll('.gallery .card');

const filterCards = () => {
  const query = searchInput.value.toLowerCase();
  const activeCategory = document.querySelector('.category-filters button.active')?.dataset.category || 'Todas';

  cards.forEach(card => {
    const altText = card.querySelector('img').alt.toLowerCase();
    const cardCategory = card.dataset.category;
    const matchesCategory = activeCategory === 'Todas' || cardCategory === activeCategory;
    card.style.display = (altText.includes(query) && matchesCategory) ? '' : 'none';
  });
};

searchInput.addEventListener('input', filterCards);

categoryButtons.forEach(button => {
  button.addEventListener('click', () => {
    categoryButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    filterCards();
  });
});

// Tema oscuro/claro con localStorage
const toggleThemeBtn = document.getElementById('toggle-theme');
const body = document.body;

const setTheme = (theme) => {
  const isLight = theme === 'light';
  body.classList.toggle('light', isLight);
  toggleThemeBtn.textContent = isLight ? 'Modo Oscuro' : 'Modo Claro';
  localStorage.setItem('theme', theme);
};

setTheme(localStorage.getItem('theme') || 'dark');

toggleThemeBtn.addEventListener('click', () => {
  const newTheme = body.classList.contains('light') ? 'dark' : 'light';
  setTheme(newTheme);
});

// Sistema de favoritos
let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

cards.forEach(card => {
  const id = card.dataset.id;
  const favBtn = card.querySelector('.favorite-icon');
  const icon = favBtn.querySelector('i');

  if (favoritos.includes(id)) {
    icon.classList.replace('fa-regular', 'fa-solid');
    icon.style.color = '#e63946';
  }

  favBtn.addEventListener('click', e => {
    e.stopPropagation();

    if (favoritos.includes(id)) {
      favoritos = favoritos.filter(favId => favId !== id);
      icon.classList.replace('fa-solid', 'fa-regular');
      icon.style.color = '';
    } else {
      favoritos.push(id);
      icon.classList.replace('fa-regular', 'fa-solid');
      icon.style.color = '#e63946';
    }

    localStorage.setItem('favoritos', JSON.stringify(favoritos));
  });
});

const showFavoritesBtn = document.getElementById('show-favorites');
let showingFavorites = false;

showFavoritesBtn.addEventListener('click', () => {
  showingFavorites = !showingFavorites;
  if (showingFavorites) {
    showFavoritesBtn.textContent = '🔁 Ver Todos';
    cards.forEach(card => {
      card.style.display = favoritos.includes(card.dataset.id) ? '' : 'none';
    });
  } else {
    showFavoritesBtn.textContent = '❤️ Ver Favoritos';
    cards.forEach(card => (card.style.display = ''));
  }
});
