// ---- DOM Referansları -------------------------------------------------------
const form = document.querySelector('form');              // <form> 
const nameInput = document.getElementById('nameInput');   // Ad
const courseInput = document.getElementById('courseInput'); // Ders
const noteInput = document.getElementById('noteInput');   // Not
const resultEl = document.getElementById('result');       // Sonuç alanı

// ---- Yardımcı: sonuç kutusunu yaz ve renklendir -----------------------------
function renderResult(text, state = 'neutral') {
  // state: 'pass' | 'fail' | 'neutral'
  resultEl.className = `result ${state}`; // var olan sınıfları sıfırlar, yenisini ekler
  resultEl.textContent = text;
  resultEl.classList.remove('hidden');
}

// ---- Yardımcı: sayısal notu doğrula (0–100) ---------------------------------
function parseValidGrade(value) {
  // input type="text" olduğu için kendimiz sayıya çevirip kontrol ediyoruz
  const grade = Number(value.replace(',', '.')); // 70,5 gibi girişleri de destekle
  const isValid = Number.isFinite(grade) && grade >= 0 && grade <= 100;
  return isValid ? grade : null;
}

// ---- (Bonus) localStorage anahtarımız ---------------------------------------
const STORAGE_KEY = 'day3-grade-evaluator:last';

// ---- (Bonus) sayfa açılışında son sonucu göster -----------------------------
document.addEventListener('DOMContentLoaded', () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const last = JSON.parse(raw);
    const msg = `Last result → ${last.name} got ${last.grade} in ${last.course}. Status: ${last.status}.`;
    renderResult(msg, last.status === 'Passed' ? 'pass' : 'fail');
  } catch {
    /* sessiz geç; bozuk veri olabilir */
  }
});

// ---- Form submit akışı ------------------------------------------------------
form.addEventListener('submit', (e) => {
  e.preventDefault(); // sayfanın yenilenmesini engelle

  const name = nameInput.value.trim();
  const course = courseInput.value.trim();
  const grade = parseValidGrade(noteInput.value.trim());

  // Boş alan kontrolü
  if (!name || !course || grade === null) {
    renderResult('Please enter a valid name, course, and a grade between 0 and 100.', 'neutral');
    return;
  }

  // Geçti/Kaldı mantığı (eşik 50)
  const passed = grade >= 50;
  const status = passed ? 'Passed' : 'Failed';

  // Template literal ile özet
  const message = `Hello ${name}, you got ${grade} in ${course}. Status: ${status}.`;

  // Ekrana yaz ve sınıfı ayarla
  renderResult(message, passed ? 'pass' : 'fail');

  // (Bonus) son sonucu sakla
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ name, course, grade, status })
    );
  } catch {
    /* storage kapalıysa sessiz geç */
  }
});
