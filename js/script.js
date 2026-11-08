
/* ============================================
   ДАННЫЕ: ГОРОДА (15 хабов)
============================================ */
const CITIES = [
  { name: 'Москва', country: 'RU', lat: 55.7558, lng: 37.6173, address: 'Тверская ул., 15', hours: '10:00 — 22:00' },
  { name: 'Санкт-Петербург', country: 'RU', lat: 59.9343, lng: 30.3351, address: 'Невский пр., 88', hours: '10:00 — 22:00' },
  { name: 'Казань', country: 'RU', lat: 55.7963, lng: 49.1088, address: 'ул. Баумана, 42', hours: '10:00 — 21:00' },
  { name: 'Екатеринбург', country: 'RU', lat: 56.8389, lng: 60.6057, address: 'ул. Вайнера, 10', hours: '10:00 — 21:00' },
  { name: 'Нью-Йорк', country: 'US', lat: 40.7128, lng: -74.0060, address: 'SoHo, Broadway 245', hours: '10AM — 9PM' },
  { name: 'Лос-Анджелес', country: 'US', lat: 34.0522, lng: -118.2437, address: 'Melrose Ave, 7520', hours: '10AM — 9PM' },
  { name: 'Лондон', country: 'UK', lat: 51.5074, lng: -0.1278, address: 'Carnaby St, 12', hours: '10AM — 8PM' },
  { name: 'Париж', country: 'FR', lat: 48.8566, lng: 2.3522, address: 'Le Marais, Rue des Rosiers 8', hours: '10AM — 8PM' },
  { name: 'Берлин', country: 'DE', lat: 52.5200, lng: 13.4050, address: 'Mitte, Torstr. 140', hours: '10AM — 8PM' },
  { name: 'Дубай', country: 'AE', lat: 25.2048, lng: 55.2708, address: 'Dubai Mall, Level 1', hours: '10AM — 12AM' },
  { name: 'Токио', country: 'JP', lat: 35.6762, lng: 139.6503, address: 'Harajuku, Takeshita 5', hours: '11AM — 9PM' },
  { name: 'Сеул', country: 'KR', lat: 37.5665, lng: 126.9780, address: 'Gangnam, Apgujeong 12', hours: '11AM — 9PM' },
  { name: 'Шанхай', country: 'CN', lat: 31.2304, lng: 121.4737, address: 'Xintiandi, Lane 181', hours: '10AM — 10PM' },
  { name: 'Сидней', country: 'AU', lat: -33.8688, lng: 151.2093, address: 'Pitt St Mall, 250', hours: '9AM — 8PM' },
  { name: 'Сан-Паулу', country: 'BR', lat: -23.5505, lng: -46.6333, address: 'Rua Oscar Freire, 500', hours: '10AM — 9PM' }
];

/* ============================================
   LOCAL STORAGE: ПОЛЬЗОВАТЕЛИ И СЕССИЯ
============================================ */
function getUsers() { return JSON.parse(localStorage.getItem('mktpro_users') || '[]'); }
function saveUsers(users) { localStorage.setItem('mktpro_users', JSON.stringify(users)); }
function getCurrentUser() { return JSON.parse(localStorage.getItem('mktpro_currentUser') || 'null'); }
function setCurrentUser(user) { localStorage.setItem('mktpro_currentUser', JSON.stringify(user)); }
function clearCurrentUser() { localStorage.removeItem('mktpro_currentUser'); }

/* ============================================
   МОДАЛЬНЫЕ ОКНА
============================================ */
function openAuthModal() { document.getElementById('authModal').classList.add('active'); document.body.style.overflow = 'hidden'; }
function openProfileModal() { loadProfile(); document.getElementById('profileModal').classList.add('active'); document.body.style.overflow = 'hidden'; }
function openCityModal() { renderCityGrid(); document.getElementById('cityModal').classList.add('active'); document.body.style.overflow = 'hidden'; }
function closeModal(id) { document.getElementById(id).classList.remove('active'); document.body.style.overflow = ''; }

// Закрытие по клику на фон и Escape
document.querySelectorAll('.modal-overlay').forEach(overlay => {
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(overlay.id); });
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') document.querySelectorAll('.modal-overlay.active').forEach(m => closeModal(m.id));
});

/* ============================================
   АВТОРИЗАЦИЯ
============================================ */
function switchTab(tab) {
  document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
  if (tab === 'login') {
    document.querySelectorAll('.auth-tab')[0].classList.add('active');
    document.getElementById('loginForm').classList.add('active');
  } else {
    document.querySelectorAll('.auth-tab')[1].classList.add('active');
    document.getElementById('registerForm').classList.add('active');
  }
  hideErrors();
}
function hideErrors() {
  document.querySelectorAll('.form-error').forEach(e => { e.classList.remove('show'); e.textContent = ''; });
  document.getElementById('authSuccess').classList.remove('show');
}
function showError(id, msg) { const el = document.getElementById(id); el.textContent = msg; el.classList.add('show'); }
function showSuccess(msg) { const el = document.getElementById('authSuccess'); el.textContent = msg; el.classList.add('show'); }
function validateEmail(email) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email); }

function handleRegister(e) {
  e.preventDefault(); hideErrors();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim().toLowerCase();
  const pass = document.getElementById('regPassword').value;
  const passConfirm = document.getElementById('regPasswordConfirm').value;

  if (name.length < 2) return showError('registerError', '✕ Имя должно быть минимум 2 символа');
  if (!validateEmail(email)) return showError('registerError', '✕ Некорректный формат email');
  if (pass.length < 6) return showError('registerError', '✕ Пароль должен быть минимум 6 символов');
  if (pass !== passConfirm) return showError('registerError', '✕ Пароли не совпадают');

  const users = getUsers();
  if (users.find(u => u.email === email)) return showError('registerError', '✕ Этот email уже зарегистрирован');

  const newUser = {
    id: Date.now(), name, email,
    password: btoa(pass),
    points: 100, orders: 0, wishlist: 0,
    level: 'CREW',
    createdAt: new Date().toISOString()
  };
  users.push(newUser);
  saveUsers(users);
  setCurrentUser(newUser);
  showSuccess('✓ АККАУНТ СОЗДАН! +100 БОНУСОВ');
  updateUserUI();
  setTimeout(() => { closeModal('authModal'); document.getElementById('registerForm').reset(); openProfileModal(); }, 1200);
}

function handleLogin(e) {
  e.preventDefault(); hideErrors();
  const email = document.getElementById('loginEmail').value.trim().toLowerCase();
  const pass = document.getElementById('loginPassword').value;

  if (!validateEmail(email)) return showError('loginError', '✕ Некорректный формат email');
  if (pass.length < 6) return showError('loginError', '✕ Пароль должен быть минимум 6 символов');

  const users = getUsers();
  const user = users.find(u => u.email === email && u.password === btoa(pass));
  if (!user) return showError('loginError', '✕ Неверный email или пароль');

  setCurrentUser(user);
  showSuccess('✓ С ВОЗВРАЩЕНИЕМ, ' + user.name.toUpperCase() + '!');
  updateUserUI();
  setTimeout(() => { closeModal('authModal'); document.getElementById('loginForm').reset(); openProfileModal(); }, 1200);
}

function logout() { clearCurrentUser(); updateUserUI(); closeModal('profileModal'); }

function loadProfile() {
  const user = getCurrentUser(); if (!user) return;
  document.getElementById('profileAvatar').textContent = user.name.charAt(0).toUpperCase();
  document.getElementById('profileName').textContent = user.name;
  document.getElementById('profileEmail').textContent = user.email;
  document.getElementById('profileLevel').textContent = user.level || 'CREW';
  document.getElementById('profilePoints').textContent = user.points || 0;
  document.getElementById('profileOrders').textContent = user.orders || 0;
  document.getElementById('profileWishlist').textContent = user.wishlist || 0;
}

function updateUserUI() {
  const user = getCurrentUser();
  const area = document.getElementById('userArea');
  if (user) {
    area.innerHTML = `<span class="user-name">${user.name}</span><div class="user-avatar" onclick="openProfileModal()">${user.name.charAt(0).toUpperCase()}</div>`;
  } else {
    area.innerHTML = `<button class="btn btn-accent" onclick="openAuthModal()">ВХОД</button>`;
  }
}

/* ============================================
   ГОРОДА
============================================ */
let currentCity = JSON.parse(localStorage.getItem('mktpro_city') || 'null') || CITIES[0];

function renderCityGrid(filter = '') {
  const grid = document.getElementById('cityGrid');
  const filtered = CITIES.filter(c =>
    c.name.toLowerCase().includes(filter.toLowerCase()) ||
    c.country.toLowerCase().includes(filter.toLowerCase())
  );
  grid.innerHTML = filtered.map(city => `
    <button class="city-option ${city.name === currentCity.name ? 'selected' : ''}" onclick="selectCity('${city.name}')">
      <span>${city.name}</span>
      <span class="country">${city.country}</span>
    </button>
  `).join('');
}
function filterCities() { renderCityGrid(document.getElementById('citySearch').value); }

function selectCity(name) {
  const city = CITIES.find(c => c.name === name); if (!city) return;
  currentCity = city;
  localStorage.setItem('mktpro_city', JSON.stringify(city));
  updateCityUI();
  if (map) {
    map.flyTo([city.lat, city.lng], 11, { duration: 1.5 });
    const found = markers.find(m => m.city.name === city.name);
    if (found) found.marker.openPopup();
  }
  closeModal('cityModal');
}

function updateCityUI() {
  const name = currentCity.name.toUpperCase();
  const short = name.length > 12 ? name.substring(0, 11) + '…' : name;
  document.getElementById('currentCityName').textContent = short;
  document.getElementById('trustCity').textContent = short;
  document.getElementById('trustCityLabel').textContent = 'Твой город · ' + currentCity.country;
  document.getElementById('heroCity').textContent = name + ' / ' + currentCity.country;
  document.getElementById('terminalCity').textContent = name + '.' + currentCity.country;
  document.getElementById('mapSelectedCity').textContent = name + ', ' + currentCity.country;
  const lat = currentCity.lat.toFixed(4);
  const lng = currentCity.lng.toFixed(4);
  document.getElementById('mapCoords').textContent = `${Math.abs(lat)}° ${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lng)}° ${lng >= 0 ? 'E' : 'W'}`;
  document.querySelectorAll('.map-city-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.city === currentCity.name);
  });
}

/* ============================================
   КАРТА (LEAFLET)
============================================ */
let map, markers = [];

function initMap() {
  map = L.map('mapCanvas', {
    center: [currentCity.lat, currentCity.lng],
    zoom: 4,
    scrollWheelZoom: true,
    zoomControl: true
  });

    // Тёмно-серая подложка Esri — БЕЗ API-ключа
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri',
    maxZoom: 16
  }).addTo(map);

  // Подписи городов и стран поверх (тоже без ключа)
  L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 16
  }).addTo(map);
  // Маркеры городов
  CITIES.forEach(city => {
    const icon = L.divIcon({
      className: 'custom-marker',
      html: '<div class="marker-dot"></div>',
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });
    const marker = L.marker([city.lat, city.lng], { icon }).addTo(map);
    marker.bindPopup(`
      <div class="popup-title">◉ ${city.name}</div>
      <div class="popup-info">
        <strong>ADDRESS:</strong> ${city.address}<br>
        <strong>HOURS:</strong> ${city.hours}<br>
        <strong>COUNTRY:</strong> ${city.country}
      </div>
    `);
    markers.push({ city, marker });
  });

  renderMapCityButtons();
  updateCityUI();
}

function renderMapCityButtons() {
  const container = document.getElementById('mapCityButtons');
  container.innerHTML = CITIES.slice(0, 6).map(city => `
    <button class="map-city-btn ${city.name === currentCity.name ? 'active' : ''}" data-city="${city.name}" onclick="selectCity('${city.name}')">
      ${city.name.toUpperCase()}
    </button>
  `).join('');
}

/* Геолокация: найти меня на карте */
function locateMe() {
  if (!navigator.geolocation) return alert('⚠ Геолокация не поддерживается вашим браузером');
  const btn = document.querySelector('.map-locate-btn');
  btn.textContent = '⌖ ОПРЕДЕЛЯЮ...';
  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude, longitude } = pos.coords;
      map.flyTo([latitude, longitude], 12, { duration: 1.5 });
      let nearest = null, minDist = Infinity;
      CITIES.forEach(c => {
        const d = Math.sqrt(Math.pow(c.lat - latitude, 2) + Math.pow(c.lng - longitude, 2));
        if (d < minDist) { minDist = d; nearest = c; }
      });
      const userIcon = L.divIcon({
        className: 'custom-marker',
        html: '<div class="marker-dot" style="background:var(--success);border-color:#000"></div>',
        iconSize: [18, 18], iconAnchor: [9, 9]
      });
      L.marker([latitude, longitude], { icon: userIcon }).addTo(map)
        .bindPopup('<div class="popup-title">⌖ ТЫ ЗДЕСЬ</div><div class="popup-info">Ближайший хаб: <strong>' + nearest.name + '</strong></div>')
        .openPopup();
      btn.textContent = '✓ НАЙДЕНО';
      setTimeout(() => btn.textContent = '⌖ НАЙТИ МЕНЯ', 2000);
    },
    err => { alert('✕ Не удалось определить местоположение: ' + err.message); btn.textContent = '⌖ НАЙТИ МЕНЯ'; },
    { enableHighAccuracy: true, timeout: 10000 }
  );
}

/* Геолокация: определить мой город (из модалки) */
function detectMyCity() {
  if (!navigator.geolocation) return alert('⚠ Геолокация не поддерживается');
  navigator.geolocation.getCurrentPosition(
    pos => {
      const { latitude, longitude } = pos.coords;
      let nearest = null, minDist = Infinity;
      CITIES.forEach(c => {
        const d = Math.sqrt(Math.pow(c.lat - latitude, 2) + Math.pow(c.lng - longitude, 2));
        if (d < minDist) { minDist = d; nearest = c; }
      });
      if (nearest) selectCity(nearest.name);
    },
    () => alert('✕ Не удалось определить местоположение')
  );
}

/* ============================================
   TRADE-IN КАЛЬКУЛЯТОР
============================================ */
function calcEstimate(e) {
  e.preventDefault();
  const orig = parseFloat(document.getElementById('origPrice').value) || 0;
  const estimate = Math.round(orig * 0.6);
  document.getElementById('payoutAmount').textContent = estimate.toLocaleString('ru-RU') + ' ₽';
}

/* ============================================
   FIT PREDICTOR (подбор размера)
============================================ */
function updateFit() {
  const h = parseInt(document.getElementById('fitHeight').value) || 0;
  const w = parseInt(document.getElementById('fitWeight').value) || 0;
  let size = 'M / US L';
  if (h < 165 || w < 55) size = 'XS / US S';
  else if (h < 175 || w < 65) size = 'S / US M';
  else if (h < 185 || w < 80) size = 'M / US L';
  else if (h < 195 || w < 95) size = 'L / US XL';
  else size = 'XL / US XXL';
  document.getElementById('fitResult').textContent = '✓ RECOMMENDED: SIZE ' + size + ' — REGULAR FIT';
}

/* ============================================
   ПОДПИСКА НА DROPS
============================================ */
function subscribeDrop(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button');
  btn.textContent = '✓ JOINED';
  btn.style.background = 'var(--success)';
  btn.style.borderColor = 'var(--success)';
}

/* ============================================
   ИНИЦИАЛИЗАЦИЯ ПРИ ЗАГРУЗКЕ
============================================ */
document.addEventListener('DOMContentLoaded', () => {
  injectCartButtons();
  updateCartUI();
  updateUserUI();
  updateCityUI();
  initMap();
  renderCityGrid();

  // Живой таймкод в hero-видео
  function updateTimecode() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const el = document.querySelector('.timecode');
    if (el) el.textContent = `${h}:${m}:${s}:00`;
  }
  updateTimecode();
  setInterval(updateTimecode, 1000);

  // Бургер-меню
  document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', () => document.getElementById('navMenu').classList.remove('active'));
  });

  // FAQ аккордеон
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
      const wasActive = item.classList.contains('active');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
      if (!wasActive) item.classList.add('active');
    });
  });

  // Фильтры товаров
  document.querySelectorAll('.filter').forEach(f => {
    f.addEventListener('click', () => {
      document.querySelectorAll('.filter').forEach(x => x.classList.remove('active'));
      f.classList.add('active');
    });
  });

  // Fit predictor
  document.getElementById('fitHeight').addEventListener('input', updateFit);
  document.getElementById('fitWeight').addEventListener('input', updateFit);
});
/* ============================================
   КОРЗИНА И ЗАКАЗЫ
============================================ */
let cart = JSON.parse(localStorage.getItem('mktpro_cart') || '[]');

function saveCart() { localStorage.setItem('mktpro_cart', JSON.stringify(cart)); }
function cartTotal() { return cart.reduce((s, i) => s + i.price * i.qty, 0); }

/* Автоматически добавляем кнопку "В КОРЗИНУ" во все карточки товаров */
function injectCartButtons() {
  document.querySelectorAll('.product-card').forEach(card => {
    const btn = document.createElement('button');
    btn.className = 'btn-add-cart';
    btn.textContent = '🛒 В КОРЗИНУ';
    btn.onclick = () => addToCart(btn);
    card.querySelector('.product-info').insertBefore(btn, card.querySelector('.product-buttons'));
  });
}

function addToCart(btn) {
  const card = btn.closest('.product-card');
  const id = card.querySelector('.product-lot').textContent.trim();
  const name = card.querySelector('h3').textContent.trim();
  const price = parseInt(card.querySelector('.price-current').textContent.replace(/\D/g, ''));
  const img = card.querySelector('img').src;

  const found = cart.find(i => i.id === id);
  if (found) found.qty++;
  else cart.push({ id, name, price, img, qty: 1 });

  saveCart(); updateCartUI();
  btn.textContent = '✓ ДОБАВЛЕНО';
  setTimeout(() => btn.textContent = '🛒 В КОРЗИНУ', 1000);
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  saveCart(); renderCart(); updateCartUI();
}

function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  saveCart(); renderCart(); updateCartUI();
}

function updateCartUI() {
  const count = cart.reduce((s, i) => s + i.qty, 0);
  const el = document.getElementById('cartCount');
  if (el) el.textContent = count;
}

function renderCart() {
  const box = document.getElementById('cartItems');
  if (cart.length === 0) {
    box.innerHTML = '<div class="cart-empty">КОРЗИНА ПУСТА<br><span>Добавь что-нибудь из дропа ↓</span></div>';
  } else {
    box.innerHTML = cart.map(i => `
      <div class="cart-item">
        <img src="${i.img}" alt="${i.name}">
        <div>
          <div class="cart-item-name">${i.name}</div>
          <div class="cart-item-price">${i.price.toLocaleString('ru-RU')} ₽</div>
        </div>
        <div class="cart-qty">
          <button onclick="changeQty('${i.id}', -1)">−</button>
          <span>${i.qty}</span>
          <button onclick="changeQty('${i.id}', 1)">+</button>
        </div>
        <button class="cart-remove" onclick="removeItem('${i.id}')">✕</button>
      </div>
    `).join('');
  }
  document.getElementById('cartTotal').textContent = cartTotal().toLocaleString('ru-RU') + ' ₽';
}

function openCartModal() {
  document.getElementById('cartView').style.display = 'block';
  document.getElementById('checkoutView').style.display = 'none';
  document.getElementById('orderSuccessView').style.display = 'none';
  renderCart();
  document.getElementById('cartModal').classList.add('active');
  document.body.style.overflow = 'hidden';
}

function showCheckout() {
  if (cart.length === 0) return alert('Корзина пуста!');
  document.getElementById('cartView').style.display = 'none';
  document.getElementById('checkoutView').style.display = 'block';
  // подставляем текущий город
  document.getElementById('orderCity').value = currentCity.name;
}

function backToCart() {
  document.getElementById('checkoutView').style.display = 'none';
  document.getElementById('cartView').style.display = 'block';
}

function submitOrder(e) {
  e.preventDefault();
  const order = {
    id: 'ORD-' + Date.now(),
    date: new Date().toISOString(),
    items: cart,
    total: cartTotal(),
    status: 'NEW',
    customer: {
      name: document.getElementById('orderName').value,
      phone: document.getElementById('orderPhone').value,
      city: document.getElementById('orderCity').value,
      address: document.getElementById('orderAddress').value,
      comment: document.getElementById('orderComment').value
    }
  };
  const orders = JSON.parse(localStorage.getItem('mktpro_orders') || '[]');
  orders.push(order);
  localStorage.setItem('mktpro_orders', JSON.stringify(orders));

  cart = []; saveCart(); updateCartUI();
  document.getElementById('checkoutView').style.display = 'none';
  document.getElementById('orderSuccessView').style.display = 'block';
  document.getElementById('orderIdSuccess').textContent = order.id;
}