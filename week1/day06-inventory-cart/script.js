// --- Başlangıç verisi ---
const products = [
  { id: 1, title: "Keyboard", category: "Electronics", price: 750, stock: 5 },
  { id: 2, title: "Notebook", category: "Stationery",  price: 60,  stock: 12 },
  { id: 3, title: "Headset",  category: "Electronics", price: 1280, stock: 2 },
  { id: 4, title: "Mug",      category: "Kitchen",     price: 130, stock: 8 },
];

// --- State ---
const state = {
  query: "",
  category: "",
  min500: false,
  showVat: false,   // KDV görünümü (map ile hesaplayacağız)
  cart: [],         // {id, title, price, qty}
};

// --- Dom refs ---
const $list = document.getElementById("productList");
const $search = document.getElementById("search");
const $category = document.getElementById("category");
const $min500 = document.getElementById("min500");
const $showVat = document.getElementById("showVat");

// Basit para formatı
const money = n => `₺${n.toLocaleString("tr-TR")}`;

// KDV’li fiyat (ör: %10 KDV)
const withVat = n => Math.round(n * 1.10);

// --- Filtre uygulama ---
function applyFilters(items) {
  let out = items;

  // metin arama: includes (case-insensitive)
  const q = state.query.trim().toLowerCase();
  if (q) out = out.filter(p => p.title.toLowerCase().includes(q));

  // kategori
  if (state.category) out = out.filter(p => p.category === state.category);

  // hızlı filtre: min 500
  if (state.min500) out = out.filter(p => p.price >= 500);

  return out;
}

// --- Render: forEach ile kart bas ---
function renderProducts(list) {
  $list.innerHTML = "";
  list.forEach(p => {
    // KDV toggle’ına göre görünen fiyat
    const visiblePrice = state.showVat ? withVat(p.price) : p.price;

    const li = document.createElement("li");
    li.className = "card";
    li.innerHTML = `
      <h3>${p.title}</h3>
      <div class="muted">${p.category}</div>
      <div class="price">${money(visiblePrice)} ${state.showVat ? "<span class='muted'>(KDV dahil)</span>" : ""}</div>
      <div class="muted">Stok: ${p.stock}</div>
      <button class="btn" data-id="${p.id}">Ekle</button>
    `;
    // “Ekle” şimdilik devre dışı (bir sonraki adımda sepeti yazacağız)
    li.querySelector("button").disabled = true;

    $list.appendChild(li);
  });
}

// --- Event bağla ---
$search.addEventListener("input", e => {
  state.query = e.target.value;
  draw();
});
$category.addEventListener("change", e => {
  state.category = e.target.value;
  draw();
});
$min500.addEventListener("change", e => {
  state.min500 = e.target.checked;
  draw();
});
$showVat.addEventListener("change", e => {
  state.showVat = e.target.checked;
  draw();
});

// --- Draw loop ---
function draw() {
  const filtered = applyFilters(products);
  renderProducts(filtered);
}
draw();
