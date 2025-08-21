// ==============================
// Gün 5 - Movie List App - Temel İskelet
// Bu dosyada önce listeleme ve ekleme iskeletini kuruyoruz.
// Sonraki adımlarda: filtre/arama/özet/silme/localStorage eklenecek.
// ==============================

// 1) Başlangıç verisi (gerçek senaryo simülasyonu)

let movies = [
    // Not: id, silme için işimize yarayacak. Şimdilik sadece listeliyoruz.
  { id: crypto.randomUUID(), title: "Inception", category: "Sci-Fi", imdb: 8.8 },
  { id: crypto.randomUUID(), title: "The Dark Knight", category: "Action", imdb: 9.0 },
  { id: crypto.randomUUID(), title: "Interstellar", category: "Sci-Fi", imdb: 8.6 },
  { id: crypto.randomUUID(), title: "Whiplash", category: "Drama", imdb: 8.5 }
]

// 2) DOM referansları

const form = document.getElementById("movie-form");
const tbody = document.getElementById("movie-tbody");

// Özet alanları: şimdilik doldurmayacağız
const avgImdbEl = document.getElementById("avg-imdb");
const countEl = document.getElementById("count");
const everyGt5El = document.getElementById("every-gt5");
const someGt9El = document.getElementById("some-gt9");

// 3) Listeyi DOM'a basan fonksiyon

function renderTable(list) {
    // Güvenli varsayılan: parametre gelmezse global movies'i kullan
  const data = Array.isArray(list) ? list : movies;

  // Tbody önce temizle
  tbody.innerHTML = "";

  // forEach ile satır üret
  data.forEach((m, idx) => {
    const tr = document.createElement("tr");

    // Sütunlar
    const cIndex = document.createElement("td");
    cIndex.textContent = idx + 1;

    const cTitle = document.createElement("td");
    cTitle.textContent = m.title;

    const cCat = document.createElement("td");
    cCat.textContent = m.category;

    const cImdb = document.createElement("td");
    cImdb.textContent = m.imdb.toFixed(1);

    // Sil butonu için yer (ileride eklenecek)
    const cActions = document.createElement("td");
    // Şimdilik boş bırakıyoruz.

    // Satıra ekle
    tr.append(cIndex, cTitle, cCat, cImdb, cActions);
    tbody.appendChild(tr);
  });
}

// 4) Form submit → diziye yeni film ekleme
form.addEventListener("submit", (e) => {
  e.preventDefault();

  // FormData ile değerleri al
  const fd = new FormData(form);
  const title = String(fd.get("title") || "").trim();
  const category = String(fd.get("category") || "").trim();
  const imdb = Number(fd.get("imdb"));

  // Basit doğrulama: boş veya NaN olmasın
  if (!title || !category || Number.isNaN(imdb)) {
    alert("Lütfen tüm alanları doğru doldurun.");
    return;
  }

  // Kenar durum uyarısı: IMDB 0–10 arasında değilse kes
  if (imdb < 0 || imdb > 10) {
    alert("IMDB puanı 0 ile 10 arasında olmalı.");
    return;
  }

  // Diziye ekle (CRUD → Create)
  movies.push({
    id: crypto.randomUUID(),
    title,
    category,
    imdb: Number(imdb.toFixed(1)) // normalize
  });

  // Formu temizle
  form.reset();

  // Listeyi yenile
  renderTable();
});

// 5) İlk render
renderTable();