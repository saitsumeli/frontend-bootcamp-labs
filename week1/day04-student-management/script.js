"use strict";

/* 1) Sık kullanılan DOM referansları */
const form = document.getElementById("studentForm");
const nameEl = document.getElementById("nameInput");
const courseEl = document.getElementById("courseInput");
const noteEl = document.getElementById("noteInput");

// <tbody> garanti: HTML'de yoksa JS ile oluştur (savunmacı programlama)
let tbody = document.querySelector("#studentTable tbody");
if (!tbody) {
  const created = document.createElement("tbody");
  document.getElementById("studentTable").appendChild(created);
  tbody = created;
}

/* 2) Uygulama durumu: öğrenciler dizisi
   - Şimdilik RAM'de. Bir sonraki adımda localStorage'a da yazacağız. */
const students = [];

/* 3) Yardımcı: nota göre durum bilgisi ve sınıf adı üret */
function getStatus(note) {
  const passed = Number(note) >= 50;
  return {
    text: passed ? "Geçti" : "Kaldı",
    rowClass: passed ? "row-pass" : "row-fail",
    badgeClass: passed ? "status-pass" : "status-fail",
  };
}

/* 4) Tek sorumluluk: dizi -> tablo
   - Önce tbody'yi temizler, sonra tüm öğrencileri satır satır basar. */
function renderTable() {
  tbody.innerHTML = "";

  students.forEach((s) => {
    const st = getStatus(s.note);

    const tr = document.createElement("tr");
    tr.classList.add(st.rowClass);

    // Hücreleri sırayla oluştur
    const tdName = document.createElement("td");
    tdName.textContent = s.name;

    const tdCourse = document.createElement("td");
    tdCourse.textContent = s.course;

    const tdNote = document.createElement("td");
    tdNote.textContent = s.note;

    const tdSituation = document.createElement("td");
    const span = document.createElement("span");
    span.textContent = st.text;
    span.className = st.badgeClass; // CSS'te renk vereceğiz
    tdSituation.appendChild(span);

    const tdSummary = document.createElement("td");
    tdSummary.textContent = `${s.name}, ${s.course} dersinden ${s.note} aldı → Durum: ${st.text}`;

    const tdProcess = document.createElement("td");
    tdProcess.textContent = "—"; // Sil butonu sonraki adımda

    // Satıra ekle ve tabloya bas
    tr.append(tdName, tdCourse, tdNote, tdSituation, tdSummary, tdProcess);
    tbody.appendChild(tr);
  });
}

/* 5) Form submit akışı
   - Default'u engelle
   - ham değerleri al, trimle
   - doğrula (boş mu, sayı mı, 0-100 aralığı mı)
   - diziye ekle
   - tabloyu yeniden çiz
   - formu sıfırla, odağı başa al
*/
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = nameEl.value.trim();
  const course = courseEl.value.trim();
  const note = Number(noteEl.value);

  // Basit doğrulamalar (ileride mesajları daha güzel yaparız)
  if (!name || !course) {
    alert("Ad ve Ders boş olamaz.");
    return;
  }
  if (!Number.isFinite(note) || note < 0 || note > 100) {
    alert("Not 0 ile 100 arasında bir sayı olmalı.");
    return;
  }

  // Model
  const student = {
    id: Date.now(), // Şimdilik basit bir id
    name,
    course,
    note,
  };

  students.push(student);
  renderTable();

  form.reset();
  nameEl.focus();
});

// Sayfa ilk açıldığında boş tabloyu çiz (opsiyonel)
renderTable();
