// Modal funcionalidad
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalClose = document.getElementById('modal-close');
const modalPrev = document.getElementById('modal-prev');
const modalNext = document.getElementById('modal-next');
const images = Array.from(document.querySelectorAll('.card img'));

let currentIndex = 0;

// Función para abrir imagen
function openModal(index) {
  currentIndex = index;
  const img = images[currentIndex];
  modalImg.src = img.src;
  modalImg.alt = img.alt;
  modal.classList.add('show');
}

// Eventos de clic en imágenes
images.forEach((img, index) => {
  img.addEventListener('click', () => openModal(index));
});

// Cerrar modal
function closeModal() {
  modal.classList.remove('show');
  modalImg.src = '';
}

modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', e => {
  if (e.target === modal) closeModal();
});

// Navegación
modalPrev.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + images.length) % images.length;
  openModal(currentIndex);
});

modalNext.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % images.length;
  openModal(currentIndex);
});

// Teclado
document.addEventListener('keydown', (e) => {
  if (!modal.classList.contains('show')) return;
  if (e.key === 'ArrowLeft') modalPrev.click();
  if (e.key === 'ArrowRight') modalNext.click();
  if (e.key === 'Escape') closeModal();
});

// Variables
const searchInput = document.getElementById('search');
const categoryButtons = document.querySelectorAll('.category-filters button');
const cards = document.querySelectorAll('.gallery .card');

// Función para filtrar tarjetas según búsqueda y categoría
function filterCards() {
  const query = searchInput.value.toLowerCase();
  const activeCategory = document.querySelector('.category-filters button.active').dataset.category;

  cards.forEach(card => {
    const altText = card.querySelector('img').alt.toLowerCase();
    const cardCategory = card.dataset.category;
    const matchesCategory = activeCategory === 'Todas' || cardCategory === activeCategory;

    if (altText.includes(query) && matchesCategory) {
      card.style.display = '';
    } else {
      card.style.display = 'none';
    }
  });
}

// Evento input búsqueda
searchInput.addEventListener('input', filterCards);

// Eventos botones categorías
categoryButtons.forEach(button => {
  button.addEventListener('click', () => {
    // Cambiar estado activo
    categoryButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');

    // Filtrar con la categoría nueva
    filterCards();
  });
});


// Modo oscuro/claro con guardado en localStorage
const toggleThemeBtn = document.getElementById('toggle-theme');
const body = document.body;

function setTheme(theme) {
  if (theme === 'light') {
    body.classList.add('light');
    toggleThemeBtn.textContent = 'Modo Oscuro';
  } else {
    body.classList.remove('light');
    toggleThemeBtn.textContent = 'Modo Claro';
  }
  localStorage.setItem('theme', theme);
}

// Carga la preferencia guardada o por defecto modo oscuro
const savedTheme = localStorage.getItem('theme') || 'dark';
setTheme(savedTheme);

toggleThemeBtn.addEventListener('click', () => {
  const currentTheme = body.classList.contains('light') ? 'light' : 'dark';
  if (currentTheme === 'dark') {
    setTheme('light');
  } else {
    setTheme('dark');
  }
});

// Sistema de favoritos
let favoritos = JSON.parse(localStorage.getItem('favoritos')) || [];

document.querySelectorAll('.card').forEach(card => {
  const id = card.dataset.id;
  const favIcon = card.querySelector('.favorite-icon');

  // Mostrar favorito al cargar
  if (favoritos.includes(id)) {
    card.classList.add('favorited');
  }

  favIcon.addEventListener('click', e => {
    e.stopPropagation();

    if (favoritos.includes(id)) {
      favoritos = favoritos.filter(f => f !== id);
      card.classList.remove('favorited');
    } else {
      favoritos.push(id);
      card.classList.add('favorited');
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
      const id = card.dataset.id;
      card.style.display = favoritos.includes(id) ? '' : 'none';
    });
  } else {
    showFavoritesBtn.textContent = '❤️ Ver Favoritos';
    cards.forEach(card => {
      card.style.display = '';
    });
  }
});
