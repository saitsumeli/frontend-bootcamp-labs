"use strict";

/* 1) Sık kullanılan DOM referansları */
const form = document.getElementById("studentForm");
const nameEl = document.getElementById("nameInput");
const courseEl = document.getElementById("courseInput");
const noteEl = document.getElementById("noteInput");

// <tbody> garanti
let tbody = document.querySelector("#studentTable tbody");
if (!tbody) {
  const created = document.createElement("tbody");
  document.getElementById("studentTable").appendChild(created);
  tbody = created;
}

/* 2) Uygulama durumu */
const students = [];

/* 3) Nota göre durum bilgisi */
function getStatus(note) {
  const passed = Number(note) >= 50;
  return {
    text: passed ? "Geçti" : "Kaldı",
    rowClass: passed ? "row-pass" : "row-fail",
    badgeClass: passed ? "status-pass" : "status-fail",
  };
}

/* 4) dizi -> tablo */
function renderTable() {
  tbody.innerHTML = "";

  if (students.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = 6;
    td.className = "table-empty";
    td.textContent = "Henüz kayıt yok";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  students.forEach((s) => {
    const st = getStatus(s.note);

    const tr = document.createElement("tr");
    tr.classList.add(st.rowClass);

    const tdName = document.createElement("td");
    tdName.textContent = s.name;

    const tdCourse = document.createElement("td");
    tdCourse.textContent = s.course;

    const tdNote = document.createElement("td");
    tdNote.textContent = s.note;

    const tdSituation = document.createElement("td");
    const span = document.createElement("span");
    span.textContent = st.text;
    span.className = st.badgeClass;
    tdSituation.appendChild(span);

    const tdSummary = document.createElement("td");
    tdSummary.textContent = `${s.name}, ${s.course} dersinden ${s.note} aldı → Durum: ${st.text}`;

    const tdProcess = document.createElement("td");
    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "action btn-delete";
    delBtn.textContent = "Sil";
    delBtn.dataset.id = String(s.id);
    tdProcess.appendChild(delBtn);

    tr.append(tdName, tdCourse, tdNote, tdSituation, tdSummary, tdProcess);
    tbody.appendChild(tr);
  });
}

/* 5) Form submit akışı */
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = nameEl.value.trim();
  const course = courseEl.value.trim();
  const note = Number(noteEl.value);

  if (!name || !course) {
    alert("Ad ve Ders boş olamaz.");
    return;
  }
  if (!Number.isFinite(note) || note < 0 || note > 100) {
    alert("Not 0 ile 100 arasında bir sayı olmalı.");
    return;
  }

  const student = {
    id: Date.now(), 
    name,
    course,
    note,
  };

  students.push(student);
  renderTable();

  form.reset();
  nameEl.focus();
});

/* 6) Silme: event delegation */
tbody.addEventListener("click", (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;

  if (target.classList.contains("btn-delete")) {
    const id = target.dataset.id;
    if (!id) return;

    const ok = confirm("Bu öğrenciyi silmek istediğine emin misin?");
    if (!ok) return;

    const idx = students.findIndex((x) => String(x.id) === id);
    if (idx !== -1) {
      students.splice(idx, 1);
      renderTable();
    }
  }
});

// İlk çizim
renderTable();
